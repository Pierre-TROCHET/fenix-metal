import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore les erreurs ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore les erreurs TypeScript pendant le build  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shuqyrr5zlkuxpcp.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
