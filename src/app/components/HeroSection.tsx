import React from "react";
import { getImageProps } from "next/image";
import { getBackgroundImage } from "@/app/utils";
import classnames from "classnames";
import probe from "probe-image-size";
import fs from "fs";

interface HeroSectionProps {
  children?: React.ReactNode;
  imageUrl: string;
  className?: string;
}

const HeroSection = async ({
  children,
  imageUrl,
  className = "",
}: HeroSectionProps) => {
  const isLocal = imageUrl.startsWith("/");
  const isRemote = imageUrl.startsWith("http");

  let style = {};

  if (isLocal || isRemote) {
    let width = 0;
    let height = 0;
    if (isLocal) {
      const localPath = `${process.cwd()}/public/${imageUrl}`;
      const imageData = await probe(fs.createReadStream(localPath));
      width = imageData.width;
      height = imageData.height;
    } else if (isRemote) {
      const imageData = await probe(imageUrl);
      width = imageData.width;
      height = imageData.height;
    }

    const {
      props: { srcSet },
    } = getImageProps({
      alt: "",
      width,
      height,
      src: imageUrl,
    });
    const backgroundImage = getBackgroundImage(srcSet);
    style = { backgroundImage };
  }

  const backgroundPlacementDefaults = /bg-/g.test(className)
    ? []
    : ["bg-cover", "bg-left"];

  return (
    <div
      style={style}
      className={classnames(
        backgroundPlacementDefaults,
        ["flex", "items-end", "p-4", "md:p-6", "xl:p-8"],
        className
      )}
    >
      {children}
    </div>
  );
};

export default HeroSection;
