/*
  Appellation: use-shifts <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { Timesheet, adjustedDate, fetchUsersTips } from '@/features/shifts';
import { Nullish } from '@/types';
import { logger } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
import {
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
} from '@supabase/supabase-js';

export const useShifts = (username?: string) => {
  // initialize the supabase client
  const supabase = createBrowserClient();
  // declared a state to check if the hook has been initialized
  const [_initialized, _setInitialized] = React.useState<boolean>(false);
  // initialize the shifts state
  const [_shifts, _setShifts] = React.useState<Timesheet[]>([]);
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
    [_setShifts]
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
        _setShifts((v) => {
          return v ? [...v, newData] : [newData];
        });
      }
      if (payload.eventType === 'UPDATE') {
        _setShifts((v) => {
          return v?.map((shift) => {
            return shift.id === newData.id ? newData : shift;
          });
        });
      }
      if (payload.eventType === 'DELETE') {
        _setShifts((v) => {
          return v?.filter((shift) => shift.id !== newData.id);
        });
      }
    },
    [_setShifts]
  );

  const onSubscribe = React.useCallback(
    (callback: (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => void, timeout?: number) => {
      channelRef.current?.subscribe(callback, timeout);
    },
    [channelRef]
  );
  // load the shifts
  React.useEffect(() => {
    // if null, load the shifts data
    if (!_initialized && _shifts.length === 0) {
      loader(username);
      _setInitialized(true);
    }
  }, [_initialized, _shifts, loader, username]);
  // realtime effects
  React.useEffect(() => {
    // if the channel is not initialized, initialize it
    if (!channelRef.current) {
      channelRef.current = supabase
        .channel(`shifts:${username}`, { config: { private: true } })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'shifts',
          },
          handleChanges
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
  // redeclare the shifts
  const shifts = _shifts;
  // create a callback to set the shifts
  const setShifts = React.useCallback(_setShifts, [_setShifts]);
  // create the context
  return React.useMemo(() => ({ shifts, onSubscribe, setShifts }), [shifts, setShifts]);
};
