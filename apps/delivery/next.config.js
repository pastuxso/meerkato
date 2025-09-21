const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@meerkato/ui', '@meerkato/database', '@meerkato/auth', '@meerkato/ai'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = withPWA(nextConfig)