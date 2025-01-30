'use client';
import * as React from 'react';

import { fetchUserProfile, Profile } from '@/features/profiles';
import { createBrowserClient, getUsername } from '@/utils/supabase';
import { Nullish } from '@/types';

export const useUserProfile = (username?: string) => {
  // initialize the supabase client
  const supabase = createBrowserClient();
  // create a state variable for the username
  const [_username, _setUsername] = React.useState<Nullish<string>>(username);
  // create a state variable for the profile
  const [_profile, _setProfile] = React.useState<Nullish<Profile>>(null);
  // create a callback for loading the profile data
  const loadProfile = React.useCallback(
    async (alias?: string | null) => {
      if (!alias) {
        throw new Error('No username provided');
      }
      // fetch the profile data
      const data = await fetchUserProfile({ username: alias });
      // set the profile data; if it exists
      if (data) _setProfile(data);
    },
    [fetchUserProfile, _setProfile]
  );
  // create a callback for getting the profile changes
  const onProfileChange = React.useCallback(
    (alias?: string | null) => {
      if (!alias) {
        throw new Error('No username provided');
      }
      // create a channel for the profile changes
      return supabase.channel(`profiles:${alias}`).on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.new) _setProfile(payload.new as Profile);
        }
      );
    },
    [supabase, _setProfile]
  );

  React.useEffect(() => {
    if (!_username) {
      getUsername(supabase).then((v) => {
        if (v) _setUsername(v);
      });
    }
  }, [supabase, _username, getUsername, _setUsername]);

  React.useEffect(() => {
    if (!_profile) loadProfile(_username);

    const channel = onProfileChange(_username).subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [loadProfile, onProfileChange, _profile, _username]);
  // redeclare the profile variable
  const profile = _profile;
  // return a memoized object with the profile data
  return React.useMemo(
    () => ({
      loadProfile,
      profile,
      uid: profile?.id,
      username: profile?.username,
    }),
    [loadProfile, profile]
  );
};
/**
 * Memoized hook for getting the current user's username; invokes the "public.username" function deployed on the database using
 * supabase's "rpc" method
 *
 * @returns the current user's username
 */
export const currentUsername = () => {
  // initialize the supabase client
  const supabase = createBrowserClient();
  // create a state variable for the username
  const [_username, _setUsername] = React.useState<string>('');

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
