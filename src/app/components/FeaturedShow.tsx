import React from "react";
import wixClient from "@/lib/wixClient";
import { media } from "@wix/sdk";
import dayjs from "dayjs";

import { Show } from "@/app/types";

import probe from "probe-image-size";
import Image from "next/image";
import { fullName } from "@/app/utils";

// interface ShowWithData extends Show {
//   cast: Credit[];
//   shows: Event[];
// }

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

  // 3. Render
  return (
    <div>
      <ul>
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
          // console.log("logoSize", logoSize);

          return (
            // Make sure to use curly braces for the key!
            <li key={show._id}>
              <h1>{show.title}</h1>
              <h2>by {show.author}</h2>
              <h3>directed by {fullName(show.director)}</h3>
              <Image
                src={scaledLogo}
                alt={show.title}
                width={scaledWidth}
                height={scaledHeight}
              />
              <h3>Featuring</h3>
              <ul>
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
                    <li key={cast._id}>
                      <a href={cast.person.aboutTheArtists}>
                        {
                          <Image
                            src={scaledHeadshot}
                            width={scaledWidth}
                            height={scaledHeight}
                            alt={fullName(cast.person)}
                          />
                        }
                        {fullName(cast.person)} as {cast.role}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <a href="/box-office" className="button">
                Buy Tickets
              </a>

              <h3>Showtimes</h3>
              <table>
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FeaturedShow;
