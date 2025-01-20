/*
  Appellation: provider <auth>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { Profile, fetchUserProfile } from '@/features/profiles';
import { getUsername } from '@/utils/supabase';

type ProfileContext = {
  get: VoidFunction;
  profile?: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  uid?: string | null;
  username?: string | null;
};

export const ProfileContext = React.createContext<ProfileContext>({
  get: () => {},
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

type ProviderProps = { uid?: string; username?: string };

export const ProfileProvider: React.FC<Readonly<React.PropsWithChildren<ProviderProps>>> = ({
  children,
  uid,
  username,
}) => {
  // initialize the profile state
  const [_profile, _setProfile] = React.useState<Profile | null>(null);
  // create a callback for loading the profile data
  const getProfile = React.useCallback(async (query?: { uid?: string, username?: string }) => {
    if (query) {
      return await fetchUserProfile(query);
    } else {
      return await getUsername().then((username) =>
        fetchUserProfile({ username })
      );
    }
  }, [fetchUserProfile, getUsername]);

  React.useEffect(() => {
    // if null, load the profile data

    getProfile({ uid, username }).then((data) => {
      if (data) _setProfile(data);
    });
  }, [getProfile, _setProfile, uid, username]);
  // get the profile state
  const profile = _profile;
  // create a setter function
  const setProfile = React.useCallback(_setProfile, [_setProfile]);
  // create the context object
  const ctx = React.useMemo(
    () => ({
      get: getProfile,
      profile: profile,
      setProfile,
      uid: profile?.id,
      username: profile?.username,
    }),
    [profile, getProfile, setProfile]
  );
  return (
    <ProfileContext.Provider value={ctx}>{children}</ProfileContext.Provider>
  );
};
ProfileProvider.displayName = 'ProfileProvider';
