import React from "react";
import wixClient from "@/lib/wixClient";
import ShowTime from "@/app/components/ShowTime";
import { getScaledImageByHeight } from "@/app/actions/media";
// import type { Event } from "@/app/types";
import type { V3Event } from "@wix/auto_sdk_events_wix-events-v-2";
import classnames from "classnames";
import Image from "next/image";

const BoxOffice = async () => {
  const { items: events } = await wixClient.wixEventsV2
    .queryEvents()
    .eq("status", "UPCOMING")
    .ascending("dateAndTimeSettings.startDate")
    .find();

  // console.log("events", events);
  // events.map((event) => {
  //   console.log(event.status);
  // });

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

  // console.log("shows", shows);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Box Office</h1>
      {Object.keys(shows).map(async (show) => {
        const imageUrl = shows[show][0].mainImage;
        if (!imageUrl) {
          return;
        }
        const showImage = await getScaledImageByHeight(imageUrl, 400);

        return (
          <div key="show">
            <div className={classnames(["flex", "flex-col", "md:flex-row"])}>
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
                <Image
                  className="rounded-lg"
                  src={showImage.url}
                  alt={show}
                  width={showImage.width}
                  height={showImage.height}
                />
              </div>
              <div className="grow-1">
                <div
                  className={classnames([
                    "grid",
                    "grid-cols-1",
                    "sm:grid-cols-2",
                    "md:grid-cols-2",
                    "lg:grid-cols-3",
                    "gap-4",
                    "items-stretch",
                    "group",
                  ])}
                >
                  {shows[show].map((event) => {
                    return (
                      <ShowTime
                        key={event._id}
                        event={event}
                        className={classnames(["h-full"])}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            {/* <h2 className={classnames(["mt-4"])}>Become a Subscriber</h2> */}
          </div>
        );
      })}
    </div>
  );
};

export default BoxOffice;
