/*
  Appellation: provider <auth>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { Profile, fetchUserProfile, profileChannel } from '@/features/profiles';
import { getUsername, createBrowserClient } from '@/utils/supabase';
import { Nullish } from '@/types';

type ProfileContext = {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Nullish<Profile>>>;
  uid?: string | null;
  username?: string | null;
  [key: string]: any;
};

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

export const ProfileProvider: React.FC<
  Readonly<React.PropsWithChildren<ProviderProps>>
> = ({ children, username: usernameProp }) => {
  const supabase = createBrowserClient();

  const [_username, _setUsername] =
    React.useState<Nullish<string>>(usernameProp);
  // initialize the profile state
  const [_profile, _setProfile] = React.useState<Nullish<Profile>>(null);
  // create a callback for loading the profile data
  const loader = React.useCallback(
    async (username?: string | null) => {
      if (!username) {
        throw new Error('No username provided');
      }
      const data = await fetchUserProfile({ username });
      if (data) _setProfile(data);
    },
    [fetchUserProfile, _setProfile]
  );
  // ensure a username is provided
  React.useEffect(() => {
    if (!_username) {
      getUsername().then((v) => {
        if (v) _setUsername(v);
      });
    }
  }, [_username, _setUsername, getUsername]);

  // subscribe to profile changes
  React.useEffect(() => {
    // if null, load the profile data
    if (!_profile) loader(_username);
    const channel = supabase
      .channel(`profiles:${_username}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.new) _setProfile(payload.new as any);
        }
      )
      .subscribe((status, err) => {
        if (err) throw err;
        if (status === 'SUBSCRIBED') {
          console.log('Profile changes subscribed');
        }
      });
    return () => {
      channel.unsubscribe();
    };
  }, [_setProfile, _profile]);
  // get the profile state
  const profile = _profile;
  // create a setter function
  const setProfile = React.useCallback(_setProfile, [_setProfile]);
  // create the context object
  const ctx = React.useMemo(
    () => ({
      profile: profile ?? null,
      setProfile,
      loader,
      uid: profile?.id,
      username: profile?.username,
    }),
    [profile, loader, setProfile]
  );
  return (
    <ProfileContext.Provider value={ctx}>{children}</ProfileContext.Provider>
  );
};
ProfileProvider.displayName = 'ProfileProvider';
