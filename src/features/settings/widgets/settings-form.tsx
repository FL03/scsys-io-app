/*
  Appellation: settings_form <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { FormComponentProps } from '@/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
// feature-specific
import * as actions from '../utils';

const settingsForm = z.object({
  theme: z.string().default('system').nullish(),
});

export type SettingsFormData = z.infer<typeof settingsForm>;

export const SettingsForm: React.FC<FormComponentProps<SettingsFormData>> = ({
  className,
  defaultValues,
  values,
  ...props
}) => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  // 1. Define the form
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsForm),
    defaultValues,
    values: values,
  });

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted, setMounted]);

  if (!mounted) return null;

  return (
    <Form {...form}>
      <form
        className={cn('w-full flex flex-col gap-2 lg:gap-4', className)}
        onSubmit={form.handleSubmit(actions.handleSubmitSettings)}
        {...props}
      >
        <FormField
          control={form.control}
          name="theme"
          render={({}) => (
            <FormItem>
              <FormLabel>Theme Mode</FormLabel>

              <FormControl>
                <Select
                  onValueChange={(value) => setTheme(value)}
                  value={theme}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your preffered theme" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the theme mode you want to use.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="flex flex-nowrap gap-2 lg:gap-4 items-center ">
          <Button type="submit">Save</Button>
        </section>
      </form>
    </Form>
  );
};

export default SettingsForm;
