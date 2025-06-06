import React from "react";
import type { Show } from "@/app/types";
import WixImage from "@/app/components/WixImage";
import { media } from "@wix/sdk";
import Link from "next/link";
import classnames from "classnames";
import { convert, random, textColor } from "colorizr";
import { fullName } from "@/app/utils";

type Props = {
  className?: string;
  show: Show;
  targetWidth?: number;
  targetHeight?: number;
  link?: boolean | string;
};

// If no show logo -- hopefully only a placeholder till we get data entered for all shows
const TextPanel = ({ show }: { show: Show }) => {
  const backgroundColor = convert(show.backgroundColor || random(), "hex");
  const color = convert(textColor(backgroundColor), "hex");
  console.log("color", color);

  return (
    <div
      className={classnames([
        "w-full",
        "h-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center",
        "p-4",
      ])}
      // There is a bit of a mystery here: the color seems to change format
      // between server/client even though we're explicitly setting it to hex
      suppressHydrationWarning={true}
      style={{ backgroundColor, color }}
    >
      <div className="w-[200px]">
        <h2
          className="text-2xl opacity-70 mb-2 leading-tight"
          suppressHydrationWarning={true}
          style={{ color }}
        >
          {show.title}
        </h2>
        <p className="opacity-50 text-xs">by {show.author}</p>
        {typeof show.director !== "string" && (
          <p className="opacity-50 text-xs">
            directed by {fullName(show.director)}
          </p>
        )}
      </div>
    </div>
  );
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

  if (!show.logo) {
    return <TextPanel show={show} />;
  }

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
