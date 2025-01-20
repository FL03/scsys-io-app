/*
  Appellation: timesheet_form <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { Crud } from '@/types';
import { cn } from '@/utils';
// components
import { DatePickerPopover } from '@/common/calendar';
import { FormOverlay } from '@/common/form-dialog';
import { Button } from '@/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
// features-specific
import * as actions from '../utils';

const shiftDetails = z
  .object({
    start_at: z.coerce.date(),
    end_at: z.coerce.date(),
    clocked_in: z.coerce.date(),
    clocked_out: z.coerce.date(),
  })
  .partial();

// define the form values
export const shiftFormValues = z
  .object({
    id: z.string().uuid().readonly().nullish(),
    assignee: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform((arg) => new Date(arg)),
    tips_cash: z.coerce.number().nullish(),
    tips_credit: z.coerce.number().nullish(),
    attachments: z.array(z.string()).nullish(),
    status: z.string().default('todo').nullish(),
    tags: z.array(z.string()).nullish(),
    employee_id: z.string().uuid().nullish(),
  })
  .merge(shiftDetails)
  .default({
    assignee: '',
    attachments: [],
    date: new Date().toLocaleDateString(),
    status: 'todo',
    tags: [],
    tips_cash: 0,
    tips_credit: 0,
  });

export type ShiftFormValues = z.infer<typeof shiftFormValues>;

const parseValues = (values?: any | null) => {
  return shiftFormValues.parse({
    ...values,
    assignee: values?.assignee ?? '',
    attachments: values?.attachments ?? [],
    date: new Date(values?.date ?? new Date()).toLocaleDateString(),
    status: values?.status ?? 'todo',
    tags: values?.tags ?? [],
    tips_cash: values?.tips_cash ?? 0,
    tips_credit: values?.tips_credit ?? 0,
  });
};

type FormProps = {
  defaultValues?: ShiftFormValues;
  description?: React.ReactNode;
  mode?: Crud;
  title?: React.ReactNode;
  values?: ShiftFormValues;
};

export const TimesheetForm: React.FC<
  React.ComponentProps<'form'> & FormProps
> = ({
  className,
  defaultValues,
  description,
  title,
  mode = 'create',
  values,
  ...props
}) => {
  if (defaultValues && values) {
    throw new Error('Cannot provide both defaultValues and values');
  }
  if (defaultValues) {
    defaultValues = parseValues(defaultValues);
  }
  if (values) {
    values = parseValues(values);
  }
  // define the form
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormValues),
    defaultValues,
    values,
  });

  const showHeader = !(!description && !title);
  return (
    <Form {...form}>
      <form
        className={cn('w-full gap-2 lg:gap-4', className)}
        onSubmit={form.handleSubmit(actions.saveTimesheet)}
        {...props}
      >
        {/* Assignee */}
        <FormField
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="The employee assigned to the shift"
                />
              </FormControl>
              <FormDescription>
                Assignee an employee to the shift
              </FormDescription>
            </FormItem>
          )}
        />
        {/* date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem datatype="text" itemType="text">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePickerPopover
                  onDateSelect={(date) => field.onChange(new Date(date))}
                  selected={field.value}
                />
              </FormControl>
              <FormDescription>
                Select a date for your appointment.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* cash */}
        <FormField
          control={form.control}
          name="tips_cash"
          render={({ field }) => (
            <FormItem itemType="number" datatype="number">
              <FormLabel>Cash</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="The amount of cash tips received"
                  type="number"
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                The total amount of cash tips earned throughout the shift.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* credit */}
        <FormField
          control={form.control}
          name="tips_credit"
          render={({ field }) => (
            <FormItem itemType="number" datatype="number">
              <FormLabel>Credit</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="The amount of credit tips received"
                  type="number"
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                The total amount of credit tips earned throughout the shift.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="w-full">
          <div className="inline-flex flex-row flex-nowrap gap-2 lg:gap-4 items-center justfy-center mx-auto">
            <Button type="submit">Save</Button>
          </div>
        </section>
      </form>
    </Form>
  );
};
TimesheetForm.displayName = 'TimesheetForm';

export const TimesheetFormDialog: React.FC<
  Omit<typeof FormOverlay, 'children'> & FormProps
> = ({ defaultValues, values, ...props }) => {
  return (
    <FormOverlay {...props}>
      <TimesheetForm defaultValues={defaultValues} values={values} />
    </FormOverlay>
  );
};

export default TimesheetForm;
