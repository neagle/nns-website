export const revalidate = 60;

import type { Metadata } from "next";
import React, { cache, Suspense } from "react";
import wixClient from "@/lib/wixClient";
import ShowTime from "@/app/components/ShowTime";
import type { V3Event } from "@wix/auto_sdk_events_wix-events-v-2";
import classnames from "classnames";
import WixImage from "@/app/components/WixImage";
import Link from "next/link";
import { formatList } from "@/app/utils";

export async function generateMetadata(): Promise<Metadata> {
  const shows = await getBoxOfficeData();

  const showTitles = Object.keys(shows);

  return {
    title: `Box Office: ${formatList(showTitles)}`,
    description:
      "Purchase tickets for upcoming shows at NOVA Nightsky Theater.",
  };
}

const getBoxOfficeData = cache(async () => {
  const { items: events } = await wixClient.wixEventsV2
    .queryEvents()
    .eq("status", "UPCOMING")
    .ascending("dateAndTimeSettings.startDate")
    .find();

  // Group events by show
  const shows: Record<string, V3Event[]> = events.reduce(
    (acc: Record<string, V3Event[]>, event) => {
      if (!event.title) {
        return acc;
      }

      if (!acc[event.title]) {
        acc[event.title] = [];
      }
      acc[event.title].push(event);
      return acc;
    },
    {}
  );

  return shows;
});

const BoxOfficeContent = async () => {
  const shows = await getBoxOfficeData();

  if (Object.keys(shows).length === 0) {
    return (
      <div className="">
        <p>No tickets are currently on sale.</p>
      </div>
    );
  }

  return (
    <>
      {Object.keys(shows).map(async (show) => {
        const id = shows[show][0]._id;
        const imageUrl = shows[show][0].mainImage;

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
                  ])}
                >
                  <WixImage
                    priority={true}
                    className="rounded-lg"
                    src={imageUrl}
                    alt={show}
                    targetHeight={400}
                  />
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
                  {shows[show].map((event) => {
                    return <ShowTime key={event._id} event={event} />;
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

      <p>
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
