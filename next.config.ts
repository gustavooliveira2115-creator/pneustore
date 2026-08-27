import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.verumcommerce.com.br",
      },
    ],
  },
};

export default nextConfig;
