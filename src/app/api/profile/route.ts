/*
  Appellation: route <profile>
  Contrib: @FL03
*/
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, currentUser } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

const fetchProfileByUsername = async (username: string, supabase: SupabaseClient) => {
  return await supabase.from('profiles').select().eq('username', username).single();
}



export const GET = async (req: NextRequest) => {
  const supabase = await createServerClient();

  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const user_id = searchParams.get('uid');

  const query = supabase.from('profiles');
  if (username) {
    const { data, error } = await query.select().eq('username', username).single();

    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(data, { status: 200 });
  } 
  if (user_id) {
    const { data, error } = await query.select().eq('id', user_id).single();
    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(data, { status: 200 });
  } 

  const { data, error } = await query.select();
  if (error) {
    throw new Error(error.message);
  }
  return NextResponse.json(data, { status: 200 });
  
};

export const POST = async (req: NextRequest) => {
  const { formData } = req;
  const supabase = await createServerClient();

  const user = await currentUser(supabase);

  const form = await formData();

  if (!user) {
    throw new Error('User not found');
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        avatar_url: form.get('avatar_url') as string,
        bio: form.get('bio') as string,
        display_name: form.get('display_name') as string,
        role: form.get('role') as string,
        status: form.get('status') as string,
        username: form.get('username') as string,
      },
      { onConflict: 'id' }
    )
    .eq('id', form.get('id') as string);

  if (error) {
    throw new Error(error.message);
  }

  return new NextResponse('Success', { status: 201 });
};
