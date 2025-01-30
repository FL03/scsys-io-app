/*
  Appellation: parts <table>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import * as ReactTable from '@tanstack/react-table';
import { TableCell, TableHead, TableRow } from '@/ui/table';
import { cn } from '@/utils';

import { DataTableContextMenu } from './context-menu';

export const DataTableAction = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return <li ref={ref} className={cn('inline-flex', className)} {...props} />;
});
DataTableAction.displayName = 'DataTableAction';

export const DataTableActionGroup = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn(
        'flex flex-row flex-nowrap flex-shrink items-center space-x-2 lg:space-x-4',
        className
      )}
      {...props}
    />
  );
});
DataTableActionGroup.displayName = 'DataTableActionGroup';

export function DataTableHead<TData extends ReactTable.RowData, TValue>({
  header,
  ...props
}: React.ComponentProps<typeof TableHead> & {
  header?: ReactTable.Header<TData, TValue>;
}) {
  if (!header) return null;
  const {
    column: { columnDef },
    getContext,
    isPlaceholder,
  } = header;
  return (
    <TableHead
      className={cn(
        'inline-flex flex-row flex-nowrap flex-1 items-center justify-center min-w-24 w-full',
        'cursor-pointer select-none',
        'font-semibold text-sm text-inherit text-nowrap',
        'bg-secondary text-secondary-foreground',
        'hover:bg-primary/10'
      )}
      {...props}
    >
      {!isPlaceholder && ReactTable.flexRender(columnDef.header, getContext())}
      {isPlaceholder && <span>{columnDef.id}</span>}
    </TableHead>
  );
}
DataTableHead.displayName = 'DataTableHead';

export function DataTableHeader<TData>({
  group,
}: {
  group?: ReactTable.HeaderGroup<TData>;
}) {
  if (!group) return null;

  return (
    <TableRow
      key={group.id}
      className={cn('w-full flex flex-1 flex-row flex-nowrap items-center')}
    >
      {group.headers.map((header, index) => {
        return <DataTableHead key={index} header={header} />;
      })}
    </TableRow>
  );
}

export function DataTableCell<TData>({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return (
    <TableCell
      className={cn(
        'inline-flex flex-row items-center justify-center min-w-24 w-full ',
        className
      )}
      {...props}
    />
  );
}
DataTableCell.displayName = 'DataTableCell';

export function DataTableRow<TData>({
  className,
  onChange,
  row,
  ...props
}: React.ComponentProps<typeof TableRow> & {
  onChange?: React.FormEventHandler;
  row?: ReactTable.Row<TData>;
}) {
  if (!row) return null;

  return (
    <TableRow
      className={cn(
        'inline-flex flex-row flex-nowrap flex-1 items-center justify-start w-full',
        className
      )}
      data-state={row.getIsSelected() && 'selected'}
      onClick={() => row.toggleSelected()}
      {...props}
    >
      {row.getVisibleCells().map((cell: any, index) => {
        return (
          <DataTableCell key={index} onChange={onChange}>
            <DataTableContextMenu>
              {ReactTable.flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </DataTableContextMenu>
          </DataTableCell>
        );
      })}
    </TableRow>
  );
}
DataTableRow.displayName = 'DataTableRow';

// TableSerach
export const DataTableSearch = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('flex rounded', className)} {...props} />
));
DataTableSearch.displayName = 'DataTableSearch';

// DataTable Header
export const DataTableBanner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col flex-shrink text-foreground', className)}
    {...props}
  />
));
DataTableBanner.displayName = 'DataTableBanner';

// TableTitle
export const DataTableTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('font-semibold text-xl', className)} {...props} />
));
DataTableTitle.displayName = 'DataTableTitle';

// TableDescription
export const DataTableDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'overflow-clip text-sm text-wrap text-muted-foreground',
      className
    )}
    {...props}
  />
));
DataTableDescription.displayName = 'DataTableDescription';
