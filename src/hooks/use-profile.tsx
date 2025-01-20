'use client';
import * as React from 'react';

import { fetchUserProfile, Profile } from '@/features/profiles';
import { createBrowserClient, getUsername } from '@/utils/supabase';

type HookParams = {
  username?: string;
};

type HookQuery = { username?: string };

export const useUserProfile = (params?: { username?: string, }) => {
  const supabase = createBrowserClient();
  const [profile, setProfile] = React.useState<Profile | null>(null);

  const getProfile = React.useCallback(async (query?: HookQuery) => {
    if (query) {
      return await fetchUserProfile(query);
    } else {
      return await getUsername().then((username) =>
        fetchUserProfile({ username })
      );
    }
  }, [fetchUserProfile, getUsername]);

  const onProfileChange = React.useCallback(async (username?: string) => {
    username ??= await getUsername();
    return supabase
      .channel(`profiles:${username}`)
      .subscribe()
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      );
  }, [supabase, setProfile]);

  React.useEffect(() => {
    if (!profile) {
      getProfile({ username: params?.username });
    }
    onProfileChange(params?.username);
  }, [getProfile, onProfileChange, profile, params]);

  const profileChannel = React.useCallback(
    (_username: string) => {
      return supabase
        .channel(`profiles:${_username}`)
        .subscribe(async (status, err) => {
          if (err) {
            throw err;
          }
          if (status === 'SUBSCRIBED') {
            await getProfile({ username: _username }).then((data) => {
              if (data) setProfile(data);
            });
          }
        });
    },
    [supabase, profile, getProfile, setProfile]
  );

  const _ctx = React.useMemo(
    () => ({
      getProfile,
      profile,
      profileChannel,
      uid: profile?.id,
      username: profile?.username,
    }),
    [getProfile, profile, profileChannel]
  );
  return _ctx;
};
