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
      return supabase
        .channel(`profiles:${alias}`)
        .on(
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
      getUsername().then((v) => {
        if (v) _setUsername(v);
      });
    }
  }, [_username, _setUsername]);

  React.useEffect(() => {
    if (!_profile) loadProfile(_username);

    const channel = onProfileChange(_username).subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [loadProfile, onProfileChange, _profile, _username]);

  const _ctx = React.useMemo(
    () => ({
      loadProfile,
      profile: _profile,
      uid: _profile?.id,
      username: _profile?.username,
    }),
    [loadProfile, _profile]
  );
  return _ctx;
};
