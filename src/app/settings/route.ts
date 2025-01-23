/*
  Appellation: route <settings>
  Contrib: @FL03
*/
import { redirect } from 'next/navigation';
import { getUsername } from '@/utils/supabase';
/**
 * `GET` request reroutes to the user's profile page
 * @param request: NextRequest
 */
export const GET = async () => {
  const username = await getUsername();

  redirect(`${username}/settings`);
};
