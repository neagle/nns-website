import React from "react";
import type { Person } from "@/app/types";
import { fullName } from "@/app/utils";
import Image from "next/image";
import classnames from "classnames";

type Props = {
  role: string;
  castMember: Person;
  headshot: {
    url: string;
    width: number;
    height: number;
  };
  className?: string;
};

const FeaturedCastMember = ({
  role,
  castMember,
  headshot,
  className = "",
}: Props) => {
  return (
    <div className={classnames([className, ""])}>
      <Image
        src={headshot.url}
        width={headshot.width}
        height={headshot.height}
        alt={fullName(castMember)}
        className="mb-2 border-4 border-primary shadow-lg"
      />
      <div className="leading-tight drop-shadow-lg">
        <span className="text-primary font-bold">{fullName(castMember)}</span>{" "}
        <span className="text-primary/80">as</span>{" "}
        <span className="text-primary font-bold uppercase"> {role}</span>
      </div>
    </div>
  );
};

export default FeaturedCastMember;
