/** @type {import('next').NextConfig} */
const apiOrigin = (
  process.env.NEXT_PUBLIC_API_URL || 'https://bitsnfinds-backend.onrender.com'
).replace(/\/+$/, '')

const nextConfig = {
  skipTrailingSlashRedirect: process.env.NODE_ENV === 'development',
}

module.exports = nextConfig
