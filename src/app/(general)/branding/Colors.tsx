"use client";

import React from "react";
import { useLocalStorage } from "usehooks-ts";
import Color from "./Color";

const Colors = () => {
  const [format, setFormat, _removeFormat] = useLocalStorage("format", "HEX", {
    initializeWithValue: false,
  });
  // const [format, setFormat] = useState("HEX");
  const colors = ["FDBF5D", "151843", "636260", "c4bdad", "ffffff"];
  if (!format) {
    return;
  } else {
    return (
      <>
        <h2>Colors</h2>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Format</legend>
          <select
            value={format}
            className="select select-xs mb-4 max-w-1/4"
            onChange={(event) => {
              setFormat(event.target.value);
              console.log(event.target.value);
            }}
          >
            <option>HEX</option>
            <option>CMYK</option>
            <option>RGB</option>
            <option>HSL</option>
            <option>OKLCH</option>
          </select>
        </fieldset>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {colors.map((color) => (
            <Color key={color} hex={color} format={format} className="flex-1" />
          ))}
        </div>
      </>
    );
  }
};

export default Colors;
