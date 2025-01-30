/*
  Appellation: server <actions>
  Contrib: @FL03
*/
'use server';
import { createServerClient, currentUser, getUsername } from '@/utils/supabase';
import {
  REALTIME_SUBSCRIBE_STATES,
} from '@supabase/supabase-js';

export const getProfile = async (username?: string) => {
  if (!username) {
    throw new Error('Error fetching profile: username not provided');
  }

  const supabase = await createServerClient();
  return await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
    .then(({ data, error }) => {
      if (error) throw error;
      return data;
    });
}


const resolveBucket = (base: string, ...path: string[]) => {
  return [base, ...path].join('/');
};

export const uploadAvatar = async (file?: File | null) => {
  const root = 'avatars';
  if (!file) return null;

  const supabase = await createServerClient();
  // fetch the user
  const username = await getUsername(supabase);

  if (!username) {
    throw new Error('Error uploading avatar: user not found');
  }

  const bucket = resolveBucket(root, username);

  const fname = `${username}.${file.name.split('.').pop()}`;

  if (!supabase.storage.from(root).exists(username)) {
    await supabase.storage.createBucket(bucket);
  }

  await supabase.storage
    .from(bucket)
    .upload(fname, file, { upsert: true })
    .then(({ data, error }) => {
      if (error) {
        throw new Error(`Error updating file: ${error.message}`);
      }
      return data;
    });

  const {
    data: { publicUrl: url },
  } = supabase.storage.from(bucket).getPublicUrl(fname);

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: url })
    .eq('username', username);

  if (error) throw error;
  

  return url;
};

export const upsertProfile = async (profile: any): Promise<any> => {
  const supabase = await createServerClient();
  const user = await currentUser(supabase);

  if (!user) {
    throw new Error('Error upserting the profile: user not found');
  }

  if (profile.id !== user.id) {
    throw new Error('Profile ID does not match user ID');
  }
  return await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .eq('id', user.id);
};

type ChangeHandler = <T>(value?: T) => void | Promise<void> | PromiseLike<void>;

type SupaSubscriptionCallback = (
  status: REALTIME_SUBSCRIBE_STATES,
  err?: Error
) => void;

export const profileChannel = async (username?: string) => {
  username ??= await getUsername();
  if (!username) {
    throw new Error('Channel Error: Current user is not authenticated');
  }
  return await createServerClient().then((supabase) =>
    supabase.channel(`profiles:${username}`)
  );
};

export const onProfileChange = async (
  username?: string,
  onChange?: ChangeHandler,
  onSubscribe?: SupaSubscriptionCallback
) => {
  // initialize the channel
  const channel = await profileChannel(username);
  // define the subscription
  return channel
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
      },
      (payload) => {
        if (payload.new) onChange?.(payload.new);
      }
    )
    .subscribe(onSubscribe);
};
