/*
  Appellation: passwordless_login <module>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
// imports
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
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
// feature-specific
import * as actions from '../utils';
import { LogInIcon } from 'lucide-react';

export const passwordlessSchema = z.object({
  email: z.string({ required_error: 'A valid email address is required to login' }).email({
    message: 'Invalid email address.',
  }),
});

type PasswordlessSchema = z.infer<typeof passwordlessSchema>;

export const PasswordlessLoginForm: React.FC<
  React.ComponentProps<'form'> & {
    description?: any;
    defaultValues?: PasswordlessSchema;
    title?: any;
    values?: PasswordlessSchema;
  }
> = ({ className, description, title = 'Login', ...props }) => {
  const form = useForm<z.infer<typeof passwordlessSchema>>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(passwordlessSchema),
  });

  return (
    <Card className={cn('w-full', className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(actions.handlePasswordlessLogin)}
          {...props}
        >
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent className="flex flex-col gap-2 lg:gap-4">
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem itemType="email" datatype="email">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter your email address.</FormDescription>
                    <FormMessage {...field} />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="outline">
              <LogInIcon/>
              <span>Sign In</span>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
