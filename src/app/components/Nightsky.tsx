import React from "react";
import { Suspense } from "react";
import classnames from "classnames";
import Sky from "@/app/components/Sky";
import Fireflies from "@/app/components/Fireflies";

type Props = {
  children?: React.ReactNode;
  className?: string;
  fireflies?: boolean;
  nebularClouds?: boolean;
  twinkle?: boolean;
};

const Nightsky = ({
  children,
  className = "",
  fireflies = false,
  nebularClouds = true,
  twinkle = true,
}: Props) => {
  return (
    <Suspense fallback={<div></div>}>
      <div
        className={classnames(className, [
          "p-4",
          "lg:p-6",
          "xl:p-8",
          "relative",
          "bg-gray-900",
          "h-full",
        ])}
      >
        <Sky numStars={2000} nebularClouds={nebularClouds} twinkle={twinkle} />
        <div className="relative">{children}</div>
        {fireflies && <Fireflies />}
      </div>
    </Suspense>
  );
};

export default Nightsky;
