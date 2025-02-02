/*
  Appellation: page <shifts::<[id]>>
  Contrib: @FL03
*/
'use server';
// imports 
import { redirect } from 'next/navigation';
// project
import {
  getTimesheet,
  shiftsTable,
  TimesheetDetails,
  TimesheetForm,
} from '@/features/shifts';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';
import { resolveCrud } from '@/utils';
// components
import { DetailSkeleton } from '@/common/skeletons';
import { Card, CardContent } from '@/ui/card';

type PageProps = PagePropsWithParams<{ alias: string, id: string }, {
    action?: string;
    view?: string;
  }>;


export default async function Page({ params, searchParams }: PageProps) {
  const { alias, id } = await params;
  const search = await searchParams;
  // fetch data
  const data = await getTimesheet(id);
  // handle no data
  if (!data) return <span className="m-auto">No item found...</span>;

  const showForm = search?.view === 'form';
  const showDetails = !showForm && search?.view === 'details';

  return (
    <DetailSkeleton
      description="View and edit timesheet details"
      title="Timesheet"
    >
      {showForm && (
        <Card className="p-4">
          <TimesheetForm
            redirectOnSuccess={`/${alias}/shifts/${id}`}
            values={data}
            mode={resolveCrud(search?.action)}
          />
        </Card>
      )}
      {showDetails && <TimesheetDetails data={data} />}
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
