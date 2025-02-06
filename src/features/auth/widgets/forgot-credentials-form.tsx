/*
  Appellation: forgot-credentials-form <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// project
import { cn } from '@/utils';
// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { useForm } from 'react-hook-form';

export const forgotCredentialsSchema = z
  .object({
    email: z
      .string({
        required_error: 'Please provide the email associated with the account',
      })
      .email(),
  })
  .passthrough();

// Forgot Credentials Form
export const ForgotCredentialsForm: React.FC<React.ComponentProps<'form'>> = ({
  className,
  ...props
}) => {
  const form = useForm({
    resolver: zodResolver(forgotCredentialsSchema),
    mode: 'onSubmit',
  });

  return (
    <Form {...form}>
      <form className={cn('', className)}>
        <FormField
          name="email"
          render={({ ...field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    {...field}
                    placeholder="Email"
                    className="input"
                  />
                  <FormMessage>
                    {form.formState.errors.email?.message?.toString()}
                  </FormMessage>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};
ForgotCredentialsForm.displayName = 'ForgotCredentialsForm';
