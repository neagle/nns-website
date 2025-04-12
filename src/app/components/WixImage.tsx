import React from "react";
import { getScaledToFitImageUrl } from "@/app/utils/wix/media";
import Image from "next/image";
import { getWixImageDimensions } from "@/app/utils";

type Props = {
  id?: string;
  priority?: boolean;
  src: string;
  alt: string;
  className?: string;
  targetWidth?: number;
  targetHeight?: number;
  wrapper?: (
    children: React.ReactNode,
    dimensions: { width: number; height: number; src: string }
  ) => React.ReactNode;
};

/* Output an optimized image scaled to match a target width OR height */
const WixImage = ({
  id = "",
  priority = false,
  src,
  alt,
  className = "",
  targetWidth,
  targetHeight,
  wrapper,
}: Props) => {
  const { width, height } = getWixImageDimensions(src);
  const ratio = width / height;

  let scaledWidth;
  let scaledHeight;
  if (targetWidth) {
    scaledWidth = targetWidth;
    scaledHeight = Math.round(scaledWidth / ratio);
  } else if (targetHeight) {
    scaledHeight = targetHeight;
    scaledWidth = Math.round(scaledHeight * ratio);
  } else {
    // If no target width or height is provided, use the original dimensions
    scaledWidth = width;
    scaledHeight = height;
  }

  const scaledImage = getScaledToFitImageUrl(
    src,
    scaledWidth,
    scaledHeight,
    {}
  );

  const imageElement = (
    <Image
      priority={priority}
      id={id}
      src={scaledImage}
      className={className}
      alt={alt}
      width={scaledWidth}
      height={scaledHeight}
    />
  );

  // If a wrapper is provided, pass the image element and dimensions to it
  return wrapper
    ? wrapper(imageElement, {
        width: scaledWidth,
        height: scaledHeight,
        src: scaledImage,
      })
    : imageElement;
};

export default WixImage;
