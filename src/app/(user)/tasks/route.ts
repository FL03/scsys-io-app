/*
  Appellation: route <tasks>
  Contrib: @FL03
*/
import { redirect } from 'next/navigation';

import { sitemap } from '@/config';
import { getUsername } from '@/utils/supabase';
/**
 * `GET` request reroutes to the user's profile page
 * @param request: NextRequest
 */
export const GET = async () => {
  const username = await getUsername();

  redirect(sitemap.pages.profile.route(username, 'tasks'));
};
