"use client";

import React from "react";
import { manualSort } from "@/app/utils";
import classnames from "classnames";
import type { AlternateHeadshot, Credit, Show } from "@/app/types";
import FeaturedCastMember from "./FeaturedCastMember";

interface Props {
  show: Show;
}

const alternateHeadshotForShow = (castMember: Credit, showTitle: string) => {
  if (castMember.person?.headshots?.length) {
    const alternateHeadshot = castMember.person.headshots.find(
      (headshot: AlternateHeadshot) => headshot.title === showTitle,
    );
    if (alternateHeadshot) {
      return alternateHeadshot.src;
    }
  }
  return castMember.person?.headshot;
};

const sortNoHeadshotsLast = (showTitle: string, cast: Credit[]) => {
  const sorted = [...cast].sort((a, b) => {
    const aHasHeadshot =
      !!alternateHeadshotForShow(a, showTitle) || a.person?.headshot;
    const bHasHeadshot =
      !!alternateHeadshotForShow(b, showTitle) || b.person?.headshot;

    if (aHasHeadshot && !bHasHeadshot) {
      return -1;
    } else if (!aHasHeadshot && bHasHeadshot) {
      return 1;
    } else {
      return 0;
    }
  });
  return sorted;
};

const FeaturedCast: React.FC<Props> = ({ show }) => {
  return (
    <div
      className={classnames([
        "grid",
        "gap-8",
        "[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]",
        "justify-items-center",
        "items-start",
      ])}
    >
      {sortNoHeadshotsLast(show.title, manualSort(show.cast)).map(
        (cast: Credit) => {
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
              role={cast.role}
              showDates={cast.showDates}
              castMember={cast.person}
              headshot={headshot}
            />
          );
        },
      )}
    </div>
  );
};

export default FeaturedCast;
