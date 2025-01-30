/*
  Appellation: columns <data-table>
  Contrib: @FL03
*/
'use client';
// global 
import * as Lucide from 'lucide-react';
import * as React from 'react';
import * as ReactTable from '@tanstack/react-table';
// components
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
// project
import { cn } from '@/utils';


export function ColumnHeader<TData, TValue>({
  className,
  column,
  size = 'sm',
  title,
  variant = 'ghost',
  ...props
}: React.ComponentProps<typeof Button> & {
  column: ReactTable.Column<TData, TValue>;
  title: string;
}) {
  // determine if the column can be sorted
  const canSort = column.getCanSort();

  const TriggerIcon = () => {
    switch (column.getIsSorted()) {
      case 'desc':
        return <Lucide.AArrowDownIcon className="ml-2 h-4 w-4" />;
      case 'asc':
        return <Lucide.AArrowUpIcon className="ml-2 h-4 w-4" />;
      default:
        return <Lucide.ArrowUpDownIcon className="ml-2 h-4 w-4" />;
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('-ml-3 h-8 data-[state=open]:bg-accent', className)}
          variant={variant}
          {...props}
        >
          <TriggerIcon />

          <span className="text-inherit font-semibold">{title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {canSort && (
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <Lucide.AArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
        )}
        {canSort && (
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <Lucide.AArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
        )}
        {canSort && <DropdownMenuSeparator />}
        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
          <Lucide.LucideEyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
ColumnHeader.displayName = 'DTableColumnHeader';