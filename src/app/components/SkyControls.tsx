"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import classnames from "classnames";
import { HelpCircle } from "lucide-react"; // import the icon from react-lucide

function NightskyControls() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [stars, setStars] = useState<number>(
    parseParam(searchParams, "stars", 500)
  );
  const [radius, setRadius] = useState<number>(
    parseParam(searchParams, "radius", 2)
  );
  const [ceiling, setCeiling] = useState<number>(
    parseParam(searchParams, "ceiling", 70)
  );
  const [floor, setFloor] = useState<number>(
    parseParam(searchParams, "floor", 30)
  );
  const [distort, setDistort] = useState<number>(
    parseParam(searchParams, "distort", 1)
  );
  const [rotateX, setRotateX] = useState<number>(
    parseParam(searchParams, "rotateX", 0)
  );

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // on mount, listen for fullscreen changes:
  useEffect(() => {
    function handleFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  // If we’re in fullscreen, hide the control panel entirely:
  if (isFullscreen) {
    return null;
  }

  // Helper to set a single param in the URL:
  function updateParam(key: string, value: string) {
    // `searchParams` is immutable, so create a new URLSearchParams
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(key, value);

    // Replace the route with the new query:
    router.replace(`?${newParams.toString()}`);
  }

  const handleStarsChange = (val: number) => {
    setStars(val);
    updateParam("stars", String(val));
  };
  const handleRadiusChange = (val: number) => {
    setRadius(val);
    updateParam("radius", String(val));
  };
  const handleCeilingChange = (val: number) => {
    setCeiling(val);
    updateParam("ceiling", String(val));
  };
  const handleFloorChange = (val: number) => {
    setFloor(val);
    updateParam("floor", String(val));
  };
  const handleDistortChange = (val: number) => {
    setDistort(val);
    updateParam("distort", String(val));
  };
  const handleRotateChange = (val: number) => {
    setRotateX(val);
    updateParam("rotateX", String(val));
  };

  return (
    <div
      className={classnames([
        "absolute",
        "top-3",
        "right-3",
        "w-[220px]",
        "bg-base-100/50",
        "p-4",
        "rounded",
        "shadow",
        "z-50",
        "border",
        "border-neutral",
        "text-neutral-content",
        "shadow-md",
        "shadow-primary",
      ])}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Example headings if desired: */}
      {/* <h2 className="text-lg font-bold mb-2">Nightsky Controls</h2> */}

      {/* STARS */}
      <div className="form-control mb-2">
        <label className="label flex justify-start items-center gap-1">
          <span className="label-text text-neutral-content text-xs">Stars</span>
          <div
            className="tooltip tooltip-left"
            data-tip="Adjust total number of stars in the sky"
          >
            <HelpCircle size={16} />
          </div>
        </label>
        <input
          type="number"
          className="input input-bordered input-xs"
          value={stars}
          step={500}
          min={0}
          max={100000}
          onChange={(e) => handleStarsChange(Number(e.target.value))}
        />
      </div>

      {/* STAR RADIUS */}
      <div className="form-control mb-2">
        <label className="label flex justify-start items-center gap-1">
          <span className="label-text text-neutral-content text-xs">
            Star Radius
          </span>
          <div
            className="tooltip tooltip-left"
            data-tip="Maximum size of each star"
          >
            <HelpCircle size={16} />
          </div>
        </label>
        <input
          type="number"
          className="input input-bordered input-xs"
          value={radius}
          min={1}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
        />
      </div>

      {/* BRIGHTNESS CEILING */}
      <div className="form-control mb-2">
        <label className="label flex justify-start items-center gap-1">
          <span className="label-text text-neutral-content text-xs">
            Ceiling
          </span>
          <div
            className="tooltip tooltip-left"
            data-tip="Max brightness of each star (0-255)"
          >
            <HelpCircle size={16} />
          </div>
        </label>
        <input
          type="number"
          className="input input-bordered input-xs"
          value={ceiling}
          step={10}
          onChange={(e) => handleCeilingChange(Number(e.target.value))}
        />
      </div>

      {/* BRIGHTNESS FLOOR */}
      <div className="form-control mb-2">
        <label className="label flex justify-start items-center gap-1">
          <span className="label-text text-neutral-content text-xs">Floor</span>
          <div
            className="tooltip tooltip-left"
            data-tip="Minimum brightness of each star"
          >
            <HelpCircle size={16} />
          </div>
        </label>
        <input
          type="number"
          className="input input-bordered input-xs"
          value={floor}
          step={10}
          onChange={(e) => handleFloorChange(Number(e.target.value))}
        />
      </div>

      {/* DISTORT */}
      <div className="form-control mb-2">
        <label className="label flex justify-start items-center gap-1">
          <span className="label-text text-neutral-content text-xs">
            Distort
          </span>
          <div
            className="tooltip tooltip-left"
            data-tip="Vertical stretch factor. 1 = no distortion, higher means more vertical compression"
          >
            <HelpCircle size={16} />
          </div>
        </label>
        <input
          type="number"
          className="input input-bordered input-xs"
          value={distort}
          min={1}
          step={1}
          onChange={(e) => handleDistortChange(Number(e.target.value))}
        />
      </div>

      {/* ROTATE X */}
      <div className="form-control mb-2">
        <label className="label flex justify-start items-center gap-1">
          <span className="label-text text-neutral-content text-xs">
            RotateX
          </span>
          <div
            className="tooltip tooltip-left"
            data-tip="Rotate the canvas in 3D space around the X axis to increase distortion"
          >
            <HelpCircle size={16} />
          </div>
        </label>
        <input
          type="range"
          min="-50"
          max="0"
          value={rotateX}
          className="range range-xs"
          onChange={(e) => handleRotateChange(Number(e.target.value))}
        />
        <div className="mt-1 text-neutral-content text-xs">
          Value: {rotateX}°
        </div>
      </div>
    </div>
  );
}

export default NightskyControls;

/**
 * Safely parse a searchParam to a number. If missing, use defaultValue.
 */
function parseParam(
  searchParams: ReturnType<typeof useSearchParams>,
  key: string,
  defaultValue: number
): number {
  const raw = searchParams.get(key);
  if (!raw) return defaultValue;
  const parsed = parseFloat(raw);
  if (Number.isNaN(parsed)) return defaultValue;
  return parsed;
}
