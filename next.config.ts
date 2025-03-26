/*
  Appellation: next.config <module>
  Contrib: @FL03
*/
import { RemotePattern } from 'next/dist/shared/lib/image-config';

const outputType = (output?: string): 'export' | 'standalone' | undefined => {
  if (['standalone', 'docker'].find((o) => o === output)) {
    return 'standalone';
  }
  if (['export'].find((o) => o === output)) {
    return 'export';
  }
  return undefined;
};

let nextConfig: import('next').NextConfig = {
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
  },
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
      {
        hostname: 'jldrgdhjxirkcedeiyev.supabase.co',
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
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
    turbo: {},
  },
};

// if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
//   nextConfig.images = {
//     remotePatterns: [
//       ...(nextConfig.images?.remotePatterns || []),
//       {
//         hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
//         pathname: '/*',
//         protocol: 'https',
//       },
//     ],
//   };
// }

export default nextConfig;
