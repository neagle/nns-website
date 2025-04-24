import type { Metadata } from "next";
import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import type { Credit, Show } from "@/app/types";
import { getFirstMiddleLastNamesFromSlug, fullName } from "@/app/utils";
import { notFound } from "next/navigation";
import type { Person } from "@/app/types";
import Link from "next/link";
import WixImage from "@/app/components/WixImage";
import classnames from "classnames";
import ShowPanel from "./ShowPanel";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { firstName, lastName } = getFirstMiddleLastNamesFromSlug(slug);

  return {
    title: `${firstName} ${lastName} - Credits`,
    description: `NOVA Nightsky credits for ${firstName} ${lastName}.`,
  };
}

interface CreditsContentProps {
  id: string;
  person: Person;
}

const CreditsContent = async ({ id, person }: CreditsContentProps) => {
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

  // Sort shows by opening date
  sortedCredits.sort(([_showA, creditsA], [_showB, creditsB]) => {
    const aShow = creditsA[0].show;
    const bShow = creditsB[0].show;
    const aShowDate = new Date(aShow.openingDate).getTime();
    const bShowDate = new Date(bShow.openingDate).getTime();

    if (aShowDate && bShowDate) {
      return bShowDate - aShowDate;
    }
    return 0;
  });

  return sortedCredits.map(([showId, credits]) => (
    <ShowPanel key={showId} credits={credits} />
  ));
};

const Credits = async ({ params }: PageProps) => {
  const { slug } = await params;
  // const person = (await wixClient.items.get("People", id)) as Person;
  const { firstName, lastName, middleName } = getFirstMiddleLastNamesFromSlug(
    decodeURIComponent(slug)
  );

  let personQuery = wixClient.items
    .query("People")
    .eq("firstName", firstName)
    .eq("lastName", lastName);

  if (middleName) {
    personQuery = personQuery.eq("middleName", middleName);
  }

  const { items: people } = await personQuery.find();

  const person = people[0] as Person;

  if (!person) {
    notFound();
  }

  const id = person._id;

  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1 className="text-2xl">{fullName(person)}</h1>

      <div
        className={classnames({ "gap-4": person.headshot }, [
          "mt-4 md:mt-6 xl:mt-8",
          "grid",
          "md:grid-cols-[auto_1fr]",
          "gap-8",
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

        <section className={classnames(["grid", "xl:grid-cols-2", "gap-8"])}>
          <Suspense
            fallback={
              <div
                className={classnames([
                  "ml-20",
                  "text-primary",
                  "loading",
                  "loading-bars",
                  "loading-lg",
                  "text-primary",
                ])}
              ></div>
            }
          >
            <CreditsContent id={id} person={person} />
          </Suspense>
        </section>
      </div>

      {person.aboutTheArtists && (
        <p className="mt-4">
          See more of {fullName(person)}&rsquo;s theater credits at{" "}
          <Link href={person.aboutTheArtists} className="link">
            <strong>About the Artists</strong>
          </Link>
        </p>
      )}
    </div>
  );
};

export default Credits;
