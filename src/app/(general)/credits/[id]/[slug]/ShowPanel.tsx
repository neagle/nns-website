"use client";

import React from "react";
import type { Credit } from "@/app/types";
import classnames from "classnames";
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
      ])}
    >
      <figure className="shrink-0">
        <ShowLogo
          show={show}
          targetWidth={200}
          className="text-center overflow-hidden p-4 w-full"
        />
      </figure>
      <div className="card-body flex-row items-start p-0">
        <div className="table table-zebra border-separate border-spacing-2">
          <div className="grow-1 table-row">
            {wasDirector ? (
              <p className="text-lg mb-2 text-primary/80">Director</p>
            ) : null}

            {cast.length ? (
              <div className="table-row gap-2">
                <h3 className="text-right table-header">Cast</h3>
                <ul className="table-cell">
                  {cast.map((credit) => (
                    <li
                      key={credit._id}
                      className="mr-2 leading-tight mb-1 pl-1 -indent-1"
                    >
                      {credit.role}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {crew.length ? (
              <div className="table-row">
                <h3 className="table-header">Crew</h3>
                <ul className="table-cell">
                  {crew.map((credit) => (
                    <li
                      key={credit._id}
                      className="mr-2 leading-tight mb-1 pl-1 -indent-1"
                    >
                      {credit.role}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div className="text-info text-right p-2 m-2 font-bold leading-tight">
          <div className="uppercase text-xs leading-tight text-info/60">
            {dayjs(show.openingDate).format("MMMM")}
          </div>
          <div className="leading-tight text-xl">
            {dayjs(show.openingDate).format("YYYY")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPanel;
