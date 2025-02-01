/*
  Appellation: form <utils>
  Contrib: @FL03
*/
'use server';

// imports
import { addDays, DateArg } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// project
import { createServerClient, currentUser, getUsername } from '@/utils/supabase';
// feature-specific
import { ShiftFormValues } from '../widgets';

const handleDate = (value?: DateArg<Date> | null) => {
  return value ? addDays(value, 1) : undefined;
};

export const saveTimesheet = async (timesheet: Partial<ShiftFormValues>) => {
  await upsertTimesheet(timesheet);
  revalidatePath('/shifts', 'layout');
  redirect('/shifts');
};

export const deleteTimesheet = async (id: string) => {
  const supabase = await createServerClient();
  const { error } = await supabase.from('shifts').delete().eq('id', id);
  if (error) {
    throw error;
  }
  revalidatePath('/shifts', 'layout');
  redirect('/shifts');
};


export const upsertTimesheet = async (shift?: any | null) => {
  if (!shift) {
    throw new Error('Shift not found');
  }

  const supabase = await createServerClient();


  const username = await getUsername(supabase);

  if (!username) {
    throw new Error('Username not found');
  }

  return await supabase
    .from('shifts')
    .upsert(
      {
        assignee: shift.assignee ?? username,
        date: handleDate(shift.date)?.toLocaleDateString(),
        start_at: shift.start_at,
        end_at: shift.end_at,
        clocked_in: shift.clocked_in,
        clocked_out: shift.clocked_out,
        tips_cash: shift.tips_cash ?? 0,
        tips_credit: shift.tips_credit ?? 0,
        attachments: shift.attachments ?? [],
        status: shift.status ?? 'pending',
        tags: shift.tags ?? [],
      },
      { onConflict: 'id' }
    )
    .eq('id', shift.id);
};
