/*
  Appellation: helpers <utils>
  Contrib: @FL03
*/
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

export const matches = <T>(arg: T, ...opts: T[]) => {
  return !!opts.find((v) => v === arg)
}

export const resolveCrud = (action?: string | null): import("@/types").Crud => {
  if (!action) return 'read';
  if (matches(action, 'create', 'new')) return 'create';
  if (matches(action, 'update', 'edit')) return 'update';
  if (matches(action, 'delete', 'remove')) return 'delete';
  return 'read';
}

export const resolveOrigin = () => {
  let origin: string;
  if (typeof window === 'undefined') {
    const tmp =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
    if (tmp && tmp.trim() !== '') {
      origin = tmp;
    }
    origin = 'http://localhost:3000';
  } else {
    origin = window.location.origin;
  }
  return origin;
};

export const resolveURL = (path: string): string => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
      ? process.env.NEXT_PUBLIC_SITE_URL
      : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
        process?.env?.NEXT_PUBLIC_VERCEL_URL &&
          process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : // If neither is set, default to localhost for local development.
          'http://localhost:3000/';

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, '');
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};
