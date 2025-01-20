/*
  Appellation: provider <shifts>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';

import { useProfile } from '@/features/profiles';

import { Timesheet } from './types';
import { fetchUsersTips } from './utils/client';

type EmployeeScheduleContext = {
  shifts: Timesheet[];
  setShifts: React.Dispatch<React.SetStateAction<Timesheet[]>>;
};

const EmployeeScheduleContext =
  React.createContext<EmployeeScheduleContext | null>(null);

export const useEmployeeSchedule = () => {
  const context = React.useContext(EmployeeScheduleContext);
  if (!context) {
    throw new Error('useEmployee must be used within a EmployeeProvider');
  }
  return context;
};

export const EmployeeScheduleProvider: React.FC<
  React.PropsWithChildren<{ username?: string }>
> = ({ children, username }) => {
  const [_shifts, _setShifts] = React.useState<Timesheet[]>([]);

  const loadData = React.useCallback(fetchUsersTips, [fetchUsersTips]);

  React.useEffect(() => {
    loadData(username).then(_setShifts);
  }, [username, loadData, _setShifts]);

  // initialize a ref to store the data
  const shifts = _shifts;
  // setup the callback
  const setShifts = React.useCallback(_setShifts, [_setShifts]);

  const ctx = React.useMemo(
    () => ({ shifts, setShifts }),
    [shifts, setShifts]
  );

  return (
    <EmployeeScheduleContext value={ctx}>{children}</EmployeeScheduleContext>
  );
};
EmployeeScheduleProvider.displayName = 'EmployeeProvider';
