/*
  Appellation: use-auth <module>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { Nullish } from '@/types';
import { createBrowserClient } from '@/utils/supabase';

export const useSupaAuth = () => {
  const supabase = createBrowserClient();
  const [_user, _setUser] = React.useState<Nullish<User>>(null);

  const _onAuthStateChange = async (
    event: AuthChangeEvent,
    session: Session | null
  ) => {
    if (event === 'SIGNED_OUT') {
      _setUser(null);
    }
    if (session) {
      if (event === 'SIGNED_IN') {
        _setUser(session.user);
      }
    }
  };

  React.useEffect(() => {
    if (!_user) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) _setUser(data?.user);
      });
    }
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange(_onAuthStateChange);

    return () => {
      authSub?.unsubscribe();
    };
  }, [supabase, _setUser, _user, _onAuthStateChange]);

  return React.useMemo(() => {
    return {
      user: _user
    };
  }, [_user]);
};
