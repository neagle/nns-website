import React from "react";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import Link from "next/link";
import { BadgeAlert } from "lucide-react";
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
        "hover:[&_svg]:scale-110",
        "hover:[&_svg]:text-secondary",
      ])}
    >
      <div className="flex items-center mb-4 lg:mb-0 grow">
        <BadgeAlert
          size={36}
          className="text-info mr-4 transition-all shrink-0"
        />
        <div>
          <h3 className="font-bold text-info!">Audition Signups</h3>
          <div className="text-sm leading-tight">
            Auditions are currently open for <strong>{show.title}</strong>, by{" "}
            {show.author}
          </div>
        </div>
      </div>
      <Link
        href="/auditions"
        className={classnames([
          "btn",
          "btn-secondary",
          "scale-95",
          "hover:scale-100",
          "transition-all",
          "w-full",
          "md:w-2/3",
          "lg:w-auto",
        ])}
      >
        Audition Information &amp; Signups
      </Link>
    </div>
  ));
};

export default OpenAuditions;
