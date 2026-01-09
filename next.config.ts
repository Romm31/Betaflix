import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.animekita.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'animekita.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'otakudesu.best',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
