/*
  Appellation: provider-buttons <widgets>
  Contrib: @FL03
*/
'use client';
// globals
import * as Lucide from 'lucide-react';
import * as React from 'react';
// imports
// project
import { cn, resolveOrigin } from '@/utils';
import { createBrowserClient, getURL } from '@/utils/supabase';
// components
import { GithubIcon, GoogleIcon } from '@/common/icons';
import { Button } from '@/ui/button';

export const AuthProviderButtons: React.FC<React.ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  const [state, setState] = React.useState<string | null>(null);
  const supabase = createBrowserClient();

  const handleAuth = async (provider: 'github' | 'google') => {
    try {
      setState(provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          
          redirectTo: getURL('/auth/callback'),
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setState(null);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex flex-row flex-nowrap items-center gap-2 lg:gap-4'
      )}
      {...props}
    >
      <Button
        variant="secondary"
        onClick={() => handleAuth('github')}
        disabled={state === 'github'}
      >
        <GithubIcon className="mr-2 h-4 w-4" />
        <span>GitHub</span>
      </Button>
      <Button
        variant="secondary"
        onClick={() => handleAuth('google')}
        disabled={state === 'google'}
      >
        <GoogleIcon />
        <span>Google</span>
      </Button>
    </div>
  );
};
AuthProviderButtons.displayName = 'AuthProviderButtons';
