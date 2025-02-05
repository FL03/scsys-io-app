/*
  Appellation: auth_gate <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils';
// components
import { BlackHoleAnimation } from '@/components/anim';
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
  const isRegister = ['register', 'sign-up'].includes(view);
  const isPasswordless = ['magic', 'passkey'].includes(view);
  const isEmailPassword = ['login', 'email-password', 'sign-in'].includes(view);

  const title = isRegister ? 'Register' : 'Login';

  const description = isRegister
    ? 'Create an account to get started.'
    : isPasswordless
    ? 'Sign in with a magic link sent to your email.'
    : 'Sign in with your email and password.';

  const isCentered = isMobile;

  return (
    <section
      className={cn(
        'h-full w-full flex flex-1 flex-col items-center justify-items-center',
        isCentered && '',
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full z-0 mx-auto">
        <BlackHoleAnimation />
      </div>
      <Card
        className={cn(
          'relative h-full py-2 max-w-lg my-auto z-10',
          !isCentered &&
            'ml-auto right-0 h-full flex flex-1 flex-col border-t-0 border-r-0 border-b-0 rounded-none ',
          isCentered && ''
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
    </section>
  );
};
AuthGate.displayName = 'AuthGate';

export default AuthGate;
