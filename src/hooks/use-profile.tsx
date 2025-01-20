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
      if (!username) {
        throw new Error('No username provided');
      }

      const data = await fetchUserProfile({ username });
      if (data) setProfile(data);
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
            table: 'profiles',
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
    const channel = getUsername().then(async (username) => {
      if (!profile) await loadProfile(username);
      
      return onProfileChange(username);
    });
    return () => {
      channel.then((c) => c.unsubscribe());
    }
  }, [loadProfile, onProfileChange, profile]);

  const _ctx = React.useMemo(
    () => ({
      loadProfile,
      profile,
      uid: profile?.id,
      username: profile?.username,
    }),
    [loadProfile, profile]
  );
  return _ctx;
};
