'use client';
import * as React from 'react';

import { fetchUserProfile, Profile } from '@/features/profiles';
import { createBrowserClient, getUsername } from '@/utils/supabase';
import { Nullish } from '@/types';

type LoaderArgs = { username?: string };

export const useCurrentUser = () => {};

export const useUserProfile = () => {
  const supabase = createBrowserClient();
  const [profile, setProfile] = React.useState<Nullish<Profile>>(null);

  const loadProfile = React.useCallback(
    async (username?: string | null) => {
      username ??= await getUsername();

      if (!username) {
        throw new Error('No username provided');
      }

      const data = await fetchUserProfile({ username });
      setProfile(data);
    },
    [fetchUserProfile, setProfile]
  );

  const onProfileChange = React.useCallback(
    (username?: string | null) => {
      if (!username) {
        throw new Error('No username provided');
      }
      return supabase
        .channel(`profiles:${username}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            if (payload.new) setProfile(payload.new as Profile);
          }
        )
        .subscribe();
    },
    [supabase, setProfile]
  );

  React.useEffect(() => {
    getUsername().then((username) => {
      if (!profile) loadProfile(username);
      
      const channel = onProfileChange(username);
      return () => {
        channel.unsubscribe();
      };
    });
  }, [loadProfile, onProfileChange, profile]);

  const _ctx = React.useMemo(
    () => ({
      getProfile: loadProfile,
      profile,
      uid: profile?.id,
      username: profile?.username,
    }),
    [loadProfile, profile]
  );
  return _ctx;
};
