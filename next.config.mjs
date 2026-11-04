/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*.JPG',
        destination: '/images/:path*.jpg',
      },
    ];
  },
};

export default nextConfig;
