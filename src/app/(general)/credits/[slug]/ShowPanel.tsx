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
        "grid",
        "md:grid-cols-[auto_1fr]",
        "gap-4",
        "mb-4",
        "w-full",
      ])}
    >
      <div>
        {show.logo && (
          <ShowLogo
            show={show}
            targetWidth={200}
            className="text-center rounded overflow-hidden"
          />
        )}
      </div>
      <div>
        <h2 className="text-lg leading-tight">
          <Link href={`/shows/${show.slug}`}>{show.title}</Link>
        </h2>
        <p className="mb-4">{dayjs(show.openingDate).format("MMMM YYYY")}</p>
        <div className="text-sm">
          {wasDirector ? (
            <p className="text-lg mb-2 text-primary/80">Director</p>
          ) : null}

          {cast.length ? (
            <>
              <h3>Cast</h3>
              <ul className="mb-4">
                {cast.map((credit) => (
                  <li key={credit._id} className="mr-2 uppercase">
                    {credit.role}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {crew.length ? (
            <>
              <h3>Crew</h3>
              <ul className="">
                {crew.map((credit) => (
                  <li key={credit._id} className="mr-2">
                    {credit.role}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShowPanel;
