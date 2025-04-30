import React from "react";
import wixClient from "@/lib/wixClient";
import { media } from "@wix/sdk";
import classnames from "classnames";

import type { AlternateHeadshot, Credit, Show } from "@/app/types";

import { fullName, manualSort, nameSlug } from "@/app/utils";
import FeaturedCastMember from "./FeaturedCastMember";
import { getShowsWithData } from "@/app/actions/shows";
import ShowTime from "./ShowTime";
import WixImage from "@/app/components/WixImage";
import { getImageProps } from "next/image";
import { getBackgroundImage } from "@/app/utils";
import probe from "probe-image-size";
import Link from "next/link";

const FeaturedShow = async () => {
  const { items } = await wixClient.items
    .query("Shows")
    .eq("feature", true)
    .include("director")
    .find();

  const shows = items as Show[];

  // Get cast, crew, and events for each show
  // These require separate queries to the Wix API
  const showsWithData = await getShowsWithData({ shows });

  return (
    <div className="h-full">
      <ul className="h-full flex flex-col">
        {showsWithData.map(async (show) => {
          let backgroundStyle: React.CSSProperties = {
            backgroundColor: show.backgroundColor || "transparent",
          };

          if (show.backgroundTexture) {
            // TODO: package up this way of optimizing background images
            const backgroundTexture = media.getImageUrl(show.backgroundTexture);
            const imageData = await probe(backgroundTexture.url);
            const backgroundWidth = imageData.width;
            const backgroundHeight = imageData.height;

            const {
              props: { srcSet },
            } = getImageProps({
              alt: "",
              width: backgroundWidth,
              height: backgroundHeight,
              src: backgroundTexture.url,
            });
            const backgroundImage = getBackgroundImage(srcSet);

            backgroundStyle = {
              ...backgroundStyle,
              backgroundImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
            };
          }

          return (
            <li
              key={show._id}
              className={classnames([
                "flex",
                "grow-1",
                "flex-col",
                "md:flex-row",
              ])}
            >
              <section
                className={classnames(["p-4", "md:p-6", "xl:p-8", "md:w-2/3"])}
                style={backgroundStyle}
              >
                <section className={classnames(["text-center"])}>
                  <div className="rounded-lg">
                    <WixImage
                      src={
                        show.logoHorizontal ? show.logoHorizontal : show.logo
                      }
                      alt={show.title}
                      targetWidth={show.logoHorizontal ? 800 : 400}
                      className="hidden md:block mx-auto mb-5"
                    />
                    <WixImage
                      src={show.logo}
                      alt={show.title}
                      targetWidth={400}
                      className="block md:hidden mx-auto mb-5"
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
                        <Link
                          className="text-primary link"
                          href={`/credits/${nameSlug(show.director)}`}
                        >
                          {fullName(show.director)}
                        </Link>
                      </p>
                    </div>
                    <h3 className="text-xl text-primary mb-6 drop-shadow-lg text-center">
                      Featuring
                    </h3>
                    <div
                      className={classnames(
                        {
                          "xl:grid-cols-3": show.cast.length > 2,
                        },
                        ["grid", "gap-8", "md:grid-cols-2", "items-start"]
                      )}
                    >
                      {manualSort(show.cast).map(async (cast: Credit) => {
                        let headshot: string | undefined;
                        // Check if the cast member has an alternate headshot
                        // designated for this show
                        if (cast.person?.headshots?.length) {
                          const alternateHeadshot = cast.person.headshots.find(
                            (headshot: AlternateHeadshot) =>
                              // The title of the headshot must exactly match
                              // the title of the show
                              headshot.title === show.title
                          );
                          if (alternateHeadshot) {
                            headshot = alternateHeadshot.src;
                          }
                        } else {
                          headshot = cast.person?.headshot;
                        }

                        return (
                          <FeaturedCastMember
                            key={cast._id}
                            className={classnames([
                              "flex",
                              "flex-col",
                              "items-center",
                              "justify-center",
                              "text-center",
                            ])}
                            role={cast.role}
                            castMember={cast.person}
                            headshot={headshot}
                          />
                        );
                      })}
                    </div>
                  </section>
                </section>
              </section>
              <section
                className={classnames([
                  "grow-1",
                  "bg-base-200",
                  "text-center",
                  "p-4",
                  "md:p-6",
                  "xl:p-8",
                ])}
              >
                <div className="mb-4">
                  <Link
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
                    Box Office
                  </Link>
                </div>
                <h3 className="text-xl mb-2 md:text-center">Showtimes</h3>
                <div className={classnames(["gap-2", "flex", "flex-col"])}>
                  {show.shows?.length ? (
                    show.shows.map((event) => {
                      return <ShowTime key={event._id} event={event} />;
                    })
                  ) : (
                    <p className="text-center text-lg">
                      No showtimes available
                    </p>
                  )}
                </div>
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FeaturedShow;
