"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Photo } from "@/app/types";
import { getWixImageDimensions } from "@/app/utils";
import { getScaledToFitImageUrl } from "@/app/utils/wix/media";
import Image from "next/image";
import classnames from "classnames";
import PhotoModal from "./PhotoModal";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Import Swiper React components
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PhotoGalleryProps {
  photos: Photo[];
}

const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

  // Close modal on Escape
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
          // onSlideChange={() => {}}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          {photos.map((photo, i) => {
            const { width, height } = getWixImageDimensions(photo.src);
            const ratio = width / height;

            const scaledHeight = 300;
            const scaledWidth = Math.round(scaledHeight * ratio);

            const scaledImage = getScaledToFitImageUrl(
              photo.src,
              scaledWidth,
              scaledHeight,
              {}
            );

            return (
              <>
                <SwiperSlide
                  key={photo.slug}
                  style={{ width: scaledWidth }}
                  onClick={() => {
                    if (openModalIndex !== i) {
                      setOpenModalIndex(i);
                    }
                  }}
                >
                  <PhotoModal
                    photo={photo}
                    isOpen={openModalIndex === i}
                    onClose={() => {
                      setOpenModalIndex(null);
                    }}
                  >
                    <Image
                      src={scaledImage}
                      alt={photo.alt}
                      width={scaledWidth}
                      height={scaledHeight}
                    />
                  </PhotoModal>
                </SwiperSlide>
              </>
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
            className={classnames(
              // { "opacity-20": swiperRef.current?.isBeginning },
              ["w-6", "md:w-8", "h-6", "md:h-8", "text-primary", "z-10"]
            )}
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
            className={classnames(
              // { "opacity-20": swiperRef.current?.isBeginning },
              ["w-6", "md:w-8", "h-6", "md:h-8", "text-primary", "z-10"]
            )}
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
    </div>
  );
};

export default PhotoGallery;
