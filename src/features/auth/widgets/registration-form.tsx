/*
  Appellation: registration-form <form>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
// imports
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { BaseFormProps } from '@/types';
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';

// feature-specific
import * as actions from '../utils';

// 1. Define your form schema.
export const registrationFormSchema = z
  .object({
    email: z
      .string({
        required_error: 'Email is required...',
      })
      .email()
      .default(''),
    password: z
      .string({
        required_error: 'Password is required...',
      })
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .default(''),
    passwordConfirm: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .default(''),
    username: z
      .string({
        required_error: 'Username is required...',
      })
      .min(3, { message: 'Username must be at least 3 characters.' })
      .max(60, { message: 'Username must be at most 60 characters.' })
      .default(''),
  })
  .passthrough()
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match.',
  });

const parser = (data?: any) => {
  return registrationFormSchema.parse({
    email: data.email ?? '',
    password: data.password ?? '',
    passwordConfirm: data.passwordConfirm ?? '',
    username: data.username ?? '',
  });
}

export type RegistrationData = z.infer<typeof registrationFormSchema>;

export const RegistrationForm: React.FC<
  React.ComponentProps<'form'> & {
    defaultValues?: any;
    values?: any;
  }
> = ({
  className,
  defaultValues,
  values,
  ...props
}) => {
  if (defaultValues && values) {
    throw new Error('Cannot provide both `defaultValues` and `values` to form');
  }
  if (defaultValues) {
    defaultValues = parser(defaultValues);
  }
  if (values) {
    values = parser(values);
  }
  // 1. Define your form.
  const form = useForm<RegistrationData>({
    mode: 'onSubmit',
    resolver: zodResolver(registrationFormSchema),
    defaultValues,
    values,
  });
  // 2. Render your form.
  return (
    <Form {...form}>
      <form
        className={cn('relative w-full', className)}
        onSubmit={async (event) => {
          await form.handleSubmit(actions.handleRegistration)(event);
          if (form.formState.isSubmitSuccessful) {
            toast.success('Registration successful!');
          }
        }}
        {...props}
      >
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input required placeholder="username" {...field} />
              </FormControl>
              <FormDescription>Choose a unique username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem itemType="email" datatype="email">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="example@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The email address associated with your account
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem datatype="password">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>Your account password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem datatype="password">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormDescription>Confirm your account password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="mt-4 w-full flex flex-col gap-2">
          <div className="flex flex-1 flex-row justify-center gap-2">
            <Button type="submit" variant="secondary">
              Sign Up
            </Button>
          </div>
          <div className="flex flex-row flex-nowrap gap-2 text-sm w-full">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="hover:underline"
            >
              <Link href="/auth/login">Already have an account?</Link>
            </Button>
          </div>
        </section>
      </form>
    </Form>
  );
};
RegistrationForm.displayName = 'RegistrationForm';

export default RegistrationForm;
