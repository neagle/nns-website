"use client";

import React, { useEffect, useRef, useState } from "react";
import { debounce } from "@/app/utils";
import { useSearchParams } from "next/navigation";

type Props = {
  numStars?: number;
  starRadius?: number;
  starBrightnessCeiling?: number;
  starBrightnessFloor?: number;
  adjustStarsToWindowWidth?: boolean;
  nebularClouds?: boolean;
  distort?: number;
  // An additional way to distort the canvas to try to compensate for the
  // projection
  rotateX?: number;
  twinkle?: boolean;
};

// Type for our star objects
interface Star {
  x: number;
  y: number;
  radius: number;
  baseBrightness: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const DEFAULT_NUM_STARS = 500;
const NARROW_WIDTH = 600;

const getQueryParam = (
  searchParams: URLSearchParams,
  key: string,
  defaultValue: number
): number => {
  const param = searchParams.get(key);

  return param ? parseInt(param, 10) : defaultValue;
};

const NightskyCanvas = ({
  numStars = DEFAULT_NUM_STARS,
  starRadius = 2,
  starBrightnessCeiling = 70,
  starBrightnessFloor = 30,
  distort = 1,
  rotateX = 0,
  adjustStarsToWindowWidth = true,
  nebularClouds = true,
  twinkle = true,
}: Props) => {
  const [windowDimensions, setWindowDimensions] = useState<
    Record<string, number>
  >({ width: 0, height: 0 });

  // Get various params from the query string or use the default if not provided
  const searchParams = useSearchParams();

  numStars = getQueryParam(searchParams, "stars", numStars);
  starRadius = getQueryParam(searchParams, "radius", starRadius);
  starBrightnessCeiling = getQueryParam(
    searchParams,
    "ceiling",
    starBrightnessCeiling
  );
  starBrightnessFloor = getQueryParam(
    searchParams,
    "floor",
    starBrightnessFloor
  );
  distort = getQueryParam(searchParams, "distort", distort);
  rotateX = getQueryParam(searchParams, "rotateX", 0);

  if (adjustStarsToWindowWidth) {
    // If we're using the default, adjust the number of stars according to
    // window width

    // If we're in a narrow (ish) view, halve the number of stars
    if (windowDimensions.width < NARROW_WIDTH) {
      numStars = numStars / 2;
    }
  }
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // We store some references as mutable refs so we can update them without re-render:
  const starsRef = useRef<Star[]>([]);
  const nebulaCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Settings
  // This will be recalculated to canvas width, so store in a ref or recalc as needed
  const fadeZoneRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // If ref not set, do nothing

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ==== Initialization logic ====
    const init = () => {
      // Match canvas size to parent container
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width =
        rotateX === 0 ? parent.clientWidth : parent.clientWidth * 2;
      // Distort canvas
      canvas.height = parent.clientHeight * distort;
      // console.log("canvas.height", canvas.height);

      // Fade zone is some portion of canvas width
      fadeZoneRef.current = canvas.width * 0.3; // 30% of width

      // Generate star data
      starsRef.current = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * starRadius,
        baseBrightness:
          Math.random() * starBrightnessCeiling + starBrightnessFloor,
        brightness: 0,
        twinkleSpeed: Math.random() * 0.002,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      if (nebularClouds) {
        generateNebula();
      }
    };

    // ==== Nebula generation ====
    const generateNebula = () => {
      // Create an offscreen canvas for the nebula
      const nebCanvas = document.createElement("canvas");
      nebCanvas.width = canvas.width;
      nebCanvas.height = canvas.height;

      const nebCtx = nebCanvas.getContext("2d");
      if (!nebCtx) return;

      nebulaCanvasRef.current = nebCanvas;

      const nebulaColors = [
        "rgba(255, 0, 150, 0.2)",
        "rgba(0, 150, 255, 0.2)",
        "rgba(150, 255, 0, 0.2)",
      ];

      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 300 + 200;

        const gradient = nebCtx.createRadialGradient(x, y, 0, x, y, size);
        const color =
          nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        nebCtx.fillStyle = gradient;
        nebCtx.beginPath();
        nebCtx.arc(x, y, size, 0, Math.PI * 2);
        nebCtx.fill();
      }
    };

    // ==== Main draw function ====
    const drawStars = (timestamp: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebula
      const nebulaCanvas = nebulaCanvasRef.current;
      if (nebulaCanvas) {
        ctx.drawImage(nebulaCanvas, 0, 0);
      }

      // Draw twinkling stars
      starsRef.current.forEach((star) => {
        star.brightness =
          star.baseBrightness *
          (0.5 +
            0.5 * Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset));

        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness / 255})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Loop
      if (twinkle) {
        requestAnimationFrame(drawStars);
      }
    };

    // ==== Resize logic ====

    // Store the window dimensions so we can know if we really need to
    // reinitialize. On mobile, a lot of things can trigger resize that aren't a
    // real resize, like bouncing at the top or bottom of the page after
    // scrolling.
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = debounce(() => {
      if (
        window.innerWidth !== windowDimensions.width ||
        window.innerHeight !== windowDimensions.height
      ) {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        init();
      }
    }, 250);

    // Initialize and start
    init();
    requestAnimationFrame(drawStars);

    // Listen for resize
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    nebularClouds,
    numStars,
    windowDimensions.width,
    windowDimensions.height,
    distort,
    starRadius,
    starBrightnessCeiling,
    starBrightnessFloor,
    rotateX,
    twinkle,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        // Adjust style as needed to position behind children
        position: "absolute",
        top: 0,
        // left: 0,
        left: rotateX === 0 ? "0" : "-50%",
        width: rotateX === 0 ? "100%" : "200%",
        height: rotateX === 0 ? "100%" : "200%",
        pointerEvents: "none",
        zIndex: 0,
        transform: `rotateX(${rotateX}deg)`,
        transformOrigin: "top center",
      }}
    />
  );
};

export default NightskyCanvas;
