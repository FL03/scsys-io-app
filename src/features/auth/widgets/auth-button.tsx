/*
  Appellation: sign_out <auth>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogInIcon, LogOutIcon } from 'lucide-react';
// project
import { cn } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
// components
import { Button } from '@/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';

type BaseProps = {
  isAuth: boolean;
  signOut?: any;
  redirect: string;
};

export const AuthButton: React.FC<
  React.ComponentProps<typeof Button> & BaseProps
> = ({
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
        <LogOutIcon className="h-5 w-5" />
        <span className={spanCls}>Logout</span>
      </Button>
    );
  } else {
    return (
      <Button asChild className={className} size={size} variant={variant}>
        <Link href={redirect}>
          <LogInIcon className="h-5 w-5" />
          <span className={spanCls}>Login</span>
        </Link>
      </Button>
    );
  }
};
AuthButton.displayName = 'AuthButton';

export const SignOutButton: React.FC<
  React.ComponentProps<typeof Button> & {
    afterSignOut?: React.MouseEventHandler<HTMLButtonElement>;
  }
> = ({ afterSignOut, className, size = 'icon', variant = 'destructive', ...props }) => {
  // initialize the router
  const router = useRouter();
  const supabase = createBrowserClient();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              '[[data-state=expanded]_&]:justify-start px-2',
              className
            )}
            size={size}
            variant={variant}
            onClick={async (event) => {
              await supabase.auth
                .signOut()
                .catch((error) => ({ error }))
                .finally(() => afterSignOut?.(event));
              toast.warning('You have been signed out');
              // redirect to the login page
              router.push('/auth/login');
            }}
            {...props}
          >
            <LogOutIcon />
            <span className="sr-only [[data-state=expanded]_&]:not-sr-only ">
              Logout
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign-out of the current account</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
SignOutButton.displayName = 'SignOutButton';
