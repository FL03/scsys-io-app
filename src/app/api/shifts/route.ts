/*
  Appellation: route <shifts>
  Contrib: @FL03
*/
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase';

export const GET = async (req: NextRequest) => {
  const supabase = await createServerClient();
  const { searchParams } = new URL(req.url);

  const username = searchParams.get('username');

  const id = searchParams.get('id');

  if (!username) {
    throw new Error('Please provide a valid username');
  }
  // initialize the base query
  const query = supabase.from('shifts').select().eq('assignee', username);
  if (id) {
    const { data, error } = await query.eq('id', id);

    if (error) {
      throw new Error('Error fetching data');
    }

    return NextResponse.json(data, { status: 200 });
  } else {
    try {
      const { data } = await query;

      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      throw new Error('Error fetching data');
    }
  }
};

export const POST = async (req: NextRequest) => {
  // destructure request object
  const formData = await req.formData();
  // create supabase client
  const supabase = await createServerClient();

  const parsedData = {
    assignee: formData.get('assignee'),
    date: formData.get('date'),
    tips_cash: formData.get('tips_cash'),
    tips_credit: formData.get('tips_credit'),
  };
  // upsert the data
  const { data, error } = await supabase
    .from('shifts')
    .upsert(parsedData)
    .eq('id', formData.get('id'));

  if (error) {
    throw new Error('Error inserting data');
  }

  return NextResponse.json(data, { status: 201 });
};
