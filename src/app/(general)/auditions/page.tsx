import type { Metadata } from "next";
import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import classnames from "classnames";
import ShowLogo from "@/app/components/ShowLogo";
import Link from "next/link";
import CenterSpinner from "@/app/components/CenterSpinner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Auditions",
  description: "Audition for a show with NOVA Nightsky Theater.",
};

const Page = async () => {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_2fr] h-full">
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
      <section className={classnames(["bg-base-300", "p-4"])}>
        <Suspense fallback={<CenterSpinner />}>
          <AuditionContent />
        </Suspense>
      </section>
    </div>
  );
};

const AuditionContent = async () => {
  // Get all future shows that do not have `noLongerAuditioning` set to true
  const now = new Date();
  const { items } = await wixClient.items
    .query("Shows")
    .ge("openingDate", now.toISOString())
    .eq("noLongerAuditioning", false)
    .find();

  const shows = items as Show[];

  return (
    <div className="">
      {shows.length ? (
        shows.map(async (show) => {
          return (
            <section
              key={show._id}
              className={classnames([
                "grid",
                "md:gap-4",
                "lg:gap-6",
                "xl:gap-8",
                "md:grid-cols-[1fr_2fr]",
                "h-full",
                "bg-base-300",
                "p-4",
              ])}
            >
              <section>
                <ShowLogo show={show} />
                {show.auditionLink && (
                  <Link
                    href={show.auditionLink}
                    className="mt-4 btn btn-primary btn-wide hover:scale-110 transition-all"
                  >
                    Sign Up to Audition
                  </Link>
                )}
              </section>

              <section>
                {show.auditions ? (
                  <div dangerouslySetInnerHTML={{ __html: show.auditions }} />
                ) : (
                  <p className="text-lg">Audition information coming soon!</p>
                )}
              </section>
            </section>
          );
        })
      ) : (
        <div>
          <h2 className="text-xl mb-4">Nothing right now</h2>
          <p>
            ...but stay tuned! Follow us on{" "}
            <Link
              className="link"
              href="https://www.instagram.com/novanightskytheater/"
            >
              Instagram
            </Link>{" "}
            or{" "}
            <Link
              className="link"
              href="https://www.facebook.com/novanightskytheater"
            >
              Facebook
            </Link>{" "}
            for audition announcements.
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
