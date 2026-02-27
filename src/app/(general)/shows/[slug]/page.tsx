import type { Metadata } from "next";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
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
import PersonList, { getPersonList } from "@/app/components/PersonList";
import FormattedDateTime from "@/app/components/FormattedDateTime";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getShowData = async (slug: string) => {
  const { items } = await wixClient.items
    .query("Shows")
    .include("directors")
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
  const ogImage = `https://www.novanightskytheater.com/og/shows/${slug}.png`;

  return {
    title: `${show.title}, by ${show.author}, directed by ${getPersonList({
      people: show.directors,
    })}`,
    description: show.description
      ? `${show.description.replace(/<[^>]+>/g, "").slice(0, 160)}...`
      : "Learn more about this show at NOVA Nightsky Theater.",
    openGraph: {
      images: [{ url: ogImage, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

const ShowContent = async ({ slug }: { slug: string }) => {
  const show = await getShowData(slug);

  if (!show) {
    notFound();
  }

  const openingDate = new Date(show?.openingDate || "");
  const now = new Date();

  return (
    <div className="">
      <div
        className={classnames([
          "grid",
          "grid-cols-1",
          "md:grid-cols-[2fr_3fr]",
          "xl:grid-cols-3",
        ])}
      >
        <ShowLogo show={show} link={false} noDirector={true} centered={false} />
        <section
          className={classnames([
            "p-8",
            "md:pt-6",
            "md:pr-8",
            "xl:pt-8",
            "flex",
            "flex-col",
            "gap-8",
          ])}
        >
          <div>
            <h1 className="text-3xl font-bold">{show.title}</h1>
            <h2 className="text-xl text-primary/70! font-normal! capitalize! font-sans!">
              <b className="text-sm text-primary/50 font-normal lowercase">
                by
              </b>{" "}
              {show.author}
            </h2>

            {show?.adaptors && (
              <div className="mt-2 text-sm">
                <span className="text-xs text-primary/50">Adapted by</span>{" "}
                <span className="text-primary/70">{show?.adaptors}</span>
              </div>
            )}
          </div>

          {show?.shows?.length ? (
            <Link
              href="/box-office"
              className={classnames([
                "btn",
                "btn-lg",
                "btn-wide",
                "btn-primary",
                "hover:scale-105",
                "transition-all",
              ])}
            >
              Buy Tickets
            </Link>
          ) : openingDate && openingDate > now ? (
            <h2 className="text-secondary!">
              Opening in{" "}
              <FormattedDateTime date={openingDate} format="MMMM YYYY" />
            </h2>
          ) : (
            <h2 className="text-primary">
              Opened in{" "}
              <FormattedDateTime date={openingDate} format="MMMM YYYY" />
            </h2>
          )}

          {show?.directors?.length && (
            <section>
              <h2>Director{show.directors.length > 1 ? "s" : ""}</h2>

              <p>
                <PersonList people={show.directors} linkToCredits={true} />
              </p>
            </section>
          )}

          {!show.noLongerAuditioning &&
            show.auditions &&
            openingDate &&
            openingDate > now && (
              <section>
                <h2>Auditions</h2>

                <div
                  className="prose text-pretty"
                  dangerouslySetInnerHTML={{ __html: show.auditions }}
                />

                {show.auditionLink && (
                  <Link
                    href={show.auditionLink}
                    className="mt-4 btn btn-primary btn-wide hover:scale-110 transition-all"
                  >
                    Sign Up to Audition
                  </Link>
                )}
              </section>
            )}

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

          {show.cast?.length ? (
            <section>
              <h2>Cast</h2>

              <ul>
                {manualSort(show.cast).map((credit: Credit) => (
                  <li key={credit._id} className="mb-2">
                    <Link
                      href={`/credits/${nameSlug(credit.person)}/${
                        credit.person._id
                      }`}
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
                            href={`/credits/${nameSlug(crew[0].person)}/${
                              crew[0].person._id
                            }`}
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
            "p-8",
            "md:pb-8",
            "md:pr-8",
            "xl:pt-8",
            "flex",
            "flex-col",
            "gap-8",
            "md:col-span-2",
            "xl:col-span-1",
          ])}
        >
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
