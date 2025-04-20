import React from "react";
import classnames from "classnames";

const CenterSpinner = () => {
  return (
    <div
      className={classnames([
        "loading",
        "loading-spinner",
        "loading-lg",
        "text-primary",
        "absolute",
        "left-1/2",
        "top-1/2",
        "-translate-x-1/2",
        "-translate-y-1/2",
      ])}
    />
  );
};

export default CenterSpinner;
