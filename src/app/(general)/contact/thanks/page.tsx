import React from "react";
import Link from "next/link";
import AnimatedArrow from "./AnimatedArrow";

const Page = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl md:text-4xl mb-4 flex items-center">
        Sent <AnimatedArrow className="ml-4 mt-1" />
      </h1>
      <p className="text-xl leading-tight">
        Thanks for reaching out! We&rsquo;ll get back to you as soon as we can.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
};

export default Page;
