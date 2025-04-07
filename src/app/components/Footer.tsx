import React, { Suspense } from "react";
import Nightsky from "@/app/components/Nightsky";
import classnames from "classnames";
import Link from "next/link";
import LinkToQrCode from "@/app/components/LinkToQrCode";

const Footer = () => {
  return (
    <footer
      className={classnames([
        "bg-neutral",
        "text-neutral-content",
        "p-0",
        "border-t-1",
        "border-base-300",
      ])}
    >
      <Nightsky twinkle={false}>
        <div className="flex flex-col md:flex-row items-center">
          <p className="uppercase tracking-wider grow-1 mb-2 md:mb-0 text-sm md:text-lg">
            &copy;{" "}
            <Suspense>
              <LinkToQrCode>NOVA Nightsky Theater</LinkToQrCode>
            </Suspense>
          </p>
          <div className="grow-0 text-md btn btn-xs md:btn-sm btn-outline mr-5 mb-2 md:mb-0">
            <Link href="/contact">Contact Us</Link>
          </div>
          <p className="grow-0 text-xs link">
            <Link href="/venue">
              Falls Church Presbyterian Church
              <span className="hidden md:inline"> &ndash; Memorial Hall</span>
              <br />
              225 E Broad St, Falls Church, VA 22046
            </Link>
          </p>
        </div>
      </Nightsky>
    </footer>
  );
};

export default Footer;
