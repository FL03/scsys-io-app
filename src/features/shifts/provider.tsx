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
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';

// project
import { Nullish } from '@/types';
import { logger } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
// feature-specific
import { Timesheet } from './types';
import { adjustedDate, fetchUsersTips } from './utils';

const handleNewData = (value: Timesheet) => {
  return { ...value, date: adjustedDate(value.date).toISOString() };
};

const handleSubscribe = (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
  if (status === 'SUBSCRIBED') {
    logger.info('Subscribed to shifts channel');
  }
  if (status === 'CLOSED') {
    logger.info('Closed the shifts channel');
  }
  if (err) {
    logger.error('Error subscribing to shifts channel', err);
  }
};

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
  const _loadShifts = React.useCallback(
    async (alias?: string) => {
      try {
        const data = await fetchUsersTips(alias).then((res) => {
          return res?.map(({ date, ...shift }) => {
            return {
              date: adjustedDate(date).toISOString(),
              ...shift,
            };
          });
        });
        if (data) _setShifts(data);
      } catch (err) {
        logger.error('Error loading shifts ', err);
      } finally {
        _setInitialized(true);
      }
    },
    [_setShifts, _setInitialized]
  );
  // create a channel reference
  const _channel = React.useRef<Nullish<RealtimeChannel>>(null);
  // create a callback to handle postgres_changes
  const _onChange = React.useCallback(
    (payload: RealtimePostgresChangesPayload<Timesheet>) => {
      logger.info('Processing changes to the shifts table');
      // make sure any new data is correctly formatted
      const data = handleNewData(payload.new as Timesheet);
      // handle any new shifts
      if (payload.eventType === 'INSERT') {
        logger.info('New shift detected');
        _setShifts((prev) => {
          return prev ? [...prev, data] : [data];
        });
      }
      // handle any updates made to a shift
      if (payload.eventType === 'UPDATE') {
        logger.info('Shift updated');
        _setShifts((v) => {
          return v?.map((shift) => {
            return shift.id === data.id ? data : shift;
          });
        });
      }
      // remove any deleted shifts from the store
      if (payload.eventType === 'DELETE') {
        logger.info('Shift deleted');
        _setShifts((v) => {
          return v?.filter((shift) => shift.id !== data.id);
        });
      }
    },
    [_setShifts]
  );
  const _createChannel = React.useCallback(() => {
    return supabase
      .channel(`shifts:${username}`, { config: { private: true } })
      .on(
        'postgres_changes',
        {
          event: '*',
          filter: `assignee=eq.${username}`,
          schema: 'public',
          table: 'shifts',
        },
        _onChange
      )
      .subscribe(handleSubscribe);
  }, [supabase, username, _onChange]);
  // load the shifts
  React.useEffect(() => {
    // if null, load the shifts data
    if (!_initialized && !_shifts) _loadShifts(username);
  }, [_initialized, _shifts, _loadShifts, username]);
  // realtime effects
  React.useEffect(() => {
    // if the channel is not initialized, initialize it
    if (!_channel.current) {
      _channel.current = _createChannel();
    }

    return () => {
      if (_channel.current) {
        supabase.removeChannel(_channel.current);
        _channel.current = null;
      }
    };
  }, [supabase, username, _channel, _createChannel]);
  // redeclare the shifts
  const shifts = _shifts;
  // create a callback to set the shifts
  const setShifts = React.useCallback(_setShifts, [_setShifts]);
  // create the context
  const ctx = React.useMemo(() => ({ shifts, setShifts }), [shifts, setShifts]);
  // return the provider
  return <ScheduleContext value={ctx}>{children}</ScheduleContext>;
};
ScheduleProvider.displayName = 'ScheduleProvider';
