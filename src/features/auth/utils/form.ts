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
} from '@supabase/supabase-js';
import { RegistrationData } from '../widgets';

const errorPath = '/error';
const onSuccessUrl = '/';

type AsyncFormHandler<T> = (data: T) => Promise<void>;
/**
 *
 * @param data : the information needed for the standard email/password authentication flow
 */
export const handleLogin: AsyncFormHandler<
  SignInWithPasswordCredentials
> = async (data) => {
  // create a new supabase client
  const supabase = await createServerClient();
  // sign in with the email and password
  const { error } = await supabase.auth.signInWithPassword(data);

  // if there is an error, redirect to the error page
  if (error) {
    getErrorRedirect(
      '/auth/login',
      'Hmm... Something went wrong.',
      'Please try again'
    );
  }

  revalidatePath(onSuccessUrl, 'layout');
  redirect(onSuccessUrl);
};

export const handleRegistration: AsyncFormHandler<RegistrationData> = async ({
  email,
  password,
  passwordConfirm,
  username,
}) => {
  if (password !== passwordConfirm) {
    throw new Error('Passwords do not match');
  }
  if (!username) {
    throw new Error('Username is required');
  }
  const callbackURL = new URL('/auth/callback', resolveOrigin()).toString();
  const supabase = await createServerClient();

  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  if (signUpError) {
    throw signUpError;
  }

  if (!user) {
    throw Error('User not found');
  }

  const { error: tableError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      username: username,
      email: [email],
    },
    { onConflict: 'id' }
  ).eq('id', user.id);

  if (tableError) {
    getErrorRedirect(
      '/auth/register',
      'Hmm... Something went wrong.',
      'You could not be registered.'
    );
  }
  revalidatePath(onSuccessUrl, 'layout');
  redirect(onSuccessUrl);
};

/**
 *
 * @param data : the information needed for the oauth flow
 */
export async function handleOAuthLogin(data: SignInWithOAuthCredentials) {
  const supabase = await createServerClient();

  await supabase.auth.signInWithOAuth(data).catch(() => redirect(errorPath));

  revalidatePath(onSuccessUrl, 'layout');
  redirect(onSuccessUrl);
}
/**
 *
 * @param data : the information needed for the passwordless flow
 */
export async function handlePasswordlessLogin(
  data: SignInWithPasswordlessCredentials
) {
  const supabase = await createServerClient();

  await supabase.auth.signInWithOtp(data).catch(() => redirect(errorPath));

  revalidatePath(onSuccessUrl, 'layout');
  redirect(onSuccessUrl);
}

export async function handleLogout() {
  const supabase = await createServerClient();

  await supabase.auth.signOut().catch(() => redirect(errorPath));

  revalidatePath('/auth', 'layout');
  redirect('/auth');
}
function isValidEmail(email: any) {
  throw new Error('Function not implemented.');
}
