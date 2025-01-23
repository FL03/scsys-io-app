/*
  Appellation: provider <shifts>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';

import { Timesheet } from './types';
import { fetchUsersTips } from './utils/client';
import { Nullish } from '@/types';

type EmployeeScheduleContext = {
  shifts?: Timesheet[] | null;
  setShifts?: React.Dispatch<React.SetStateAction<Nullish<Timesheet[]>>>;
};

const EmployeeScheduleContext =
  React.createContext<EmployeeScheduleContext | null>( {
    shifts: null,
    setShifts: () => {},
  });

export const useEmployeeSchedule = () => {
  const context = React.useContext(EmployeeScheduleContext);
  if (!context) {
    throw new Error('useEmployee must be used within a EmployeeProvider');
  }
  return context;
};

export const EmployeeScheduleProvider: React.FC<
  React.PropsWithChildren<{ username: string }>
> = ({ children, username }) => {
  // initialize the shifts state
  const [_shifts, _setShifts] = React.useState<Nullish<Timesheet[]>>();
  // create a loader callback
  const loader = React.useCallback(
    async (alias?: string) => {
      const data = await fetchUsersTips(alias);
      if (data) _setShifts(data);
    },
    [fetchUsersTips, _setShifts]
  );
  // create a callback to set the shifts
  const setShifts = React.useCallback(_setShifts, [_setShifts]);

  React.useEffect(() => {
    if (!_shifts) loader(username);
  }, [username, loader, _setShifts]);

  // redeclare the shifts
  const shifts = _shifts;
  // create the context
  const ctx = React.useMemo(() => ({ shifts, setShifts }), [shifts, setShifts]);
  // return the provider
  return (
    <EmployeeScheduleContext value={ctx}>{children}</EmployeeScheduleContext>
  );
};
EmployeeScheduleProvider.displayName = 'EmployeeProvider';
