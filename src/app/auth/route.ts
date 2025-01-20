/*
  Appellation: route <auth>
  Contrib: @FL03
*/
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDefaultSignInView } from '@/utils/supabase/helpers/auth/settings';

/**
 *
 * @param request: NextRequest
 */
export async function GET() {
  const cookieStore = await cookies();
  const preferredSignInView = cookieStore.get('preferredSignInView')?.value;
  const defaultView = getDefaultSignInView(preferredSignInView || null);

  redirect(`/auth/${defaultView}`);
}
