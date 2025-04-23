"use client";

/** TODO
 * - [ ] Add a way to change the background color
 * - [ ] Add a way to change the text color
 * - [ ] Make the filename reflect the settings
 * - [ ] Add a button to regenerate the nightsky
 * - [ ] Add a button to copy the image to the clipboard
 * - [ ] Create controls to justify/align logo
 */

import React, { useRef } from "react";
import Logo from "@/app/components/Logo";
import Nightsky from "@/app/components/Nightsky";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { useLocalStorage as useLocalStorageOriginal } from "usehooks-ts";
import classnames from "classnames";

const useLocalStorage = <T,>(key: string, initialValue: T | (() => T)) => {
  const [storedValue, setStoredValue] = useLocalStorageOriginal(
    key,
    initialValue,
    {
      initializeWithValue: false,
    }
  );
  return [storedValue, setStoredValue] as [
    T,
    React.Dispatch<React.SetStateAction<T>>
  ];
};

const fileTypes = ["png", "jpg", "svg"];

const LogoGenerator = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useLocalStorage("logo-width", 600);
  const [height, setHeight] = useLocalStorage("logo-height", 300);
  // const [backgroundType, setBackgroundType] = useLocalStorage(
  //   "logo-background-type",
  //   "nightsky"
  // );
  // const [alignLogo, setAlignLogo] = useLocalStorage("logo-align-logo", "top");
  // const [justifyLogo, setJustifyLogo] = useLocalStorage(
  //   "logo-justify-logo",
  //   "left"
  // );

  const [fileType, setFileType] = useLocalStorage("logo-file-type", "png");
  const [fontSize, setFontSize] = useLocalStorage("logo-font-size", 48);

  const handleSave = async () => {
    if (logoRef.current) {
      let dataUrl;
      if (fileType === "png") {
        dataUrl = await toPng(logoRef.current, { pixelRatio: 1 });
      } else if (fileType === "jpg") {
        dataUrl = await toJpeg(logoRef.current, { pixelRatio: 1 });
      } else if (fileType === "svg") {
        dataUrl = await toSvg(logoRef.current);
      }

      if (dataUrl) {
        const link = document.createElement("a");
        link.download = `logo.${fileType}`;
        link.href = dataUrl;
        link.click();
      }
    }
  };

  return (
    <div>
      <h1>Logo Generator</h1>
      <div className="flex gap-8">
        <label className="input">
          Width
          <input
            type="text"
            className="grow"
            // placeholder="600"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </label>
        <label className="input">
          Height
          <input
            type="text"
            className="grow"
            placeholder="300"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
        <label>
          <label className="input">
            Font Size
            <input
              type="text"
              className="grow"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
            <span className="">px</span>
          </label>
          <input
            type="range"
            min={0}
            max={200}
            value={fontSize}
            className="range range-xs w-[200px]"
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>
      </div>
      <div
        className="outline-10 outline-gray-500 my-8 relative"
        style={{ width }}
      >
        <div id="logo-generator" style={{ width, height }} ref={logoRef}>
          <Nightsky
            className={classnames([
              // "[&_div]:outline-10",
              // "[&_div]:outline-red-500",
              "[&_div]:w-full",
              "[&_div]:h-full",
              "[&_div]:flex",
              "[&_div]:justify-end",
              "[&_div]:items-end",
              "[&_h1]:m-0",
              "[&_h1]:inline-block",
              "[&_h1]:text-right",
            ])}
          >
            <Logo
              fontSize={fontSize}
              disableInteractions={true}
              breakWords={true}
            />
          </Nightsky>
        </div>
      </div>
      <div className="flex gap-8">
        <label className="input">
          File Type
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="grow"
          >
            {fileTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <button className="btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default LogoGenerator;
