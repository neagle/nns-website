import type { Metadata } from "next";
import React from "react";
import { Suspense } from "react";
import classnames from "classnames";
// import Nightsky from "@/app/components/Nightsky";
import FullscreenWrapper from "@/app/components/FullscreenWrapper";
import Sky from "@/app/components/Sky";
import Fireflies from "@/app/components/Fireflies";

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
            className={classnames(["p-4", "relative", "bg-gray-900", "h-full"])}
          >
            <Sky
              numStars={2000}
              starRadius={4}
              adjustStarsToWindowWidth={false}
              nebularClouds={true}
              clouds={false}
            />
            {/* <Fireflies /> */}
          </div>
        </Suspense>
        {/* <Nightsky
          adjustStarsToWindowWidth={false}
          nebularClouds={true}
          clouds={false}
        /> */}
      </FullscreenWrapper>
    </div>
  );
};

export default Page;
