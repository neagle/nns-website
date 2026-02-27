import React from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import Link from "next/link";
import { BadgeAlert, Users } from "lucide-react";
import classnames from "classnames";

const OpenAuditions = async () => {
  // Get all future shows that do not have `noLongerAuditioning` set to true
  const now = new Date();
  const { items } = await wixClient.items
    .query("Shows")
    .ge("openingDate", now.toISOString())
    .ne("noLongerAuditioning", true)
    .isNotEmpty("auditionLink")
    .ascending("openingDate")
    .include("directors")
    .find();

  const shows = items as Show[];

  return shows.map((show: Show) => (
    <div
      key={show._id}
      role="alert"
      className={classnames([
        "block",
        "m-4",
        "flex",
        "flex-col",
        "lg:flex-row",
        "items-center",
        "p-2",
        // "hover:[&_svg]:scale-110",
        // "hover:[&_svg]:text-secondary",
      ])}
    >
      <Link
        href="/auditions"
        className={classnames([
          "btn",
          "btn-secondary",
          "scale-95",
          "hover:scale-100",
          "transition-all",
          "w-full",
          "mb-4",
          "lg:mb-0",
          "md:w-2/3",
          "lg:w-auto",
        ])}
      >
        <Users />
        Audition Info &amp; Sign Up
      </Link>
      <div
        className={classnames([
          "flex",
          "items-center",
          "ml-4",
          "mb-4",
          "lg:mb-0",
          "grow",
          "text-center",
          "lg:text-left",
        ])}
      >
        <div>
          {/* <h3 className="font-bold text-info!">Audition Signups</h3> */}
          <Link
            href="/auditions"
            className={classnames([
              "text-base",
              "leading-tight",
              "underline",
              "underline-offset-4",
              // "decoration-dotted",
              "decoration-base-content/30",
              "hover:text-primary",
              "hover:decoration-primary/30",
              "transition-colors",
            ])}
          >
            Auditions are currently open for <strong>{show.title}</strong>, by{" "}
            {show.author}
          </Link>
        </div>
      </div>
    </div>
  ));
};

export default OpenAuditions;
