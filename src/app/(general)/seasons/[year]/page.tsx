import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import classnames from "classnames";
import ShowPanel from "./ShowPanel";

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

interface ShowsProps {
  startOfYear: Date;
  endOfYear: Date;
}

const Shows = async ({ startOfYear, endOfYear }: ShowsProps) => {
  const { items } = await wixClient.items
    .query("Shows")
    .ge("openingDate", startOfYear.toISOString()) // Greater than or equal to start of the year
    .le("openingDate", endOfYear.toISOString()) // Less than or equal to end of the year
    .ascending("openingDate")
    .find();

  const shows = items as Show[];

  return (
    <>
      {shows.map(async (show) => {
        return <ShowPanel key={show._id} show={show} />;
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
      <div className="flex flex-row flex-wrap group">
        <Suspense
          fallback={
            <div
              className={classnames([
                "absolute",
                "left-1/2",
                "text-primary",
                "loading",
                "loading-spinner",
                "loading-lg",
                "text-primary",
              ])}
            ></div>
          }
        >
          <Shows startOfYear={startOfYear} endOfYear={endOfYear} />
        </Suspense>
      </div>
    </div>
  );
};

export default Season;
