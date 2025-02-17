/*
  Appellation: login-form <module>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
// imports
import { LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { cn, logger } from '@/utils';
// components
import { Button } from '@/ui/button';
import { CardFooter } from '@/ui/card';
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
import { Separator } from '@/components/ui/separator';

const emailPasswordForm = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email address.',
    })
    .default('')
    .refine((arg) => arg.trim().length > 0),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long.',
    })
    .default(''),
}).passthrough();

const loginParser = (values?: any) => {
  if (!values) return undefined;
  return emailPasswordForm.parse(values);
};

export type EmailPasswordSchema = z.infer<typeof emailPasswordForm>;

export const AuthForm: React.FC<React.ComponentProps<"form"> & { defaultValues?: any, values?: any; }> = ({
  className,
  defaultValues,
  values,
  ...props
}) => {
  if (defaultValues && values) {
    throw new Error('Cannot provide both `defaultValues` and `values`');
  }
  // define the form with the useForm hook
  const form = useForm<EmailPasswordSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(emailPasswordForm),
    defaultValues: loginParser(defaultValues),
    values: loginParser(values),
  });

  return (
    <Form {...form}>
      <form
        className={cn('relative h-full w-full', className)}
        onSubmit={async (event) => {
          try {
            await form.handleSubmit(actions.handleLogin)(event);
            if (form.formState.isSubmitSuccessful) {
              logger.info('Login Successful');
            }
          } catch (error) {
            logger.error('Login Error', error);
            toast.error('Login Error');
          }
        }}
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
        <CardFooter className="mt-2 w-full flex flex-col gap-2">
          <div className="w-full flex flex-row flex-1 flex-wrap">
            <Button className="w-full" type="submit">
              <LogInIcon />
              <span>Sign In</span>
            </Button>
          </div>
          <Button asChild className="ml-auto" size="sm" variant="link">
            <Link href="/auth/register">Create an account</Link>
          </Button>
          <Separator />
          <AuthProviderButtons className="w-full mx-auto" />
        </CardFooter>
      </form>
    </Form>
  );
};
AuthForm.displayName = 'AuthForm';
