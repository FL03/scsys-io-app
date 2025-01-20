/*
  Appellation: shift-list <widgets>
  Contrib: @FL03
*/
'use client';
// packages
import * as React from 'react';
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

type CompareFn = <T>(a: T, b: T) => number;

type ListViewProps = {
  sortBy?: CompareFn;
  itemCount?: number;
};

type ListViewQuery = {
  sortBy?: CompareFn;
  itemCount?: number;
};

export const handleListViewState = (values: any[] = [], options?: ListViewQuery) => {
  let data = values;
  if (options?.sortBy) {
    data = data.sort(options.sortBy);
  }
  if (options?.itemCount) {
    data = data.slice(0, options.itemCount);
  }
  return data;
}

export const ShiftList: React.FC<
  React.ComponentProps<typeof UList> & ListViewProps
> = ({ className, itemCount = 5, sortBy, ...props }) => {
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
  const records = handleListViewState(shifts, { itemCount, sortBy });
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
