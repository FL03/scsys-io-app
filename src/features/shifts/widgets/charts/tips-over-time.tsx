/*
  Appellation: tips_over_time <charts>
  Contrib: @FL03
*/
'use client';
// imports
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
// project
import { ChartConfig } from '@/types/charts';
import { formatAsCurrency } from '@/utils';
import { cn } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';
// feature-specific
import { useSchedule } from '../../provider';
import { Timesheet } from '../../types';

const CustomTooltip: React.FC<
  React.ComponentProps<typeof Card> & { active?: boolean; payload?: any[] }
> = ({ active, payload, ...props }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>
          {new Date(payload[0].payload.date).toLocaleDateString()}
        </CardTitle>
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

export const ChartThemes = {
  "dark": {},
  "light": {
    background: '#FFF',
    color: '#000',

  },
}
export const TipsOverTimeChart: React.FC<
  Omit<React.ComponentProps<'div'>, 'children'> & {
    chartHeight?: number | string;
  }
> = ({ chartHeight = 300, className, ...props }) => {
  // use the schedule provider
  const { shifts } = useSchedule();
  // define the chart configuration
  const chartConfig: ChartConfig = {
    cash: {
      dataKey: 'tips_cash',
      fill: '#00FFFF',
      name: "Cash",
      stroke: '#00FFFF',
      
    },
    credit: {
      dataKey: 'tips_credit',
      fill: '#EB0194',
      name: "Credit",
      stroke: '#EB0194',
    },
    total: {
      fill: '#FFF',
      stroke: '#FFF',
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
      <React.Suspense fallback={null}>
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
              name="Cash"
              strokeWidth={1}
              type="monotone"
              {...chartConfig.cash}
            />
            <Bar
              stackId="tips"
              barSize={1}
              dataKey="tips_credit"
              name="Credit"
              strokeWidth={1}
              type="monotone"
              {...chartConfig.credit}
            />
            <XAxis
              dataKey="date"
              name="Date"
              textAnchor="middle"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
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
      </React.Suspense>
    </div>
  );
};
TipsOverTimeChart.displayName = 'TipsOverTimeChart';

export default TipsOverTimeChart;
