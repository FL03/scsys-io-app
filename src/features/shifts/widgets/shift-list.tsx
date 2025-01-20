/*
  Appellation: shift-list <widgets>
  Contrib: @FL03
*/
'use client';
// packages
import * as React from 'react';
import { useRouter } from 'next/navigation';
// project
import { sitemap } from '@/config';
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

type CompareFn = (a: any, b: any) => number;

type ListViewProps = {
  sortBy?: CompareFn;
  itemCount?: number;
};

export const ShiftList: React.FC<
  React.ComponentProps<typeof UList> & ListViewProps
> = ({ className, itemCount = 5, sortBy, ...props }) => {
  const { shifts } = useEmployeeSchedule();
  const router = useRouter();
  let data = shifts;
  if (sortBy) {
    data = data.sort(sortBy);
  }
  if (itemCount) {
    data = data.slice(0, itemCount);
  }

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
          router.push(`${sitemap.pages.shifts.route(id)}?action=read`);
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
      {data.map(renderItem)}
    </UList>
  );
};
ShiftList.displayName = 'ShiftList';

export default ShiftList;
