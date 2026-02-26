export const revalidate = 60;

import { Suspense } from "react";
import FeaturedShow from "@/app/components/FeaturedShow";
import OpenAuditions from "@/app/components/OpenAuditions";

export default function Home() {
  return (
    <div className="bg-base-100 h-full">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="loading loading-spinner loading-xl text-primary"></div>
          </div>
        }
      >
        <OpenAuditions />
        <FeaturedShow />
      </Suspense>
    </div>
  );
}
