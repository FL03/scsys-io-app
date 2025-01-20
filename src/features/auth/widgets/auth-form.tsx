/*
  Appellation: login-form <module>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
import * as Lucide from 'lucide-react';
// packages
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/ui/button';
// project
import { FormComponentProps } from '@/types';
import { cn } from '@/utils';
// components
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
import * as actions from '../utils';
import { AuthProviderButtons } from './provider-buttons';

const emailPasswordForm = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }).refine((arg) => arg.trim().length > 0),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
}).default({
  email: '',
  password: '',
});


export type EmailPasswordSchema = z.infer<typeof emailPasswordForm>;

export const LoginWithEmailPasswordForm: React.FC<
  FormComponentProps<EmailPasswordSchema>
> = ({ className, defaultValues, values, ...props }) => {
  if (defaultValues && values) {
    throw new Error('Cannot provide both `defaultValues` and `values`');
  }
  const form = useForm<EmailPasswordSchema>({
    resolver: zodResolver(emailPasswordForm),
    defaultValues,
    values,
  });

  return (
    <Form {...form}>
      <form
        className={cn('relative flex flex-col flex-1 w-full', className)}
        onSubmit={form.handleSubmit(actions.handleLogin)}
        {...props}
      >
        <div className="w-full flex flex-1 flex-col gap-2 lg:gap-4">
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem itemType="email" datatype="email">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="sample@sample.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter the email address associated with the account
                  </FormDescription>
                  <FormMessage {...field} />
                </FormItem>
              );
            }}
          />
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem itemType="password" datatype="password">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    The password for the respective account
                  </FormDescription>
                  <FormMessage {...field} />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="mt-4 w-full flex flex-col gap-4">
          <Button type="submit">
            <Lucide.LogInIcon />
            <span>Sign In</span>
          </Button>
          <AuthProviderButtons className="w-full" />
          <Button asChild className="ml-auto" size="sm" variant="link">
            <Link href="/auth/register">Create an account</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
LoginWithEmailPasswordForm.displayName = 'LoginWithEmailPasswordForm';
