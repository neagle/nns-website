import React from "react";
import wixClient from "@/lib/wixClient";
import type { Credit, Show } from "@/app/types";
import { fullName } from "@/app/utils";
import { notFound } from "next/navigation";
import type { Person } from "@/app/types";
import Link from "next/link";
import WixImage from "@/app/components/WixImage";
import classnames from "classnames";
import ShowLogo from "@/app/components/ShowLogo";
import dayjs from "dayjs";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const History = async ({ params }: PageProps) => {
  const { id } = await params;
  const person = (await wixClient.items.get("People", id)) as Person;

  if (!person) {
    notFound();
  }

  const { items: directed } = await wixClient.items
    .query("Shows")
    .eq("director", id)
    .find();

  const showsDirected = directed as Show[];
  // Transform directed shows into credits
  const directorialCredits = showsDirected.map(
    (show) =>
      ({
        _id: show._id,
        role: "Director",
        person,
        show,
        category: "crew",
      } as Credit)
  );

  const { items } = await wixClient.items
    .query("Credits")
    .eq("person", id)
    .include("show")
    .find();

  const credits = items as Credit[];

  // Transform credits into an object with show IDs as keys
  // and an array of credits as values
  const creditsByShow: Record<string, Credit[]> = {};
  credits.forEach((credit) => {
    const showId = credit.show._id;
    if (!creditsByShow[showId]) {
      creditsByShow[showId] = [];
    }
    creditsByShow[showId].push(credit);
  });

  // Add in the directorial credits
  directorialCredits.forEach((credit) => {
    const showId = credit.show._id;
    if (!creditsByShow[showId]) {
      creditsByShow[showId] = [];
    }
    creditsByShow[showId].push(credit);
  });

  // Transform the credits object back into an array, but with a single array
  // for each show, containing all of the person's credits
  const sortedCredits = Object.entries(creditsByShow);
  sortedCredits.sort(([showA], [showB]) => {
    const aShow = credits.find((credit) => credit.show._id === showA);
    const bShow = credits.find((credit) => credit.show._id === showB);
    if (aShow && bShow) {
      return (
        new Date(bShow.show.openingDate).getTime() -
        new Date(aShow.show.openingDate).getTime()
      );
    }
    return 0;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl">{fullName(person)}</h1>

      <div
        className={classnames({ "gap-4": person.headshot }, [
          "mt-4",
          "grid",
          "md:grid-cols-[auto_1fr]",
          // "gap-4",
          "w-2/3",
          "w-full",
        ])}
      >
        <section>
          {person.headshot && (
            <WixImage
              src={person.headshot}
              alt={fullName(person)}
              targetHeight={300}
              className={classnames([
                "rounded-lg",
                "shadow-md",
                "shadow-primary",
                "mx-auto",
                "md:mx-0",
              ])}
            />
          )}
        </section>

        <section className={classnames([])}>
          {sortedCredits.map(([showId, credits]) => {
            // We can just use the first show since all credits are for the same
            // show
            const show = credits[0].show;

            // Single out directorship -- they're the captain of the ship!
            const wasDirector = credits.some(
              (credit) =>
                credit.category === "crew" && credit.role === "Director"
            );

            const cast = credits.filter((credit) => credit.category === "cast");
            const crew = credits.filter(
              (credit) =>
                credit.category === "crew" && credit.role !== "Director"
            );

            return (
              <div
                key={showId}
                className={classnames([
                  "grid",
                  "md:grid-cols-[auto_1fr]",
                  "gap-4",
                  "mb-4",
                  "w-full",
                ])}
              >
                <div>
                  <ShowLogo
                    show={show}
                    targetWidth={300}
                    className="text-center"
                  />
                </div>
                <div>
                  <h2 className="text-xl">
                    <Link href={`/shows/${show.slug}`}>{show.title}</Link>
                  </h2>
                  <p className="mb-4">
                    {dayjs(show.openingDate).format("MMMM YYYY")}
                  </p>
                  <div className="text-sm">
                    {wasDirector ? (
                      <h3 className="text-lg mb-2">
                        <strong>Director</strong>
                      </h3>
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
          })}
        </section>
      </div>

      {person.aboutTheArtists && (
        <p>
          <Link href={person.aboutTheArtists} className="link">
            More Theater Credits on &ldquo;About the Artists&rdquo; &rarr;
          </Link>
        </p>
      )}
    </div>
  );
};

export default History;
