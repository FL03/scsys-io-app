/*
  Appellation: route <profile>
  Contrib: @FL03
*/
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

/**
 *
 * @param request: NextRequest
 */
export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  const username = searchParams.get('username');

  redirect(`/shifts/form/create?action=create`);
};
