import React from "react";
import wixClient from "@/lib/wixClient";
import type { Show, ShowWithData, Photo } from "@/app/types";
// import { media } from "@wix/sdk";
import { fullName } from "@/app/utils";
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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Season = async ({ params }: PageProps) => {
  const { slug } = await params;
  const { items } = await wixClient.items
    .query("Shows")
    .eq("slug", slug)
    .include("director")
    .find();

  const showsWithData = await getShowsWithData({ shows: items as Show[] });

  const show = showsWithData[0] as ShowWithData;
  // console.log("show", show);
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
            <Link href={`/shows/${show.slug}`}>
              <WixImage src={show.logo} alt={show.title} />
            </Link>
          </section>
        )}
        <section className="p-4">
          <h2 className="text-2xl mb-4">
            <b className="text-xl text-primary/50 font-normal">by</b>{" "}
            {show.author}
          </h2>

          <h2>Director</h2>

          <p className="mb-4">{fullName(show.director)}</p>

          {show.crew?.length ? (
            <>
              <h2>Crew</h2>
              <ul className="mb-4">
                {show.crew.map((credit) => (
                  <li key={credit._id}>
                    <b>{credit.role}:</b> {fullName(credit.person)}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {show.cast?.length ? (
            <>
              <h2>Cast</h2>

              <ul>
                {show.cast.map((credit) => (
                  <li key={credit._id}>
                    {fullName(credit.person)} as{" "}
                    <b className="uppercase">{credit.role}</b>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
        <section className="md:w-1/3 p-4">
          {show.description && (
            <div dangerouslySetInnerHTML={{ __html: show.description }}></div>
          )}
        </section>
      </div>
      {show.photos && (
        <div className="carousel mt-4 mb-4 group">
          {show.photos.map(async (photo: Photo) => {
            // const image = await getImageWithDimensions(photo.src);
            console.log("photo", photo);
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
