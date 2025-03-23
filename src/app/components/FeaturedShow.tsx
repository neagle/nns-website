import React from "react";
import wixClient from "@/lib/wixClient";
import { media } from "@wix/sdk";
import classnames from "classnames";

import { Show } from "@/app/types";

import { fullName } from "@/app/utils";
import FeaturedCastMember from "./FeaturedCastMember";
import { getShowsWithData } from "@/app/actions/shows";
import ShowTime from "./ShowTime";
import WixImage from "@/app/components/WixImage";

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
      <ul className="h-full">
        {showsWithData.map(async (show) => {
          let backgroundStyle: React.CSSProperties = {
            backgroundColor: show.backgroundColor || "transparent",
          };

          if (show.backgroundTexture) {
            const backgroundTexture = media.getImageUrl(show.backgroundTexture);
            backgroundStyle = {
              ...backgroundStyle,
              backgroundImage: `url(${backgroundTexture.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            };
          }

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
                    <WixImage
                      src={
                        show.logoHorizontal ? show.logoHorizontal : show.logo
                      }
                      alt={show.title}
                      targetWidth={show.logoHorizontal ? 800 : 400}
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
                        return (
                          <FeaturedCastMember
                            key={cast._id}
                            className="flex flex-col items-center justify-center text-center"
                            role={cast.role}
                            castMember={cast.person}
                            headshot={cast.person.headshot}
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
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FeaturedShow;
