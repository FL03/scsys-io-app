/*
  Appellation: use-profile <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { fetchUserProfile, Profile } from '@/features/profiles';
import { createBrowserClient, getUsername } from '@/utils/supabase';
import { Nullish } from '@/types';
import { User } from '@supabase/supabase-js';

/**
 * Memoized hook for getting the current user's username; invokes the "public.username" function deployed on the database using
 * supabase's "rpc" method
 *
 * @returns the current user's username
 */
export const useUsername = () => {
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

/**
 * A memoized hook returning the current user's profile and user objects.
 * 
 * @returns {useCurrentProfileRT} the current user's profile and user objects
 */
export const useCurrentProfile = () => {
  const supabase = createBrowserClient();
  const [_user, _setUser] = React.useState<Nullish<User>>(null);
  const [_profile, _setProfile] = React.useState<Nullish<Profile>>(null);
  // user related effetcs
  React.useEffect(() => {
    // perform an initial load
    if (!_user) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) _setUser(data?.user);
      });
    }
  }, [supabase, _user, _setUser]);
  // profile related effects
  React.useEffect(() => {
    // perform an initial load
    if (!_profile && _user) {
      fetchUserProfile({ uid: _user.id }).then((v) => {
        if (v) _setProfile(v);
      });
    }
  }, [supabase, _profile, _setProfile, _user]);
  // redeclare the '_profile' state variable
  const profile = _profile;
  // redeclare the '_user' state variable
  const user = _user;
  // return the memoized values
  return React.useMemo(() => {
    return {
      profile,
      user,
    };
  }, [profile]);
}

type useCurrentProfileRT = ReturnType<typeof useCurrentProfile>;
