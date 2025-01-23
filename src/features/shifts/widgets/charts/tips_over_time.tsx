/*
  Appellation: tips_over_time <charts>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { compareAsc } from 'date-fns';
import {
  Bar,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartConfig, ChartProps } from '@/types/charts';
import { formatAsCurrency, formatAsDateString } from '@/utils/fmt';
import { cn } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { useEmployeeSchedule } from '../../provider';

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({
  active,
  payload,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatAsDateString(payload[0].payload.date)}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-2">
        <ul className="flex flex-col flex-shrink space-y-2 w-full">
          {payload.map((item, index) => (
            <li
              key={index}
              className="flex flex-row flex-nowrap items-center justify-between space-x-2 text-sm"
            >
              <span style={{ color: item.stroke }}>{item.name}: </span>
              <span>{formatAsCurrency(item.value)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const TipsOverTimeChart: React.FC<
  React.HTMLAttributes<HTMLDivElement> &
    ChartProps<import('../../types').Timesheet>
> = ({ chartHeight = 300, className, ...props }) => {
  const { shifts } = useEmployeeSchedule();

  const chartConfig: ChartConfig = {
    cash: {
      options: {
        fill: '#00FFFF',
        name: 'Cash',
        stroke: '#00FFFF',
      },
    },
    credit: {
      options: {
        fill: '#EB0194',
        name: 'Credit',
        stroke: '#EB0194',
      },
    },
    total: {
      options: {
        fill: '#FFF',
        name: 'Total Tips',
        stroke: '#FFF',
      },
    },
  };

  const chartData = shifts
    ? shifts
        .map(({ date, tips_cash: cash = 0, tips_credit: credit = 0 }) => ({
          date: date,
          tips_cash: cash,
          tips_credit: credit,
          total_tips: cash + credit,
        }))
        .sort((a, b) => compareAsc(a.date, b.date))
    : [];

  return (
    <div
      className={cn('w-full', className)}
      style={{ height: chartHeight, ...props.style }}
      {...props}
    >
      <ResponsiveContainer height="100%" width="100%">
        <ComposedChart
          data={chartData}
          title="Earned Tips"
          style={{ padding: 5 }}
        >
          <Bar
            stackId="tips"
            barSize={1}
            dataKey="tips_cash"
            strokeWidth={1}
            type="monotone"
            {...chartConfig.cash.options}
          />
          <Bar
            stackId="tips"
            barSize={1}
            dataKey="tips_credit"
            strokeWidth={1}
            type="monotone"
            {...chartConfig.credit.options}
          />

          <XAxis
            dataKey="date"
            name="Date"
            textAnchor="middle"
            tickFormatter={(value) => formatAsDateString(value)}
            tickMargin={2}
            type="category"
          />
          <YAxis
            allowDecimals
            name="Amount"
            tickFormatter={(value) => formatAsCurrency(value)}
            tickMargin={2}
            type="number"
          />
          <Legend enableBackground="#000" name="Legend" />
          <Tooltip
            content={({ active, payload }) => (
              <CustomTooltip active={active} payload={payload} />
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
TipsOverTimeChart.displayName = 'TipsOverTimeChart';

export default TipsOverTimeChart;
