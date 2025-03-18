import React from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import { getImageWithDimensions } from "@/app/actions/media";
import Image from "next/image";
import classnames from "classnames";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

const Season = async ({ params }: PageProps) => {
  const { year } = await params;

  // Construct the start and end dates for the year
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

  const { items } = await wixClient.items
    .query("Shows")
    .ge("openingDate", startOfYear.toISOString()) // Greater than or equal to start of the year
    .le("openingDate", endOfYear.toISOString()) // Less than or equal to end of the year
    .ascending("openingDate")
    .include("director")
    .find();

  const shows = items as Show[];
  return (
    <div className="">
      <h1 className="p-4 text-2xl text-primary/70! font-normal!">
        Season <b className="text-primary! text-3xl">{year}</b>
      </h1>
      <div className="flex flex-row flex-wrap group">
        {shows.map(async (show) => {
          // console.log("show", show);

          const logo = await getImageWithDimensions(show.logo);
          const backgroundTexture = show.backgroundTexture
            ? await getImageWithDimensions(show.backgroundTexture)
            : null;

          const styleBlock = {
            backgroundImage: backgroundTexture
              ? `url(${backgroundTexture.url})`
              : "none",
            backgroundColor: show.backgroundColor || "transparent",
            backgroundSize: "cover",
            backgroundPosition: "center",
          };

          return (
            <section
              key={show._id}
              style={styleBlock}
              className={classnames([
                "w-full",
                "sm:w-1/2",
                "md:w-1/3",
                "lg:w-1/4",
                "flex",
                "items-center",
                "opacity-100",
                "peer",
                "transition-all",
                "group-hover:opacity-50", // Dim all sections when hovering over the parent
                "group-hover:scale-90", // Dim all sections when hovering over the parent
                "hover:scale-100",
                "ease-in-out",
                "duration-500",
                "hover:opacity-100",
              ])}
            >
              <Link
                href={`/shows/${show.slug}`}
                className="w-full h-full flex items-center"
              >
                <Image
                  // className="w-full"
                  src={logo.url}
                  alt={show.title}
                  width={logo.width}
                  height={logo.height}
                />
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Season;
