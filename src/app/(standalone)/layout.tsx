import type { Metadata } from "next";
import "../globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "NOVA Nightsky Theater",
  description:
    "NOVA Nightsky Theater is community theater group in Falls Church VA performing outdoors and indoors in unconventional places.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`font-sans h-full flex flex-col`}>
        <main className="flex-grow bg-base-100">{children}</main>
      </body>
    </html>
  );
}
