import React from "react";
import wixClient from "@/lib/wixClient";
import type { Credit, Show, ShowWithData } from "@/app/types";
import { media } from "@wix/sdk";
import { manualSort, fullName, nameSlug } from "@/app/utils";
import { getImageWithDimensions } from "@/app/actions/media";
import WixImage from "@/app/components/WixImage";
import classnames from "classnames";
import Link from "next/link";
import { getShowsWithData } from "@/app/actions/shows";
import { BookImage } from "lucide-react";
import PhotoGallery from "@/app/components/PhotoGallery";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Season = async ({ params }: PageProps) => {
  const { slug } = await params;
  const { items } = await wixClient.items
    .query("Shows")
    .include("director")
    .eq("slug", slug)
    .find();

  const showsWithData = await getShowsWithData({ shows: items as Show[] });

  const show = showsWithData[0] as ShowWithData;

  const backgroundTexture = show.backgroundTexture
    ? await getImageWithDimensions(show.backgroundTexture)
    : null;

  const styleBlock = {
    backgroundImage: backgroundTexture
      ? `url(${backgroundTexture.url})`
      : "none",
    backgroundColor: show.backgroundColor || "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  // console.log("show.crew", show.crew);

  return (
    <div className="">
      <h1 className="p-4 md:p-6 xl:p-8 text-2xl">{show.title}</h1>
      <div className="flex flex-col md:flex-row">
        {show.logo && (
          <section
            key={show._id}
            style={styleBlock}
            className={classnames(["md:w-1/3"])}
          >
            {show.program ? (
              <Link href={media.getDocumentUrl(show.program).url}>
                <WixImage src={show.logo} alt={show.title} />
              </Link>
            ) : (
              <WixImage src={show.logo} alt={show.title} />
            )}
          </section>
        )}
        <section className="p-4 md:p-6 xl:p-8">
          <h2 className="text-2xl mb-4">
            <b className="text-xl text-primary/50 font-normal">by</b>{" "}
            {show.author}
          </h2>

          <h2>Director</h2>

          <p className="mb-4">
            <Link href={`/credits/${nameSlug(show.director)}`} className="link">
              {fullName(show.director)}
            </Link>
          </p>

          {show.program && (
            <Link
              href={media.getDocumentUrl(show.program).url}
              className={classnames([
                "flex",
                "mb-4",
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
          )}

          {show.crew?.length ? (
            <>
              <h2>Crew</h2>
              <table className="mt-1 mb-4">
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
            </>
          ) : null}
        </section>
        <section className="md:w-1/3 p-4">
          {show.cast?.length ? (
            <>
              <h2>Cast</h2>

              <ul className="mb-4">
                {manualSort(show.cast).map((credit: Credit) => (
                  <li key={credit._id}>
                    <Link
                      href={`/credits/${nameSlug(credit.person)}`}
                      className="link text-primary/70 hover:text-primary transition-all"
                    >
                      {fullName(credit.person)}
                    </Link>{" "}
                    as{" "}
                    <b className="uppercase text-primary/70">{credit.role}</b>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {show.description && (
            <>
              <h2 className="text-lg">Description</h2>
              <div
                className="leading-tight"
                dangerouslySetInnerHTML={{ __html: show.description }}
              ></div>
            </>
          )}
        </section>
      </div>
      {show.photos && <PhotoGallery photos={show.photos} />}
    </div>
  );
};

export default Season;
