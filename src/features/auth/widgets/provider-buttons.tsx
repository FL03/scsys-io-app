/*
  Appellation: provider-buttons <widgets>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
// imports
import { Provider } from '@supabase/supabase-js';
// project
import { Nullish } from '@/types';
import { cn } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
// components
import { GithubIcon, GoogleIcon, XPlatformLogo } from '@/common/icons';
import { Button } from '@/ui/button';

type ProviderButtonMode = 'sign-in' | 'link';

/**
 * A set of buttons for signing in or linking with OAuth providers.
 *
 * @param {ProviderButtonMode} mode The mode of the buttons.
 */
export const AuthProviderButtons: React.FC<
  React.ComponentProps<'div'> & { mode?: ProviderButtonMode }
> = ({ className, mode = 'sign-in', ...props }) => {
  // initialize the provider state
  const [state, setState] = React.useState<Nullish<Provider>>(null);
  // initialize the supabase client
  const supabase = createBrowserClient();

  const handleAuth = (provider: Provider) => {
    return async () => {
      try {
        setState(provider);
        if (mode === 'sign-in') {
          const { error } = await supabase.auth.signInWithOAuth({ provider });
          if (error) {
            console.error('Error:', error.message);
          }
        }
        if (mode === 'link') {
          const { error } = await supabase.auth.linkIdentity({ provider });
          if (error) {
            console.error('Error:', error.message);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setState(null);
      }
    };
  };

  return (
    <div
      className={cn(
        'inline-flex flex-row flex-nowrap items-center gap-2 lg:gap-4',
        className
      )}
      {...props}
    >
      <Button
        variant="secondary"
        onClick={handleAuth('github')}
        disabled={state === 'github'}
      >
        <GithubIcon className="mr-2 h-4 w-4" />
        <span>GitHub</span>
      </Button>
      <Button
        variant="secondary"
        onClick={handleAuth('google')}
        disabled={state === 'google'}
      >
        <GoogleIcon />
        <span>Google</span>
      </Button>
      <Button
        variant="secondary"
        onClick={handleAuth('twitter')}
        disabled={state === 'twitter'}
      >
        <XPlatformLogo className="mr-2 h-4 w-4" />
        <span>X</span>
      </Button>
    </div>
  );
};
AuthProviderButtons.displayName = 'AuthProviderButtons';
