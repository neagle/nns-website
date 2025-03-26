import type { Metadata } from "next";
import React from "react";
import Nightsky from "@/app/components/Nightsky";
import FullscreenWrapper from "@/app/components/FullscreenWrapper";

export const metadata: Metadata = {
  title: "Starry Night Sky",
  description:
    "A full page of a starry night sky. Change the number of stars by changing the `stars` query param.",
};

const Page = () => {
  return (
    <div className="h-full relative">
      <FullscreenWrapper>
        <Nightsky nebularClouds={false} clouds={false} />
      </FullscreenWrapper>
    </div>
  );
};

export default Page;
