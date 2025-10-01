"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  MouseEvent,
} from "react";
import { media } from "@wix/sdk";
import classnames from "classnames";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Photo } from "@/app/types";
import { X } from "lucide-react";

interface PhotoModalProps {
  photo: Photo;
  isOpen?: boolean;
  onClose?: () => void;
  /** The child component(s), e.g. <Image /> */
  children: ReactNode;
}

const PhotoModal = ({
  photo,
  children,
  isOpen = false,
  onClose,
}: PhotoModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scaledUrl, setScaledUrl] = useState("");
  const [finalWidth, setFinalWidth] = useState(0);
  const [finalHeight, setFinalHeight] = useState(0);

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  // Measure the window size
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Calculate scaled dimensions when modal opens or window size changes
  useEffect(() => {
    if (!isOpen) {
      setScaledUrl("");
      setIsLoading(true);
      return;
    }

    if (!photo?.src || !windowWidth || !windowHeight) return;

    if (!photo.settings) {
      return;
    }
    const { width: originalW, height: originalH } = photo.settings;

    // Bounding box: 90% of the viewport
    const containerW = Math.round(windowWidth * 0.9);
    const containerH = Math.round(windowHeight * 0.9);

    // Calculate scale factor to maintain aspect ratio
    const scaleFactor = Math.min(
      containerW / originalW,
      containerH / originalH
    );

    // Scaled dimensions
    const calculatedWidth = Math.round(originalW * scaleFactor);
    const calculatedHeight = Math.round(originalH * scaleFactor);

    setFinalWidth(calculatedWidth);
    setFinalHeight(calculatedHeight);

    // Get the scaled image URL from Wix (no cropping)
    const newUrl = media.getScaledToFillImageUrl(
      photo.src,
      calculatedWidth,
      calculatedHeight,
      {}
    );
    setScaledUrl(newUrl);
    setIsLoading(true);
  }, [isOpen, photo, windowWidth, windowHeight]);

  // Close modal when clicking the backdrop
  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      if (onClose) onClose();
    }
  };

  const modalContent = (
    <dialog
      className={classnames({ "modal-open": isOpen, "bg-black/90!": isOpen }, [
        "modal",
      ])}
      onClick={handleBackdropClick}
    >
      <div
        className={classnames([
          "modal-box",
          "relative",
          "w-auto",
          "max-w-none",
          "h-auto",
          "p-0",
          "shadow-lg",
          "shadow-yellow-500/50",
        ])}
      >
        {/* Close button */}
        {!isLoading && (
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
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            <X />
          </button>
        )}

        {/* Image Container */}
        <div className="flex justify-center items-center">
          {isLoading && (
            <span className="loading loading-spinner loading-lg m-8" />
          )}
          {!isLoading && scaledUrl && (
            <div
              style={{
                position: "relative",
                width: `${finalWidth}px`,
                height: `${finalHeight}px`,
                maxWidth: "90vw",
                maxHeight: "90vh",
              }}
            >
              <Image
                src={scaledUrl}
                alt={photo.alt || "Enlarged Image"}
                width={finalWidth}
                height={finalHeight}
                style={{
                  objectFit: "contain",
                }}
                className="rounded-lg"
                onLoad={() => setIsLoading(false)}
                priority={true}
              />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer", display: "inline-block" }}
      >
        {children}
      </div>

      {/* Render modal using React Portal */}
      {createPortal(modalContent, document.body)}

      {/* Preload the image */}
      {scaledUrl && (
        <Image
          src={scaledUrl}
          alt=""
          width={finalWidth}
          height={finalHeight}
          style={{ display: "none" }}
          onLoad={() => setIsLoading(false)}
          priority={true}
        />
      )}
    </>
  );
};

export default PhotoModal;
