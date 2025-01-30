/*
  Appellation: use-profile <module>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';

import { createBrowserClient, getUsername } from '@/utils/supabase';
import { Nullish } from '@/types';

/**
 * Memoized hook for getting the current user's username; invokes the "public.username" function deployed on the database using
 * supabase's "rpc" method
 *
 * @returns the current user's username
 */
export const useProfileUsername = () => {
  // initialize the supabase client
  const supabase = createBrowserClient();
  // create a state variable for the username
  const [_username, _setUsername] = React.useState<Nullish<string>>(null);

  React.useEffect(() => {
    if (!_username) {
      getUsername(supabase, { ssr: false }).then((v) => {
        if (v) _setUsername(v);
      });
    }
  }, [supabase, _username, _setUsername]);

  const username = _username;

  return React.useMemo(
    () => ({
      username,
    }),
    [username]
  );
};
