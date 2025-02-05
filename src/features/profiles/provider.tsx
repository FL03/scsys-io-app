/*
  Appellation: provider <auth>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { Profile, fetchUserProfile } from '@/features/profiles';
import { createBrowserClient } from '@/utils/supabase';
import { Nullish } from '@/types';
import { REALTIME_SUBSCRIBE_STATES, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type ProfileContext = {
  profile?: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Nullish<Profile>>>;
  uid?: string | null;
  username?: string | null;
} & { [key: string]: any };

export const ProfileContext = React.createContext<ProfileContext>({
  profile: null,
  setProfile: () => {},
  uid: null,
  username: null,
});

export const useProfile = (): ProfileContext => {
  const context = React.useContext(ProfileContext);
  if (!context) {
    throw new Error('The useProfile must be used within a ProfileProvider');
  }
  return context;
};

type ProviderProps = { username?: string | null };

export const ProfileProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ProviderProps
>(({ username, ...props }, ref) => {
  const supabase = createBrowserClient();
  // initialize the profile state
  const [_profile, _setProfile] = React.useState<Nullish<Profile>>(null);

  const channelRef = React.useRef<Nullish<RealtimeChannel>>(null);
  // create a callback for loading the profile data
  const loader = React.useCallback(
    async (alias?: string | null) => {
      if (alias) {
        const data = await fetchUserProfile({ username: alias });
        if (data) _setProfile(data);
      }
    },
    [_setProfile]
  );
  const onChange = React.useCallback((payload: RealtimePostgresChangesPayload<Profile>) => {
    const data = payload.new as Profile;

    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      _setProfile(payload.new);
    }
  }, [_setProfile]);
  const onSubscribe = React.useCallback(
        (callback: (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => void, timeout?: number) => {
          channelRef.current?.subscribe(callback, timeout);
        },
        [channelRef]
      );
  // subscribe to profile changes
  React.useEffect(() => {
    // if null, load the profile data
    if (!_profile) loader(username);
  }, [_profile, loader, username]);

  React.useEffect(() => {
    if (username) {
      channelRef.current = supabase
        .channel(`profiles:${username}`, { config: { private: true } })
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles' },
          onChange
        );
    }
    return () => {
      if (channelRef.current) {
        supabase?.realtime.removeChannel(channelRef.current);
      }
    };
  }, [channelRef, supabase, username, _setProfile]);
  // get the profile state
  const profile = _profile;
  // create a setter function
  const setProfile = React.useCallback(_setProfile, [_setProfile]);
  // create the context object
  const ctx = React.useMemo(
    () => ({
      profile: profile,
      uid: profile?.id,
      username: profile?.username,
      loader,
      setProfile,
      onSubscribe,
    }),
    [profile, loader, onSubscribe, setProfile]
  );
  return (
    <ProfileContext.Provider value={ctx}>
      <div ref={ref} {...props} />
    </ProfileContext.Provider>
  );
});
ProfileProvider.displayName = 'ProfileProvider';
