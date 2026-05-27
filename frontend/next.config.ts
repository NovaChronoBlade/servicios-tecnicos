import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "files.123inventatuweb.com",
      },

      {
        protocol: "https",
        hostname: "constructor.lacuarta.com",
      },
    ],
  },
};

export default nextConfig;