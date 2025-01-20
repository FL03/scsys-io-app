'use client';
import * as React from 'react';

import { fetchUserProfile, Profile } from '@/features/profiles';
import { createBrowserClient, getUsername } from '@/utils/supabase';

type HookParams = {
  uid?: string;
  username?: string;
};
export const useUserProfile: (params?: HookParams) => any = (params) => {
  const supabase = createBrowserClient();
  const [profile, setProfile] = React.useState<Profile | null>(null);

  const getProfile = React.useCallback(
    async (query?: { uid?: string; username?: string }) => {
      if (!query) {
        return await getUsername().then((alias) => fetchUserProfile({ username: alias }));
      }
      if (query.uid) {
        return await fetchUserProfile({ uid: query.uid });
      }
      if (query.username) {
        return await fetchUserProfile({ username: query.username });
      }
    },
    []
  );

  React.useEffect(() => {
    if (!profile) {
      getProfile(params).then((data) => {
        if (data) setProfile(data);
      });
    }
  }, [getProfile, profile, params]);

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

  return React.useMemo(
    () => ({
      getProfile,
      profile,
      profileChannel,
      uid: profile?.id,
      username: profile?.username,
    }),
    [getProfile, profile, profileChannel]
  );
};
