/*
  Appellation: client <actions>
  Contrib: @FL03
*/
'use client';
import { resolveOrigin } from '@/utils';
import { Profile } from '../types';

export const fetchUserProfile = async (
  params?: Record<string, string>,
  init?: RequestInit,
): Promise<Profile | null> => {
  let url = new URL('/api/profile', resolveOrigin());
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, init).then((res) => res.json());
};

// export const streamProfileChanges = async (