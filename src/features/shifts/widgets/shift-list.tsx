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

export const listViewController = (values: any[] = [], options?: ListViewQuery) => {
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
        <TileContent>
          <span>{formatAsCurrency(cash + credit)}</span>
        </TileContent>
      </ListTile>
    );
  };
  return (
    <UList
      className={cn(
        'flex flex-col flex-1 h-[200px] gap-2 items-center w-full ',
        className
      )}
      {...props}
    >
      {listViewController(shifts, { itemCount, sortBy }).map(renderItem)}
    </UList>
  );
};
ShiftList.displayName = 'ShiftList';

export default ShiftList;
