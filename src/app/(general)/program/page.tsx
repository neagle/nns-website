import { Metadata } from "next";
import React from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import ShowLogo from "@/app/components/ShowLogo";
import { media } from "@wix/sdk";
import classnames from "classnames";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital Program",
  description: "Digital programs for NOVA Nightsky Theater shows",
};

const getShows = async () => {
  const { items } = await wixClient.items
    .query("Shows")
    // Only get shows that have opened in the past (or today)
    .le("openingDate", new Date().toISOString())
    // Only get shows that have a program
    .ne("program", null)
    .descending("openingDate")
    .find();

  return items as Show[];
};

const Program = async () => {
  const shows = await getShows();

  return (
    <div className="p-4 md:p-6 xl:p-8 ">
      <h1 className="text-2xl mb-4">Digital Program</h1>
      <Link
        key={shows[0]._id}
        href={media.getDocumentUrl(shows[0].program!).url}
        className={classnames([
          "flex",
          "ml-[-3px]",
          "items-center",
          "link",
          "text-primary/70",
          "hover:text-primary",
          "transition-all",
          "duration-250",
          "hover:[&>svg]:scale-120",
        ])}
      >
        <ShowLogo
          show={shows[0]}
          link={false}
          // targetWidth={150}
          className={classnames([
            "text-center",
            "overflow-hidden",
            "w-full",
            "md:max-w-1/2",
            "lg:max-w-1/3",
          ])}
        />
      </Link>

      {shows.length > 1 && (
        <>
          <h2 className="mt-8 mb-4">Previous Shows</h2>

          <section
            className={classnames([
              "flex",
              "flex-wrap",
              "gap-4",
              "flex-col",
              "md:flex-row",
            ])}
          >
            {shows.length &&
              shows.map((show, i) =>
                i !== 0 ? (
                  <Link
                    key={show._id}
                    href={media.getDocumentUrl(show.program!).url}
                    className={classnames([
                      "flex",
                      "ml-[-3px]",
                      "items-center",
                      "link",
                      "text-primary/70",
                      "hover:text-primary",
                      "transition-all",
                      "duration-250",
                      "hover:[&>svg]:scale-120",
                    ])}
                  >
                    {show.title}
                  </Link>
                ) : null
              )}
          </section>
        </>
      )}
    </div>
  );
};

export default Program;
