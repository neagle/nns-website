import type { Metadata } from "next";
import "../globals.css";
import localFont from "next/font/local";
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const dunbarLow = localFont({
  src: [
    {
      path: "../../../public/fonts/dunbar-low/DunbarLow-Regular.woff2",
      weight: "400",
    },
    {
      path: "../../../public/fonts/dunbar-low/DunbarLow-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-dunbar-low",
});

const noah = localFont({
  src: [
    {
      path: "../../../public/fonts/noah/noah-regular.woff",
      weight: "400",
    },
    {
      path: "../../../public/fonts/noah/noah-regularitalic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../public/fonts/noah/noah-bold.woff",
      weight: "700",
    },
    {
      path: "../../../public/fonts/noah/noah-bolditalic.woff",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-noah",
});

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
      <body
        className={`${dunbarLow.variable} ${noah.variable} font-sans h-full flex flex-col`}
      >
        <Header />
        <main className="flex-grow bg-base-100">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
