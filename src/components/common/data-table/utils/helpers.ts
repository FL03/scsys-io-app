/*
  Appellation: summary <data-table>
  Contrib: @FL03
*/
import * as ReactTable from '@tanstack/react-table';

export const countByAgg: ReactTable.AggregationFn<any> = (
  columnId,
  leafRows,
  childRows
) => {
  const count = leafRows.reduce((acc, row) => {
    if (row.original[columnId]) {
      acc++;
    }
    return acc;
  }, 0);
  return childRows.reduce((acc, row) => {
    if (row.original[columnId]) {
      acc++;
    }
    return acc;
  }, count);
};