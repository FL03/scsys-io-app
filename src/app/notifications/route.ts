/*
  Appellation: route <notifications>
  Contrib: @FL03
*/
'use server';
// imports
import { redirect } from 'next/navigation';
// project
import { sitemap } from '@/config';
import { resolveUsername } from '@/utils/supabase';
/**
 * `GET` request reroutes to the user's profile page
 * @param request: NextRequest
 */
export const GET = async () => {
  const username = await resolveUsername();
  redirect(sitemap.pages.profile.route(username, 'notifications'));
};
