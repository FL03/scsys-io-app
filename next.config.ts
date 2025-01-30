/*
  Appellation: next.config <module>
  Contrib: @FL03
*/

const outputType = (output?: string): 'export' | 'standalone' | undefined => {
  if (['standalone', 'docker'].find((o) => o === output)) {
    return 'standalone';
  }
  if (['export'].find((o) => o === output)) {
    return 'export';
  }
  return undefined;
};


let nextConfig: import("next").NextConfig = {
  // Configure assetPrefix or else the server won't properly resolve your assets.
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
      process.env.NEXT_PUBLIC_SUPABASE_URL && {
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
        pathname: '/*',
        protocol: 'https',
      },
    ],
  },
  output: outputType(process.env.NEXT_PUBLIC_OUTPUT_TYPE),
  publicRuntimeConfig: {
    // Will be available on both server and client
    // This is a good place to put environment variables
    // that are required in the browser
    // e.g. `publicRuntimeConfig: { API_URL: process.env.API_URL }`
    SITE_URL: process.env.SITE_URL,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
    turbo: {},
    useWasmBinary: true,
  },
  webpack: (config) => {
    config.experiments.asyncWebAssembly = true;
    return config;
  },
};

export default nextConfig;
