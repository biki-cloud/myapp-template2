/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  experimental: {
    serverActions: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
