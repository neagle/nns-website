"use client";

import React from "react";
import { manualSort } from "@/app/utils";
import classnames from "classnames";
import type { AlternateHeadshot, Credit, Show } from "@/app/types";
import FeaturedCastMember from "./FeaturedCastMember";

interface Props {
  show: Show;
}

const FeaturedCast: React.FC<Props> = ({ show }) => {
  return (
    <div
      className={classnames(
        {
          "xl:grid-cols-3": show.cast.length % 3 === 0,
          "xl:grid-cols-2": show.cast.length % 2 === 0,
          "xl:grid-cols-4": show.cast.length % 4 === 0,
        },
        [
          "grid",
          "gap-8",
          "sm:grid-cols-1",
          "md:grid-cols-2",
          "justify-items-center",
          "items-start",
        ],
      )}
    >
      {manualSort(show.cast).map((cast: Credit) => {
        let headshot: string | undefined;
        // Check if the cast member has an alternate headshot
        // designated for this show
        if (cast.person?.headshots?.length) {
          const alternateHeadshot = cast.person.headshots.find(
            (headshot: AlternateHeadshot) =>
              // The title of the headshot must exactly match
              // the title of the show
              headshot.title === show.title,
          );
          if (alternateHeadshot) {
            headshot = alternateHeadshot.src;
          } else {
            headshot = cast.person?.headshot;
          }
        } else {
          headshot = cast.person?.headshot;
        }

        return (
          <FeaturedCastMember
            key={cast._id}
            className={classnames([
              "flex",
              "flex-col",
              "items-center",
              "justify-center",
            ])}
            role={cast.role}
            castMember={cast.person}
            headshot={headshot}
          />
        );
      })}
    </div>
  );
};

export default FeaturedCast;
