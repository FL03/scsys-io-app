/*
  Appellation: sign_out <auth>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import * as Lucide from 'lucide-react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Button } from '@/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { cn } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';

type BaseProps = {
  isAuth: boolean;
  signOut?: any;
  redirect: string;
};

export const AuthButton: React.FC<React.ComponentProps<typeof Button> & BaseProps> = ({
  className,
  isAuth,
  signOut,
  redirect,
  size = 'default',
  variant = 'default',
  ...props
}) => {
  const spanCls = 'visible [[data-state=collapsed]_&]:collapse';

  if (isAuth) {
    return (
      <Button
        className={cn('justify-center items-center text-center', className)}
        onClick={signOut}
        size={size}
        variant={variant}
        {...props}
      >
        <Lucide.LogOutIcon className="h-5 w-5" />
        <span className={spanCls}>Logout</span>
      </Button>
    );
  } else {
    return (
      <Button asChild className={className} size={size} variant={variant}>
        <Link href={redirect}>
          <Lucide.LogInIcon className="h-5 w-5" />
          <span className={spanCls}>Login</span>
        </Link>
      </Button>
    );
  }
}
AuthButton.displayName = 'AuthButton';

export const SignOutButton: React.FC<React.ComponentProps<typeof Button>> = ({ size = 'icon', variant = 'ghost', ...props }) => {
  const supabase = createBrowserClient();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => supabase.auth.signOut()}
            {...props}
          >
            <Lucide.LogOut />
            <span className="not-sr-only [[data-state=collapsed]_&]:sr-only">
              Sign-out
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign-out of the current account</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
SignOutButton.displayName = 'SignOutButton';
