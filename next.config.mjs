/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["better-auth"],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    // Fix better-auth importing non-exported path '@noble/ciphers/chacha.js'
    config.resolve.alias["@noble/ciphers/chacha.js"] = "@noble/ciphers/chacha";
    return config;
  },
};

export default nextConfig;
