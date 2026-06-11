import type { NextConfig } from "next";

const wpHostname = (() => {
  try {
    return new URL(
      process.env.WP_SITE_URL ?? "https://api.nahancafe.ir",
    ).hostname;
  } catch {
    return "nahancafe.ir";
  }
})();

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wpHostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.api.nahancafe.ir",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
