import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.nahancafe.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.nahancafe.ir",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
