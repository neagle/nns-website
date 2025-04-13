import React, { Suspense } from "react";
import wixApiKeyClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import classnames from "classnames";
import ShowLogo from "@/app/components/ShowLogo";
import Link from "next/link";

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
        <Suspense
          fallback={
            <div className="loading loading-spinner loading-lg text-primary" />
          }
        >
          <AuditionContent />
        </Suspense>
      </section>
    </div>
  );
};

const AuditionContent = async () => {
  // Get all future shows that do not have `noLongerAuditioning` set to true
  const now = new Date();
  const { items } = await wixApiKeyClient.items
    .query("Shows")
    .ge("openingDate", now.toISOString())
    .eq("noLongerAuditioning", false)
    .find();

  const shows = items as Show[];

  return (
    <div className="">
      {shows.map(async (show) => {
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
              <div dangerouslySetInnerHTML={{ __html: show.auditions }} />
            </section>
          </section>
        );
      })}
    </div>
  );
};

export default Page;
