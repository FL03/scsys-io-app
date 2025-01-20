/*
  Appellation: actions <profile::form>
  Contrib: @FL03
*/
'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sitemap } from '@/config';
// feature
import { upsertProfile } from './server';

const redirectTo = sitemap.pages.profile.route();

type FormAction<TOut = any> = (
  data: FormData
) => TOut | Promise<TOut> | PromiseLike<TOut>;

export const handleSumbitProfile: FormAction = async (formData: FormData) => {
  const { error } = await upsertProfile({
    avatar_url: formData.get('avatar_url') as string,
    bio: formData.get('bio') as string,
    display_name: formData.get('display_name') as string,
    role: formData.get('role') as string,
    username: formData.get('username') as string,
  });

  if (error) {
    throw error;
  }

  revalidatePath(redirectTo, 'layout');
  redirect(redirectTo);
};

