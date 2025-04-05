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
  clouds?: boolean;
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
  clouds = false,
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
  const cloudCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // “Global” animation variables
  const cloudOffsetRef = useRef<number>(0);

  // Settings
  const CLOUD_SPEED = 0.9;
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
      if (clouds) {
        generateClouds();
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

    // ==== Cloud generation ====
    const generateClouds = () => {
      // Create an offscreen canvas for clouds
      const cldCanvas = document.createElement("canvas");
      // Width is 2 * canvas.width for the horizontal scroll effect
      cldCanvas.width = canvas.width * 2;
      cldCanvas.height = canvas.height;

      const cldCtx = cldCanvas.getContext("2d");
      if (!cldCtx) return;

      cloudCanvasRef.current = cldCanvas;

      const imageData = cldCtx.createImageData(
        cldCanvas.width,
        cldCanvas.height
      );
      const data = imageData.data;

      for (let y = 0; y < cldCanvas.height; y++) {
        for (let x = 0; x < cldCanvas.width; x++) {
          // “Perlin-like” noise, could be replaced with real Perlin if desired
          const noise = (Math.sin(x * 0.003) + Math.sin(y * 0.005)) * 128 + 128;

          // Only highlight the top range as clouds
          const alpha = noise > 160 ? (noise - 160) / 95 : 0;

          // Edge fade effect
          const fadeEdge = Math.min(1, (y / cldCanvas.height) * 2);
          const edgeFade = Math.min(
            x / (cldCanvas.width * 0.15),
            (cldCanvas.width - x) / (cldCanvas.width * 0.15)
          );

          const finalAlpha = alpha * fadeEdge * edgeFade * 0.2;

          const index = (y * cldCanvas.width + x) * 4;
          data[index] = 255;
          data[index + 1] = 255;
          data[index + 2] = 255;
          data[index + 3] = finalAlpha * 255;
        }
      }

      cldCtx.putImageData(imageData, 0, 0);
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

      // Draw clouds
      drawClouds();

      // Loop
      if (twinkle) {
        requestAnimationFrame(drawStars);
      }
    };

    // ==== Draw clouds ====
    const drawClouds = () => {
      if (!cloudCanvasRef.current) return;

      // Move offset
      cloudOffsetRef.current += CLOUD_SPEED;

      // Calculate fade opacity based on how close we are to resetting
      let fadeOpacity = 1;
      const fadeZone = fadeZoneRef.current;

      if (cloudOffsetRef.current >= canvas.width - fadeZone) {
        // fade out as it nears the reset point
        fadeOpacity = (canvas.width - cloudOffsetRef.current) / fadeZone;
      } else if (cloudOffsetRef.current < fadeZone) {
        // fade back in after reset
        fadeOpacity = Math.min(1, cloudOffsetRef.current / fadeZone);
      }

      // fully transparent right before reset
      if (cloudOffsetRef.current >= canvas.width - 1) {
        fadeOpacity = 0;
      }

      // reset logic
      if (cloudOffsetRef.current >= canvas.width) {
        cloudOffsetRef.current = 0;
        fadeOpacity = 0;
      }

      // Draw cloud canvas twice to create looping effect
      ctx.globalAlpha = 0.1 * fadeOpacity;
      ctx.drawImage(
        cloudCanvasRef.current,
        cloudOffsetRef.current - canvas.width,
        0
      );
      ctx.drawImage(cloudCanvasRef.current, cloudOffsetRef.current, 0);
      ctx.globalAlpha = 1;
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
    clouds,
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
  // console.log("rotateX", rotateX, rotateX === 0);

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
