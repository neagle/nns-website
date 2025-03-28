import React from "react";
import wixClient from "@/lib/wixClient";
import type { Credit, Show, ShowWithData, Photo } from "@/app/types";
import { media } from "@wix/sdk";
import { manualSort, fullName, nameSlug } from "@/app/utils";
import {
  getImageWithDimensions,
  getScaledImageByHeight,
} from "@/app/actions/media";
import WixImage from "@/app/components/WixImage";
import Image from "next/image";
import classnames from "classnames";
import Link from "next/link";
import { getShowsWithData } from "@/app/actions/shows";
import PhotoModal from "@/app/components/PhotoModal";
import { BookImage } from "lucide-react";

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
      <h1 className="p-4 text-2xl">{show.title}</h1>
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
        <section className="p-4">
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
                    {credit.person.aboutTheArtists ? (
                      <Link
                        href={`/credits/${nameSlug(credit.person)}`}
                        className="link text-primary/70 hover:text-primary transition-all"
                      >
                        {fullName(credit.person)}
                      </Link>
                    ) : (
                      fullName(credit.person)
                    )}{" "}
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
      {show.photos && (
        <div className="carousel mt-4 mb-4 group">
          {show.photos.map(async (photo: Photo) => {
            // const image = await getImageWithDimensions(photo.src);
            // console.log("photo", photo);
            const image = await getScaledImageByHeight(photo.src, 300);
            // const fullImage = await getImageWithDimensions(photo.src);
            // console.log("fullImage", fullImage.url);

            return (
              <div key={photo.slug} className="carousel-item mr-4">
                <PhotoModal photo={photo}>
                  <Image
                    className={classnames([
                      "transition-all",
                      "group-hover:opacity-50",
                      "hover:opacity-100",
                    ])}
                    src={image.url}
                    alt={`${photo.title}: ${photo.description}`}
                    width={image.width}
                    height={image.height}
                  />
                </PhotoModal>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Season;
