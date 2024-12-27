/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'project3-ya8f.onrender.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'deltasport.vn',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};
