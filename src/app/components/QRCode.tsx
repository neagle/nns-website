"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import slugify from "@sindresorhus/slugify";
import { QRCodeSVG } from "qrcode.react";
import classnames from "classnames";
import { getSvgDataUrl } from "@/app/utils";
import { CircleX, Settings2 } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const COLOR_PRIMARY = "#fdbf5d";
const COLOR_NEUTRAL = "hsl(236, 52%, 17%)";
const DEFAULT_UTM_SOURCE = "print";
const DEFAULT_UTM_MEDIUM = "qr";

interface TrackingFields {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

const getDefaultCampaign = (pageTitle: string, pathname: string) => {
  const rawTitle = pageTitle.split("|")[0]?.trim();

  if (rawTitle) {
    return slugify(rawTitle, { separator: "-", lowercase: true });
  }

  if (pathname === "/") {
    return "homepage";
  }

  const slug = pathname.split("/").filter(Boolean).join("-");

  return slugify(slug || "page", { separator: "-", lowercase: true });
};

const QrCode = () => {
  const searchParams = useSearchParams();
  const qrCodeParam = searchParams.get("qrCode");

  const pathname = usePathname();
  const router = useRouter();

  const [origin, setOrigin] = useState<string | null>(null);
  const [inColor, setInColor] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isCampaignDirty, setIsCampaignDirty] = useState(false);
  const advancedDialogRef = useRef<HTMLDialogElement>(null);
  const [tracking, setTracking] = useState<TrackingFields>({
    source: DEFAULT_UTM_SOURCE,
    medium: DEFAULT_UTM_MEDIUM,
    campaign: "",
    content: "",
    term: "",
  });

  const defaultCampaign = useMemo(
    () => getDefaultCampaign(pageTitle, pathname),
    [pageTitle, pathname],
  );

  const trackedUrl = useMemo(() => {
    if (!origin) {
      return null;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("qrCode");

    if (tracking.source.trim()) {
      params.set("utm_source", tracking.source.trim());
    } else {
      params.delete("utm_source");
    }

    if (tracking.medium.trim()) {
      params.set("utm_medium", tracking.medium.trim());
    } else {
      params.delete("utm_medium");
    }

    if (tracking.campaign.trim()) {
      params.set("utm_campaign", tracking.campaign.trim());
    } else {
      params.delete("utm_campaign");
    }

    if (tracking.content.trim()) {
      params.set("utm_content", tracking.content.trim());
    } else {
      params.delete("utm_content");
    }

    if (tracking.term.trim()) {
      params.set("utm_term", tracking.term.trim());
    } else {
      params.delete("utm_term");
    }

    const query = params.toString();
    return `${origin}${pathname}${query ? `?${query}` : ""}`;
  }, [origin, pathname, searchParams, tracking]);

  useEffect(() => {
    setOrigin(window.location.origin);
    setPageTitle(document.title);

    const loadLogo = async () => {
      const url = await getSvgDataUrl(
        `/svg/star.svg?fill=${inColor ? COLOR_NEUTRAL : COLOR_PRIMARY}`,
      );
      setLogoUrl(url);
    };
    loadLogo();
  }, [inColor, pathname]);

  useEffect(() => {
    if (!defaultCampaign || isCampaignDirty) {
      return;
    }

    setTracking((prev) => ({
      ...prev,
      campaign: defaultCampaign,
    }));
  }, [defaultCampaign, isCampaignDirty]);

  if (typeof qrCodeParam !== "string" || !trackedUrl) return null;

  const saveSVG = () => {
    const svg = document.querySelector("#url-qr-code");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const filename = `qr-code-for-${slugify(trackedUrl)}.svg`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("qrCode");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  if (!logoUrl) return null;

  return (
    <>
      <div
        className={classnames([
          "fixed",
          "bottom-4",
          "md:bottom-4",
          "right-4",
          "left-4",
          "md:left-auto",
          "md:right-4",
          "md:w-[18rem]",
          "p-3",
          "bg-base-100",
          "rounded-lg",
          "shadow-lg",
          "shadow-primary",
          "z-40",
        ])}
      >
        <div
          className={classnames([
            "flex",
            "gap-3",
            "items-start",
            "flex-col",
            "md:flex-row",
          ])}
        >
          <div
            className={classnames(
              { "bg-white": !inColor, "bg-primary": inColor },
              ["rounded", "overflow-hidden", "shrink-0", "mx-auto"],
            )}
          >
            <QRCodeSVG
              id="url-qr-code"
              title={pageTitle}
              value={trackedUrl}
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

          <div className="min-w-0 grow flex flex-col gap-2 ">
            <div>
              <div className={classnames(["flex", "items-center"])}>
                <label
                  htmlFor="qr-tracking-campaign"
                  className={classnames([
                    "block",
                    "text-xs",
                    "font-bold",
                    "uppercase",
                    "tracking-wide",
                    "text-primary/80",
                    "grow",
                  ])}
                >
                  Tracking campaign
                </label>
                <button
                  className="btn btn-ghost btn-xs ml-2"
                  onClick={handleClose}
                >
                  <CircleX />
                </button>
              </div>
              <input
                id="qr-tracking-campaign"
                name="qr-tracking-campaign"
                type="text"
                value={tracking.campaign}
                onChange={(event) => {
                  setIsCampaignDirty(true);
                  setTracking((prev) => ({
                    ...prev,
                    campaign: slugify(event.target.value, {
                      separator: "-",
                      lowercase: true,
                    }),
                  }));
                }}
                className={classnames([
                  "input",
                  "input-sm",
                  "w-full",
                  "mt-1",
                  "bg-base-200",
                  "border-base-300",
                ])}
              />
            </div>

            <div className="rounded bg-base-200 p-2 text-[11px] leading-tight">
              <p className="font-bold text-primary/70">Encoded URL</p>
              <p className="mt-1 break-all text-base-content/80">
                {trackedUrl}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="fieldset-label m-0 gap-2">
                <input
                  type="checkbox"
                  checked={inColor}
                  onChange={() => setInColor((prev) => !prev)}
                  className="toggle toggle-xs toggle-primary"
                />
                Color
              </label>

              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => advancedDialogRef.current?.showModal()}
              >
                <Settings2 size={14} />
                Advanced
              </button>
            </div>

            <button className="btn btn-sm btn-primary w-full" onClick={saveSVG}>
              Download SVG
            </button>
          </div>
        </div>
      </div>

      <dialog
        ref={advancedDialogRef}
        className={classnames([
          "modal",
          "modal-bottom",
          "sm:modal-middle",
          "px-4",
          "pb-4",
        ])}
      >
        <div className={classnames(["modal-box", "rounded", "rounded-lg"])}>
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              aria-label="Close advanced tracking"
            >
              <CircleX size={18} />
            </button>
          </form>

          <h2 className="font-bold text-lg">Advanced tracking</h2>
          <p className="text-sm text-base-content/70 mt-1">
            Adjust the UTM fields that will be embedded in the QR code.
          </p>

          <div className="grid gap-3 md:grid-cols-2 mt-4">
            <div>
              <label
                htmlFor="utm-source"
                className="block text-xs font-bold uppercase tracking-wide text-primary/80"
              >
                UTM source
              </label>
              <input
                id="utm-source"
                type="text"
                value={tracking.source}
                onChange={(event) =>
                  setTracking((prev) => ({
                    ...prev,
                    source: slugify(event.target.value, {
                      separator: "-",
                      lowercase: true,
                    }),
                  }))
                }
                className="input input-bordered input-xs mt-1 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="utm-medium"
                className="block text-xs font-bold uppercase tracking-wide text-primary/80"
              >
                UTM medium
              </label>
              <input
                id="utm-medium"
                type="text"
                value={tracking.medium}
                onChange={(event) =>
                  setTracking((prev) => ({
                    ...prev,
                    medium: slugify(event.target.value, {
                      separator: "-",
                      lowercase: true,
                    }),
                  }))
                }
                className="input input-bordered input-xs mt-1 w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="utm-campaign"
                className="block text-xs font-bold uppercase tracking-wide text-primary/80"
              >
                UTM campaign
              </label>
              <input
                id="utm-campaign"
                type="text"
                value={tracking.campaign}
                onChange={(event) => {
                  setIsCampaignDirty(true);
                  setTracking((prev) => ({
                    ...prev,
                    campaign: slugify(event.target.value, {
                      separator: "-",
                      lowercase: true,
                    }),
                  }));
                }}
                className="input input-bordered input-xs mt-1 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="utm-content"
                className="block text-xs font-bold uppercase tracking-wide text-primary/80"
              >
                UTM content
              </label>
              <input
                id="utm-content"
                type="text"
                value={tracking.content}
                onChange={(event) =>
                  setTracking((prev) => ({
                    ...prev,
                    content: slugify(event.target.value, {
                      separator: "-",
                      lowercase: true,
                    }),
                  }))
                }
                className="input input-bordered input-xs mt-1 w-full"
                placeholder="optional"
              />
            </div>

            <div>
              <label
                htmlFor="utm-term"
                className="block text-xs font-bold uppercase tracking-wide text-primary/80"
              >
                UTM term
              </label>
              <input
                id="utm-term"
                type="text"
                value={tracking.term}
                onChange={(event) =>
                  setTracking((prev) => ({
                    ...prev,
                    term: slugify(event.target.value, {
                      separator: "-",
                      lowercase: true,
                    }),
                  }))
                }
                className="input input-bordered input-xs mt-1 w-full"
                placeholder="optional"
              />
            </div>
          </div>

          <div className="rounded bg-base-200 p-3 text-xs leading-relaxed mt-4">
            <p className="font-bold text-primary/70">Tracked URL preview</p>
            <p className="mt-1 break-all text-base-content/80">{trackedUrl}</p>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => {
                setIsCampaignDirty(false);
                setTracking({
                  source: DEFAULT_UTM_SOURCE,
                  medium: DEFAULT_UTM_MEDIUM,
                  campaign: defaultCampaign,
                  content: "",
                  term: "",
                });
              }}
            >
              Reset defaults
            </button>
            <form method="dialog">
              <button className="btn btn-primary btn-xs">Done</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default QrCode;
