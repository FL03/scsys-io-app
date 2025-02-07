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

const onSuccess: (path?: string) => void = (path = '/') => {
  revalidatePath(path, 'layout');
  redirect(path);
}

type AsyncFn<T> = (values: T) => Promise<void>;
/**
 *
 * @param values : the information needed for the standard email/password authentication flow
 */
export const handleLogin: AsyncFn<SignInWithPasswordCredentials> = async (
  values
) => {
  // create a new supabase client
  const supabase = await createServerClient();
  try {
    // sign in with the email and password
    await supabase.auth.signInWithPassword(values);
    // revalidate before redirecting
    onSuccess();
  } catch (error) {
    // if there is an error, redirect to the error page
    getErrorRedirect(
      '/auth/login',
      'Hmm... Something went wrong.',
      'Please try again'
    );
  }
};

export const handleRegistration: AsyncFn<RegistrationData> = async ({
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

  const { error: tableError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        username: username,
        email: [email],
      },
      { onConflict: 'id' }
    )
    .eq('id', user.id);

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
