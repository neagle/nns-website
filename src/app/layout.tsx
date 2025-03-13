import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/Header";
import localFont from "next/font/local";

const dunbarLow = localFont({
  src: [
    {
      path: "../../public/fonts/dunbar-low/DunbarLow-regular.woff2",
      weight: "400",
    },
    {
      path: "../../public/fonts/dunbar-low/DunbarLow-bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-dunbar-low",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dunbarLow.variable} font-sans`}>
        <h1 className="font-serif">DEBUG!</h1>
        <Header />
        {children}
      </body>
    </html>
  );
}
