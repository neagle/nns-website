import { media } from "@wix/sdk";

export const getScaledToFitImageUrl = (
  ...args: Parameters<typeof media.getScaledToFitImageUrl>
) => {
  const scaledImage = media.getScaledToFitImageUrl(...args);
  const [_src, targetWidth, targetHeight, options = {}] = args;
  const { quality = 100 } = options;

  // This is the key part of the fix
  // The methods seem to get the width and height values wrong
  const fixedImageUrl = scaledImage
    .replace(/w_\d+,h_\d+/, `w_${targetWidth},h_${targetHeight}`)
    // Remarkable that this seems to be wrong?
    .replace("/fill/", "/fit/")
    .replace(/q_\d+/, `q_${quality}`);

  // console.log("fixedImageUrl", fixedImageUrl);

  return fixedImageUrl;
};
