import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    // All project media is downloaded locally into /public/media by
    // `npm run fetch:media`, so no remotePatterns are needed. If you
    // ever point the manifest at a CDN, allow the host here:
    // remotePatterns: [{ protocol: 'https', hostname: 'images.example.com' }],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
