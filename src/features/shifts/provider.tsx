/*
  Appellation: provider <shifts>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import {
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
} from '@supabase/supabase-js';

// project
import { Nullish } from '@/types';
import { logger } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
// feature-specific
import { Timesheet } from './types';
import { adjustedDate, fetchUsersTips } from './utils';

type ScheduleContext = {
  shifts?: Timesheet[] | null;
  setShifts?: React.Dispatch<React.SetStateAction<Nullish<Timesheet[]>>>;
};

const ScheduleContext = React.createContext<ScheduleContext | null>({
  shifts: null,
  setShifts: () => {},
});

export const useSchedule = () => {
  const context = React.useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider: React.FC<
  React.PropsWithChildren<{ username: string }>
> = ({ children, username }) => {
    // initialize the supabase client
    const supabase = createBrowserClient();
    // declared a state to check if the hook has been initialized
    const [_initialized, _setInitialized] = React.useState<boolean>(false);
    // initialize the shifts state
    const [_shifts, _setShifts] = React.useState<Nullish<Timesheet[]>>(null);
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
    // create a channel reference
    const channelRef = React.useRef<Nullish<RealtimeChannel>>(
      supabase.channel(`shifts:${username}`, { config: { private: true } })
    );
    // create a callback to handle postgres_changes
    const handleChanges = React.useCallback(
      (payload:{ [key: string]: any }) => {
        logger.info('Change detected within the shifts table');
        const newData = payload.new as Timesheet;
        if (payload.eventType === 'INSERT') {
          logger.info('New shift detected');
          _setShifts((v) => {
            return v ? [...v, newData] : [newData];
          });
        }
        if (payload.eventType === 'UPDATE') {
          logger.info('Shift updated');
          _setShifts((v) => {
            return v?.map((shift) => {
              return shift.id === newData.id ? newData : shift;
            });
          });
        }
        if (payload.eventType === 'DELETE') {
          logger.info('Shift deleted');
          _setShifts((v) => {
            return v?.filter((shift) => shift.id !== newData.id);
          });
        }
      },
      [_setShifts]
    );

    const handleSubscribe = React.useCallback((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
      if (status === 'SUBSCRIBED') {
        logger.info('Subscribed to shifts channel');
      }
      if (status === 'CLOSED') {
        logger.info('Closed the shifts channel');
      }
      if (err) {
        logger.error('Error subscribing to shifts channel', err);
      }
    }, []);
  
    const onSubscribe = React.useCallback(
      (callback: (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => void, timeout?: number) => {
        channelRef.current?.subscribe(callback, timeout);
      },
      [channelRef]
    );
    // load the shifts
    React.useEffect(() => {
      // if null, load the shifts data
      if (!_shifts) {
        loader(username);
      }
    }, [_shifts, loader, username]);
    // realtime effects
    React.useEffect(() => {
      // if the channel is not initialized, initialize it
      if (!channelRef.current) {
        channelRef.current = supabase
          .channel(`shifts:${username}`, { config: { private: false } })
          .on(
            'postgres_changes',
            {
              event: '*',
              filter: `assignee=eq.${username}`,
              schema: 'public',
              table: 'shifts',
            },
            handleChanges
          ).subscribe(
            handleSubscribe
          );
      }
  
      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }, [
      _initialized, _shifts, handleChanges, channelRef, supabase, username,
    ]);
    const channel = channelRef.current;
    // redeclare the shifts
    const shifts = _shifts;
    // create a callback to set the shifts
    const setShifts = React.useCallback(_setShifts, [_setShifts]);
    // create the context
    const ctx = React.useMemo(() => ({ shifts, onSubscribe, setShifts }), [shifts, onSubscribe, setShifts]);
  // return the provider
  return <ScheduleContext value={ctx}>{children}</ScheduleContext>;
};
ScheduleProvider.displayName = 'ScheduleProvider';
