import React from "react";
import wixClient from "@/lib/wixClient";
import { media } from "@wix/sdk";
import dayjs from "dayjs";
import classnames from "classnames";

import { Show } from "@/app/types";

import probe from "probe-image-size";
import Image from "next/image";
import { fullName } from "@/app/utils";

const FeaturedShow = async () => {
  // 1. Get featured shows
  const { items } = await wixClient.items
    .query("Shows")
    .eq("feature", true)
    .include("director")
    .find();

  const shows = items as Show[];

  // 2. For each show, get cast and showtimes in parallel using Promise.all
  const showsWithData = await Promise.all(
    shows.map(async (show: Show) => {
      const [credits, events] = await Promise.all([
        wixClient.items
          .query("Credits")
          .eq("show", show._id)
          .eq("category", "cast")
          .include("person")
          .ascending("order")
          .find(),
        wixClient.wixEventsV2
          .queryEvents()
          .eq("title", show.title)
          .ascending("dateAndTimeSettings.startDate")
          .find(),
      ]);

      return {
        ...show,
        cast: credits.items,
        shows: events.items,
      };
    })
  );

  console.log("showsWithData", showsWithData);

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
            console.log("backgroundTexture", backgroundTexture);
            backgroundStyle = {
              backgroundImage: `url(${backgroundTexture.url})`,
              backgroundSize: "cover", // Optional: Adjust as needed
              backgroundPosition: "center", // Optional: Adjust as needed
            };
          }
          // console.log("logoSize", logoSize);

          return (
            // Make sure to use curly braces for the key!
            <li
              key={show._id}
              className={classnames([
                "flex",
                "h-full",
                "flex-col",
                "md:flex-row",
              ])}
            >
              <section
                className={classnames(["p-8", "grow-1", "text-center"])}
                style={backgroundStyle}
              >
                <Image
                  src={scaledLogo}
                  alt={show.title}
                  width={scaledWidth}
                  height={scaledHeight}
                  className="mx-auto"
                />
                <a href="/box-office" className="btn">
                  Buy Tickets
                </a>
              </section>
              <section className={classnames(["p-8", "grow-1"])}>
                <h3 className="text-4xl uppercase text-primary mb-2">
                  Directed by
                </h3>
                <p className="mb-10 text-4xl text-base-content">
                  {fullName(show.director)}
                </p>
                <h3 className="text-4xl uppercase text-primary mb-2">
                  Featuring
                </h3>
                <ul className="flex gap-4">
                  {show.cast.map(async (cast) => {
                    // console.log(cast);
                    const headshot = media.getImageUrl(cast.person.headshot);
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
                      <li key={cast._id} className="text-2xl">
                        <a
                          href={cast.person.aboutTheArtists}
                          className="break-words"
                        >
                          {
                            <Image
                              src={scaledHeadshot}
                              width={scaledWidth}
                              height={scaledHeight}
                              alt={fullName(cast.person)}
                              className="mb-2"
                            />
                          }
                          <span className="text-primary">
                            {fullName(cast.person)}
                          </span>
                          <span className="pl-2 text-base-content">as</span>
                          <span className="text-primary block">
                            {" "}
                            {cast.role}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
              <section className={classnames(["p-8", "grow-1"])}>
                <h3 className="text-3xl uppercase text-primary mb-2">
                  Showtimes
                </h3>
                <table className="text-base-content text-2xl">
                  <tbody>
                    {show.shows.map((event) => {
                      // console.log("event", event);
                      // @see https://day.js.org/docs/en/display/format

                      const startDate = event?.dateAndTimeSettings?.startDate;
                      return startDate ? (
                        <tr key={event._id}>
                          <td className="text-right pr-1">
                            <a href={event.eventPageUrl}>
                              {dayjs(startDate).format("dddd, MMMM D")}
                            </a>{" "}
                            &ndash;
                          </td>
                          <td>
                            <a href={event.eventPageUrl}>
                              {dayjs(startDate).format("h:mm A")}
                            </a>
                          </td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                </table>
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FeaturedShow;
