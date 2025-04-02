import type { Metadata } from "next";
import React from "react";
import { Suspense } from "react";
import classnames from "classnames";
import FullscreenWrapper from "@/app/components/FullscreenWrapper";
import Sky from "@/app/components/Sky";
import SkyControls from "@/app/components/SkyControls";

export const metadata: Metadata = {
  title: "Starry Night Sky",
  description:
    "A full page of a starry night sky. Change the number of stars by changing the `stars` query param.",
};

const Page = () => {
  return (
    <div className="h-full relative">
      <FullscreenWrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <div
            className={classnames([
              "p-4",
              "relative",
              "bg-gray-900",
              "h-full",
              "perspective-[1000px]",
              "transform-3d",
              "overflow-hidden",
            ])}
          >
            <Sky
              numStars={2000}
              starRadius={4}
              adjustStarsToWindowWidth={false}
              nebularClouds={true}
              clouds={false}
            />
            <SkyControls />
          </div>
        </Suspense>
      </FullscreenWrapper>
    </div>
  );
};

export default Page;
