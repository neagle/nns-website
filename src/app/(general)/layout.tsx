import type { Metadata } from "next";
import "../globals.css";
import localFont from "next/font/local";
import React, { Suspense } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import QRCode from "@/app/components/QRCode";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  title: {
    template: "%s | NOVA Nightsky Theater",
    default: "Community Theater | NOVA Nightsky Theater | Falls Church",
  },
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
        <NextTopLoader color="var(--color-primary)" />

        <Header />
        <Suspense>
          {/* Every page on the site can have a QR code if the query string
          `qrCode` is present. This makes it possible for NOVA Nightsky staff to
          use a link to any page for signs/flyers/whatever. */}
          <QRCode />
        </Suspense>
        <main className="flex-grow bg-base-100">{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
