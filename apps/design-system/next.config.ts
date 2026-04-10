import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "ichef.bbc.co.uk" },
      { protocol: "https", hostname: "www.carebears.com" },
    ],
  },
};

export default nextConfig;
