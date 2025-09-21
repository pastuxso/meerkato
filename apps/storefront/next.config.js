/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@meerkato/ui', '@meerkato/database', '@meerkato/auth', '@meerkato/ai'],
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
    ]
  },
}

module.exports = nextConfig