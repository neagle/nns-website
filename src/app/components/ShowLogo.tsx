import React from "react";
import type { Show } from "@/app/types";
import WixImage from "@/app/components/WixImage";
import Link from "next/link";
import classnames from "classnames";
import { convert, textColor } from "colorizr";
import { getPersonList } from "./PersonList";
import { getShowBackgroundStyle } from "@/app/utils";

type Props = {
  className?: string;
  show: Show;
  targetWidth?: number;
  targetHeight?: number;
  link?: boolean | string;
  noDirector?: boolean;
  centered?: boolean;
  priority?: boolean;
};

// Derives a consistent background color from a string so server and client
// always agree, eliminating the hydration mismatch from random().
const colorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 40%, 30%)`;
};

// If no show logo -- hopefully only a placeholder till we get data entered for all shows
const TextPanel = ({
  className = "",
  link = undefined,
  show,
  width = 200,
  noDirector = false,
}: {
  className?: string;
  link?: string | boolean;
  show: Show;
  width?: number;
  noDirector?: boolean;
}) => {
  const backgroundColor = convert(
    show.backgroundColor || colorFromString(show.title || show._id || ""),
    "hex",
  );
  const color = convert(textColor(backgroundColor), "hex");

  const TextPanelContent = (
    <div style={{ width: `${width}px` }}>
      <h2
        className={classnames(
          {
            "text-2xl": width >= 200,
            "text-xl": width >= 150,
          },
          ["opacity-70", "mb-2", "leading-tight"]
        )}
        style={{ color }}
      >
        {show.title}
      </h2>
      <p className="opacity-50 text-xs">by {show.author}</p>
      {!noDirector && show.directors?.length && (
        <p className="opacity-50 text-xs">
          directed by {getPersonList({ people: show.directors })}
        </p>
      )}
    </div>
  );

  return (
    <div
      className={classnames(
        ["w-full", "h-full", "flex", "flex-col", "p-[1.5rem]"],
        className
      )}
      style={{ backgroundColor, color }}
    >
      {link ? (
        <Link href={typeof link === "string" ? link : `/shows/${show.slug}`}>
          {TextPanelContent}
        </Link>
      ) : (
        TextPanelContent
      )}
    </div>
  );
};

const ShowLogo = ({
  show,
  className = "",
  targetWidth,
  targetHeight,
  link = true,
  noDirector,
  centered = true,
  priority = false,
  ...rest
}: Props) => {
  if (!show.logo) {
    return (
      <TextPanel
        link={link}
        className={className}
        width={targetWidth}
        show={show}
        noDirector={noDirector}
        {...rest}
      />
    );
  }

  const styleBlock = getShowBackgroundStyle(show);

  const ShowImage = (
    <WixImage
      src={show.logo}
      alt={show.title}
      targetWidth={targetWidth}
      targetHeight={targetHeight}
      priority={priority}
      className={classnames("mx-auto", {
        "p-[10%]": !show.nologopadding,
      })}
    />
  );

  return (
    <div
      style={styleBlock}
      className={classnames({ flex: centered, "items-center": centered }, [
        className,
      ])}
      {...rest}
    >
      {link ? (
        <Link
          href={typeof link === "string" ? link : `/shows/${show.slug}`}
          className={classnames(["flex", "text-center", "items-start"])}
        >
          {ShowImage}
        </Link>
      ) : (
        <>{ShowImage}</>
      )}
    </div>
  );
};

export default ShowLogo;
