/*
  Appellation: provider <table>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import {
  useReactTable,
  RowData,
  Table,
  TableOptions,
} from '@tanstack/react-table';

type DataState = 'before' | 'after' | 'during';

type DataContext<TData extends RowData = any> = {
  data: TData[];
  isEmpty: boolean;
  state: DataState;
};

type DataTableContext<TData extends RowData = any> = {
  options: TableOptions<TData>;
  table: Table<TData>;
};

const DataTableContext = React.createContext<DataTableContext | null>(null);

/**
 * useTable hook to get the table context
 */
export const useDataTable = () => {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context;
};

export function DataTableProvider<TData>({
  children,
  options: optionsProp,
}: React.PropsWithChildren<{
  options: TableOptions<TData>;
}>) {
  const table = useReactTable(optionsProp);

  const contextValue = React.useMemo(
    () => ({ options: table.options, table }),
    [table]
  );
  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
}
DataTableProvider.displayName = 'DataTableProvider';