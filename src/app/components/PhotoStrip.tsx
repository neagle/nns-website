"use client";
import React, { useEffect, useRef } from "react";
import classnames from "classnames";
import Nightsky from "@/app/components/Nightsky";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import useResponsive from "@/app/hooks/useResponsive";

import WixImage from "@/app/components/WixImage";
import { Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation } from "swiper/modules";

interface Props {
  className?: string;
  width?: number;
  height?: number;
  photos: {
    _id: string;
    resourceUrl: string;
    name: string;
  }[];
}

const PhotoStrip = ({
  className = "",
  width = 300,
  height = 300,
  photos,
}: Props) => {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current) {
        swiperRef.current.update();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [activeSlide, setActiveSlide] = React.useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const isMediumUp = useResponsive();
  const orientation = isMediumUp ? "vertical" : "horizontal";

  const styleObject: { width?: string; height?: string } = {};
  if (orientation === "vertical") {
    styleObject.width = `${width}px`;
  } else {
    styleObject.height = `${height}px`;
  }

  return isMounted ? (
    <div
      style={styleObject}
      className={classnames([
        "card",
        "card-border",
        "bg-base-100",
        "shadow-lg",
        // "overflow-hidden",
        "[&_.swiper-slide_img]:transition-all",
        "[&_.swiper-slide_img]:duration-1000",
        "[&_.swiper-slide_img]:opacity-30",
        "[&_.swiper-slide-active_img]:opacity-100",
      ])}
    >
      <Nightsky twinkle={false} className="p-0! rounded-lg overflow-hidden">
        <div className="card-body p-0 overflow-hidden rounded-lg relative">
          <Swiper
            className={classnames(
              {
                "h-[500px]": orientation === "vertical",
                "h-[300px]": orientation === "horizontal",
                "w-full": orientation === "horizontal",
              },
              ["select-none", "cursor-grab"],
              className
            )}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveSlide(swiper.activeIndex);
            }}
            // You may be very tempted to want to make this a loop. I sure was!
            // But it's not possible with `slidesPerView="auto"`
            // @see https://github.com/nolimits4web/swiper/issues/6559
            // loop={true}
            spaceBetween={0}
            direction={orientation}
            slidesPerView="auto"
            centeredSlides={true}
            modules={[Navigation]}
          >
            {photos.map((photo, i) => (
              <SwiperSlide
                key={photo._id}
                className={classnames(
                  {
                    "h-auto!": orientation === "vertical",
                    "w-auto!": orientation === "horizontal",
                  },
                  ["bg-black"],
                  {
                    "active-slide": i === activeSlide,
                  }
                )}
              >
                <WixImage
                  src={photo.resourceUrl}
                  alt={photo.name}
                  targetWidth={orientation === "vertical" ? width : undefined}
                  targetHeight={
                    orientation === "horizontal" ? height : undefined
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Nightsky>
      <div className="navigation">
        <div
          className={classnames(
            {
              "left-1/2": orientation === "vertical",
              "-translate-x-1/2": orientation === "vertical",
              "top-0": orientation === "vertical",
              "-translate-y-2/3": orientation === "vertical",
            },
            {
              "left-0": orientation === "horizontal",
              "-translate-x-2/3": orientation === "horizontal",
              "top-1/2": orientation === "horizontal",
              "-translate-y-1/2": orientation === "horizontal",
            },
            [
              "absolute",
              "z-10",
              "cursor-pointer",
              "bg-base-100/70",
              "hover:bg-base-100",
              "hover:scale-110",
              "transition-all",
              "rounded-full",
              "p-1",
              "select-none",
            ]
          )}
        >
          {orientation === "vertical" ? (
            <ArrowUp
              className={classnames(
                {
                  "opacity-20": activeSlide === 0,
                  "cursor-default": activeSlide === 0,
                },
                ["swiper-button-prev-custom", "w-6", "h-6", "text-primary"]
              )}
              // onClick={handlePrevSlide}
              onClick={() => swiperRef?.current?.slidePrev()}
            />
          ) : (
            <ArrowLeft
              className={classnames(
                {
                  "opacity-20": activeSlide === 0,
                  "cursor-default": activeSlide === 0,
                },
                ["swiper-button-next-custom", "w-6", "h-6", "text-primary"]
              )}
              onClick={() => swiperRef?.current?.slidePrev()}
            />
          )}
        </div>
        <div
          className={classnames(
            {
              "left-1/2": orientation === "vertical",
              "-translate-x-1/2": orientation === "vertical",
              "bottom-0": orientation === "vertical",
              "translate-y-2/3": orientation === "vertical",

              "top-1/2": orientation === "horizontal",
              "-translate-y-1/2": orientation === "horizontal",
              "right-0": orientation === "horizontal",
              "translate-x-2/3": orientation === "horizontal",
            },
            [
              "absolute",
              "z-10",
              "cursor-pointer",
              "bg-base-100/70",
              "hover:bg-base-100",
              "hover:scale-110",
              "transition-all",
              "rounded-full",
              "p-2",
              "select-none",
            ]
          )}
        >
          {orientation === "vertical" ? (
            <ArrowDown
              className={classnames(
                {
                  "opacity-20": activeSlide === photos.length - 1,
                  "cursor-default": activeSlide === photos.length - 1,
                },
                [
                  "swiper-button-next-custom",
                  "w-6",
                  "h-6",
                  "text-primary",
                  "z-10",
                ]
              )}
              onClick={() => swiperRef?.current?.slideNext()}
            />
          ) : (
            <ArrowRight
              className={classnames(
                {
                  "opacity-20": activeSlide === photos.length - 1,
                  "cursor-default": activeSlide === photos.length - 1,
                },
                ["swiper-button-prev-custom", "w-6", "h-6", "text-primary"]
              )}
              onClick={() => swiperRef?.current?.slideNext()}
            />
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default PhotoStrip;
