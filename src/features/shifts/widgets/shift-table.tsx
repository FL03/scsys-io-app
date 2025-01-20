/*
  Appellation: shift-table <module>
  Contrib: @FL03
*/
'use client';
// Imports
import * as React from 'react';
import * as Lucide from 'lucide-react';
import * as ReactTable from '@tanstack/react-table';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  DataTable,
  DataTableAction,
  DataTableActionGroup,
} from '@/common/data-table';
import { useProfile } from '@/features/profiles';
import { sitemap } from '@/config';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/ui/dropdown-menu';
import { formatAsDateString } from '@/utils';
import * as actions from '../utils/form';
import { accountingStyle, dateStyle, ColumnHeader } from '@/common/data-table';

import { useEmployeeSchedule } from '../provider';
import { Timesheet } from '../types';
import { countByAgg } from '@/utils/data-table';

const columnHelper = ReactTable.createColumnHelper<Timesheet>();

const shiftColDef = [
  columnHelper.display({
    id: 'select',
    footer: () => {
      return <span className="font-semibold">Total</span>;
    },
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        className="m-0 p-0"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  }),
  columnHelper.accessor('date', {
    enableGrouping: true,
    enableHiding: true,
    enableSorting: true,

    aggregatedCell: (props) => dateStyle(props.row.original.date),
    id: 'date',
    cell: (props) => {
      return <span>{formatAsDateString(props.row.original.date)}</span>;
    },
    header: (column) => <ColumnHeader title="Date" column={column.column} />,
    aggregationFn: countByAgg,
  }),
  columnHelper.accessor('tips_cash', {
    id: 'tips_cash',
    cell: (props) => accountingStyle(props.row.original.tips_cash),
    header: 'Cash',
  }),
  columnHelper.accessor('tips_credit', {
    id: 'tips_credit',
    cell: (props) => accountingStyle(props.row.original.tips_credit),
    header: 'Credit',
  }),
  columnHelper.display({
    id: 'total_tips',
    cell: ({ row }) => {
      const { tips_cash: cash = 0, tips_credit: credit = 0 } = row.original;

      return accountingStyle(cash + credit);
    },
    header: 'Total Tips',
    aggregationFn: (_columnId, leafRows, childRows) => {
      const total = leafRows.reduce((acc, row) => {
        const { tips_cash: cash = 0, tips_credit: credit = 0 } = row.original;
        return acc + cash + credit;
      }, 0);
      return childRows.reduce((acc, row) => {
        const { tips_cash: cash = 0, tips_credit: credit = 0 } = row.original;
        return acc + cash + credit;
      }, total);
    },
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => <RowActionMenu item={props.row.original} />,
    aggregationFn: ReactTable.aggregationFns.count,
  }),
];

const TableActions: React.FC = () => {
  return (
    <DataTableActionGroup>
      <DataTableAction key={sitemap.pages.shifts.name}>
        <Button asChild variant="secondary">
          <Link
            href={{
              pathname: `/shifts/form`,
              query: { action: 'create' },
            }}
          >
            Create
          </Link>
        </Button>
      </DataTableAction>
    </DataTableActionGroup>
  );
};

const RowActionMenu: React.FC<{ item: Timesheet }> = ({ item: { id } }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Lucide.MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link
            href={{
              pathname: sitemap.pages.shifts.route(id),
              query: { action: 'update' },
            }}
          >
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={{
              pathname: sitemap.pages.shifts.route(id),
              query: { action: 'read' },
            }}
          >
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-center text-destructive-foreground bg-destructive hover:bg-blend-darken transition-colors"
          onClick={async () => {
            await actions.deleteTimesheet(id);
            toast.success('Shift deleted');
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
RowActionMenu.displayName = 'RowActionMenu';

export const ShiftTable: React.FC = () => {
  const { shifts } = useEmployeeSchedule();

  return (
    <DataTable
      actions={<TableActions />}
      columns={shiftColDef}
      data={shifts}
      title="Shifts"
      sorting={[{ id: 'date', desc: true }]}
    />
  );
};

export default ShiftTable;
