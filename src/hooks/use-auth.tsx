/*
  Appellation: use-auth <module>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
// project
import { createBrowserClient } from '@/utils/supabase';
import { Nullish } from '@/types';

export const useSupaAuth = () => {
  // initialize the supabase client
  const supabase = createBrowserClient();

  const [user, setUser] = React.useState<Nullish<User>>();
  // create a callback for getting the auth session
  const getSession = React.useCallback(supabase.auth.getSession, [supabase]);
  // create a callback for getting the user
  const getUser = React.useCallback(
    async () => await supabase.auth.getUser().then(({ data }) => data.user),
    [supabase]
  );
  // create a callback for handling auth state changes
  const handleAuthStateChange = React.useCallback(
    async (event: AuthChangeEvent, session: Session | null) => {
      if (session?.user && !user) setUser(session.user);
      if (
        session?.user &&
        (event === 'SIGNED_IN' || event === 'USER_UPDATED')
      ) {
        setUser(session.user);
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    },
    [setUser, user]
  );
  // create a callback for signing out
  const signOut = React.useCallback(supabase.auth.signOut, [supabase]);
  // subscribe to auth state changes
  React.useEffect(() => {
    // if no user is set, get the user
    if (!user) {
      getUser().then((data) => setUser(data));
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, handleAuthStateChange, getUser]);

  return React.useMemo(
    () => ({ getSession, getUser, signOut, user, uid: user?.id }),
    [getSession, getUser, signOut, user]
  );
};
