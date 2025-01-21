/*
  Appellation: auth_gate <module>
  Contrib: @FL03
*/
'use client';
// Imports
import * as React from 'react';
import { cn } from '@/utils';
// Components
import { DetailCard } from '@/common/cards';
// Feature-specific
import { AuthView } from '../types';
import { AuthForm, RegistrationForm } from '../widgets';

export const AuthGate: React.FC<
  React.ComponentProps<typeof DetailCard> & { view?: AuthView }
> = ({ className, view = 'login', ...props }) => {
  const isRegister = ['register', 'sign-up'].includes(view);
  const isPasswordless = ['magic', 'passkey'].includes(view);
  const isEmailPassword = ['login', 'email-password', 'sign-in'].includes(view);

  const title = isRegister ? 'Register' : 'Login';

  const description = isRegister
    ? 'Create an account to get started.'
    : isPasswordless
      ? 'Sign in with a magic link sent to your email.'
      : 'Sign in with your email and password.';
  return (
    <DetailCard description={description} title={title} {...props}>
      {isRegister && <RegistrationForm />}
      {isEmailPassword && <AuthForm />}
    </DetailCard>
  );
};
AuthGate.displayName = 'AuthGate';

export default AuthGate;
