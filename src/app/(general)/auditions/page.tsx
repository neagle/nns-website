import React from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import { getImageWithDimensions } from "@/app/actions/media";
import classnames from "classnames";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  const { items } = await wixClient.items
    .query("Shows")
    // The name of the show is currently hard-coded
    .eq("slug", "the-taming-of-the-shrew")
    .find();

  const show = items[0] as Show;

  const logo = await getImageWithDimensions(show.logo);
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
    <div className="grid gap-4 md:grid-cols-[2fr_1fr] h-full">
      <section className="p-4">
        <h1 className="text-xl mb-4">Auditions</h1>
        <div className="md:text-lg leading-tight [&>p]:mb-3 [&>p]:last-of-type:mb-0">
          <p>
            We believe the word <em>community</em> is the most important word in
            &ldquo;community theater.&rdquo;
          </p>
          <p>
            If you are a local artist who wants to join a fun group of people,
            we invite you to audition for us!
          </p>

          <p>
            NOVA Nightsky Theater welcomes friends of all races, cultural
            backgrounds, abilities, sexual orientation, &amp; gender identity to
            audition for our shows.
          </p>

          <p>Audition sides will be emailed to you prior to auditions.</p>
        </div>
      </section>
      <section key={show._id} className={classnames(["bg-base-300", "p-4"])}>
        <div style={styleBlock}>
          <Link href={`/shows/${show.slug}`}>
            <Image
              src={logo.url}
              alt={show.title}
              width={logo.width}
              height={logo.height}
            />
          </Link>
        </div>

        <p className="alert alert-info mt-4">
          Check back in April to audition for The Taming of the Shrew!
        </p>
      </section>
    </div>
  );
};

export default Page;
