/*
  Appellation: auth_gate <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
// project
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, matches } from '@/utils';
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
// feature-specific
import { AuthView } from '../types';
import { AuthForm, RegistrationForm } from '../widgets';

export const AuthGate: React.FC<
  React.ComponentProps<typeof Card> & { view?: AuthView }
> = ({ className, view = 'login', ...props }) => {
  const isMobile = useIsMobile();

  const isRegister = matches(view, 'register', 'sign-up', 'signup');
  const isPasswordless = ['magic', 'passkey'].includes(view);
  const isEmailPassword = ['login', 'email-password', 'sign-in'].includes(view);

  const title = isRegister ? 'Register' : 'Login';

  const description = isRegister
    ? 'Create an account to get started.'
    : isPasswordless
    ? 'Sign in with a magic link sent to your email.'
    : 'Sign in with your email and password.';

  const isCentered = isMobile;

  const Animation = dynamic(
    () => import('@/components/anim/waves/mobius-wave'),
    { ssr: false }
  );

  return (
    <div
      className={cn(
        'h-full w-full flex flex-1 flex-col items-center justify-items-center',
        isCentered && '',
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-0 mx-auto">
        <Animation />
      </div>
      <div
        className={cn(
          'h-full w-full max-w-sm z-10 flex flex-1 flex-col',
          isCentered &&
            'items-center justify-center justify-items-center max-w-[90%]',
          !isCentered && 'ml-auto'
        )}
      >
        <Card
          className={cn(
            'h-full w-full flex flex-col',
            !isCentered &&
              'border-t-0 border-r-0 border-b-0 rounded-none flex-1',
            isCentered && 'm-auto'
          )}
          {...props}
        >
          <CardHeader className="left-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {isRegister && <RegistrationForm />}
            {isEmailPassword && <AuthForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
AuthGate.displayName = 'AuthGate';

export default AuthGate;
