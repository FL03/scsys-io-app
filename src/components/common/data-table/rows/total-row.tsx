/*
  Appellation: total-row <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import * as ReactTable from '@tanstack/react-table';
import { cva, type VariantProps } from 'class-variance-authority';
// components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from '@/ui/select';
import { TableCell, TableFooter, TableRow } from '@/ui/table';
// project
import { cn, formatAsCurrency } from '@/utils';
// feature-specific
import { useDataTable } from '../provider';

const tableFooterVariants = cva(
  'inline-flex flex-1 items-center justify-between w-full',
  {
    defaultVariants: {
      flavor: 'default',
      variant: 'default',
    },
    variants: {
      flavor: {
        default: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        black: 'bg-black text-white',
        white: 'bg-white text-black',
      },
      variant: {
        default: 'flex-row flex-nowrap items-center text-nowrap',
      },
    },
  }
);

export function TotalRowSelect<
  TData extends ReactTable.RowData,
  TValue = unknown,
>({
  column,
  datatype,
  ...props
}: React.ComponentProps<typeof Select> & {
  column: ReactTable.Column<TData, TValue>;
  datatype?: 'number' | 'currency' | 'percent';
}) {
  const { table } = useDataTable();

  const [selected, setSelected] = React.useState('count');
  const [value, setValue] = React.useState<number | null>(null);

  const handleSummary = () => {
    const rows = table.getCoreRowModel().rows;
    let res: number | null = null;
    switch (selected) {
      case 'avg':
        res = Number(colAvg(column.id, ...rows).toFixed(2));
        break;
      case 'count':
        res = colCountExists(column.id, ...rows);
        break;
      case 'min':
        res = colMin(column.id, ...rows);
        break;
      case 'max':
        res = colMax(column.id, ...rows);
        break;
      case 'std':
        res = Number(colStd(column.id, ...rows).toFixed(2));
        break;
      case 'sum':
        res = Number(colSum(column.id, ...rows).toFixed(2));
        break;
      case 'unique':
        res = colCountUnique(column.id, ...rows);
        break;
      default:
        break;
    }
    setValue(res);
  };

  function colCountExists(columnId: string, ...rows: ReactTable.Row<any>[]) {
    return rows.reduce((acc, row) => {
      return acc + (row.original[columnId] ? 1 : 0);
    }, 0);
  }

  function colCountUnique(
    columnId: string,
    ...rows: ReactTable.Row<any>[]
  ) {
    return rows.filter(
      (row, index, self) =>
        self.findIndex(
          (r) => r.original[columnId] === row.original[columnId]
        ) === index
    ).length;
  }

  function colAvg(columnId: string, ...rows: ReactTable.Row<any>[]) {
    return colSum(columnId, ...rows) / rows.length;
  }

  function colSum(columnId: string, ...rows: ReactTable.Row<any>[]) {
    const sum = rows.reduce((acc, row) => {
      return acc + (row.original[columnId] ?? 0);
    }, 0);
    return Number(sum);
  }

  function colStd(columnId: string, ...rows: ReactTable.Row<any>[]) {
    const mean = colAvg(columnId, ...rows);
    const sum = rows.reduce((acc, row) => {
      return acc + Math.pow(row.original[columnId] - mean, 2);
    }, 0);
    return Math.sqrt(sum / rows.length);
  }

  function colMin(columnId: string, ...rows: ReactTable.Row<any>[]) {
    return rows.reduce((acc, row) => {
      return Math.min(acc, row.original[columnId]);
    }, Infinity);
  }

  function colMax(columnId: string, ...rows: ReactTable.Row<any>[]) {
    return rows.reduce((acc, row) => {
      return Math.max(acc, row.original[columnId]);
    }, -Infinity);
  }

  React.useEffect(() => {
    handleSummary();
  }, [handleSummary]);

  let display: any = `${value}`;
  if (datatype === 'currency' && selected.match(/avg|min|max|std|sum/)) {
    display = formatAsCurrency(value);
  }

  return (
    <Select onValueChange={setSelected} value={selected} {...props}>
      <SelectTrigger
        className={cn(
          'inline-flex justify-center gap-2 border-none',
          'hover:bg-primary/20'
        )}
      >
        <span>{display}</span>
        <span className="text-muted-foreground ">{selected}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="count">Count</SelectItem>
        <SelectItem value="unique">Unique</SelectItem>
        <SelectSeparator />
        <SelectGroup title="stats">
          <SelectLabel>Statistics</SelectLabel>
          <SelectItem value="avg">Average</SelectItem>
          <SelectItem value="min">Min</SelectItem>
          <SelectItem value="max">Max</SelectItem>
          <SelectItem value="std">Standard Deviation</SelectItem>
          <SelectItem value="sum">Sum</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const TotalRowCell: React.FC<React.ComponentProps<typeof TableCell>> = ({
  className,
  colSpan = 1,
  ...props
}) => {
  return (
    <TableCell
      className={cn(
        'inline-flex flex-1 items-center justify-center',
        'font-semibold ',
        'transition-colors whitespace-nowrap',
        'hover:cursor-pointer focus:ring focus:ring-ring',
        className
      )}
      colSpan={colSpan}
      {...props}
    />
  );
};
TotalRowCell.displayName = 'TotalRowCell';

export const TotalRow: React.FC<React.ComponentProps<typeof TableRow>> = ({
  className,
  ...props
}) => {
  const { table } = useDataTable();

  const columns = table.getAllColumns();
  const dataCols = columns.filter((column) => column.id.startsWith('tips_c'));
  const dateCol = columns.find((column) => column.id === 'date');
  const totalTipsCol = columns.find((column) => column.id === 'total_tips');
  const totalRows = table.getCoreRowModel().rows.length;

  return (
    <TableRow className={cn('flex flex-1 flex-nowrap w-full', className)} {...props}>
      <TableCell
        className="inline-flex flex-1 px-2 items-center justify-center"
        colSpan={1}
      >
        <span className="font-semibold">Total</span>
      </TableCell>
      <TotalRowCell>
        <span>
          {dateCol?.getAggregationFn?.()?.(
            'date',
            [],
            table.getCoreRowModel().rows
          )}
        </span>
      </TotalRowCell>
      {dataCols.map((column, index) => {
        return (
          <TotalRowCell key={index} colSpan={1}>
            <TotalRowSelect column={column} datatype="currency"/>
          </TotalRowCell>
        );
      })}
      <TotalRowCell key={totalTipsCol?.id} colSpan={1}>
        <span>
          {formatAsCurrency(
            totalTipsCol?.getAggregationFn?.()?.(
              totalTipsCol?.id,
              [],
              table.getCoreRowModel().rows
            )
          )}
        </span>
        {/* <TotalRowSelect column={column} /> */}
      </TotalRowCell>
      <TableCell className="inline-flex flex-1 items-center justify-center gap-2" colSpan={1}>
        <span className="font-semibold">{totalRows}</span>
        <span className="text-muted-foreground">rows</span>
      </TableCell>
    </TableRow>
  );
};
TotalRow.displayName = 'TotalRow';

const Summaries: React.FC<
  React.ComponentProps<typeof TableRow> &
    VariantProps<typeof tableFooterVariants>
> = ({ className, flavor = 'default', variant = 'default', ...props }) => {
  const { table } = useDataTable();

  const columns = table.getAllColumns();
  const dataCols = columns.filter(
    (column) => column.id !== 'select' && column.id !== 'actions'
  );
  const totalRows = table.getCoreRowModel().rows.length;
  const tableFooter = table.getFooterGroups();

  return (
    <TableRow className={cn('w-full', className)} {...props}>
      <TableCell
        className="inline-flex flex-1 min-w-24 px-2 items-center justify-end font-semibold"
        colSpan={1}
      >
        <span>Total</span>
      </TableCell>

      {dataCols.map((column, index) => {
        return (
          <TotalRowCell key={index} colSpan={1}>
            <span>
              {column
                .getAggregationFn?.()?.(
                  column.id,
                  [],
                  table.getCoreRowModel().rows
                )
                .toFixed(2)}
            </span>
          </TotalRowCell>
        );
      })}

      <TotalRowCell colSpan={1}>
        <span>{totalRows} rows</span>
      </TotalRowCell>
    </TableRow>
  );
};

export const DataTableFooter: React.FC<
  React.ComponentProps<typeof TableFooter> &
    VariantProps<typeof tableFooterVariants>
> = ({ children, className, flavor, variant, ...props }) => {

  const { table } = useDataTable();

  const columns = table.getAllColumns();
  const footer = table.getFooterGroups();
  return (
    <TableFooter
      className={cn(
        tableFooterVariants({ flavor, variant }),
        'w-full flex flex-1 flex-row flex-nowrap items-center justify-start',
        className
      )}
      {...props}
    >
      {children}
    </TableFooter>
  );
};
DataTableFooter.displayName = 'DataTableFooter';
