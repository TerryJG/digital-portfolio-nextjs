import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tjg-portfolio-db.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
