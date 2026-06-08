import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["103.150.197.225"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
