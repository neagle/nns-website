import React from "react";
import type { Credit } from "@/app/types";
import classnames from "classnames";
import Link from "next/link";
import ShowLogo from "@/app/components/ShowLogo";
import dayjs from "dayjs";

interface ShowPanelProps {
  credits: Credit[];
}

const ShowPanel = ({ credits }: ShowPanelProps) => {
  // We can just use the first show since all credits are for the same
  // show
  const show = credits[0].show;

  // Single out directorship -- they're the captain of the ship!
  const wasDirector = credits.some(
    (credit) => credit.category === "crew" && credit.role === "Director"
  );

  const cast = credits.filter((credit) => credit.category === "cast");
  const crew = credits.filter(
    (credit) => credit.category === "crew" && credit.role !== "Director"
  );
  return (
    <div
      className={classnames([
        "card",
        "md:card-side",
        "bg-base-200",
        "shadow-md",
        // "hover:bg-base-300",
        // "transition-all",
      ])}
    >
      {show.logo && (
        <figure className="shrink-0">
          <ShowLogo
            show={show}
            targetWidth={200}
            className="text-center overflow-hidden p-2 w-full"
          />
        </figure>
      )}
      <div className="card-body flex-row items-start">
        <div className="grow-1">
          {wasDirector ? (
            <p className="text-lg mb-2 text-primary/80">Director</p>
          ) : null}

          {cast.length ? (
            <div className="flex flex-row gap-2">
              <h3 className="w-1/4 text-right">Cast</h3>
              <ul className="">
                {cast.map((credit) => (
                  <li key={credit._id} className="mr-2 uppercase">
                    {credit.role}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {crew.length ? (
            <div className="flex flex-row gap-2">
              <h3 className="w-1/4 text-right">Crew</h3>
              <ul className="">
                {crew.map((credit) => (
                  <li key={credit._id} className="mr-2">
                    {credit.role}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="text-info text-right">
          <div className="uppercase text-sm leading-tight">
            {dayjs(show.openingDate).format("MMM")}
          </div>
          <div className="leading-tight">
            {dayjs(show.openingDate).format("YYYY")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPanel;
