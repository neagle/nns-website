"use client";

/** TODO
 * - [ ] Add a way to change the background color
 * - [ ] Add a way to change the text color
 * - [ ] Make the filename reflect the settings
 * - [ ] Add a button to regenerate the nightsky
 * - [ ] Add a button to copy the image to the clipboard
 * - [ ] Create controls to justify/align logo
 */

import React, { useEffect, useRef } from "react";
import Logo from "@/app/components/Logo";
import Nightsky from "@/app/components/Nightsky";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { useLocalStorage as useLocalStorageOriginal } from "usehooks-ts";
import classnames from "classnames";
import {
  TextAlignEnd,
  TextAlignCenter,
  TextAlignStart,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
} from "lucide-react";

const useLocalStorage = <T,>(key: string, initialValue: T | (() => T)) => {
  const [storedValue, setStoredValue] = useLocalStorageOriginal(
    key,
    initialValue,
    {
      initializeWithValue: false,
    },
  );
  return [storedValue, setStoredValue] as [
    T,
    React.Dispatch<React.SetStateAction<T>>,
  ];
};

const fileTypes = ["png", "jpg", "svg"] as const;

const sizePresets = [
  {
    id: "facebook-cover",
    label: "Facebook Cover Photo",
    width: 1640,
    height: 720,
  },
  {
    id: "profile-avatar",
    label: "Profile Avatar",
    width: 1080,
    height: 1080,
  },
  {
    id: "instagram-post",
    label: "Instagram Post",
    width: 1080,
    height: 1350,
  },
] as const;

type FileType = (typeof fileTypes)[number];

type LogoGeneratorSettings = {
  width: number;
  height: number;
  fileType: FileType;
  fontSize: number;
  showFireflies: boolean;
  justifyLogo: "start" | "center" | "end";
  verticalAlignLogo: "start" | "center" | "end";
  breakWords: boolean;
};

const defaultSettings: LogoGeneratorSettings = {
  width: 600,
  height: 300,
  fileType: "png",
  fontSize: 48,
  showFireflies: false,
  justifyLogo: "start",
  verticalAlignLogo: "start",
  breakWords: false,
};

const LogoGenerator = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useLocalStorage(
    "logo-generator-settings",
    defaultSettings,
  );

  const updateSetting = <K extends keyof LogoGeneratorSettings>(
    key: K,
    value: LogoGeneratorSettings[K],
  ) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  const {
    width,
    height,
    fileType,
    fontSize,
    showFireflies,
    justifyLogo,
    verticalAlignLogo,
    breakWords,
  } = settings;

  const activePresetId =
    sizePresets.find(
      (preset) => preset.width === width && preset.height === height,
    )?.id ?? "";
  // const [backgroundType, setBackgroundType] = useLocalStorage(
  //   "logo-background-type",
  //   "nightsky"
  // );
  // const [alignLogo, setAlignLogo] = useLocalStorage("logo-align-logo", "top");
  // const [justifyLogo, setJustifyLogo] = useLocalStorage(
  //   "logo-justify-logo",
  //   "left"
  // );
  useEffect(() => {
    // If fileType is not in fileTypes, set it to the first item
    if (!fileTypes.includes(fileType)) {
      updateSetting("fileType", fileTypes[0]);
    }
  }, [fileType]);

  const handleSave = async () => {
    console.log("save", fileType);
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
      <div className="w-full flex gap-8">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Preset Sizes</legend>
          <select
            value={activePresetId}
            onChange={(e) => {
              const selectedPreset = sizePresets.find(
                (preset) => preset.id === e.target.value,
              );

              if (!selectedPreset) {
                return;
              }

              setSettings((currentSettings) => ({
                ...currentSettings,
                width: selectedPreset.width,
                height: selectedPreset.height,
              }));
            }}
            className="select select-xs"
          >
            <option value="">Custom Size</option>
            {sizePresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label} ({preset.width} × {preset.height})
              </option>
            ))}
          </select>
        </fieldset>
        <label className="input input-xs">
          Width
          <input
            type="text"
            className="grow"
            // placeholder="600"
            value={width}
            onChange={(e) => updateSetting("width", Number(e.target.value))}
          />
        </label>
        <label className="input input-xs">
          Height
          <input
            type="text"
            className="grow"
            placeholder="300"
            value={height}
            onChange={(e) => updateSetting("height", Number(e.target.value))}
          />
        </label>
      </div>
      <div className="py-4">
        <label>
          <label className="input input-xs">
            Font Size
            <input
              type="text"
              className="grow"
              value={fontSize}
              onChange={(e) =>
                updateSetting("fontSize", Number(e.target.value))
              }
            />
            <span className="">px</span>
          </label>
          <input
            type="range"
            min={0}
            max={200}
            value={fontSize}
            className="range range-xs w-[200px] ml-4"
            onChange={(e) => updateSetting("fontSize", Number(e.target.value))}
          />
        </label>
        <label className="label pt-4">
          <input
            type="checkbox"
            checked={showFireflies}
            onChange={(e) => updateSetting("showFireflies", e.target.checked)}
            className="toggle toggle-xs"
          />
          Show Fireflies
        </label>
        <label className="label pt-4 ml-4">
          <input
            type="checkbox"
            checked={breakWords}
            onChange={(e) => updateSetting("breakWords", e.target.checked)}
            className="toggle toggle-xs"
          />
          Break Words
        </label>
      </div>

      <div>
        <div className="join">
          <button
            className={classnames(["btn", "btn-xs", "join-item"], {
              "btn-active": justifyLogo === "start",
            })}
            onClick={() => updateSetting("justifyLogo", "start")}
          >
            <TextAlignStart />
          </button>
          <button
            className={classnames(["btn", "btn-xs", "join-item"], {
              "btn-active": justifyLogo === "center",
            })}
            onClick={() => updateSetting("justifyLogo", "center")}
          >
            <TextAlignCenter />
          </button>
          <button
            className={classnames(["btn", "btn-xs", "join-item"], {
              "btn-active": justifyLogo === "end",
            })}
            onClick={() => updateSetting("justifyLogo", "end")}
          >
            <TextAlignEnd />
          </button>
        </div>

        <div className="join ml-2">
          <button
            className={classnames(["btn", "btn-xs", "join-item"], {
              "btn-active": verticalAlignLogo === "start",
            })}
            onClick={() => updateSetting("verticalAlignLogo", "start")}
          >
            <AlignVerticalJustifyStart />
          </button>
          <button
            className={classnames(["btn", "btn-xs", "join-item"], {
              "btn-active": verticalAlignLogo === "center",
            })}
            onClick={() => updateSetting("verticalAlignLogo", "center")}
          >
            <AlignVerticalJustifyCenter />
          </button>
          <button
            className={classnames(["btn", "btn-xs", "join-item"], {
              "btn-active": verticalAlignLogo === "end",
            })}
            onClick={() => updateSetting("verticalAlignLogo", "end")}
          >
            <AlignVerticalJustifyEnd />
          </button>
        </div>
      </div>

      {/* <pre>{JSON.stringify(settings, null, 2)}</pre> */}
      <div
        className="outline-10 outline-gray-500 my-8 relative"
        style={{ width }}
      >
        <div id="logo-generator" style={{ width, height }} ref={logoRef}>
          <Nightsky
            fireflies={showFireflies}
            className={classnames(
              [
                "[&_div]:w-full",
                "[&_div]:h-full",
                "[&_div]:flex",
                "[&_div]:justify-end",
                // "[&_div]:items-end",
                "[&_h1]:m-0",
                // "[&_h1]:inline-block",
                // "[&_h1]:text-right",
              ],
              {
                "[&_div]:items-start": verticalAlignLogo === "start",
                "[&_div]:items-center": verticalAlignLogo === "center",
                "[&_div]:items-end": verticalAlignLogo === "end",
              },
            )}
          >
            <Logo
              fontSize={fontSize}
              disableInteractions={true}
              breakWords={breakWords}
              className={classnames(
                {
                  "text-start": justifyLogo === "start",
                  "text-center": justifyLogo === "center",
                  "text-end": justifyLogo === "end",
                },
                ["w-full"],
              )}
            />
          </Nightsky>
        </div>
      </div>
      <div className="flex gap-8">
        <label className="input">
          File Type
          <select
            value={fileType}
            onChange={(e) =>
              updateSetting("fileType", e.target.value as FileType)
            }
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
