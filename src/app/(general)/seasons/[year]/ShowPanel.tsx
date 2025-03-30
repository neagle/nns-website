import React from "react";
import type { Show } from "@/app/types";
import { getImageWithDimensions } from "@/app/actions/media";
import classnames from "classnames";
import WixImage from "@/app/components/WixImage";
import Link from "next/link";

interface ShowPanelProps {
  show: Show;
}

const ShowPanel = async ({ show }: ShowPanelProps) => {
  const backgroundTexture = show.backgroundTexture
    ? await getImageWithDimensions(show.backgroundTexture)
    : null;

  const styleBlock = {
    backgroundImage: backgroundTexture
      ? `url(${backgroundTexture.url})`
      : "none",
    backgroundColor: show.backgroundColor || "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  return (
    <section
      style={styleBlock}
      className={classnames([
        "w-full",
        "sm:w-1/2",
        "md:w-1/3",
        "lg:w-1/4",
        "flex",
        "items-center",
        "opacity-100",
        "peer",
        "transition-all",
        // Dim all sections when hovering over the parent
        "group-has-[section:hover]:opacity-50",
        "group-has-[section:hover]:scale-90",
        "hover:scale-100!",
        "ease-in-out",
        "duration-500",
        "hover:opacity-100!",
      ])}
    >
      <Link
        href={`/shows/${show.slug}`}
        className="w-full h-full flex items-center"
      >
        {show.logo ? (
          <WixImage src={show.logo} alt={show.title} className="w-full" />
        ) : (
          <div
            className={classnames([
              // "items-center",
              // "min-h-400",
              // "min-w-400",
              "border-2",
              "border-accent",
            ])}
          >
            {show.title}
          </div>
        )}
      </Link>
    </section>
  );
};

export default ShowPanel;
