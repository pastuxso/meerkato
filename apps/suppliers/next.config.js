/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@meerkato/ui', '@meerkato/database', '@meerkato/auth', '@meerkato/ai'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig