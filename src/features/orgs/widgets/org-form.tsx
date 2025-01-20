/*
  Appellation: form <widgets>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { cn } from '@/utils';
// components
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

// feature-specific
import { organizationSchema, OrganizationSchema } from '../types';
import { useForm } from 'react-hook-form';

type FormProps = {
  defaultValues?: OrganizationSchema;
  values?: OrganizationSchema;
} & React.ComponentProps<"form">;

export const OrganizationForm: React.FC<FormProps> = ({ className, defaultValues, values, ...props }) => {
  // define the form
  const form = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues,
    mode: 'onSubmit',
    values,
  });
  return (
    <Form {...form}>
      <form className={cn('w-full', className)} {...props}>
        <div className="flex flex-row flex-nowrap gap-2 lg:gap-4 items-center justify-items-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
};
OrganizationForm.displayName = 'OrganizationForm';

export default OrganizationForm;
