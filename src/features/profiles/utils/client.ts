/*
  Appellation: client <actions>
  Contrib: @FL03
*/
'use client';
import { resolveOrigin } from '@/utils';
import { Profile } from '../types';

/**
 * 
 * @param {{uid: string } | { username: string } | Record<string, string>} params accepts params as an object with either a uid or username key
 * @param {RequestInit} standard fetch init object
 * @returns 
 */
export const fetchUserProfile = async (
  params?: Record<string, string>,
  init?: RequestInit,
): Promise<Profile | null> => {
  if (!params) {
    throw new Error('No params provided');
  }
  const url = new URL('/api/profile', resolveOrigin());
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, init).then((res) => res.json());
};

// export const streamProfileChanges = async (