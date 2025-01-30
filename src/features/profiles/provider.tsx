/*
  Appellation: provider <auth>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { Profile, fetchUserProfile } from '@/features/profiles';
import { createBrowserClient } from '@/utils/supabase';
import { Nullish } from '@/types';

type ProfileContext = {
  profile?: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Nullish<Profile>>>;
  uid?: string | null;
  username?: string | null;
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

export const ProfileProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ProviderProps
>(({ username, ...props }, ref) => {
  const supabase = createBrowserClient();
  // initialize the profile state
  const [_profile, _setProfile] = React.useState<Nullish<Profile>>(null);
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
  // subscribe to profile changes
  React.useEffect(() => {
    // if null, load the profile data
    if (!_profile) loader(username);
    const channel = supabase
      .channel(`profiles:${_profile?.username ?? username}`)
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
  }, [_setProfile, _profile, loader, supabase, username]);
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
