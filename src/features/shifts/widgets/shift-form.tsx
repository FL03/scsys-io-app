/*
  Appellation: timesheet_form <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { useProfile } from '@/features/profiles';
import { Crud } from '@/types';
import { cn, logger } from '@/utils';
// components
import { Calendar } from '@/common/calendar';
import { FormOverlayProvider, FormSheet } from '@/common/forms';
import { Button } from '@/ui/button';
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
import { adjustedDate, upsertTimesheet } from '../utils';


// define the form values
export const shiftFormValues = z
  .object({
    id: z.string().uuid().readonly().nullish(),
    assignee: z.string().default('').nullish(),
    date: z
      .string()
      .or(z.date())
      .transform((arg) => new Date(arg))
      .default(new Date().toISOString())
      .nullish(),
    tips_cash: z.coerce.number().default(0).nullish(),
    tips_credit: z.coerce.number().default(0).nullish(),
    attachments: z.array(z.string()).default([]).nullish(),
    status: z.string().default('todo').nullish(),
    tags: z.array(z.string()).default([]).nullish(),
  })
  .passthrough();

export type ShiftFormValues = z.infer<typeof shiftFormValues>;

const parseValues = (values?: any | null) => {
  return shiftFormValues.parse({
    ...values,
    assignee: values?.assignee ?? '',
    attachments: values?.attachments ?? [],
    date: values?.date ? new Date(values?.date) : new Date(),
    status: values?.status ?? 'todo',
    tags: values?.tags ?? [],
    tips_cash: values?.tips_cash ?? 0,
    tips_credit: values?.tips_credit ?? 0,
  });
};

type FormProps = {
  actions?: React.ReactNode;
  defaultValues?: any;
  mode?: Crud;
  onSuccess?: () => void;
  redirectOnSuccess?: string;
  values?: any;
};

export const TimesheetForm: React.FC<
  React.ComponentProps<'form'> & FormProps
> = ({
  actions,
  className,
  defaultValues,
  mode = 'create',
  onSuccess,
  redirectOnSuccess,
  values,
  ...props
}) => {
  const router = useRouter();
  if (onSuccess && redirectOnSuccess) {
    throw new Error('Cannot provide both onSuccess and redirectOnSuccess');
  }
  if (defaultValues && values) {
    throw new Error('Cannot provide both defaultValues and values');
  }
  if (defaultValues) {
    defaultValues = parseValues({ ...defaultValues });
  }
  if (values) {
    values = parseValues({ ...values });
  }
  // define the form
  const form = useForm<ShiftFormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(shiftFormValues),
    defaultValues,
    values,
  });

  return (
    <Form {...form}>
      <form
        {...props}
        className={cn('h-full w-full gap-2 lg:gap-4', className)}
        onSubmit={async (event) => {
          event.preventDefault();
          // handle the form submission
          try {
            await form.handleSubmit(async (formData) => {
              const { error } = await upsertTimesheet(formData);
              if (error) {
                throw error;
              }
              onSuccess?.();
              // notify the user
              toast.success('Timesheet saved successfully');
              // reset the form
              form.reset();
              // redirect if needed
              if (redirectOnSuccess) {
                router.push(redirectOnSuccess);
              }
            })(event);
          } catch (error) {
            // on error
            logger.error('Error saving the timesheet', error);
            // notify the user
            toast.error('Failed to save timesheet');
          }
        }}
      >
        {/* date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            const selectedDate = field.value
              ? adjustedDate(field.value)
              : undefined;
            return (
              <FormItem datatype="date" itemType="text">
                <FormControl>
                  <Calendar
                    required
                    className="mx-auto"
                    mode="single"
                    defaultMonth={selectedDate}
                    onSelect={(date) => field.onChange(new Date(date))}
                    selected={selectedDate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {/* Assignee */}
        <FormField
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly={mode === 'update'}
                  placeholder="The employee assigned to the shift"
                />
              </FormControl>
              <FormDescription>
                Assignee an employee to the shift
              </FormDescription>
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
        <div className="w-full flex flex-row flex-nowrap gap-2 lg:gap-4 items-center justify-center">
          <Button type="submit" className="mx-auto">
            Save
          </Button>
          {actions}
        </div>
      </form>
    </Form>
  );
};
TimesheetForm.displayName = 'TimesheetForm';

export const ShiftFormSheet: React.FC<
  Omit<React.ComponentProps<typeof FormSheet>, 'children'> & {
    defaultValues?: any;
    values?: any;
  }
> = ({ defaultOpen = false, defaultValues, values, ...props }) => {
  const { username } = useProfile();
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  const title = 'Record a shift';
  const description =
    'Use this form to record any tips recieved during your shift.';

  const closeForm = () => {
    setOpen(false);
  };

  return (
    <FormSheet
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={setOpen}
      title={title}
      description={description}
      {...props}
    >
      <TimesheetForm
        className="h-full"
        defaultValues={{ assignee: username }}
        onSuccess={closeForm}
        values={values}
      />
    </FormSheet>
  );
};
ShiftFormSheet.displayName = 'ShiftFormSheet';

export const InjectedTimesheetForm: React.FC = () => {
  return (
    <FormOverlayProvider>
      <ShiftFormSheet variant="ghost" />
    </FormOverlayProvider>
  );
};

export default TimesheetForm;
