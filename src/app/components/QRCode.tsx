"use client";
import { useEffect, useState } from "react";
import slugify from "@sindresorhus/slugify";
import { QRCodeSVG } from "qrcode.react";
import classnames from "classnames";
import { getSvgDataUrl } from "@/app/utils";
import { CircleX } from "lucide-react";

import { usePathname, useSearchParams } from "next/navigation";

const COLOR_PRIMARY = "#fdbf5d";
const COLOR_NEUTRAL = "hsl(236, 52%, 17%)";

const QrCode = () => {
  const searchParams = useSearchParams();
  const qrCodeParam = searchParams.get("qrCode");

  const pathname = usePathname();

  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [inColor, setInColor] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const { protocol, host } = window.location;
    setFullUrl(`${protocol}//${host}${pathname}`);
    setPageTitle(document.title);

    const loadLogo = async () => {
      const url = await getSvgDataUrl(
        `/svg/star.svg?fill=${inColor ? COLOR_NEUTRAL : COLOR_PRIMARY}`
      );
      setLogoUrl(url);
    };
    loadLogo();
  }, [inColor, pathname]);

  if (typeof qrCodeParam !== "string" || !fullUrl) return null;

  const saveSVG = () => {
    const svg = document.querySelector("#url-qr-code");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const filename = `qr-code-for-${slugify(fullUrl)}.svg`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    // Redirect to the same page without the qrCode query parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("qrCode");
    window.history.pushState({}, "", url);
    window.location.reload();
  };

  if (!logoUrl) return null;

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-base-100 rounded-lg shadow-lg z-40">
      <div
        className={classnames([
          "absolute",
          "-top-7",
          "right-0",
          "cursor-pointer",
          "bg-base-100",
          "hover:text-primary",
          "transition-all",
          "rounded-full",
          "p-1",
          "shadow-lg",
          "z-50",
        ])}
        onClick={handleClose}
      >
        <CircleX size={24} />
      </div>
      <div
        className={classnames({ "bg-white": !inColor, "bg-primary": inColor }, [
          "rounded",
          "mb-2",
          "overflow-hidden",
        ])}
      >
        <QRCodeSVG
          id="url-qr-code"
          title={pageTitle}
          value={fullUrl}
          size={128}
          level="H"
          bgColor={inColor ? COLOR_PRIMARY : "#ffffff"}
          fgColor={inColor ? COLOR_NEUTRAL : "#000000"}
          marginSize={4}
          imageSettings={{
            src: logoUrl,
            height: 24,
            width: 24,
            excavate: true,
            opacity: 1,
          }}
        />
      </div>

      <fieldset className="fieldset mb-1">
        <label className="fieldset-label">
          <input
            type="checkbox"
            defaultChecked={inColor}
            onChange={() => setInColor((prev) => !prev)}
            className="toggle toggle-xs toggle-primary"
          />
          Color
        </label>
      </fieldset>
      <button className="btn btn-xs btn-primary btn-wide" onClick={saveSVG}>
        Download
      </button>
    </div>
  );
};

export default QrCode;
