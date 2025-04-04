"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import classnames from "classnames";

type Props = {
  children: React.ReactNode;
  showButton?: boolean;
};

export default function FullscreenWrapper({
  children,
  showButton = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(() => {
    if (containerRef.current && !isFullscreen) {
      containerRef.current.requestFullscreen?.();
    }
  }, [isFullscreen]);

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        enterFullscreen();
      } else if (e.key === "Escape") {
        exitFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [enterFullscreen]);

  return (
    <div
      ref={containerRef}
      className={classnames({ "cursor-pointer": !isFullscreen }, [
        "relative",
        "w-full",
        "h-full",
      ])}
      onClick={() => enterFullscreen()}
    >
      {showButton && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-50 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-75"
        >
          {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </button>
      )}
      {children}
    </div>
  );
}
