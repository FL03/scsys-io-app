/*
  Appellation: shift-detail-screen <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
// project
import { Nullish } from '@/types';
import { resolveCrud } from '@/utils';
// components
import { DetailSkeleton } from '@/common/skeletons';
import { Card } from '@/ui/card';
// feature-specific
import { Timesheet } from '../types';
import * as actions from '../utils';
// import { ShiftDetailCard, TimesheetForm } from '../widgets';

export const ShiftDetailScreen: React.FC = () => {
  const pathname = usePathname();
  const params = useSearchParams();

  const action = params.get('action');
  const view = params.get('view');

  const [item, setItem] = React.useState<Nullish<Timesheet>>(null);

  const splitPath = pathname.split('/');

  const username = splitPath[1];
  const id = splitPath.pop();

  React.useEffect(() => {
    actions.fetchTimesheet(username, id).then((data) => {
      if (data) setItem(data);
    });
  }, [id, username]);

  const showForm = view === 'form';

  const Form = dynamic(async () => await import('../widgets/shift-form'), {
    ssr: false,
  });
  const ShiftDetails = dynamic(async () => await import('../widgets/shift-info'), {
    ssr: false,
  });

  return (
    <DetailSkeleton
      description="View and edit timesheet details"
      title="Timesheet"
    >
      {showForm ? (
        <Card>
          <Form
            className="m-auto px-4 py-2"
            mode={resolveCrud(action ?? 'read')}
            values={item}
          />
        </Card>
      ) : (
        <ShiftDetails data={item} />
      )}
    </DetailSkeleton>
  );
};
ShiftDetailScreen.displayName = 'ShiftScreen';

export default ShiftDetailScreen;
