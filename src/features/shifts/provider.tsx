/*
  Appellation: provider <shifts>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { Nullish } from '@/types';
import { logger } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
// feature-specific
import { Timesheet } from './types';
import { adjustedDate, fetchUsersTips, streamShifts } from './utils';

type ScheduleContext = {
  shifts?: Timesheet[] | null;
  setShifts?: React.Dispatch<React.SetStateAction<Nullish<Timesheet[]>>>;
};

const ScheduleContext = React.createContext<ScheduleContext | null>({
  shifts: null,
  setShifts: () => {},
});

export const useEmployeeSchedule = () => {
  const context = React.useContext(ScheduleContext);
  if (!context) {
    throw new Error('useEmployee must be used within a EmployeeProvider');
  }
  return context;
};

export const ScheduleProvider: React.FC<
  React.PropsWithChildren<{ username: string }>
> = ({ children, username }) => {
  const supabase = createBrowserClient();
  // initialize the shifts state
  const [_shifts, _setShifts] = React.useState<Nullish<Timesheet[]>>();
  // create a loader callback
  const loader = React.useCallback(
    async (alias?: string) => {
      let data = await fetchUsersTips(alias);
      data = data?.map(({ date, ...shift }) => {
        return {
          date: adjustedDate(date).toISOString(),
          ...shift,
        };
      });
      if (data) _setShifts(data);
    },
    [fetchUsersTips, _setShifts]
  );

  const stream = React.useCallback((assignee: string) => {
    const channel = supabase.channel(`shifts:${assignee}`);
    return channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shifts',
          filter: 'assignee=eq.assignee',
        },
        (payload) => {
          logger.info('Change detected within the shifts table');
          const newData = payload.new as Timesheet;
          if (payload.eventType === 'INSERT') {
            _setShifts((values) => {
              return values ? [...values, newData] : [newData];
            });
          }
          if (payload.eventType === 'UPDATE') {
            _setShifts((values) => {
              return values?.map((shift) => {
                return shift.id === newData.id ? newData : shift;
              });
            });
          }
          if (payload.eventType === 'DELETE') {
            _setShifts((values) => {
              return values?.filter((shift) => shift.id !== newData.id);
            });
          }
        }
      );
  }, [supabase, _setShifts]);
  // create a callback to set the shifts
  const setShifts = React.useCallback(_setShifts, [_setShifts]);

  React.useEffect(() => {
    if (!_shifts) loader(username);
    const channel = stream(username);
    channel.subscribe((status, err) => {
      if (err) {
        console.error(err);
      }
      if (status === 'SUBSCRIBED') {
        logger.info('Subscribed to shifts channel');
      }
    });
    return () => {
      channel.unsubscribe();
    };
  }, [username, loader, stream, _setShifts]);

  // redeclare the shifts
  const shifts = _shifts;
  // create the context
  const ctx = React.useMemo(() => ({ shifts, setShifts }), [shifts, setShifts]);
  // return the provider
  return <ScheduleContext value={ctx}>{children}</ScheduleContext>;
};
ScheduleProvider.displayName = 'ScheduleProvider';
