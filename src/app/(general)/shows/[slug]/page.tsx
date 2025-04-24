import type { Metadata } from "next";
import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import type { Credit, Show, ShowWithData } from "@/app/types";
import { media } from "@wix/sdk";
import { manualSort, fullName, nameSlug } from "@/app/utils";
import classnames from "classnames";
import Link from "next/link";
import { getShowsWithData } from "@/app/actions/shows";
import { BookImage } from "lucide-react";
import PhotoGallery from "@/app/components/PhotoGallery";
import ShowLogo from "@/app/components/ShowLogo";
import CenterSpinner from "@/app/components/CenterSpinner";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getShowData = async (slug: string) => {
  const { items } = await wixClient.items
    .query("Shows")
    .include("director")
    .eq("slug", slug)
    .find();

  const showsWithData = await getShowsWithData({ shows: items as Show[] });

  return showsWithData[0] as ShowWithData;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShowData(slug);

  return {
    title: `${show.title}, by ${show.author}, directed by ${fullName(
      show.director
    )}`,
    description: show.description
      ? `${show.description.replace(/<[^>]+>/g, "").slice(0, 160)}...`
      : "Learn more about this show at NOVA Nightsky Theater.",
  };
}

const ShowContent = async ({ slug }: { slug: string }) => {
  const show = await getShowData(slug);

  return (
    <div className="">
      {/* <h1 className="p-4 md:p-6 xl:p-8 text-2xl">{show.title}</h1> */}
      <div
        className={classnames([
          "grid",
          "md:gap-x-8",
          "md:gap-y-6",
          "grid-cols-1",
          "md:grid-cols-[2fr_3fr]",
          "xl:grid-cols-3",
          // "flex",
          // "flex-col",
          // "md:flex-row",
        ])}
      >
        {show.logo && (
          <ShowLogo
            show={show}
            className={classnames([
              //"md:w-1/3",
              "p-2",
              "row-span-2",
            ])}
            link={show.program ? media.getDocumentUrl(show.program).url : false}
          />
        )}
        <section
          className={classnames([
            "xl:col-start-2",
            "xl:row-start-1",
            // "md:pt-0!",
            "p-4",
            "md:pl-0",
            "md:pt-6",
            "md:pr-8",
            // "md:pb-0",
            "xl:pt-8",
            "flex",
            "flex-col",
            "gap-8",
          ])}
        >
          {/* <h2 className="text-2xl">
            <b className="text-xl text-primary/50 font-normal">by</b>{" "}
            {show.author}
          </h2> */}

          <section>
            <h2>Director</h2>

            <p>
              <Link
                href={`/credits/${nameSlug(show.director)}`}
                className="link"
              >
                {fullName(show.director)}
              </Link>
            </p>
          </section>

          {show.program && (
            <section>
              <Link
                href={media.getDocumentUrl(show.program).url}
                className={classnames([
                  "flex",
                  "ml-[-3px]",
                  "items-center",
                  "link",
                  "text-primary/70",
                  "hover:text-primary",
                  "transition-all",
                  "duration-250",
                  "hover:[&>svg]:scale-120",
                ])}
              >
                <BookImage
                  size={32}
                  className={classnames([
                    "mr-1",
                    "duration-250",
                    "transition-transform",
                  ])}
                />
                <span className="link">Download Program</span>
              </Link>
            </section>
          )}

          {show.crew?.length ? (
            <section>
              <h2>Crew</h2>
              <table className="mt-1">
                <tbody>
                  {show.crew.map((crew) => {
                    return (
                      <tr key={crew[0]._id}>
                        <td
                          className={classnames([
                            "align-top",
                            "text-right",
                            "leading-tight",
                            "pr-2",
                            "pb-2",
                            "text-sm",
                          ])}
                        >
                          <Link
                            href={`/credits/${nameSlug(crew[0].person)}`}
                            className={classnames([
                              "link",
                              // "text-sm",
                              "text-primary/70",
                              "hover:text-primary",
                              "transition-all",
                            ])}
                          >
                            {fullName(crew[0].person)}
                          </Link>
                        </td>
                        <td
                          className={classnames([
                            "align-top",
                            "leading-tight",
                            "pb-2",
                            "text-sm",
                          ])}
                        >
                          <ul>
                            {crew.map((credit) => {
                              return (
                                <li
                                  key={credit._id}
                                  className={classnames([
                                    // "leading-tight",
                                    "[&+li]:mt-1",
                                    // "text-sm",
                                  ])}
                                >
                                  {credit.role}
                                </li>
                              );
                            })}{" "}
                          </ul>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ) : null}
        </section>

        <section
          className={classnames([
            "md:col-start-2",
            "md:row-start-2",
            "xl:col-start-3",
            "xl:row-start-1",
            // "md:pt-0!",
            // "md:w-1/3",
            "p-4",
            "md:pl-0",
            "md:pb-8",
            "md:pr-8",
            "xl:pt-8",
            "flex",
            "flex-col",
            "gap-8",
          ])}
        >
          {show.cast?.length ? (
            <section>
              <h2>Cast</h2>

              <ul>
                {manualSort(show.cast).map((credit: Credit) => (
                  <li key={credit._id} className="mb-2">
                    <Link
                      href={`/credits/${nameSlug(credit.person)}`}
                      className="link text-primary/70 hover:text-primary transition-all"
                    >
                      {fullName(credit.person)}
                    </Link>{" "}
                    as <b className="text-primary/70">{credit.role}</b>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {show.description && (
            <section>
              <h2 className="text-lg">Description</h2>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: show.description }}
              ></div>
            </section>
          )}

          {show.reviews && (
            <section>
              <h2 className="text-lg">Reviews</h2>
              <div
                className={classnames(["prose", "[&_p:first-child]:mt-0"])}
                dangerouslySetInnerHTML={{ __html: show.reviews }}
              ></div>
            </section>
          )}
        </section>
      </div>
      {show.photos && <PhotoGallery photos={show.photos} />}
    </div>
  );
};

const Season = async ({ params }: PageProps) => {
  const { slug } = await params;

  return (
    <Suspense fallback={<CenterSpinner />}>
      <ShowContent slug={slug} />
    </Suspense>
  );
};

export default Season;
