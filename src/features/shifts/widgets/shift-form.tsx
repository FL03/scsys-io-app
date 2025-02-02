/*
  Appellation: timesheet_form <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { useProfile } from '@/features/profiles';
import { useIsMobile } from '@/hooks/use-mobile';
import { Crud } from '@/types';
import { cn, logger } from '@/utils';
// components
import { Calendar, DatePickerPopover } from '@/common/calendar';
import { FormOverlay, OverlayTrigger } from '@/common/form-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/ui/sheet';
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
import * as actions from '../utils';

// define the form values
export const shiftFormValues = z
  .object({
    id: z.string().uuid().readonly().nullish(),
    assignee: z.string().default('').nullish(),
    date: z
      .string()
      .or(z.date())
      .transform((arg) => new Date(arg))
      .default(new Date().toLocaleDateString())
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
  defaultValues?: any;
  mode?: Crud;
  onSuccess?: () => void;
  redirectOnSuccess?: string;
  values?: any;
};

export const TimesheetForm: React.FC<
  React.ComponentProps<'form'> & FormProps
> = ({ className, defaultValues, mode = 'create', onSuccess, redirectOnSuccess, values, ...props }) => {
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
        className={cn('w-full gap-2 lg:gap-4', className)}
        onSubmit={async (event) => {
          event.preventDefault();
          // handle the form submission
          await form.handleSubmit(actions.upsertTimesheet)(event);
          // on success
          if (form.formState.isSubmitSuccessful) {
            logger.info('Timesheet saved successfully');
            // notify the user
            toast.success('Timesheet saved successfully');
            form.reset();
            onSuccess?.();
            if (redirectOnSuccess) {
              router.push(redirectOnSuccess);
            }
          }
        }}
      >
        {/* date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            const selectedDate = field.value ? actions.adjustedDate(field.value) : undefined;
            return (
              <FormItem datatype="date" itemType="text">
                <FormControl>
                  <Calendar
                    required
                    mode="single"
                    defaultMonth={selectedDate}
                    onSelect={(date) => field.onChange(new Date(date))}
                    selected={selectedDate}
                  />
                </FormControl>
                <FormDescription>The date of the worked shift.</FormDescription>
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
  React.ComponentProps<typeof FormOverlay>
> = ({ defaultOpen = false, defaultValues, values, ...props }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  const title = 'Record a shift'
  const description = 'Use this form to record any tips recieved during your shift.';

  const handleSuccess = () => {
    revalidatePath('/', "layout");
    setOpen(false);
  }

  const FormComponent: React.FC = () => (
    <TimesheetForm defaultValues={defaultValues} onSuccess={handleSuccess} values={values} />
  );

  if (isMobile) {
    return (
      <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <OverlayTrigger/>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="bg-card text-card-foreground flex flex-shrink flex-col gap-2"
        >
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="mx-auto">
            <FormComponent/>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <OverlayTrigger />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <FormComponent />
      </DialogContent>
    </Dialog>
  );
};

export default TimesheetForm;
