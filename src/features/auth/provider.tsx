/*
  Appellation: provider <auth>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/features/profiles';
import { Nullish } from '@/types';
import { createBrowserClient } from '@/utils/supabase';

type AuthContext = {
  auth: any;
  profile?: Profile | null;
  uid?: string | null;
  username?: string | null;
  user?: User | null;
  signOut: VoidFunction;
  updateUser: (user: User) => void;
};

const AuthContext = React.createContext<AuthContext | null>(null);

/**
 * useAuth hook for consuming the auth context
 *
 * @returns {AuthContext} The auth context
 * @throws {Error} If the hook is not used within an AuthProvider
 */
export const useAuth = (): AuthContext => {
  // get the context
  const context = React.useContext(AuthContext);
  //
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // return the context
  return context;
};

/**
 * AuthProvider component
 *
 * @param {AuthProviderData} props The component props
 * @returns {React.ReactElement} The component
 */
export const AuthProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  // create a new supabase client
  const supabase = createBrowserClient();
  // create a ref for the auth
  const auth = React.useRef(supabase.auth);
  // create state variables for managing the user
  const [_user, _setUser] = React.useState<Nullish<User>>();

  const onAuthStateChange = React.useCallback(
    async (event: string, session: any) => {
      // handle any events
      if (event === 'SIGNED_OUT') {
        _setUser(null);
      }
      if (event === 'SIGNED_IN') {
        _setUser(session.user);
      }
      if (event === 'USER_UPDATED') {
        _setUser(session.user);
      }
      if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery
      }
      if (event === 'USER_DELETED') {
        // handle user deletion
      }
      // if the user has changed, update the state
      if (session?.user && session?.user !== _user) {
        _setUser(session.user);
      }
    },
    [_setUser, _user]
  );
  // handle the auth state

  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(onAuthStateChange);
    return data.subscription?.unsubscribe;
  }, [supabase, onAuthStateChange]);
  // create the update user callback
  const updateUser = React.useCallback(supabase.auth.updateUser, [supabase]);
  // create the signout callback
  const signOut = React.useCallback(auth.current.signOut, [auth]);
  // get the user
  const user = _user;
  // setup the context value
  const contextValue = React.useMemo<AuthContext>(
    () => ({
      auth: auth.current,
      uid: user?.id,
      username: user?.user_metadata.username,
      user,
      signOut,
      updateUser,
    }),
    [auth, user, signOut, updateUser]
  );
  // return the provider
  return (
    <AuthContext.Provider value={contextValue}>
      <div ref={ref} {...props} />
    </AuthContext.Provider>
  );
});
AuthProvider.displayName = 'AuthProvider';
