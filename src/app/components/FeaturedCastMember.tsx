"use client";

import React from "react";
import type { Person } from "@/app/types";
import { fullName, nameSlug } from "@/app/utils";
import classnames from "classnames";
import WixImage from "@/app/components/WixImage";
import Link from "next/link";

type Props = {
  role: string;
  castMember?: Person | null;
  showDates?: string;
  headshot?: string;
  className?: string;
  width?: number;
};

const FeaturedCastMember = ({
  role,
  castMember,
  showDates,
  headshot,
  className = "",
  width = 300,
}: Props) => {
  const hasCastMember = !!castMember;
  const Headshot = () => {
    if (headshot && castMember) {
      return (
        <WixImage
          alt={fullName(castMember)}
          src={headshot}
          targetWidth={width}
          className={classnames([])}
        />
      );
    } else {
      return null;
      // Still working out the best way to handle missing headshots
      // Keeping this for the moment as reference for a blank block
      // return (
      //   <div
      //     className={classnames([
      //       "w-[160px]",
      //       "h-[200px]",
      //       "bg-base-100",
      //       "opacity-30",
      //     ])}
      //   >
      //     No headshot
      //   </div>
      // );
    }
  };
  const cardClassName = classnames(className, [
    "block",
    "flex",
    "flex-col",
    "hover:scale-110",
    "hover:shadow-lg",
    "focus:scale-110",
    "focus:shadow-lg",
    "transition-all",
    "card",
    "bg-base-200",
    "shadow-sm",
  ]);

  const content = (
    <>
      <figure>
        <Headshot />
      </figure>
      <div
        className={classnames([
          "card-body",
          "leading-tight",
          "w-full",
          "min-w-0",
        ])}
      >
        <div className="card-title font-bold text-neutral-content">{role}</div>
        {castMember ? (
          <p className="font-bold">{fullName(castMember)}</p>
        ) : (
          <p className="font-bold opacity-60 italic">Not yet cast</p>
        )}
        {showDates && (
          <p className="text-sm text-neutral-content">
            <strong className="opacity-50">Show Dates:</strong> {showDates}
          </p>
        )}
      </div>
    </>
  );

  if (!hasCastMember) {
    return (
      <div className={cardClassName} style={{ width: `${width}px` }}>
        {content}
      </div>
    );
  }

  return (
    <Link
      // className="text-primary font-bold "
      // style={{ width: `${width}px` }}
      className={cardClassName}
      style={{ width: `${width}px` }}
      href={`/credits/${nameSlug(castMember)}/${castMember._id}`}
    >
      {content}
    </Link>
  );
};

export default FeaturedCastMember;
