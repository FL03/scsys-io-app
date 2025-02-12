/*
  Appellation: actions <login>
  Contrib: @FL03
*/
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { resolveOrigin } from '@/utils';
import { createServerClient, getErrorRedirect } from '@/utils/supabase';

import {
  SignInWithPasswordCredentials,
  SignInWithOAuthCredentials,
  SignInWithPasswordlessCredentials,
  AuthResponse,
} from '@supabase/supabase-js';
import { RegistrationData } from '../widgets';

const errorPath = '/error';
const onSuccessUrl = '/';

type AsyncFn<TData = unknown, TOut = void> = (values: TData) => Promise<TOut>;
/**
 *
 * @param values : the information needed for the standard email/password authentication flow
 */
export const handleLogin: AsyncFn<SignInWithPasswordCredentials> = async (
  values
) => {
  // create a new supabase client
  const supabase = await createServerClient();
  // sign in with the email and password
   const { error } = await supabase.auth.signInWithPassword(values);

   if (error) throw error;
  // revalidate before redirecting
  revalidatePath('/', 'layout');
  return redirect('/');
  
};

export const handleRegistration: AsyncFn<
  RegistrationData,
  AuthResponse
> = async ({ email, password, passwordConfirm, username }) => {
  if (password !== passwordConfirm) {
    throw new Error('Passwords do not match');
  }
  if (!username) {
    throw new Error('Username is required');
  }
  const callbackURL = new URL('/auth/callback', resolveOrigin()).toString();
  const supabase = await createServerClient();

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      // pass required metadata from the form
      data: {
        username,
      },
      emailRedirectTo: callbackURL,
    },
  });
};

/**
 *
 * @param {SignInWithOAuthCredentials} data : the information needed for the oauth flow
 */
export const handleOAuthLogin: AsyncFn<SignInWithOAuthCredentials> = async (
  data
) => {
  const supabase = await createServerClient();

  await supabase.auth.signInWithOAuth(data).catch(() => redirect(errorPath));

  revalidatePath(onSuccessUrl, 'layout');
  redirect(onSuccessUrl);
};

export const handleOAuthCreateUser: AsyncFn<
  SignInWithOAuthCredentials
> = async (data) => {
  const supabase = await createServerClient();

  await supabase.auth.signInWithOAuth(data).catch(() => redirect(errorPath));

  revalidatePath(onSuccessUrl, 'layout');
  redirect(onSuccessUrl);
};
/**
 *
 * @param data : the information needed for the passwordless flow
 */
export const handlePasswordlessLogin: AsyncFn<
  SignInWithPasswordlessCredentials
> = async (data) => {
  const supabase = await createServerClient();

  await supabase.auth.signInWithOtp(data).catch(() => redirect(errorPath));

  revalidatePath(onSuccessUrl, 'layout');
  redirect(onSuccessUrl);
};

export const handleLogout = async () => {
  const supabase = await createServerClient();

  try {
    await supabase.auth.signOut();
  } catch (err) {
    throw new Error('Could not sign out');
  }

  revalidatePath('/auth', 'layout');
  redirect('/auth');
};
function isValidEmail(email: any) {
  throw new Error('Function not implemented.');
}
