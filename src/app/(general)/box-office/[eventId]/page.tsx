import { Metadata } from "next";
import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import Link from "next/link";
import WixImage from "@/app/components/WixImage";
import { getScaledToFitImageUrl } from "@/app/utils/wix/media";
import FormattedDateTime from "@/app/components/FormattedDateTime";
import type { Address } from "@/app/types";
import Tickets from "./Tickets";
import { CalendarPlus2, Accessibility } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// import Ricos from "@/app/components/Ricos";

dayjs.extend(utc);
dayjs.extend(timezone);
interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

const getEventData = async (eventId: string) => {
  const { items: events } = await wixClient.wixEventsV2
    .queryEvents()
    .eq("_id", eventId)
    .find();

  return events[0];
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEventData(eventId);
  const startDate = event.dateAndTimeSettings!.startDate;
  const timeZone = event.dateAndTimeSettings!.timeZoneId || "America/New_York";
  // TODO: Finish setting up ogImage
  const ogImage = getScaledToFitImageUrl(event.mainImage!, 1200, 630, {});
  // console.log("ogImage", ogImage);

  return {
    title: `${event.title}: ${dayjs(startDate)
      .tz(timeZone)
      .format("dddd, MMMM D")}`,
    description: event.shortDescription,
  };
}

const EventContent = async ({ eventId }: { eventId: string }) => {
  const event = await getEventData(eventId);
  console.log("event", event);

  // console.log("event description", event.description);

  const startDate = event.dateAndTimeSettings!.startDate;
  const endDate = event.dateAndTimeSettings!.endDate;
  const timeZone = event.dateAndTimeSettings!.timeZoneId || "America/New_York";

  if (!startDate || !endDate) {
    throw new Error("Event date not found");
  }

  // The `CommonAddress` type coming back from the API call seems to be
  // incorrect. This manually overrides it for the address.
  const location = event.location!;
  const locationAddress = location?.address as Address;

  return (
    <div className="p-4 md:p-6 xl:p-8 md:grid md:grid-cols-[auto_1fr] md:gap-8">
      <WixImage
        priority={true}
        className="rounded-lg mx-auto mb-8 md:mb-0"
        src={event.mainImage!}
        alt={event.title!}
        targetHeight={400}
      />
      <section className="w-full flex flex-col gap-8">
        <section>
          <h1 className="text-2xl">
            <FormattedDateTime
              date={startDate}
              format="dddd, MMMM D"
              timeZone={timeZone}
            />{" "}
          </h1>
          <h2 className="text-5xl text-info! font-normal! flex">
            <FormattedDateTime
              date={startDate}
              format="h:mm"
              timeZone={timeZone}
            />{" "}
            <FormattedDateTime
              date={startDate}
              format="A"
              className="opacity-50 text-xl ml-1"
              timeZone={timeZone}
            />
            <span className="text-xl">
              <span className="mx-3">&ndash;</span>
              <FormattedDateTime
                date={endDate}
                format="h:mm"
                timeZone={timeZone}
              />{" "}
            </span>
            <FormattedDateTime
              date={endDate}
              format="A"
              className="opacity-50 text-xs ml-1 pt-1"
              timeZone={timeZone}
            />
          </h2>

          <Link
            href="/box-office"
            className="btn btn-xs hover:scale-110 transition-all mt-2"
          >
            Select a different date
          </Link>
        </section>

        {event.shortDescription && <section>{event.shortDescription}</section>}

        <section>
          <h3>Location</h3>
          <address className="not-italic">
            {location.name}, {locationAddress.formatted}
          </address>

          <p>
            <Link href="/venue" className="link">
              Read more about our venue and how to find the right entrance once
              you&rsquo;re here.
            </Link>
          </p>
          <div role="alert" className="alert alert-info alert-soft mt-4">
            <Accessibility />
            <span>
              If you need handicap access, you must contact us beforehand so we
              can escort you into the building. Send an email to{" "}
              <a href="mailto:novanightskytheater@gmail.com" className="link">
                novanightskytheater@gmail.com
              </a>{" "}
              at least 24 hours before your scheduled performance.
            </span>
          </div>
        </section>

        {/* <section>
          <Ricos richContent={event.description!} />
        </section> */}

        <section>
          <Suspense
            fallback={<div className="loading loading-bars loading-sm"></div>}
          >
            <Tickets event={event} />
          </Suspense>
        </section>

        {event.calendarUrls && (
          <section>
            <h3 className="flex items-center">
              <CalendarPlus2 className="mr-2" /> Add to Your Calendar
            </h3>
            <ul className="pl-4">
              <li className="list-disc">
                <Link href={event.calendarUrls.google!} className="link">
                  Google
                </Link>
              </li>
              <li className="list-disc">
                <Link href={event.calendarUrls.ics!} className="link">
                  iCal
                </Link>
              </li>
            </ul>
          </section>
        )}
      </section>
    </div>
  );
};

const Event = async ({ params }: PageProps) => {
  const { eventId } = await params;

  return (
    <Suspense
      fallback={
        <div className="loading loading-spinner loading-lg text-primary absolute left-1/2 top-1/2" />
      }
    >
      <EventContent eventId={eventId} />
    </Suspense>
  );
};

export default Event;
