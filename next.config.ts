import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Для GitHub Pages — static export
  output: "export",
  basePath: "/banena",
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
