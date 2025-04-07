"use client";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const LinkToQrCode = ({ children }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("qrCode", "");

    const newUrl = `${pathname}?${params.toString()}`;
    window.location.href = newUrl;
  };

  return (
    <span
      onClick={handleClick}
      title="Get a QR Code for this URL"
      className="cursor-pointer"
    >
      {children}
    </span>
  );
};

export default LinkToQrCode;
