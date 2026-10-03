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

const logoResolutionScale = 2;

const convertAvifUrlToPngBase64 = async (url: string) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const pngBuffer = await sharp(Buffer.from(buffer)).toFormat("png").toBuffer();
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
};

// **This default export is required**:
export default async function Image({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

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
  const columns = Math.max(1, Math.ceil(Math.sqrt(shows.length)));
  const rows = Math.max(1, Math.ceil(shows.length / columns));
  const panelWidth = size.width / columns;
  const panelHeight = size.height / rows;
  const logoPadding = panelWidth * 0.1;

  const showPanels = await Promise.all(
    shows.map(async (show) => {
      if (!show.logo) {
        return { _id: show._id, title: show.title };
      }
      const padding = show.nologopadding ? 0 : logoPadding;
      let url = getScaledToFitImageUrl(
        show.logo,
        Math.ceil((panelWidth - padding * 2) * logoResolutionScale),
        Math.ceil((panelHeight - padding * 2) * logoResolutionScale),
        { quality: 100 },
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
          backgroundTexture.url,
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
        backgroundColor: show.backgroundColor
          ? show.backgroundColor
          : "transparent",
        nologopadding: show.nologopadding,
      };
    }),
  );
  // console.log("showPanels", showPanels);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        width: `${size.width}px`,
        height: `${size.height}px`,
        background: "#002b36",
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
            style={{
              ...styleBlock,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: panelWidth,
              height: panelHeight,
              margin: 0,
              padding: panel.url && !panel.nologopadding ? logoPadding : 0,
            }}
          >
            {panel.url ? (
              <img
                src={panel.url}
                alt={panel.title}
                width={panelWidth - (panel.nologopadding ? 0 : logoPadding * 2)}
                height={
                  panelHeight - (panel.nologopadding ? 0 : logoPadding * 2)
                }
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
                  width: panelWidth,
                  height: panelHeight,
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
    </div>,
    {
      width: size.width,
      height: size.height,
    },
  );
}
