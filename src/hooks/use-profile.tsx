'use client';
import * as React from 'react';

import { fetchUserProfile, Profile } from '@/features/profiles';
import { createBrowserClient, getUsername } from '@/utils/supabase';
import { Nullish } from '@/types';

type LoaderArgs = { username?: string };

export const useCurrentUser = (username?: string) => {};

export const useUserProfile = (username?: string) => {
  const supabase = createBrowserClient();
  const [profile, setProfile] = React.useState<Nullish<Profile>>(null);

  const loadProfile = React.useCallback(
    async (alias?: string | null) => {
      alias ??= await getUsername();
      if (!alias) {
        throw new Error('No username provided');
      }

      const data = await fetchUserProfile({ username: alias });
      if (data) setProfile(data);
    },
    [fetchUserProfile, setProfile]
  );

  const onProfileChange = React.useCallback(
    (alias?: string | null) => {
      if (!alias) {
        throw new Error('No username provided');
      }
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
            if (payload.new) setProfile(payload.new as Profile);
          }
        );
    },
    [supabase, setProfile]
  );

  React.useEffect(() => {
    if (!profile) loadProfile(username);

    const channel = onProfileChange(username).subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [loadProfile, onProfileChange, profile, username]);

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
