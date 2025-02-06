/*
  Appellation: provider <auth>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { Profile, fetchUserProfile } from '@/features/profiles';
import { logger } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
import { Nullish } from '@/types';
import {
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';

const handleOnSubscribe = (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
  if (err) {
    logger.error(err);
  }
  if (status === 'SUBSCRIBED') {
    logger.info('Successfully subscribed to profile changes');
  }
  if (status === 'CLOSED') {
    logger.info('Successfully unsubscribed from profile changes');
  }
  if (status === 'TIMED_OUT') {
    logger.error('Channel timed out');
  }
};

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

type ProviderProps = { username: string };

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
    async (u?: string | null) => {
      if (!u) {
        throw new Error('No username provided');
      }
      try {
        const data = await fetchUserProfile({ username: u });
        if (data) _setProfile(data);
      } catch (err) {
        logger.error(err);
      }
    },
    [_setProfile]
  );
  const onChange = React.useCallback(
    (payload: RealtimePostgresChangesPayload<Profile>) => {
      const data = payload.new as Profile;

      if (payload.eventType === 'INSERT') {
        logger.info('A new user profile has been created');
        _setProfile(data);
      }
      if (payload.eventType === 'UPDATE') {
        logger.info('Updating the user profile');
        _setProfile(data);
      }
      if (payload.eventType === 'DELETE') {
        logger.info('Profile deleted');
        _setProfile(null);
      }
    },
    [_setProfile]
  );
  // a callback for creating a channel
  const _createChannel = React.useCallback((alias?: string | null) => {
    if (!alias) {
      throw new Error('No username provided');
    }
    return supabase
      .channel(`profiles:${alias}`, { config: { private: true } })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `username=eq.${alias}`,
        },
        onChange
      )
      .subscribe(handleOnSubscribe);;
  }, [supabase, onChange]);
  // initial load
  React.useEffect(() => {
    // if null, load the profile data
    if (!_profile) loader(username);
  }, [_profile, loader, username]);
  // realtime effects
  React.useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = _createChannel(username);
    }
    return () => {
      if (channelRef.current) {
        supabase.realtime.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [channelRef, supabase, username, _createChannel, _setProfile]);
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
    }),
    [profile, loader, setProfile]
  );
  return (
    <ProfileContext.Provider value={ctx}>
      <div ref={ref} {...props} />
    </ProfileContext.Provider>
  );
});
ProfileProvider.displayName = 'ProfileProvider';
