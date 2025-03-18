import { media } from "@wix/sdk";
import probe from "probe-image-size";

export const getImageWithDimensions = async (image: string) => {
  "use server";
  const imageUrl = media.getImageUrl(image);
  const imageSize = await probe(imageUrl.url);
  return {
    url: imageUrl.url,
    width: imageSize.width,
    height: imageSize.height,
  };
};

/**
 * Scales a Wix image URL to the desired width while maintaining its aspect ratio.
 * @param image - The Wix image object.
 * @param targetWidth - The desired width for the scaled image.
 * @returns An object containing the scaled image URL, width, and height.
 */
export const getScaledImage = async (
  image: string,
  targetWidth: number
): Promise<{ url: string; width: number; height: number }> => {
  const imageurl = media.getImageUrl(image);
  const imagesize = await probe(imageurl.url); // fetch image metadata
  const aspectratio = imagesize.width / imagesize.height;

  const scaledwidth = targetWidth;
  const scaledheight = scaledwidth / aspectratio;

  const scaledimageurl = media.getScaledToFillImageUrl(
    image,
    scaledwidth,
    scaledheight,
    {}
  );

  return {
    url: scaledimageurl,
    width: scaledwidth,
    height: scaledheight,
  };
};

export const getScaledImageByHeight = async (
  image: string,
  targetHeight: number
): Promise<{ url: string; width: number; height: number }> => {
  const imageurl = media.getImageUrl(image);
  const imagesize = await probe(imageurl.url); // fetch image metadata
  const aspectratio = imagesize.width / imagesize.height;

  const scaledheight = targetHeight;
  const scaledwidth = scaledheight * aspectratio;

  const scaledimageurl = media.getScaledToFillImageUrl(
    image,
    scaledwidth,
    scaledheight,
    {}
  );

  return {
    url: scaledimageurl,
    width: scaledwidth,
    height: scaledheight,
  };
};
