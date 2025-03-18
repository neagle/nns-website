"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { media } from "@wix/sdk";
import classnames from "classnames";

interface PhotoSettings {
  width: number;
  height: number;
  focalPoint?: [number, number];
}

interface Photo {
  description: string;
  slug: string;
  alt: string;
  src: string;
  title: string;
  type: "image";
  settings: PhotoSettings;
}

interface PhotoModalProps {
  photo: Photo;
  /** The child component(s), e.g. <Image /> */
  children: ReactNode;
}

const PhotoModal = ({ photo, children }: PhotoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scaledUrl, setScaledUrl] = useState("");

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  // Measure the window size
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    // Measure once at mount
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Close modal on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /**
   * Compute scaled image URL only once the modal is open
   * or if the window is resized while the modal is open.
   */
  useEffect(() => {
    if (!isOpen) {
      // If the modal is closed, clear out the scaled URL so we don't preload
      setScaledUrl("");
      setIsLoading(true);
      return;
    }

    if (!photo?.src || !windowWidth || !windowHeight) return;

    const { width: originalW, height: originalH } = photo.settings;
    if (!originalW || !originalH) return;

    // Our bounding box: 90% of the viewport
    const containerW = Math.round(windowWidth * 0.9);
    const containerH = Math.round(windowHeight * 0.9);

    // Determine how much we can scale the image down
    // so it fits entirely inside containerW x containerH
    const scaleFactor = Math.min(
      containerW / originalW,
      containerH / originalH
    );

    // Final requested size
    const finalWidth = Math.round(originalW * scaleFactor);
    const finalHeight = Math.round(originalH * scaleFactor);

    // Grab the scaled image from Wix (no cropping)
    const newUrl = media.getScaledToFillImageUrl(
      photo.src,
      finalWidth,
      finalHeight
    );
    setScaledUrl(newUrl);
    setIsLoading(true);
  }, [isOpen, photo, windowWidth, windowHeight]);

  // Close modal when user clicks the backdrop
  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Wrap the child element(s). Clicking them opens the modal. */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
        style={{ cursor: "pointer", display: "inline-block" }}
      >
        {children}
      </div>

      {/* Daisy UI modal */}
      <dialog
        className={classnames(
          { "modal-open": isOpen, "bg-black/90!": isOpen },
          ["modal"]
        )}
        onClick={handleBackdropClick}
      >
        {/**
         * By default, DaisyUI’s .modal-box has max-w-lg or similar constraints.
         * We override with w-auto / max-w-none / h-auto / p-0 to let the box
         * fit around the image naturally.
         */}
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
          {/* Close button in the top corner */}
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          {/* Center the image (or spinner) */}
          <div className="flex justify-center items-center">
            {isLoading && (
              <span className="loading loading-spinner loading-lg m-8" />
            )}
            {!isLoading && scaledUrl && (
              <img
                src={scaledUrl}
                alt={photo.alt || "Enlarged Image"}
                // Ensures the image doesn’t overflow the screen
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </div>
      </dialog>

      {/**
       * Hidden preloader. We mark the image as loaded
       * before actually displaying it in the modal
       */}
      {scaledUrl && (
        <img
          src={scaledUrl}
          alt=""
          style={{ display: "none" }}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </>
  );
};

export default PhotoModal;
