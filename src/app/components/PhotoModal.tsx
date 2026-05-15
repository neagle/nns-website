"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import { media } from "@wix/sdk";
import Image from "next/image";
import type { Photo } from "@/app/types";

interface PhotoModalProps {
  photo: Photo;
  alreadyLoaded?: boolean;
  onImageLoaded?: () => void;
}

/**
 * Renders the full-size image for the gallery lightbox.
 * Contains no dialog or portal — the shared backdrop lives in PhotoGallery.
 */
const PhotoModal = ({
  photo,
  alreadyLoaded = false,
  onImageLoaded,
}: PhotoModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  // Delayed spinner: only show after 150 ms so cached images never flash.
  const [showSpinner, setShowSpinner] = useState(false);
  const [scaledUrl, setScaledUrl] = useState("");
  const [finalWidth, setFinalWidth] = useState(0);
  const [finalHeight, setFinalHeight] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setShowSpinner(false);
      return;
    }
    const timer = setTimeout(() => setShowSpinner(true), 150);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Compute URL synchronously before the browser paints.
  useLayoutEffect(() => {
    if (!photo?.src || !photo.settings) return;

    const { width: originalW, height: originalH } = photo.settings;
    const containerW = Math.round(window.innerWidth * 0.9);
    const containerH = Math.round(window.innerHeight * 0.9);
    const scaleFactor = Math.min(containerW / originalW, containerH / originalH);
    const w = Math.round(originalW * scaleFactor);
    const h = Math.round(originalH * scaleFactor);

    setFinalWidth(w);
    setFinalHeight(h);
    const newUrl = media.getScaledToFillImageUrl(photo.src, w, h, {});
    setScaledUrl(newUrl);
    setIsLoading(!alreadyLoaded);
  }, [photo, alreadyLoaded]);

  // Recalculate when window is resized.
  useEffect(() => {
    if (!photo?.src || !photo.settings) return;

    const handleResize = () => {
      if (!photo.settings) return;
      const { width: originalW, height: originalH } = photo.settings;
      const containerW = Math.round(window.innerWidth * 0.9);
      const containerH = Math.round(window.innerHeight * 0.9);
      const scaleFactor = Math.min(containerW / originalW, containerH / originalH);
      const w = Math.round(originalW * scaleFactor);
      const h = Math.round(originalH * scaleFactor);
      setFinalWidth(w);
      setFinalHeight(h);
      const newUrl = media.getScaledToFillImageUrl(photo.src, w, h, {});
      setScaledUrl(newUrl);
      setIsLoading(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [photo]);

  const handleImageLoaded = () => {
    setIsLoading(false);
    onImageLoaded?.();
  };

  if (!scaledUrl) return null;

  return (
    <div
      style={{
        position: "relative",
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
        maxWidth: "90vw",
        maxHeight: "90vh",
      }}
    >
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}
      {/* Always rendered once we have a URL so the browser can decode
          immediately; hidden via opacity until the image is ready. */}
      <Image
        src={scaledUrl}
        alt={photo.alt || "Enlarged Image"}
        width={finalWidth}
        height={finalHeight}
        style={{
          objectFit: "contain",
          opacity: isLoading ? 0 : 1,
          transition: isLoading ? "none" : "opacity 0.1s",
        }}
        className="rounded-lg"
        onLoad={handleImageLoaded}
        priority={true}
      />
    </div>
  );
};

export default PhotoModal;
