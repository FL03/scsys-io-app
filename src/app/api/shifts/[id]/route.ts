/*
  Appellation: route <shifts>
  Contrib: @FL03
*/
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase';
import { logger } from '@/utils';

export const GET = async (req: NextRequest) => {
  const supabase = await createServerClient();
  const { searchParams, pathname } = new URL(req.url);

  const username = searchParams.get('username');
  const id = pathname.split('/').pop();
  logger.info(`shift_id: ${id}`);

  if (!username) {
    throw new Error('Please provide a valid username');
  }
  
  try {
    const { data } = await supabase.from('shifts').select().eq('assignee', username).eq('id', id).single();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    throw new Error('Error fetching data');
  }
};