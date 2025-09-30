import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import classnames from "classnames";
import ShowLogo from "@/app/components/ShowLogo";
import CenterSpinner from "@/app/components/CenterSpinner";
import { formatList } from "@/app/utils";

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

interface ShowsProps {
  startOfYear: Date;
  endOfYear: Date;
}

export async function generateMetadata({ params }: PageProps) {
  const { year } = await params;

  // Construct the start and end dates for the year
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
  const shows = await getShows(startOfYear, endOfYear);

  return {
    title: `${year} Season: ${formatList(shows.map((show) => show.title))}`,
  };
}

const getShows = async (startOfYear: Date, endOfYear: Date) => {
  const { items } = await wixClient.items
    .query("Shows")
    .ge("openingDate", startOfYear.toISOString()) // Greater than or equal to start of the year
    .le("openingDate", endOfYear.toISOString()) // Less than or equal to end of the year
    .ascending("openingDate")
    .include("director")
    .find();

  return items as Show[];
};

const Shows = async ({ startOfYear, endOfYear }: ShowsProps) => {
  const shows = await getShows(startOfYear, endOfYear);

  return (
    <>
      {shows.map(async (show) => {
        return (
          <ShowLogo
            key={show._id}
            show={show}
            className={classnames([
              "flex",
              "items-center",
              "hover:scale-100!",
              "hover:opacity-100!",
              "transition-all",
              "duration-300",
              "[&:focus-within]:scale-100!",
              "[&:focus-within]:opacity-100!",
              "[&:focus-within]:outline-8",
              "[&:focus-within]:outline-accent",
            ])}
          />
        );
      })}
    </>
  );
};

const Season = async ({ params }: PageProps) => {
  const { year } = await params;

  // Construct the start and end dates for the year
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

  return (
    <div className="">
      <h1 className="p-4 text-2xl text-primary! font-normal!">
        <b className="text-primary! text-3xl">{year}</b> Season
      </h1>
      <div
        className={classnames([
          "grid",
          "gap-0",
          "grid-cols-1",
          "sm:grid-cols-2",
          "md:grid-cols-3",
          "lg:grid-cols-4",
          "items-stretch",

          "group",

          "[&:has(*:hover)]:hover:[&>*]:scale-90",
          "[&:has(*:hover)]:hover:[&>*]:opacity-50",
          "[&:focus-within]:[&>*]:scale-90",
          "[&:focus-within]:[&>*]:opacity-50",
        ])}
      >
        <Suspense fallback={<CenterSpinner />}>
          <Shows startOfYear={startOfYear} endOfYear={endOfYear} />
        </Suspense>
      </div>
    </div>
  );
};

export default Season;
