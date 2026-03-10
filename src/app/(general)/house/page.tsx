export const dynamic = "force-dynamic";
import Link from "next/link";
import { wixApiClient } from "@/lib/wixClient";
import type { Event } from "@wix/auto_sdk_events_wix-events-v-2";
import ShowsList from "@/app/(general)/house/ShowsList";

const getShows = async () => {
  const { items: events } = await wixApiClient.wixEventsV2
    .queryEvents({ fields: ["DASHBOARD"] })
    .eq("status", "UPCOMING")
    .ascending("dateAndTimeSettings.startDate")
    .find();

  // Group events by show
  const shows: Record<string, Event[]> = events.reduce(
    (acc: Record<string, Event[]>, event) => {
      if (!event.title) {
        return acc;
      }

      if (!acc[event.title]) {
        acc[event.title] = [];
      }
      acc[event.title].push(event);
      return acc;
    },
    {},
  );

  return shows;
};

export default async function HousePage() {
  const shows = await getShows();
  console.log("shows", shows);

  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1>House Manager Area</h1>
      <p className="mt-2 opacity-80">
        This area is available to house managers and admins.
      </p>
      <ol>
        {Object.entries(shows).map(([showTitle, events]) => (
          <li key={showTitle}>
            <h2>{showTitle}</h2>
            <ShowsList data={events} />
          </li>
        ))}
      </ol>
      <Link href="/house/shows">Past Shows</Link>
    </div>
  );
}
