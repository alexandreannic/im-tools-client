/** @type {import('next').NextConfig} */
module.exports = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  transpilePackages: ['mui-extension'],
  eslint: {
    ignoreDuringBuilds: true,
  }
}
