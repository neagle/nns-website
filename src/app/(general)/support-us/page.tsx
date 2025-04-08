import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import HeroSection from "@/app/components/HeroSection";
import classnames from "classnames";

export const metadata: Metadata = {
  title: "Support Us",
  description: "Support NOVA Nightsky Theater with a donation!",
};

const Page = () => {
  return (
    <div>
      <HeroSection
        imageUrl="/images/photographs/general/all-the-board.jpg"
        className={classnames(["h-[40vh]", "xl:h-[60vh]"])}
      >
        <h1>Support NOVA Nightsky Theater with a donation!</h1>
      </HeroSection>
      <div className="prose">
        <p>
          We are an unconventional community theater company powered by
          unconventional people in our community.
        </p>

        <p>
          We believe in the power of expression and our volunteers work day and
          night to make sure our performances bring our audience members joy. We
          believe that the most important thing about community theater is the
          community of people who create it. A donation to NOVA Nightsky allows
          us to:
        </p>

        <ul>
          <li>
            pay for rehearsal and performance space that gives us flexibility to
            build rehearsal schedules that work for our cast and crew
          </li>

          <li>compensate playwrights and other artists for their work</li>

          <li>apply for rights from publishers to perform shows</li>

          <li>rent/purchase technical equipment</li>

          <li>
            cover costs associated with each individual show including costumes,
            props, set pieces, and construction
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Link
          className="btn btn-primary"
          href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=novanightskytheater@gmail.com&item_name=NOVA%20Nightsky%20Theater&currency_code=USD"
        >
          Give Today
        </Link>
        <Link className="btn" href="/box-office">
          Become a Subscriber
        </Link>
      </div>
    </div>
  );
};

export default Page;
