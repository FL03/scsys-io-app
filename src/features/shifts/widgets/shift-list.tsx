/*
  Appellation: shift-list <widgets>
  Contrib: @FL03
*/
'use client';
// packages
import * as React from 'react';
import { compareDesc } from 'date-fns'
import { useRouter } from 'next/navigation';
// project
import { cn, formatAsCurrency } from '@/utils';
// components
import {
  UList,
  ListTile,
  TileContent,
  TileLeading,
  TileTitle,
  TileBody,
} from '@/common/list-view';
// feature-specific
import { useEmployeeSchedule } from '../provider';
import { Timesheet } from '../types';
import { useProfile } from '@/features/profiles';

type CompareFn<T = any> = (a: T, b: T) => number;

type ListViewProps = DataControllerOptions

type DataControllerOptions<T = any> = {
  sortBy?: CompareFn<T>;
  itemCount?: number;
};

export const handleListViewState = (values: any[] = [], options?: DataControllerOptions) => {
  if (options?.sortBy) {
    values = values.sort(options.sortBy);
  }
  if (options?.itemCount) {
    values = values.slice(0, options.itemCount);
  }
  return values;
}

export const ShiftList: React.FC<
  React.ComponentProps<typeof UList> & ListViewProps
> = ({ className, itemCount = 5, sortBy = compareDesc, ...props }) => {
  // initialize providers
  const { username } = useProfile();
  const { shifts } = useEmployeeSchedule();
  // setup the router
  const router = useRouter();
  
  const renderItem = (
    { id, date, tips_cash: cash = 0, tips_credit: credit = 0 }: Timesheet,
    index?: number
  ) => {
    return (
      <ListTile
        id={id}
        key={index ?? id}
        className="items-center"
        onClick={() => {
          router.push(`/${username}/shifts/${id}/?action=read&view=details`);
        }}
      >
        <TileLeading>
          <TileTitle>{new Date(date).toLocaleDateString()}</TileTitle>
        </TileLeading>
        <TileBody>
          <TileContent>
            <span>{formatAsCurrency(cash + credit)}</span>
          </TileContent>
        </TileBody>
      </ListTile>
    );
  };
  const records = handleListViewState(shifts, { itemCount, sortBy: sortBy ?? compareDesc });
  return (
    <UList
      className={cn(
        'w-full ',
        itemCount && 'overflow-y-auto',
        className
      )}
      {...props}
    >
      {records.map(renderItem)}
    </UList>
  );
};
ShiftList.displayName = 'ShiftList';

export default ShiftList;
