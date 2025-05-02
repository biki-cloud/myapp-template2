/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // experimental: {
  //   serverActions: true, // Next.js 14以降は不要
  // },
  output: "standalone",
  // pages/ディレクトリを無効化
  pageExtensions: ["tsx", "ts"],
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
