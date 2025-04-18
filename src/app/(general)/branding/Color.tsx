import React, { useState } from "react";
import classnames from "classnames";
// This one has CMYK
import convert from "color-convert";
// This one has OKLCH
import { convert as converter, textColor } from "colorizr";
import { CopyCheck } from "lucide-react";

interface Props {
  hex: string;
  format: string;
  className?: string;
}

const convertedColor = (hex: string, format: string) => {
  if (format === "HEX") {
    return hex;
  } else if (format === "CMYK") {
    return convert.hex.cmyk(hex).join(", ");
  } else if (format === "RGB") {
    return convert.hex.rgb(hex).join(", ");
  } else if (format === "HSL") {
    const [h, s, l] = convert.hex.hsl(hex);
    return `hsl(${h}, ${s}%, ${l}%)`;
  } else if (format === "OKLCH") {
    return converter("#" + hex, "oklch");
  } else {
    console.error("Unrecognized format", format);
    return hex;
  }
};

const Color = ({ hex, format, className = "" }: Props) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const converted = convertedColor(hex, format);
  return (
    <div
      className={classnames(
        [
          "rounded-lg",
          "flex",
          "md:aspect-square",
          "min-h-10",
          "cursor-pointer",
          "hover:scale-110",
          "transition-all",
          "group",
          "relative",
        ],
        className
      )}
      onMouseLeave={() => {
        if (isFlipped) {
          setIsFlipped(() => false);
        }
      }}
    >
      <div
        className={classnames(
          {
            "rotate-y-180": isFlipped,
          },
          [
            "absolute",
            "top-0",
            "right-0",
            "bottom-0",
            "left-0",
            "duration-500",
            "cursor-pointer",
            "rounded-lg",
            "p-4",
            "transition-all",
            "transform-3d",
          ]
        )}
        style={{ backgroundColor: "#" + hex, color: textColor("#" + hex) }}
        onClick={() =>
          setIsFlipped((prev) => {
            if (!prev) {
              const clipboardItem = new ClipboardItem({
                "text/plain": converted,
              });
              navigator.clipboard.write([clipboardItem]);
            }
            return !prev;
          })
        }
      >
        <div
          className={classnames([
            "text-[12px]",
            "font-mono",
            "font-bold",
            "p-4",
            "opacity-50",
            "transition-opacity",
            "absolute",
            "top-0",
            "right-0",
            "bottom-0",
            "left-0",
            "flex",
            "justify-center",
            "items-center",
            "transform-3d",
            "backface-hidden",
          ])}
        >
          {converted}
        </div>
        <div
          className={classnames([
            "absolute",
            "top-0",
            "right-0",
            "bottom-0",
            "left-0",
            "flex",
            "justify-center",
            "items-center",
            "transform-3d",
            "backface-hidden",
            "rotate-y-180",
            "text-xs",
            "opacity-50",
          ])}
        >
          <div className="flex md:flex-col items-center gap-2 p-4">
            <CopyCheck className="mx-auto" />
            <div className="text-[12px] text-center">Copied to Clipboard</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Color;
