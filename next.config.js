/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  compiler: {
    removeConsole: false,
  },
  experimental: {
    serverActions: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
