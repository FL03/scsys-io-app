/*
  Appellation: pagination <data-table>
  Contrib: @FL03
*/
'use client';

import * as Lucide from 'lucide-react';
import * as React from 'react';
// components
import { Button } from '@/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
// project
import { cn } from '@/utils';
// feature-specific
import { useDataTable } from './provider';

const PaginationButton: React.FC<React.ComponentProps<typeof Button> & {}> = ({ className, size = 'icon', variant = 'ghost', ...props }) => {
  return (
    <Button
      className={cn('', className)}
      size={size}
      variant={variant}
      {...props}
    />
  );
}
PaginationButton.displayName = 'ControlButton';


type PaginationProps = {
  pageSizes?: number[];
} & React.ComponentProps<'div'>;

export const DataTablePagination: React.FC<PaginationProps> = ({ className, pageSizes = [10, 20, 30, 40, 50], ...props }) => {
  // Get the table instance
  const { table } = useDataTable();
  
  const getItemCount = () => table.getFilteredRowModel().rows.length;
  return (
    <div
      className={cn(
        'flex flex-row flex-nowrap gap-2 items-center justify-between p-2 text-sm',
        className
      )}
      {...props}
    >
      <section className="flex-shrink text-muted-foreground mr-auto">
        {getItemCount()} items
      </section>
      <section className="inline-flex flex-1 flex-nowrap items-center justify-center gap-2">
        <PaginationButton
          className="hidden md:inline-flex"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}
        >
          <Lucide.ArrowLeftToLineIcon className="h-4 w-4" />
          <span className="sr-only">Go to first page</span>
        </PaginationButton>
        <PaginationButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <Lucide.ChevronLeftIcon className="h-4 w-4" />
        </PaginationButton>
        <div className="flex items-center justify-center gap-1">
          <span>{table.getState().pagination.pageIndex + 1}</span>
          <span className="hidden md:block">of {table.getPageCount()}</span>
        </div>
        <PaginationButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <Lucide.ChevronRightIcon className="h-4 w-4" />
        </PaginationButton>
        <PaginationButton
          className="hidden md:inline-flex"
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        >
          <span className="sr-only">Go to last page</span>
          <Lucide.ArrowRightToLineIcon className="h-4 w-4" />
        </PaginationButton>
      </section>
      <section className="ml-auto inline-flex items-center gap-2">
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 max-w-xs">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectGroup>
              <SelectLabel>Rows</SelectLabel>
              {pageSizes?.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sr-only md:not-sr-only">rows</span>
      </section>
    </div>
  );
};
DataTablePagination.displayName = 'DataTablePagination';

export default DataTablePagination;
