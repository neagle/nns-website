export const revalidate = 60; // revalidate this page every 60 seconds

import React from "react";
import wixClient from "@/lib/wixClient";
import classnames from "classnames";
import type { Show } from "@/app/types";
import PersonList from "@/app/components/PersonList";
import { getShowsWithData } from "@/app/actions/shows";
import ShowTime from "./ShowTime";
import WixImage from "@/app/components/WixImage";
import { getShowBackgroundStyle } from "@/app/utils";
import Link from "next/link";
import FeaturedCast from "@/app/components/FeaturedCast";
import FormattedDateTime from "@/app/components/FormattedDateTime";

const FeaturedShow = async () => {
  const { items } = await wixClient.items
    .query("Shows")
    .eq("feature", true)
    .include("directors")
    .find();

  const shows = items as Show[];

  // Get cast, crew, and events for each show
  // These require separate queries to the Wix API
  const showsWithData = await getShowsWithData({ shows });

  return (
    <div>
      <ul className="flex flex-col">
        {showsWithData.map(async (show) => {
          const backgroundStyle = getShowBackgroundStyle(show);

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
              <section className={classnames(["md:w-2/3"])}>
                <section className={classnames(["text-center"])}>
                  <Link
                    className={classnames(["p-4", "md:p-6", "xl:p-8", "block"])}
                    style={backgroundStyle}
                    href={
                      // If there are showtimes, link to the box office,
                      // otherwise link to the show page
                      show.shows?.length ? "/box-office" : `/shows/${show.slug}`
                    }
                  >
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
                  </Link>
                  <section
                    className={classnames([
                      "text-left",
                      "p-4",
                      "md:p-6",
                      "xl:p-8",
                    ])}
                  >
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
                        <PersonList
                          people={show.directors}
                          linkToCredits={true}
                        />
                      </p>
                    </div>
                    {show.cast?.length ? (
                      <>
                        <h3 className="text-2xl text-primary mb-8 drop-shadow-lg text-center">
                          The Cast
                        </h3>
                        <FeaturedCast show={show} />
                      </>
                    ) : (
                      <>
                        {show.openingDate ? (
                          <h3 className="text-center">
                            <span className="font-normal opacity-80 text-md mr-1">
                              Opens on
                            </span>{" "}
                            <FormattedDateTime
                              className="text-xl"
                              date={new Date(show.openingDate)}
                              format="MMMM D , YYYY"
                            />
                          </h3>
                        ) : null}
                        {show.auditions && !show.noLongerAuditioning ? (
                          <div className="flex gap-8 flex-col xl:flex-row">
                            <div
                              className="my-2 grow"
                              dangerouslySetInnerHTML={{
                                __html: show.auditions,
                              }}
                            />

                            {show.auditionLink && (
                              <Link
                                href={show.auditionLink}
                                className={classnames([
                                  "mt-4",
                                  "btn",
                                  "btn-primary",
                                  "btn-full",
                                  "hover:scale-110",
                                  "transition-all",
                                  "self-end",
                                ])}
                              >
                                Sign Up to Audition
                              </Link>
                            )}
                          </div>
                        ) : null}
                      </>
                    )}
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
                      Tickets are not yet available for this show.
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
