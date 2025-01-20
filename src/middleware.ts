/*
  Appellation: middleware <module>
  Contrib: @FL03
*/
'use server';
// imports
import type { NextRequest } from 'next/server';
// project
import { handleUserSession } from '@/utils/supabase/middleware';

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
