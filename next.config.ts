import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,  // Ignora los errores de tipo durante el build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint durante el build
  }
};

export default nextConfig;
