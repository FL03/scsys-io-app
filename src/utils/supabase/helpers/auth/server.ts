/*
  Appellation: server <auth-helpers>
  Contrib: @FL03
*/
'use server';
import { SupabaseClient } from '@supabase/supabase-js';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '../../server';
import { getURL, getErrorRedirect, getStatusRedirect } from '../database';
import { getAuthTypes } from './settings';

const authPrefix = '/auth';

type SupaClient = SupabaseClient | Promise<SupabaseClient>;

const resolveClient = async (client?: SupaClient) => {
  if (client) {
    if (client instanceof Promise) {
      return await client;
    } else {
      return client;
    }
  } else {
    return await createClient();
  }
};

export const getUserId = async (client?: SupaClient) => {
  const supabase = await resolveClient(client);
 return await supabase.rpc('user_profile_id').then(({ data }) => data);
};

export const getUsername = async (client?: SupaClient) => {
  const supabase = await resolveClient(client);
  return await supabase.rpc('username').then(({ data }) => data);
};

export const currentUser = async (client?: SupaClient) => {
  let supabase: SupabaseClient;
  if (client) {
    if (client instanceof Promise) {
      supabase = await client;
    } else {
      supabase = client;
    }
  } else {
    supabase = await createClient();
  }
  return supabase.auth
    .getUser()
    .catch((error) => {
      throw error;
    })
    .then(({ data }) => data.user);
};

const authPath = (path: string | string[]) => {
  if (!Array.isArray(path)) {
    path = [path];
  }
  return [authPrefix, ...path].join('/');
};

function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get('pathName')).trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      pathName,
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    );
  }

  return authPath('login');
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = await cookies();
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/auth/login/email_signin',
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = await createClient();
  const options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true,
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/auth/login/email_signin',
      'You could not be signed in.',
      error.message
    );
  } else if (data) {
    await cookieStore.set('preferredSignInView', 'email_signin', { path: '/' });
    redirectPath = getStatusRedirect(
      '/auth/login/email_signin',
      'Success!',
      'Please check your email for a magic link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/auth/login/email_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }

  return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/auth/forgot_password',
      'Invalid email address.',
      'Please try again.'
    );
  }
  // initialize the supabase client for server-side operations
  const supabase = await createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/auth/forgot_password',
      error.message,
      'Please try again.'
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      '/auth/forgot_password',
      'Success!',
      'Please check your email for a password reset link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/auth/forgot_password',
      'Hmm... Something went wrong.',
      'Password reset email could not be sent.'
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = await cookies();
  let redirectPath: string;
  // initialize the supabase client for server-side operations
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email')).trim(),
    password: String(formData.get('password')).trim(),
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/auth/login',
      'Sign in failed.',
      error.message
    );
  } else if (data.user) {
    cookieStore.set('preferredSignInView', 'password_signin', { path: '/' });
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else {
    redirectPath = getErrorRedirect(
      '/auth/login',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }

  return redirectPath;
}

export async function signUp(formData: FormData) {
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();

  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/auth/signup',
      'Invalid email address.',
      'Please try again.'
    );
  }
  // initialize the supabase client for server-side operations
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  await supabase
    .from('profiles')
    .insert([{ email: [email], id: data.user?.id }]);

  if (error) {
    redirectPath = getErrorRedirect(
      '/auth/signup',
      'Sign up failed.',
      error.message
    );
  } else if (data.session) {
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    redirectPath = getErrorRedirect(
      '/auth/login',
      'Sign up failed.',
      'There is already an profile associated with this email address. Try resetting your password.'
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Please check your email for a confirmation link. You may now close this tab.'
    );
  } else {
    redirectPath = getErrorRedirect(
      '/auth/login',
      'Hmm... Something went wrong.',
      'You could not be signed up.'
    );
  }

  return redirectPath;
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      '/auth/update_password',
      'Your password could not be updated.',
      'Passwords do not match.'
    );
  }
  // initialize the supabase client for server-side operations
  const supabase = await createClient();
  // Update the user's password
  const { error, data } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/auth/update_password',
      'Your password could not be updated.',
      error.message
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Your password has been updated.'
    );
  } else {
    redirectPath = getErrorRedirect(
      '/auth/update_password',
      'Hmm... Something went wrong.',
      'Your password could not be updated.'
    );
  }

  return redirectPath;
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get('newEmail')).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/profile',
      'Your email could not be updated.',
      'Invalid email address.'
    );
  }

  const supabase = await createClient();

  const callbackUrl = getURL(
    getStatusRedirect('/profile', 'Success!', `Your email has been updated.`)
  );

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl,
    }
  );

  if (error) {
    return getErrorRedirect(
      '/profile',
      'Your email could not be updated.',
      error.message
    );
  } else {
    return getStatusRedirect(
      '/profile',
      'Confirmation emails sent.',
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
    );
  }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = await createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    return getErrorRedirect(
      '/profile',
      'Your name could not be updated.',
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/profile',
      'Success!',
      'Your name has been updated.'
    );
  } else {
    return getErrorRedirect(
      '/profile',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    );
  }
}
