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
};

const FeaturedCastMember = ({
  role,
  castMember,
  headshot,
  className = "",
}: Props) => {
  const Headshot = () => {
    if (headshot) {
      return (
        <WixImage
          alt={fullName(castMember)}
          src={headshot}
          targetHeight={200}
          className="mb-2 outline-4 outline-primary shadow-lg rounded"
        />
      );
    } else {
      return (
        <div
          className={classnames([
            "w-[160px]",
            "h-[200px]",
            "outline-4",
            "outline-primary",
            "rounded",
            "shadow-lg",
            "bg-base-100",
            "mb-2",
            "flex",
            "items-end",
            "justify-center",
            "opacity-30",
          ])}
        ></div>
      );
    }
  };
  return (
    <div className={classnames(className, [""])}>
      <Headshot />
      <div className="leading-tight drop-shadow-lg">
        <Link
          className="text-primary font-bold link"
          href={`/credits/${nameSlug(castMember)}`}
        >
          {fullName(castMember)}
        </Link>{" "}
        <span className="text-primary/80">as</span>{" "}
        <span className="text-primary font-bold"> {role}</span>
      </div>
    </div>
  );
};

export default FeaturedCastMember;
