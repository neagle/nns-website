// app/seasons/[year]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import wixClient from "@/lib/wixClient";
import { getScaledToFitImageUrl } from "@/app/utils/wix/media";
import type { Show } from "@/app/types";
import { getImageWithDimensions } from "@/app/actions/media";
import sharp from "sharp";

// export const runtime = "edge";

// Optional metadata exports:
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Season lineup";

const convertAvifUrlToPngBase64 = async (url: string) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const pngBuffer = await sharp(Buffer.from(buffer)).toFormat("png").toBuffer();
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
};

// **This default export is required**:
export default async function Image({ params }: { params: { year: string } }) {
  const { year } = params;
  // console.log("OPENGRAPH IMAGE", year);

  // fetch your season’s shows exactly as you do in your page
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

  const { items } = await wixClient.items
    .query("Shows")
    .ge("openingDate", startOfYear.toISOString())
    .le("openingDate", endOfYear.toISOString())
    .ascending("openingDate")
    .find();

  const shows = items as Show[];
  // console.log("shows", shows);

  const showPanels = await Promise.all(
    shows.map(async (show) => {
      if (!show.logo) {
        return { _id: show._id, title: show.title };
      }
      let url = getScaledToFitImageUrl(show.logo, 300, 315, {});

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
      // console.log("logo (wix)", show.logo);
      // console.log("logo (url)", url);
      // console.log("backgroundTexture", backgroundTexture);
      return {
        _id: show._id,
        title: show.title,
        url,
        backgroundTexture,
        backgroundColor: show.backgroundColor,
      };
    })
  );
  // console.log("showPanels", showPanels);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: `${size.width}px`,
          height: `${size.height}px`,
          background: "#151843",
        }}
      >
        {showPanels.map((panel) => {
          const styleBlock: Record<string, string> = {
            backgroundColor: panel.backgroundColor || "transparent",
            backgroundSize: "cover",
            backgroundPosition: "center",
          };

          if (panel.backgroundTexture) {
            styleBlock.backgroundImage = `url(${panel.backgroundTexture.url})`;
          }
          // console.log("styleBlock", panel.title, styleBlock);

          return (
            <p
              key={panel._id}
              style={{ ...styleBlock, margin: "0", padding: "0" }}
            >
              {panel.url ? (
                <img
                  src={panel.url}
                  alt={panel.title}
                  width={300}
                  height={315}
                  style={{
                    objectFit: "contain",
                    // borderRadius: "8px",
                    // margin: "10px",
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
                  {panel.title}
                </span>
              )}
            </p>
          );
        })}
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
