import type { Metadata } from "next";
import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import classnames from "classnames";
import ShowLogo from "@/app/components/ShowLogo";
import Link from "next/link";
import CenterSpinner from "@/app/components/CenterSpinner";
import PersonList from "@/app/components/PersonList";

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
    .ne("noLongerAuditioning", true)
    .ascending("openingDate")
    .include("directors")
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
                    className={classnames([
                      "md:sticky",
                      "top-5",
                      "mt-4",
                      "btn",
                      "btn-primary",
                      "btn-wide",
                      "hover:scale-110",
                      "transition-all",
                    ])}
                  >
                    Sign Up to Audition
                  </Link>
                )}
              </section>

              <section>
                <div className="mb-4">
                  <h1 className="text-xl font-bold">{show.title}</h1>
                  <h2 className="text-lg text-primary/70! font-normal! capitalize! font-sans!">
                    <b className="text-sm text-primary/50 font-normal lowercase">
                      by
                    </b>{" "}
                    {show.author}
                  </h2>

                  {show?.adaptors && (
                    <div className="mt-1 text-sm">
                      <span className="text-xs text-primary/50">
                        Adapted by
                      </span>{" "}
                      <span className="text-primary/70">{show?.adaptors}</span>
                    </div>
                  )}
                </div>

                {show?.directors?.length && (
                  <section className="mb-4">
                    <h2>Director{show.directors.length > 1 ? "s" : ""}</h2>

                    <p>
                      <PersonList
                        people={show.directors}
                        linkToCredits={true}
                      />
                    </p>
                  </section>
                )}
                {show.auditions ? (
                  <div
                    className="prose mb-4"
                    dangerouslySetInnerHTML={{ __html: show.auditions }}
                  />
                ) : (
                  <p className="text-lg">Audition information coming soon!</p>
                )}

                {show.description && (
                  <section>
                    <h2 className="text-base">Description</h2>
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: show.description }}
                    ></div>
                  </section>
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
