/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost', 'storage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  experimental: {
    esmExternals: true,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = nextConfig;
