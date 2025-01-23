/*
  Appellation: route <(user)>
  Contrib: @FL03
*/
'use server';
import { redirect } from 'next/navigation';
import { getUsername } from '@/utils/supabase';
/**
 * `GET` request reroutes to the user's profile page
 * @param request: NextRequest
 */
export const GET = async () => {
  const username = await getUsername();

  if (!username) {
    return redirect('/auth/login');
  }

  redirect(`/${username}?view=dashboard`);
};
