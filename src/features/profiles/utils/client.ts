/*
  Appellation: client <actions>
  Contrib: @FL03
*/
'use client';
import { resolveOrigin } from '@/utils';
import { Profile } from '../types';

type ProfileQuery = { uid: string } | { username: string };

export const fetchProfile = async (
  params?: ProfileQuery,
  init?: RequestInit
): Promise<Profile | null> => {
  let url = new URL('/api/profile', resolveOrigin());
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, init).then((res) => res.json());
};

export const fetchUserProfile = async (
  params?: { [key: string]: string },
  init?: RequestInit,
): Promise<Profile | null> => {
  let url = new URL('/api/profile', resolveOrigin());
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, init).then((res) => res.json());
};
