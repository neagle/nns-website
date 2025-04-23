import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import ParkingMap from "./ParkingMap";
import classnames from "classnames";
import Image from "next/image";
import { Accessibility, MapPinned } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Venue",
  description:
    "How to find us and where to park at Falls Church Presbyterian Church.",
};

const Page = () => {
  return (
    <div className="flex flex-col md:flex-row h-full">
      <section
        className={classnames([
          "grow-1",
          "p-4",
          "md:p-6",
          "xl:p-8",
          "order-1",
          "md:order-0",
          "flex",
          "flex-col",
          "gap-8",
        ])}
      >
        <div className="max-w-full flex flex-col md:flex-row items-start gap-8">
          <div className="md:w-1/2">
            <h1 className="text-xl">Our Venue</h1>
            <address
              className={classnames([
                "relative",
                "not-italic",
                "bg-base-200",
                "px-2",
                "py-1",
                "text-sm",
                "rounded",
                "shadow-sm",
                "-mx-2",
                "mt-2",
                "mb-4",
              ])}
            >
              <span className="block font-bold">
                Memorial Hall <span className="opacity-50">at</span>
              </span>
              <span className="block">Falls Church Presbyterian Church</span>
              <span className="block">
                225 E Broad St, Falls Church, VA 22046
              </span>

              <Link
                href="https://www.google.com/maps?ll=38.880608,-77.167542&z=17&t=m&hl=en&gl=US&mapclient=embed&cid=7129841290350630658"
                className="absolute right-2 top-2 text-info"
                title="View on Google Maps"
              >
                <MapPinned />
              </Link>
            </address>

            <p>
              Our performance space is located in Memorial Hall, in the basement
              of the Falls Church Presbyterian Church.
            </p>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-xl">Parking</h2>

            <p>
              Park in the front parking lot (facing Broad St) or side parking
              lot and follow the NOVA Nightsky signs until you see our sandwich
              board located at the top of the stairs to our performance space.
            </p>
          </div>
        </div>

        <div
          role="alert"
          className={classnames([
            "alert",
            "alert-info",
            "alert-soft",
            "alert-vertical",
            "md:alert-horizontal",
            "text-left",
            "shadow-sm!",
          ])}
        >
          <Accessibility />
          <span>
            If you need handicap access, you must contact us beforehand so we
            can escort you into the building.{" "}
            <Link href="/contact" className="link">
              Contact us
            </Link>{" "}
            at least 24 hours before your scheduled performance.
          </span>
        </div>

        <div className="card md:card-side bg-base-200 shadow-sm">
          <figure className="md:min-w-1/3 md:max-w-1/3 justify-start!">
            <Image
              src="/images/photographs/general/little-food-pantry.jpeg"
              alt="Little Food Pantry"
              width={4032}
              height={3024}
              // style={{ objectPosition: "left", objectFit: "cover" }}
              className="object-cover object-left"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Little Food Pantry</h2>
            <p>
              Falls Church Presbyterian Church supports our local community in
              many ways, one of which is a Little Food Pantry. We are asking
              patrons to bring non-perishable items to keep the food pantry
              stocked. Thank you for helping us support our new home
              and&nbsp;community.
            </p>
          </div>
        </div>
      </section>
      <section className={classnames(["aspect-square", "md:min-w-1/3"])}>
        <ParkingMap />
      </section>
    </div>
  );
};

export default Page;
