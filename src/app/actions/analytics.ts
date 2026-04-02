import type { Event } from "@wix/auto_sdk_events_wix-events-v-2";
import { wixApiClient } from "@/lib/wixClient";
import type { Show } from "@/app/types";

export interface PerformanceStats {
  eventId: string;
  date: string; // ISO string
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  ticketsSold: number;
  estimatedRevenue: number;
  status: "UPCOMING" | "PAST" | "CANCELED" | string;
}

export interface ShowAnalytics {
  showId: string;
  title: string;
  slug: string;
  openingDate: string;
  author: string;
  castCount: number;
  crewCount: number;
  performances: PerformanceStats[];
  totalTickets: number;
  totalRevenue: number;
}

/** Fetch all events (past + upcoming) using cursor pagination, with the DASHBOARD fieldset. */
async function fetchAllEvents(): Promise<Event[]> {
  const allEvents: Event[] = [];

  let result = await wixApiClient.wixEventsV2
    .queryEvents({ fields: ["DASHBOARD"] })
    .descending("dateAndTimeSettings.startDate")
    .limit(100)
    .find();

  allEvents.push(...result.items);

  while (result.hasNext()) {
    result = await result.next();
    allEvents.push(...result.items);
  }

  return allEvents;
}

/** Fetch all Credits with show references to compute cast/crew counts per show. */
async function fetchCreditCountsByShow(): Promise<
  Record<string, { cast: number; crew: number }>
> {
  const counts: Record<string, { cast: number; crew: number }> = {};

  let result = await wixApiClient.items.query("Credits").limit(1000).find();

  const processItems = (items: Record<string, unknown>[]) => {
    for (const item of items) {
      const showRef = item.show as { _id?: string } | string | undefined;
      const showId =
        typeof showRef === "string"
          ? showRef
          : (showRef as { _id?: string } | undefined)?._id;
      if (!showId) continue;
      if (!counts[showId]) counts[showId] = { cast: 0, crew: 0 };
      if (item.category === "cast") counts[showId].cast++;
      else if (item.category === "crew") counts[showId].crew++;
    }
  };

  processItems(result.items as Record<string, unknown>[]);

  while (result.hasNext()) {
    result = await result.next();
    processItems(result.items as Record<string, unknown>[]);
  }

  return counts;
}

/**
 * Estimate revenue for a single event.
 * Uses the lowest fixed ticket price available. For PWYC-only events, uses minPrice.
 * Returns 0 if no pricing info is available.
 */
function estimateRevenue(event: Event, ticketsSold: number): number {
  const regTickets = event.registration?.tickets;
  if (!regTickets || ticketsSold === 0) return 0;

  const lowestPrice = regTickets.lowestPrice?.value;
  if (!lowestPrice) return 0;

  const priceNum = parseFloat(lowestPrice);
  return isNaN(priceNum) ? 0 : Math.round(priceNum * ticketsSold * 100) / 100;
}

function buildPerformanceStats(event: Event): PerformanceStats {
  const ticketsSold =
    (event as Event & { summaries?: { tickets?: { ticketsSold?: number } } })
      .summaries?.tickets?.ticketsSold ?? 0;
  const estimatedRevenue = estimateRevenue(event, ticketsSold);

  // startDate may be a Date object or a string depending on the SDK version
  const rawDate = event.dateAndTimeSettings?.startDate;
  const date = rawDate instanceof Date ? rawDate : rawDate ? new Date(rawDate) : null;
  const dateIso = date ? date.toISOString() : "";

  return {
    eventId: event._id ?? "",
    date: dateIso,
    dayOfWeek: date ? date.getDay() : -1,
    ticketsSold,
    estimatedRevenue,
    status: event.status ?? "UPCOMING",
  };
}

/**
 * Normalize an event title for fuzzy show matching:
 * - Lowercased and trimmed
 * - Common prefixes like "Staged Reading: " stripped
 */
const EVENT_TITLE_PREFIXES = [
  "staged reading: ",
  "staged reading - ",
  "play reading: ",
  "play reading - ",
  "recording of ",
];

function normalizeTitle(title: string): string {
  let t = title.toLowerCase().trim();
  for (const prefix of EVENT_TITLE_PREFIXES) {
    if (t.startsWith(prefix)) {
      t = t.slice(prefix.length);
      break;
    }
  }
  // Normalize hyphens between words to spaces ("man-in-the-moon" → "man in the moon")
  t = t.replace(/-/g, " ").replace(/\s+/g, " ").trim();
  return t;
}

/** Aggregate all analytics data. Joins Events → Shows by title. */
export async function getAnalyticsData(): Promise<{
  showAnalytics: ShowAnalytics[];
  totalTickets: number;
  totalRevenue: number;
  totalPerformances: number;
}> {
  const [allEvents, allShows, creditCounts] = await Promise.all([
    fetchAllEvents(),
    wixApiClient.items
      .query("Shows")
      .descending("openingDate")
      .limit(100)
      .find()
      .then((r) => r.items as Show[]),
    fetchCreditCountsByShow(),
  ]);

  // Group events by normalized title for case-insensitive matching
  const eventsByNormalizedTitle: Record<string, Event[]> = {};
  for (const event of allEvents) {
    if (!event.title) continue;
    const key = normalizeTitle(event.title);
    if (!eventsByNormalizedTitle[key]) eventsByNormalizedTitle[key] = [];
    eventsByNormalizedTitle[key].push(event);
  }

  const showAnalytics: ShowAnalytics[] = allShows.map((show) => {
    const key = normalizeTitle(show.title);
    const events = eventsByNormalizedTitle[key] ?? [];
    const performances = events.map(buildPerformanceStats);
    const totalTickets = performances.reduce((s, p) => s + p.ticketsSold, 0);
    const totalRevenue = performances.reduce(
      (s, p) => s + p.estimatedRevenue,
      0,
    );
    const credits = creditCounts[show._id] ?? { cast: 0, crew: 0 };

    return {
      showId: show._id,
      title: show.title,
      slug: show.slug,
      openingDate: show.openingDate,
      author: show.author,
      castCount: credits.cast,
      crewCount: credits.crew,
      performances,
      totalTickets,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
    };
  });

  const totalTickets = showAnalytics.reduce((s, a) => s + a.totalTickets, 0);
  const totalRevenue = showAnalytics.reduce((s, a) => s + a.totalRevenue, 0);
  const totalPerformances = showAnalytics.reduce(
    (s, a) => s + a.performances.length,
    0,
  );

  return {
    showAnalytics,
    totalTickets,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalPerformances,
  };
}

/** Fetch analytics for a single show by slug. */
export async function getShowAnalyticsData(
  slug: string,
): Promise<ShowAnalytics | null> {
  const showResult = await wixApiClient.items
    .query("Shows")
    .eq("slug", slug)
    .limit(1)
    .find();

  const show = showResult.items[0] as Show | undefined;
  if (!show) return null;

  const [allEvents, creditCounts] = await Promise.all([
    fetchAllEvents(),
    fetchCreditCountsByShow(),
  ]);

  const showNormalized = normalizeTitle(show.title);
  const events = allEvents.filter(
    (e) => e.title && normalizeTitle(e.title) === showNormalized,
  );
  const performances = events
    .map(buildPerformanceStats)
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalTickets = performances.reduce((s, p) => s + p.ticketsSold, 0);
  const totalRevenue = performances.reduce((s, p) => s + p.estimatedRevenue, 0);
  const credits = creditCounts[show._id] ?? { cast: 0, crew: 0 };

  return {
    showId: show._id,
    title: show.title,
    slug: show.slug,
    openingDate: show.openingDate,
    author: show.author,
    castCount: credits.cast,
    crewCount: credits.crew,
    performances,
    totalTickets,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
  };
}
