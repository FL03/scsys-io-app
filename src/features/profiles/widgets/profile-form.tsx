/*
  Appellation: profile_form <profile>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { FormComponentProps } from '@/types';
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from '@/ui/textarea';
// feature-specific
import * as actions from '../utils';

const fullNameSchema = z
  .object({
    first_name: z.string().default('').nullish(),
    last_name: z.string().default('').nullish(),
    middle_name: z.string().default('').nullish(),
    name_prefix: z.string().default('').nullish(),
    name_suffix: z.string().default('').nullish(),
  });

const profileSchema = z
  .object({
    id: z.string({ required_error: 'An ID is required ' }).uuid().readonly(),
    username: z.string({ required_error: 'Username is required' }),
    avatar_url: z.string().url().default('').nullish(),
    bio: z.string().default('').nullish(),
    display_name: z.string().default('').nullish(),
    role: z.string().default('user').nullish(),
    socials: z.string().array().nullish(),
  })
  .passthrough()
  .merge(fullNameSchema);

export type ProfileFormValues = z.infer<typeof profileSchema>;

const parseValues = (profile: any) => {
  if (!profile.id) {
    throw new Error('Profile ID is required');
  }
  return profileSchema.parse(
    {
    id: profile.id,
    username: profile.username ?? '',
    display_name: profile.display_name,
    first_name: profile.first_name,
    last_name: profile.last_name,
    middle_name: profile.middle_name,
    name_prefix: profile.name_prefix,
    name_suffix: profile.name_suffix,
    avatar_url: profile.avatar_url,
    bio: profile.bio ?? '',
    role: profile.role ?? 'user',
    socials: profile.socials
  }
  );
};

export const ProfileForm: React.FC<
  FormComponentProps<ProfileFormValues>
> = ({ className, defaultValues, values, ...props }) => {
  if (defaultValues) {
    defaultValues = parseValues(defaultValues);
  }
  if (values) {
    values = parseValues(values);
  }
  // 1. Define the form with the useForm hook
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: 'onSubmit',
    values,
  });

  return (
    <Form {...form}>
      <form
        className={cn('w-full flex flex-1 flex-col', className)}
        onSubmit={form.handleSubmit(actions.upsertProfile)}
        {...props}
      >
        <div className="w-full flex flex-1 flex-col gap-2 lg:gap-4">
          {/* Display Name */}
          <FormField
            control={form.control}
            name="display_name"
            render={({ field: { value, ...field } }) => (
              <FormItem itemType="text" datatype="text">
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Display Name" type="text" value={value ?? ''} {...field} />
                </FormControl>
                <FormDescription>
                  This is how your name will appear in the app.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* first name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field: { value, ...field } }) => (
              <FormItem itemType="text" datatype="text">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    type="text"
                    value={value ?? ''}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* last name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field: { value, ...field } }) => (
              <FormItem itemType="text" datatype="text">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    type="text"
                    value={value ?? ''}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem itemType="text" datatype="text">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Your choosen username will be visible for all users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field: { value, ...field } }) => (
              <FormItem itemType="text" datatype="text">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Bio" value={value ?? ''} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4 flex flex-row flex-nowrap items-center justify-center justify-items-center gap-2 lg:gap-4">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export const ProfileFormCard: React.FC<
  React.ComponentProps<typeof Card> &
    FormComponentProps<ProfileFormValues> & {
      description?: React.ReactNode;
      title?: React.ReactNode;
    }
> = ({
  className,
  description = 'Update your account settings',
  title = 'Profile',
  defaultValues,
  values,
  ...props
}) => {
  return (
    <Card className={cn('w-full flex flex-col flex-1', className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm
          className="max-w-sm"
          defaultValues={defaultValues}
          values={values}
        />
      </CardContent>
    </Card>
  );
};
ProfileFormCard.displayName = 'ProfileFormCard';

export default ProfileForm;
