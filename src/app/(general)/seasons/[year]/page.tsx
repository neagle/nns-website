import React, { cache, Suspense } from "react";
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

const getShows = cache(async (startOfYear: Date, endOfYear: Date) => {
  const { items } = await wixClient.items
    .query("Shows")
    .ge("openingDate", startOfYear.toISOString()) // Greater than or equal to start of the year
    .le("openingDate", endOfYear.toISOString()) // Less than or equal to end of the year
    .ascending("openingDate")
    .include("director")
    .find();

  return items as Show[];
});

const Shows = async ({ startOfYear, endOfYear }: ShowsProps) => {
  const shows = await getShows(startOfYear, endOfYear);

  return (
    <>
      {shows.map(async (show) => {
        return <ShowLogo key={show._id} show={show} />;
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
      <h1 className="p-4 text-2xl text-primary/70! font-normal!">
        Season <b className="text-primary! text-3xl">{year}</b>
      </h1>
      <div
        className={classnames([
          "flex",
          "flex-row",
          "flex-wrap",
          "group",
          "hover:[&>section]:scale-90",
          "hover:[&>section]:opacity-50",
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
