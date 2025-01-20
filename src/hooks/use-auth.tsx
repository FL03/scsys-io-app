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
  const supabase = createBrowserClient();

  const getSession = React.useCallback(supabase.auth.getSession, [supabase]);
  const getUser = React.useCallback(
    async () => await supabase.auth.getUser().then(({ data }) => data.user),
    [supabase]
  );
  const signOut = React.useCallback(supabase.auth.signOut, [supabase]);

  const [user, setUser] = React.useState<Nullish<User>>();

  const handleAuthStateChange = React.useCallback(
    async (event: AuthChangeEvent, session: Session | null) => {
      if (session?.user && !user) setUser(session.user);
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        setUser(session.user);
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    },
    [setUser, user]
  );
  // subscribe to auth state changes
  React.useEffect(() => {
    if (!user) {
      getUser().then((data) => setUser(data));
    }
    const { data } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      data.subscription?.unsubscribe();
    };
  }, [supabase, handleAuthStateChange, getUser]);

  return React.useMemo(
    () => ({ getSession, getUser, signOut, user }),
    [getSession, getUser, signOut, user]
  );
};
