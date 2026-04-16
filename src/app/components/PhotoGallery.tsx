"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import type { Photo } from "@/app/types";
import { getWixImageDimensions } from "@/app/utils";
import { getScaledToFitImageUrl } from "@/app/utils/wix/media";
import { media } from "@wix/sdk";
import Image from "next/image";
import classnames from "classnames";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

// Import Swiper React components
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Prevent SSR for PhotoModal (uses useLayoutEffect reading window)
import dynamic from "next/dynamic";
const PhotoModal = dynamic(() => import("./PhotoModal"), {
  ssr: false,
});

interface PhotoGalleryProps {
  photos: Photo[];
}

// Compute the same full-size URL that PhotoModal uses so prefetch URLs get
// cache hits when the modal opens.
function computeModalUrl(
  photo: Photo,
  windowWidth: number,
  windowHeight: number,
): { url: string; width: number; height: number } | null {
  if (!photo.settings || !windowWidth || !windowHeight) return null;
  const { width: originalW, height: originalH } = photo.settings;
  const containerW = Math.round(windowWidth * 0.9);
  const containerH = Math.round(windowHeight * 0.9);
  const scaleFactor = Math.min(containerW / originalW, containerH / originalH);
  const w = Math.round(originalW * scaleFactor);
  const h = Math.round(originalH * scaleFactor);
  const url = media.getScaledToFillImageUrl(photo.src, w, h, {});
  return { url, width: w, height: h };
}

const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  // Tracks the last-opened index so the image stays visible during the
  // DaisyUI close animation after openModalIndex becomes null.
  const [lastOpenModalIndex, setLastOpenModalIndex] = useState<number | null>(
    null,
  );
  const [prefetchedIndices, setPrefetchedIndices] = useState<Set<number>>(
    new Set(),
  );
  const [loadedSlugs, setLoadedSlugs] = useState<Set<string>>(new Set());
  // Guard createPortal — document is not available during SSR.
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const handlePhotoLoaded = useCallback((slug: string) => {
    setLoadedSlugs((prev) => new Set(prev).add(slug));
  }, []);

  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  // Keep lastOpenModalIndex up to date whenever a real index is selected.
  useEffect(() => {
    if (openModalIndex !== null) {
      setLastOpenModalIndex(openModalIndex);
    }
  }, [openModalIndex]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeypress(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenModalIndex(null);
      }
      if (e.key === "ArrowLeft") {
        setOpenModalIndex((prev) => {
          if (prev === null) return null;
          return prev > 0 ? prev - 1 : prev;
        });
      }
      if (e.key === "ArrowRight") {
        setOpenModalIndex((prev) => {
          if (prev === null) return null;
          return prev < photos.length - 1 ? prev + 1 : prev;
        });
      }
    }
    document.addEventListener("keyup", handleKeypress as EventListener);
    return () => {
      document.removeEventListener("keyup", handleKeypress);
    };
  }, [photos.length]);

  // All indices to prefetch: hovered thumbnails + neighbours of the open modal.
  // Exclude the currently open index — the modal handles its own loading.
  const indicesToPrefetch = useMemo(() => {
    const set = new Set(prefetchedIndices);
    if (openModalIndex !== null) {
      if (openModalIndex > 0) set.add(openModalIndex - 1);
      if (openModalIndex < photos.length - 1) set.add(openModalIndex + 1);
      set.delete(openModalIndex);
    }
    return set;
  }, [prefetchedIndices, openModalIndex, photos.length]);

  const isModalOpen = openModalIndex !== null;
  // Use lastOpenModalIndex during the close animation so the image doesn't
  // disappear before the DaisyUI backdrop has finished fading out.
  const displayIndex = openModalIndex ?? lastOpenModalIndex;
  const currentPhoto = displayIndex !== null ? photos[displayIndex] : null;

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      setOpenModalIndex(null);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="relative">
        <Swiper
          className={classnames([
            "w-full",
            "select-none",
            "my-4",
            "md:my-6",
            "xl:my-8",
          ])}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={"auto"}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
            renderBullet: (index, className) =>
              `<span class="${classnames(className, [
                "text-3xl",
                "w-3!",
                "md:w-5!",
                "mx-1!",
                "h-3!",
                "md:h-5!",
                "cursor-pointer",
                "bg-primary!",
                "hover:opacity-50!",
                "transition-opacity",
              ])}"></span>`,
          }}
        >
          {photos.map((photo, i) => {
            const { width, height } = getWixImageDimensions(photo.src);
            const ratio = width / height;

            const displayHeight = 300;
            const displayWidth = Math.round(displayHeight * ratio);

            // Request 2× pixel resolution for retina / HiDPI screens while
            // keeping the CSS display size at displayWidth × displayHeight.
            const scaledImage = getScaledToFitImageUrl(
              photo.src,
              displayWidth * 2,
              displayHeight * 2,
              {},
            );

            return (
              <SwiperSlide
                key={photo.slug}
                style={{ width: displayWidth }}
                onClick={() => {
                  if (openModalIndex !== i) {
                    setOpenModalIndex(i);
                  }
                }}
                onMouseEnter={() => {
                  setPrefetchedIndices((prev) => {
                    if (prev.has(i)) return prev;
                    const next = new Set(prev);
                    next.add(i);
                    return next;
                  });
                }}
              >
                <Image
                  src={scaledImage}
                  alt={photo.alt}
                  width={displayWidth}
                  height={displayHeight}
                  className="cursor-pointer"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div
          className={classnames([
            "absolute",
            "top-1/2",
            "-translate-y-1/2",
            "z-10",
            "-left-2",
            "hover:left-0",
            "cursor-pointer",
            "bg-base-100/70",
            "hover:bg-base-100",
            "transition-all",
            "rounded-r-full",
            "p-2",
          ])}
        >
          <ArrowLeft
            className={classnames([
              "w-6",
              "md:w-8",
              "h-6",
              "md:h-8",
              "text-primary",
              "z-10",
              "transition-transform",
              "active:scale-120",
            ])}
            onClick={() => swiperRef.current?.slidePrev()}
          />
        </div>
        <div
          className={classnames([
            "absolute",
            "top-1/2",
            "-translate-y-1/2",
            "z-10",
            "-right-2",
            "hover:right-0",
            "cursor-pointer",
            "bg-base-100/70",
            "hover:bg-base-100",
            "transition-all",
            "rounded-l-full",
            "p-2",
          ])}
        >
          <ArrowRight
            className={classnames([
              "w-6",
              "md:w-8",
              "h-6",
              "md:h-8",
              "text-primary",
              "z-10",
              "transition-transform",
              "active:scale-120",
            ])}
            onClick={() => swiperRef.current?.slideNext()}
          />
        </div>
      </div>

      <div
        className={classnames([
          "custom-pagination",
          "text-center",
          "mt-2",
          "mb-8",
        ])}
      />

      {/* Single shared lightbox — stays modal-open while navigating so the
          backdrop never fades between photos */}
      {isMounted &&
        createPortal(
          <dialog
            className={classnames(
              { "modal-open": isModalOpen, "bg-black/90!": isModalOpen },
              ["modal"],
            )}
            onClick={handleBackdropClick}
          >
            <div
              className={classnames([
                "modal-box",
                "relative",
                "w-auto",
                "max-w-none",
                "h-auto",
                "overflow-hidden",
                "p-0",
                "shadow-lg",
                "shadow-yellow-500/50",
              ])}
            >
              {/* Close button */}
              {isModalOpen && (
                <button
                  type="button"
                  className={classnames([
                    "btn",
                    "btn-sm",
                    "btn-circle",
                    "absolute",
                    "right-2",
                    "top-2",
                    "z-10",
                    "bg-base-100/0",
                    "border-0",
                    "hover:bg-base-100",
                    "transition-all",
                    "font-bold",
                  ])}
                  onClick={() => setOpenModalIndex(null)}
                >
                  <X />
                </button>
              )}

              {/* Image — currentPhoto stays set during the close animation
                  via lastOpenModalIndex so the image doesn't vanish mid-fade */}
              <div className="flex justify-center items-center">
                {currentPhoto && (
                  <PhotoModal
                    photo={currentPhoto}
                    alreadyLoaded={loadedSlugs.has(currentPhoto.slug)}
                    onImageLoaded={() => handlePhotoLoaded(currentPhoto.slug)}
                  />
                )}
              </div>
            </div>
          </dialog>,
          document.body,
        )}

      {/* Hidden images: prefetch on hover + neighbours of the open modal */}
      {windowWidth > 0 &&
        [...indicesToPrefetch].map((i) => {
          const photo = photos[i];
          if (!photo) return null;
          const computed = computeModalUrl(photo, windowWidth, windowHeight);
          if (!computed) return null;
          return (
            <Image
              key={`prefetch-${photo.slug}`}
              src={computed.url}
              alt=""
              width={computed.width}
              height={computed.height}
              style={{ display: "none" }}
              priority
            />
          );
        })}
    </div>
  );
};

export default PhotoGallery;
