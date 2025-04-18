import React from "react";
import type { Show } from "@/app/types";
import { getImageWithDimensions } from "@/app/actions/media";
import classnames from "classnames";
import WixImage from "@/app/components/WixImage";
import Link from "next/link";
import { random, textColor } from "colorizr";
import { fullName } from "@/app/utils";

interface ShowPanelProps {
  show: Show;
}

// If no show logo -- hopefully only a placeholder till we get data entered for all shows
const TextPanel = ({ show }: ShowPanelProps) => {
  const backgroundColor = show.backgroundColor || random();
  const color = textColor(backgroundColor);
  return (
    <div
      className={classnames([
        "w-full",
        "h-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center",
      ])}
      style={{ backgroundColor, color }}
    >
      <h2 className="text-2xl opacity-70 mb-2" style={{ color }}>
        {show.title}
      </h2>
      <p className="opacity-50">by {show.author}</p>
      <p className="opacity-50">directed by {fullName(show.director)}</p>
    </div>
  );
};

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
        className={classnames([
          "w-full",
          "h-full",
          "flex",
          "items-center",
          "justify-center",
          "min-h-[300px]",
        ])}
      >
        {show.logo ? (
          <WixImage src={show.logo} alt={show.title} className="w-full" />
        ) : (
          <TextPanel show={show} />
        )}
      </Link>
    </section>
  );
};

export default ShowPanel;
