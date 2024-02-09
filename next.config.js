/** @type {import('next').NextConfig} */
module.exports = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  staticPageGenerationTimeout: 200,
  transpilePackages: ['mui-extension'],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: process.env.IGNORE_BUILD_TS_ERRORS === 'true',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
