/*
  Appellation: next.config <module>
  Contrib: FL03 <jo3mccain@icloud.com>
*/

/** @type {import('next').NextConfig} */
let nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        pathname: '/*',
        protocol: 'https',
      },
      {
        hostname: 'avatars.githubusercontent.com',
        pathname: '/*',
        protocol: 'https',
      },
      {
        hostname: 'jldrgdhjxirkcedeiyev.supabase.co',
        pathname: '/*',
        protocol: 'https',
      },
    ],
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    // This is a good place to put environment variables
    // that are required in the browser
    // e.g. `publicRuntimeConfig: { API_URL: process.env.API_URL }`
    SITE_URL: process.env.SITE_URL,
  },
  experimental: {
    turbo: {},
    useWasmBinary: true,
  },
  webpack: (config) => {
    config.experiments.asyncWebAssembly = true;
    return config;
  },
};

nextConfig.output = process.env.NEXT_PUBLIC_OUTPUT_TYPE;

export default nextConfig;
