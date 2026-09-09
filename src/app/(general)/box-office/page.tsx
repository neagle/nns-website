export const revalidate = 60;

import type { Metadata } from "next";
import { cache, Suspense } from "react";
import wixClient from "@/lib/wixClient";
import ShowTime from "@/app/components/ShowTime";
import type { Event } from "@wix/auto_sdk_events_wix-events-v-2";
import type { Show, Ticket } from "@/app/types";
import classnames from "classnames";
import WixImage from "@/app/components/WixImage";
import Link from "next/link";
import { findShowByTitle, formatList } from "@/app/utils";

type BoxOfficeShowGroup = {
  key: string;
  title: string;
  show?: Show;
  events: Event[];
};

// Prefix used to mark internal QA/test events in Wix (e.g. for reproducing
// the checkout redirect flow) so they never show up in the public listing.
// The event detail page (box-office/[eventId]) has no such filter and
// queries Wix directly by ID, so a test event created with this prefix is
// still reachable at its direct URL — just never linked or listed anywhere.
const TEST_EVENT_TITLE_PREFIX = "[TEST]";

export async function generateMetadata(): Promise<Metadata> {
  const { showGroups } = await getBoxOfficeData();

  const showTitles = showGroups.map(({ show, title }) => show?.title || title);

  const metadata = {
    title: `Box Office: ${formatList(showTitles)}`,
    description:
      "Purchase tickets for upcoming shows at NOVA Nightsky Theater.",
  };

  // If there's only one show in the box office, use its OG image
  // In the future, we could add behavior for dealing with multiple shows, but
  // it's a fine default behavior at the moment to default to the standard site
  // OG Image.
  if (showGroups.length === 1 && showGroups[0].show?.slug) {
    const slug = showGroups[0].show.slug;
    const ogImage = `https://www.novanightskytheater.com/og/shows/${slug}.png`;

    const openGraph = {
      images: [{ url: ogImage, width: 1200, height: 630, type: "image/png" }],
    };

    return {
      ...metadata,
      openGraph,
    };
  }

  return metadata;
}

const getBoxOfficeData = cache(async () => {
  const [{ items: allEvents }, { items: showItems }] = await Promise.all([
    wixClient.wixEventsV2
      .queryEvents()
      .eq("status", "UPCOMING")
      .ascending("dateAndTimeSettings.startDate")
      .find(),
    wixClient.items.query("Shows").find(),
  ]);

  // Exclude internal QA/test events from the public listing (see
  // TEST_EVENT_TITLE_PREFIX above).
  const events = allEvents.filter(
    (event) => !event.title?.startsWith(TEST_EVENT_TITLE_PREFIX),
  );

  const cmsShows = showItems as Show[];

  const ticketResults = await Promise.all(
    events.map((event) =>
      event._id
        ? wixClient.orders.queryAvailableTickets({
            filter: { eventId: event._id },
            limit: 100,
          })
        : Promise.resolve({ definitions: [] }),
    ),
  );

  const ticketDefinitionsByEventId: Record<string, Ticket[]> = {};
  events.forEach((event, i) => {
    if (event._id) {
      ticketDefinitionsByEventId[event._id] = (ticketResults[i].definitions ||
        []) as unknown as Ticket[];
    }
  });

  const showGroupsByKey = new Map<string, BoxOfficeShowGroup>();

  // Group events by CMS show when possible so links always use the true show slug.
  events.forEach((event) => {
    if (!event.title) {
      return;
    }

    const show = findShowByTitle(cmsShows, event.title);
    const key = show?._id || event.title;
    const existingGroup = showGroupsByKey.get(key);

    if (existingGroup) {
      existingGroup.events.push(event);
      return;
    }

    showGroupsByKey.set(key, {
      key,
      title: show?.title || event.title,
      show,
      events: [event],
    });
  });

  return {
    showGroups: Array.from(showGroupsByKey.values()),
    ticketDefinitionsByEventId,
  };
});

const BoxOfficeContent = async () => {
  const { showGroups, ticketDefinitionsByEventId } = await getBoxOfficeData();

  if (showGroups.length === 0) {
    return (
      <div className="">
        <p>No tickets are currently on sale.</p>
      </div>
    );
  }

  return (
    <>
      {showGroups.map(({ key, title, show, events }) => {
        const firstEvent = events[0];
        const id = firstEvent._id || key;
        const imageUrl = firstEvent.mainImage;
        const showHref = show?.slug ? `/shows/${show.slug}` : undefined;

        return (
          <section key={id} className="last-of-type:mt-8">
            <div className={classnames(["flex", "flex-col", "md:flex-row"])}>
              {imageUrl && (
                <div
                  className={classnames([
                    "mb-4",
                    "md:mb-0",
                    "md:mr-4",
                    "flex",
                    "items-start",
                    "justify-center",
                    "hover:scale-105",
                    "transition-transform",
                  ])}
                >
                  {showHref ? (
                    <Link href={showHref}>
                      <WixImage
                        priority={true}
                        className="rounded-lg"
                        src={imageUrl}
                        alt={title}
                        targetHeight={400}
                      />
                    </Link>
                  ) : (
                    <WixImage
                      priority={true}
                      className="rounded-lg"
                      src={imageUrl}
                      alt={title}
                      targetHeight={400}
                    />
                  )}
                </div>
              )}
              <div className="grow-1">
                <div
                  className={classnames([
                    "grid",
                    "grid-cols-1",
                    "sm:grid-cols-2",
                    "md:grid-cols-2",
                    "xl:grid-cols-3",
                    "gap-4",
                    "items-stretch",
                    "group",
                  ])}
                >
                  {events.map((event) => {
                    return (
                      <ShowTime
                        key={event._id}
                        event={event}
                        ticketDefinitions={
                          ticketDefinitionsByEventId[event._id!] ?? []
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

const BoxOffice = async () => {
  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1 className="text-xl mb-4">Box Office</h1>
      <Suspense
        fallback={
          <div className="loading loading-spinner loading-2xl text-primary"></div>
        }
      >
        <BoxOfficeContent />
      </Suspense>

      <hr className="mt-8 mb-4" />

      <p className="mb-4 md:mb-0">
        Looking for season tickets?{" "}
        <Link href="/box-office/subscriptions">
          Check out our subscriptions.
        </Link>
      </p>
      <p>
        Have you been cast in a show?{" "}
        <Link href="/box-office/participant">
          Here&rsquo;s where you can pay your participant fee.
        </Link>
      </p>
    </div>
  );
};

export default BoxOffice;
