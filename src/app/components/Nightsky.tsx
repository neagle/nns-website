import React from "react";
import { Suspense } from "react";
import classnames from "classnames";
import Sky from "@/app/components/Sky";
import Fireflies from "@/app/components/Fireflies";

type Props = {
  children?: React.ReactNode;
  className?: string;
  fireflies?: boolean;
};

const Nightsky = ({ children, className = "", fireflies = false }: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={classnames(className, [
          "p-4",
          "relative",
          "bg-gray-900",
          "h-full",
        ])}
      >
        <Sky numStars={2000} nebularClouds={false} clouds={false} />
        <div className="relative">{children}</div>
        {fireflies && <Fireflies />}
      </div>
    </Suspense>
  );
};

export default Nightsky;
