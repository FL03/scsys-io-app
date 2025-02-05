/*
  Appellation: middleware <module>
  Contrib: @FL03
*/
'use server';
// imports
import { NextRequest } from 'next/server';
// project
import { getUsername } from '@/utils/supabase';
import { handleUserSession } from '@/utils/supabase/middleware';

const handleRoutes = async (request: NextRequest) => {
  const username = await getUsername();
  // handle routes
  if (request.url.startsWith('/auth') || request.url.startsWith('/api')) {
    return request;
  } else if (request.url.startsWith(`/${username}`)) {
    return request;
  } else {
    return new NextRequest(new URL(request.url, `/${username}`), request);
  }
}

export const middleware = async (request: NextRequest) => {
  return await handleUserSession(request);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
