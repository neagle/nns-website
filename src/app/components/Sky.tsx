"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { debounce } from "@/app/utils";
import { useSearchParams } from "next/navigation";

type Props = {
  numStars?: number;
  starRadius?: number;
  starBrightnessCeiling?: number;
  starBrightnessFloor?: number;
  nebularClouds?: boolean;
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
  nebularClouds = true,
  twinkle = true,
}: Props) => {
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // We store some references as mutable refs so we can update them without re-render:
  const starsRef = useRef<Star[]>([]);
  const nebulaCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateStars = useCallback(() => {
    if (!canvasRef.current) return [];

    const { width, height } = canvasRef.current;
    if (!width || !height) return [];

    return Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * starRadius,
      baseBrightness:
        Math.random() * starBrightnessCeiling + starBrightnessFloor,
      brightness: 0,
      twinkleSpeed: Math.random() * 0.002,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, [
    canvasRef,
    numStars,
    starRadius,
    starBrightnessCeiling,
    starBrightnessFloor,
  ]);

  // ==== Nebula generation ====
  const generateNebula = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

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
  }, [canvasRef]);

  // ==== Main draw function ====
  const drawStars = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
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
    },
    [twinkle]
  );

  // ==== Resize observer ====
  useEffect(() => {
    if (!canvasRef.current) return;
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        // Resize only if the size has changed
        if (
          canvas.width === parent.clientWidth &&
          canvas.height === parent.clientHeight
        ) {
          return;
        }

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;

        starsRef.current = generateStars();
        if (nebularClouds) {
          generateNebula();
        }
        requestAnimationFrame(drawStars);
      }, 250)
    );

    resizeObserver.observe(canvasRef.current.parentElement!);

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasRef, generateStars, generateNebula, nebularClouds, drawStars]);

  // Settings

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

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      // Generate star data
      starsRef.current = generateStars();

      if (nebularClouds) {
        generateNebula();
      }
    };

    // Initialize and start
    init();
    requestAnimationFrame(drawStars);

    return () => {
      // cleanup
    };
  }, [
    generateNebula,
    generateStars,
    nebularClouds,
    numStars,
    starRadius,
    starBrightnessCeiling,
    starBrightnessFloor,
    twinkle,
    drawStars,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default NightskyCanvas;
