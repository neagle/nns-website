import React from "react";
import { getScaledToFitImageUrl } from "@/app/utils/wix/media";
import Image from "next/image";
import { getWixImageDimensions } from "@/app/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  targetWidth?: number;
  targetHeight?: number;
};

/* Output an optimized image scaled to match a target width OR height */
const WixImage = ({
  src,
  alt,
  className = "",
  targetWidth,
  targetHeight,
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
    // Can't create an image without a target width or height
    return null;
  }

  const scaledImage = getScaledToFitImageUrl(
    src,
    scaledWidth,
    scaledHeight,
    {}
  );

  return (
    <Image
      src={scaledImage}
      className={className}
      alt={alt}
      width={scaledWidth}
      height={scaledHeight}
    />
  );
};

export default WixImage;
