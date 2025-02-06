/*
  Appellation: tips_by_source <module>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';

import {
  Bar,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { cn, formatAsCurrency } from '@/utils';

import { useSchedule } from '../../provider';
import { Timesheet } from '../../types';

type Day = {
  index: number;
  name: string;
  slug: string;
};

const daysOfWeek: Day[] = [
  { index: 0, name: 'Sunday', slug: 'sun' },
  { index: 1, name: 'Monday', slug: 'mon' },
  { index: 2, name: 'Tuesday', slug: 'tue' },
  { index: 3, name: 'Wednesday', slug: 'wed' },
  { index: 4, name: 'Thursday', slug: 'thu' },
  { index: 5, name: 'Friday', slug: 'fri' },
  { index: 6, name: 'Saturday', slug: 'sat' },
];

const dayAbbreviation = (day: string) => day.slice(0, 3);

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
        <CardTitle>{payload[0].payload.day}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-2">
        <ul className="flex flex-col flex-shrink space-y-2 w-full">
          {payload.map((item, index) => (
            <li
              key={index}
              className="flex flex-row flex-nowrap items-center justify-between space-x-2 text-sm"
            >
              <span style={{ color: item.stroke ?? item.fill }}>
                {item.name}:{' '}
              </span>
              <span>{formatAsCurrency(item.value)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

type ChartData = {
  day: string;
  average: number;
};

const processData = (data: Timesheet[]): ChartData[] => {
  const records = data.reduce(
    (acc, { date, tips_cash: cash = 0, tips_credit: credit = 0 }) => {
      const day = new Date(date).getDay();
      if (!acc[day]) {
        acc[day] = {
          count: 1,
          day,
          cash,
          credit,
          total: cash + credit,
        };
      } else {
        acc[day] = {
          count: acc[day].count + 1,
          day,
          cash: acc[day].cash + cash,
          credit: acc[day].credit + credit,
          total: acc[day].total + cash + credit,
        };
      }
      return acc;
    },
    {} as Record<
      number,
      {
        count: number;
        day: number;
        cash: number;
        credit: number;
        total: number;
      }
    >
  );

  return Object.keys(records).map((key) => {
    const { day, total, count } = records[Number(key)];
    return {
      day: daysOfWeek[day].name,
      average: total / count,
    };
  });
};

export const TipsByDayChart: React.FC<
  Omit<React.ComponentProps<'div'>, "children"> & { chartHeight?: number | string }
> = ({ chartHeight = 300, className, ...props }) => {
  // use the schedule provider
  const { shifts } = useSchedule();
  // process the incoming data
  const chartData: ChartData[] = shifts ? processData(shifts) : [];
  // render the chart
  return (
    <div
      className={cn('w-full', className)}
      style={{ height: chartHeight, ...props.style }}
      {...props}
    >
      <React.Suspense fallback={null}>
        <ResponsiveContainer height="100%" width="100%">
          <ComposedChart data={chartData}>
            <Legend />
            <XAxis
              dataKey="day"
              padding="gap"
              tickFormatter={(value) => dayAbbreviation(value)}
            />
            <YAxis
              allowDecimals
              name="Amount"
              tickFormatter={(value) => formatAsCurrency(value)}
              tickMargin={2}
              type="number"
            />
            <Bar dataKey="average" name="Average" fill="#8884d8" />
            <Tooltip
              content={({ active, payload }) => (
                <CustomTooltip active={active} payload={payload} />
              )}
            />
            <XAxis />
            <YAxis />
          </ComposedChart>
        </ResponsiveContainer>
      </React.Suspense>
    </div>
  );
};
TipsByDayChart.displayName = 'TipsByDayChart';

export default TipsByDayChart;
