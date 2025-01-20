/*
  Appellation: charts <types>
  Contrib: @FL03
*/

export type ChartConfig = {
  [key: string]: ChartSeriesConfig;
};

export type ChartProps<T = unknown> = {
  chartHeight?: number | string;
  data?: T[] | null;
};

export type ChartSeriesConfig = {
  options: ChartSeriesOptions;
};

export type ChartSeriesOptions = {
  dataKey?: any;
  fill?: string;
  name?: string;
  stroke?: string;

  [key: string]: any;
};

export type LineProps = {
  label?: any;
  type?: import('recharts/types/shape/Curve').CurveType;
} & ChartSeriesOptions;