"use client";

import React from "react";
import type { Credit } from "@/app/types";
import classnames from "classnames";
import ShowLogo from "@/app/components/ShowLogo";

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
          targetWidth={150}
          className="text-center overflow-hidden p-4 w-full"
        />
      </figure>
      <div className="card-body">
        <div className="flex flex-col gap-4">
          {wasDirector ? (
            <p className="text-xl font-bold mb-2 text-secondary">Director</p>
          ) : null}

          {cast.length ? (
            <div className="">
              <h3 className="">Cast</h3>
              <ul className="">
                {cast.map((credit) => (
                  <li key={credit._id} className=" leading-tight my-2">
                    {credit.role}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {crew.length ? (
            <div className="">
              <h3 className="">Crew</h3>
              <ul className="">
                {crew.map((credit) => (
                  <li key={credit._id} className="leading-tight my-2">
                    {credit.role}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShowPanel;
