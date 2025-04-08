import React from "react";
import type { Show } from "@/app/types";
import WixImage from "@/app/components/WixImage";
import { media } from "@wix/sdk";
import Link from "next/link";
import classnames from "classnames";

type Props = {
  className?: string;
  show: Show;
  targetWidth?: number;
  targetHeight?: number;
  link?: boolean | string;
};

const ShowLogo = ({
  show,
  className = "",
  targetWidth,
  targetHeight,
  link = true,
}: Props) => {
  const styleBlock = {
    backgroundImage: show.backgroundTexture
      ? `url(${media.getImageUrl(show.backgroundTexture).url})`
      : "none",
    backgroundColor: show.backgroundColor || "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  if (link) {
    return (
      <div style={styleBlock} className={classnames(className)}>
        <Link href={typeof link === "string" ? link : `/shows/${show.slug}`}>
          <WixImage
            src={show.logo}
            alt={show.title}
            targetWidth={targetWidth}
            targetHeight={targetHeight}
            className="mx-auto"
          />
        </Link>
      </div>
    );
  } else {
    return (
      <div style={styleBlock} className={classnames(className)}>
        <WixImage
          src={show.logo}
          alt={show.title}
          targetWidth={targetWidth}
          targetHeight={targetHeight}
          className="mx-auto"
        />
      </div>
    );
  }
};

export default ShowLogo;
