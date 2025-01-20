/*
  Appellation: route <shifts>
  Contrib: @FL03
*/
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getUsername } from '@/utils/supabase';

export const GET = async (req: NextRequest) => {
  const supabase = await createServerClient();
  const { searchParams } = new URL(req.url);

  const username = searchParams.get('username') ?? (await getUsername(supabase));
  
  if (!username) {
    throw new Error('Please provide a valid username');
  }

  const { data, error } = await supabase
    .from('shifts')
    .select()
    .eq('assignee', username);

  if (error) {
    throw new Error('Error fetching data');
  }

  return NextResponse.json(data, { status: 200 });
};
