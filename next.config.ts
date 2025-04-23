import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        // Serve up all SVGs with an .svg extension
        source: "/svg/:path*.svg",
        destination: "/svg/:path*",
      },
    ];
  },
};

export default nextConfig;
