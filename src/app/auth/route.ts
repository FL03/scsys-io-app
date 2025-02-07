/*
  Appellation: route <auth>
  Contrib: @FL03
*/
'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDefaultSignInView } from '@/utils/supabase/helpers/auth/settings';
import { NextRequest } from 'next/server';


export const GET = async () => {
  const cookieStore = await cookies();
  const preferredSignInView = cookieStore.get('preferredSignInView')?.value;
  const defaultView = getDefaultSignInView(preferredSignInView || null);

  redirect(`/auth/${defaultView}`);
}

export const POST = async (req: NextRequest) => {
  const origin = new URL(req.url);
  const view = origin.searchParams.get('view') || 'login';

  if (view === 'login') {
    return redirect(`/auth/register`);
  }
  redirect(`/auth/${view}`);
}