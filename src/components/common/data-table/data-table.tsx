/*
  Appellation: data-table <table>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import * as ReactTable from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
} from '@tanstack/react-table';
// project
import { ShiftContextMenu } from '@/features/shifts';
import { cn } from '@/utils';
// components
import { Input } from '@/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/ui/table';
// feature-specific
import { DataTablePagination } from './pagination';
import { DataTableHeader, DataTableRow } from './parts';
import { useDataTable, DataTableProvider } from './provider';
import { TotalRow } from './rows/total-row';

type TableProps<TData extends RowData = any> = {
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  columns?: any[];
  data?: TData[];
  filter?: string;
  onCellChange?: React.FormEventHandler;
  pagination?: ReactTable.PaginationState;
  rowCount?: number;
  selection?: ReactTable.RowSelectionState;
  sorting?: ReactTable.SortingState;
};

const EmptyRow: React.FC<
  React.ComponentProps<typeof TableRow> & { colSpan?: number }
> = ({ colSpan = 1, ...props }) => {
  return (
    <TableRow {...props}>
      <TableCell colSpan={colSpan} className="h-[1/12] text-center">
        No results.
      </TableCell>
    </TableRow>
  );
};

function DataTableImpl<TData extends RowData = any>({
  className,
  ...props
}: React.ComponentProps<typeof Table>) {
  const { table } = useDataTable();
  return (
    <Table className={cn('w-full', className)} {...props}>
      <TableHeader>
        {table.getHeaderGroups().map((value, index) => (
          <DataTableHeader key={index} group={value} />
        ))}
      </TableHeader>
      {/* Table Body */}
      <TableBody className="w-full">
        {table.getRowCount() === 0 ? (
          <EmptyRow colSpan={table.getAllColumns().length} />
        ) : (
          table.getPaginationRowModel().rows.map((row, index) => (
            <ShiftContextMenu asChild key={index} itemId={row.original.id}>
              <DataTableRow key={index} row={row} />
            </ShiftContextMenu>
          ))
        )}
      </TableBody>
      {/* Table Footer */}
      <TableFooter className="w-full inline-flex flex-nowrap items-center">
        <TotalRow />
      </TableFooter>
    </Table>
  );
}
DataTableImpl.displayName = 'DataTableImpl';

export const DataTable: React.FC<
  React.ComponentProps<'div'> &
    TableProps & {
      title?: React.ReactNode;
      description?: React.ReactNode;
    }
> = ({
  actions,
  className,
  children,
  columns = [],
  data = [],
  onCellChange,
  rowCount,
  filter: filterProp = '',
  pagination: paginationProp = { pageIndex: 0, pageSize: 10 },
  selection: selectionProp = {},
  sorting: sortingProp = [],
  ...props
}) => {
  // initialize the table state
  const [globalFilter, setGlobalFilter] = React.useState(filterProp);
  const [rowSelection, setRowSelection] = React.useState(selectionProp);
  const [sorting, setSorting] = React.useState(sortingProp);
  const [pagination, setPagination] = React.useState(paginationProp);
  // set the table options
  const tableOptions = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    rowCount: rowCount,
    state: {
      globalFilter,
      pagination,
      rowSelection,
      sorting,
    },
  };

  return (
    <DataTableProvider options={tableOptions}>
      <div
        className={cn('relative w-full flex flex-col flex-1', className)}
        {...props}
      >
        <div className="ml-auto mb-2 inline-flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
          <Input
            className="max-w-sm"
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search the table..."
            value={globalFilter}
          />
          {children}
        </div>
        <DataTableImpl />
        <DataTablePagination className="w-full" />
      </div>
    </DataTableProvider>
  );
};
DataTable.displayName = 'DataTable';

export default DataTable;
