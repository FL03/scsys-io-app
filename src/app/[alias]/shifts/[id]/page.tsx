/*
  Appellation: page <shifts::<[id]>>
  Contrib: @FL03
*/
import * as React from 'react';
import {
  shiftsTable,
  TimesheetDetails,
  TimesheetForm,
} from '@/features/shifts';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';
import { DetailSkeleton } from '@/common/skeletons';
import { Card } from '@/ui/card';

type PageProps = PagePropsWithParams<{ id: string }>;

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { action } = (await searchParams) as { action?: string };

  const { data } = await shiftsTable.fetch(id);

  if (!data) return <span className="m-auto">No item found...</span>;

  if (!action) return <TimesheetDetails data={data} />;

  const isUpdate = action === 'update';
  const isRead = action === 'read' || !action;
  return (
    <DetailSkeleton>
      {isRead && <TimesheetDetails data={data} />}
      {isUpdate && (
        <Card>
          <TimesheetForm
            className="m-auto px-4 py-2"
            mode={action}
            values={data}
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
