import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl md:text-4xl mb-4">Success!</h1>
      <p className="text-xl leading-tight">
        Thanks for reaching out; we&rsquo;ll get back to you as soon as we can.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
};

export default Page;
