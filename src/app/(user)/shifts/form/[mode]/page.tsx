/*
  Appellation: page <create>
  Contrib: @FL03
*/
import * as React from 'react';
import { TimesheetForm } from '@/features/shifts';
import { Crud, PagePropsWithParams } from '@/types';
import { Card, CardContent } from '@/ui/card';
import { DetailSkeleton } from '@/components';

const Page = async ({ params }: PagePropsWithParams<{ mode: Crud }>) => {
  const { mode } = await params;

  return (
    <DetailSkeleton>
      <div className="flex flex-1 flex-col w-full items-center justify-center ">
        <Card className="px-4 py-2">
          <TimesheetForm mode={mode} />
        </Card>
      </div>
    </DetailSkeleton>
  );
};
Page.displayName = 'ShiftEditorPage';

export default Page;
