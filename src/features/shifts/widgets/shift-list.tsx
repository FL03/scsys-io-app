/*
  Appellation: shift-list <widgets>
  Contrib: @FL03
*/
'use client';
// packages
import * as React from 'react';
import { compareAsc, compareDesc } from 'date-fns';
import { useRouter } from 'next/navigation';
// project
import { useProfile } from '@/features/profiles';
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

export const ShiftList: React.FC<
  React.ComponentProps<typeof UList> & {
    descending?: boolean;
    itemCount?: number;
  }
> = ({ className, descending = false, itemCount = 5, ...props }) => {
  // initialize providers
  const { username } = useProfile();
  const { shifts } = useEmployeeSchedule();
  // setup the router
  const router = useRouter();

  const handleData = (values: any[]) => {
    values = values.sort((a, b) =>
      descending
        ? compareDesc(new Date(a.date), new Date(b.date))
        : compareAsc(new Date(a.date), new Date(b.date))
    );
    if (itemCount) {
      values = values.slice(0, itemCount);
    }
    return values;
  };

  const data = shifts ? handleData(shifts) : [];

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
          router.push(`/${username}/shifts/${id}?action=read&view=details`);
        }}
      >
        <TileLeading>
          <TileTitle className="text-right">
            {new Date(date).toLocaleDateString()}
          </TileTitle>
        </TileLeading>
        <TileBody>
          <TileContent className="items-end">
            <span>{formatAsCurrency(cash + credit)}</span>
          </TileContent>
        </TileBody>
      </ListTile>
    );
  };
  return (
    <UList
      className={cn('w-full ', itemCount && 'overflow-y-auto', className)}
      {...props}
    >
      {data?.map(renderItem)}
    </UList>
  );
};
ShiftList.displayName = 'ShiftList';

export default ShiftList;
