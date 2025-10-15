import { ImageResponse } from "next/og";
import wixClient from "@/lib/wixClient";
import { getScaledToFitImageUrl } from "@/app/utils/wix/media";
import type { Show } from "@/app/types";
import { getImageWithDimensions } from "@/app/actions/media";
import sharp from "sharp";

// Optional metadata exports:
export const size = { width: 1200, height: 630, margin: 20 };
export const contentType = "image/png";

const convertAvifUrlToPngBase64 = async (url: string) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const pngBuffer = await sharp(Buffer.from(buffer)).toFormat("png").toBuffer();
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
};

// **This default export is required**:
export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { items } = await wixClient.items
    .query("Shows")
    .eq("slug", slug)
    .find();

  const show = items[0] as Show;

  const getShowPanel = async (show: Show) => {
    if (!show.logo) {
      return { _id: show._id, title: show.title };
    }
    let url = getScaledToFitImageUrl(
      show.logo,
      size.width - size.margin * 2,
      size.height - size.margin * 2,
      {}
    );

    if (url.endsWith(".avif")) {
      url = await convertAvifUrlToPngBase64(url);
    }

    const backgroundTexture = show.backgroundTexture
      ? await getImageWithDimensions(show.backgroundTexture)
      : null;
    if (
      backgroundTexture &&
      backgroundTexture?.url &&
      backgroundTexture.url.endsWith(".avif")
    ) {
      backgroundTexture.url = await convertAvifUrlToPngBase64(
        backgroundTexture.url
      );
    }

    return {
      _id: show._id,
      title: show.title,
      url,
      backgroundTexture,
      backgroundColor: show.backgroundColor,
    };
  };
  const showPanel = await getShowPanel(show);

  const styleBlock: Record<string, string> = {
    backgroundColor: showPanel.backgroundColor || "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: `${size.width}px`,
    height: `${size.height}px`,
  };

  if (showPanel.backgroundTexture) {
    styleBlock.backgroundImage = `url(${showPanel.backgroundTexture.url})`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          // stretch items to fill height and width
          ...styleBlock,
        }}
      >
        {showPanel.url ? (
          <img
            src={showPanel.url}
            alt={showPanel.title}
            width={size.width - size.margin * 2}
            height={size.height - size.margin * 2}
            style={{
              objectFit: "contain",
              margin: size.margin + "px",
            }}
          />
        ) : (
          <span
            style={{
              color: "white",
              padding: "25px",
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "center",
              width: "300px",
              height: "315px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showPanel.title}
          </span>
        )}
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
