import React from "react";
import Nightsky from "@/app/components/Nightsky";
import FullscreenWrapper from "@/app/components/FullscreenWrapper";

const Page = () => {
  return (
    <div className="h-full relative">
      <FullscreenWrapper>
        <Nightsky />
      </FullscreenWrapper>
    </div>
  );
};

export default Page;
