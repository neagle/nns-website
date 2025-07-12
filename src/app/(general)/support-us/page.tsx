import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import classnames from "classnames";

export const metadata: Metadata = {
  title: "Support Us",
  description: "Support NOVA Nightsky Theater with a donation!",
};

const Page = () => {
  return (
    <div className="p-4 md:p-6 xl:p-8 ">
      <h1 className="text-2xl mb-4">
        Support NOVA Nightsky Theater with a donation
      </h1>
      <div
        className={classnames(["md:grid", "md:grid-cols-[3fr_2fr]", "gap-8"])}
      >
        <div className="prose xl:prose-xl mb-8 md:mb-0">
          <p>
            We are an unconventional community theater company powered by
            unconventional people in our community.
          </p>

          <p>
            We believe in the power of expression: our volunteers work day and
            night to make sure our performances bring our audience members joy.
            We believe that the most important thing about community theater is
            the community of people who create it. A donation to NOVA Nightsky
            allows us to:
          </p>

          <ul>
            <li>
              Pay for rehearsal and performance space that gives us flexibility
              to build rehearsal schedules that work for our cast and crew
            </li>

            <li>Compensate playwrights and other artists for their work</li>

            <li>Apply for rights from publishers to perform shows</li>

            <li>Rent/purchase technical equipment</li>

            <li>
              Cover costs associated with each individual show including
              costumes, props, set pieces, and construction
            </li>
          </ul>
        </div>

        <div className={classnames([])}>
          <Image
            className="w-full rounded-lg shadow-md mb-4 shadow-primary"
            src="/images/photographs/general/the-gulf-cast-and-crew.jpg"
            width="1382"
            height="1036"
            alt="The cast and crew of The Gulf"
          />
          <div className={classnames(["flex", "gap-4"])}>
            <Link
              className={classnames([
                "btn",
                "btn-primary",
                "grow",
                "hover:scale-110",
                "transition-all",
              ])}
              href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=novanightskytheater@gmail.com&item_name=NOVA%20Nightsky%20Theater&currency_code=USD"
            >
              Give Today
            </Link>
            <Link
              className={classnames(["btn", "grow"])}
              href="/box-office/subscriptions"
            >
              Become a Subscriber
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
