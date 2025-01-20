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
  const get = React.useCallback(async () => {
    if (uid) {
      return await fetchUserProfile({ uid });
    } else if (username) {
      return await fetchUserProfile({ username });
    } else {
      const alias = await getUsername();
      return await fetchUserProfile({ username: alias });
    }
  }, [uid, username]);

  React.useEffect(() => {
    // if null, load the profile data
    get().then((data) => {
      if (data) _setProfile(data);
    });
  }, [get, _setProfile]);
  // get the profile state
  const profile = _profile;
  // create a setter function
  const setProfile = React.useCallback(_setProfile, [_setProfile]);
  // create the context object
  const ctx = React.useMemo(
    () => ({
      get,
      profile: profile,
      setProfile,
      uid: profile?.id,
      username: profile?.username,
    }),
    [get, profile, setProfile]
  );
  return (
    <ProfileContext.Provider value={ctx}>{children}</ProfileContext.Provider>
  );
};
ProfileProvider.displayName = 'ProfileProvider';
