"use client";

import React from "react";
import type { Person } from "@/app/types";
import { fullName, nameSlug } from "@/app/utils";
import classnames from "classnames";
import WixImage from "@/app/components/WixImage";
import Link from "next/link";

type Props = {
  role: string;
  castMember: Person;
  headshot?: string;
  className?: string;
  width?: number;
};

const FeaturedCastMember = ({
  role,
  castMember,
  headshot,
  className = "",
  width = 300,
}: Props) => {
  const Headshot = () => {
    if (headshot) {
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
  return (
    <Link
      // className="text-primary font-bold "
      style={{ width: `${width}px` }}
      className={classnames(className, [
        "block",
        "flex",
        "flex-col",
        "items-start",
        "hover:scale-110",
        "hover:shadow-lg",
        "focus:scale-110",
        "focus:shadow-lg",
        "transition-all",
        "card",
        "bg-base-200",
        "shadow-sm",
      ])}
      href={`/credits/${castMember._id}/${nameSlug(castMember)}`}
    >
      <figure>
        <Headshot />
      </figure>
      <div className="card-body leading-tight">
        <div className="card-title font-bold text-neutral-content">{role}</div>
        <p className="font-bold">{fullName(castMember)}</p>
      </div>
    </Link>
  );
};

export default FeaturedCastMember;
