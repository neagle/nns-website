import React from "react";
import wixClient from "@/lib/wixClient";
import { media } from "@wix/sdk";
import classnames from "classnames";

import { Show } from "@/app/types";

import probe from "probe-image-size";
import Image from "next/image";
import { fullName } from "@/app/utils";
import FeaturedCastMember from "./FeaturedCastMember";
import { getShowsWithData } from "@/app/actions/shows";
import ShowTime from "./ShowTime";

const FeaturedShow = async () => {
  // 1. Get featured shows
  const { items } = await wixClient.items
    .query("Shows")
    .eq("feature", true)
    .include("director")
    .find();

  const shows = items as Show[];

  // 2. For each show, get cast and showtimes in parallel using Promise.all

  const showsWithData = await getShowsWithData({ shows });
  // console.log("showsWithData", showsWithData);

  // 3. Render
  return (
    <div className="h-full">
      <ul className="h-full">
        {showsWithData.map(async (show /*: ShowWithData*/) => {
          const logo = media.getImageUrl(show.logo);
          const logoSize = await probe(logo.url);
          const logoRatio = logoSize.width / logoSize.height;
          const scaledWidth = 400;
          const scaledHeight = scaledWidth / logoRatio;
          const scaledLogo = media.getScaledToFillImageUrl(
            show.logo,
            scaledWidth,
            scaledHeight,
            {}
          );

          let backgroundStyle = {};
          if (show.backgroundTexture) {
            const backgroundTexture = media.getImageUrl(show.backgroundTexture);
            // console.log("backgroundTexture", backgroundTexture);
            backgroundStyle = {
              backgroundImage: `url(${backgroundTexture.url})`,
              backgroundSize: "cover", // Optional: Adjust as needed
              backgroundPosition: "center", // Optional: Adjust as needed
            };
          }
          // console.log("logoSize", logoSize);

          return (
            <li
              key={show._id}
              className={classnames([
                "flex",
                "h-full",
                "flex-col",
                "md:flex-row",
                "[&>section]:p-8",
              ])}
            >
              <section className="grow-1 md:w-2/3" style={backgroundStyle}>
                <section className={classnames(["text-center"])}>
                  <div className="rounded-lg">
                    <Image
                      src={scaledLogo}
                      alt={show.title}
                      width={scaledWidth}
                      height={scaledHeight}
                      className="mx-auto mb-5"
                    />
                  </div>
                  <section className={classnames(["text-left"])}>
                    <div className="flex mb-2 items-center justify-center">
                      <p
                        className={classnames([
                          "drop-shadow-lg",
                          "text-xl",
                          "mb-6",
                          "text-primary/80",
                          "text-center",
                        ])}
                      >
                        Directed by <br className="md:hidden" />
                        <b className="text-primary">
                          {fullName(show.director)}
                        </b>
                      </p>
                    </div>
                    <h3 className="text-xl text-primary mb-6 drop-shadow-lg text-center">
                      Featuring
                    </h3>
                    <div className="grid gap-2 md:grid-cols-2 items-start">
                      {show.cast.map(async (cast) => {
                        const headshot = media.getImageUrl(
                          cast.person.headshot
                        );
                        const headshotSize = await probe(headshot.url);
                        const headshotRatio =
                          headshotSize.width / headshotSize.height;
                        const scaledHeight = 200;
                        const scaledWidth = scaledHeight * headshotRatio;

                        const scaledHeadshot = media.getScaledToFillImageUrl(
                          cast.person.headshot,
                          scaledWidth,
                          scaledHeight,
                          {}
                        );

                        return (
                          <FeaturedCastMember
                            key={cast._id}
                            className="flex flex-col items-center justify-center text-center"
                            role={cast.role}
                            castMember={cast.person}
                            headshot={{
                              url: scaledHeadshot,
                              width: scaledWidth,
                              height: scaledHeight,
                            }}
                          />
                        );
                      })}
                    </div>
                  </section>
                </section>
              </section>
              <section
                className={classnames(["grow-1", "bg-base-200", "text-center"])}
              >
                <div className="mb-4">
                  <a
                    href="/box-office"
                    className={classnames([
                      "btn",
                      "btn-lg",
                      "btn-wide",
                      "btn-primary",
                      "hover:scale-105",
                      "transition-all",
                      "mx-auto",
                    ])}
                  >
                    Buy Tickets
                  </a>
                </div>
                <h3 className="text-xl mb-2 md:text-center">Showtimes</h3>
                <div className="grid gap-2 text-left text-xs">
                  {show.shows.map((event) => {
                    return <ShowTime key={event._id} event={event} />;
                  })}
                </div>
                {/* <ol className="md:text-right leading-loose text-lg md:text-xs xl:text-lg inline-block">
                  {show.shows.map((event) => {
                    // console.log("event", event);
                    // @see https://day.js.org/docs/en/display/format

                    const startDate = event?.dateAndTimeSettings?.startDate;
                    return startDate ? (
                      <li key={event._id} className="whitespace-nowrap">
                        <a href={event.eventPageUrl} className="link">
                          {dayjs(startDate).format("dddd, MMMM D")}
                        </a>{" "}
                        <b className="text-primary/50">&ndash;</b>{" "}
                        {dayjs(startDate).format("h:mm")}{" "}
                        <b className="text-primary/50 font-normal text-xs">
                          {dayjs(startDate).format("A")}
                        </b>
                      </li>
                    ) : null;
                  })}
                </ol> */}
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FeaturedShow;
