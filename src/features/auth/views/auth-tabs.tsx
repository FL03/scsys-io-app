/*
  Appellation: auth-tabs <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { cn } from '@/utils';
// components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
// feature-specific
import { AuthView } from '../types';
import {
  AuthForm,
  RegistrationForm,
} from '../widgets';

export const AuthTabs: React.FC<
  { view?: AuthView } & React.ComponentProps<typeof Tabs>
> = ({ view = 'login', className, ...props }) => {
  // tab-state
  const [tab, setTab] = React.useState<string>(view);
  // return the tabs
  return (
    <Tabs
      className={cn('w-full items-center min-h-[20%]', className)}
      onValueChange={setTab}
      value={tab}
      {...props}
    >
      <TabsList className="inline-flex justify-center mx-auto w-full">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <AuthForm />
      </TabsContent>
      <TabsContent value="register">
        <RegistrationForm />
      </TabsContent>
    </Tabs>
  );
};
AuthTabs.displayName = 'AuthTabs';

export default AuthTabs;
