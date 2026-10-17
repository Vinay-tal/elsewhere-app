import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow access from local network IPs during development */
  allowedDevOrigins: [
    '192.168.0.24',
    '192.168.*',
    '10.*',
    '*.local',
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
