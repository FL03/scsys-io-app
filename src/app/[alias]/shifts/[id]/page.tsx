/*
  Appellation: page <shifts::<[id]>>
  Contrib: @FL03
*/
'use server';
// imports
import {
  shiftsTable,
  Timesheet,
  TimesheetDetails,
  TimesheetForm,
} from '@/features/shifts';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';
import { createServerClient } from '@/utils/supabase';
// components
import { DetailSkeleton } from '@/common/skeletons';
import { Card } from '@/ui/card';

type PageProps = PagePropsWithParams<{ id: string }>;

const resolveCrud = (action: string) => {
  if (['create', 'add'].includes(action)) return 'create';
  if (['edit', 'update'].includes(action)) return 'update';
  if (['delete', 'remove'].includes(action)) return 'delete';
  return 'read';
}

const fetchTimesheet = async (id: string) => {
  const supabase = await createServerClient();

  let shift: Timesheet | null = null;
  try {
    const { data } = await supabase.from('shifts').select().eq('id', id).single();
    shift = data;
  } catch (error) {
    throw error;
  } finally {
    return shift;
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { action, view } = (await searchParams) as { action?: string, view?: string };
  // fetch data
  const data = await fetchTimesheet(id);
  if (!data) return <span className="m-auto">No item found...</span>;

  const showForm = view === 'form';
  const showDetails = !showForm && view === 'details';
  return (
    <DetailSkeleton>
      {showDetails && <TimesheetDetails data={data} />}
      {showForm && (
        <Card>
          <TimesheetForm
            className="m-auto px-4 py-2"
            mode={resolveCrud(action ?? 'read')}
            values={{
              ...data,
              date: new Date(data.date),
            }}
          />
        </Card>
      )}
    </DetailSkeleton>
  );
}
Page.displayName = 'ShiftDetailsPage';

export const generateMetadata: NextMetaGenerator<PageProps> = async (
  { params },
  parent
) => {
  // read route params
  const { id } = await params;
  // fetch data
  const { data } = await shiftsTable.fetch(id);
  // optionally access and extend (rather than replace) parent metadata
  const images = (await parent).openGraph?.images || [];

  const date = new Date(data?.date).toLocaleDateString();

  return {
    title: `Shift (${date})`,
    description: `View and manage your shift on ${date}.`,
    openGraph: {
      images: [...images],
    },
  };
};
