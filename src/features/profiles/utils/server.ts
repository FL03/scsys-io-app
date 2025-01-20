/*
  Appellation: server <actions>
  Contrib: @FL03
*/
'use server';
import { createServerClient, currentUser, getUsername } from '@/utils/supabase';
import { REALTIME_SUBSCRIBE_STATES, RealtimeChannel, Subscription } from '@supabase/supabase-js';

const resolveBucket = (base: string, ...path: string[]) => {
  return [base, ...path].join('/');
};

export const uploadAvatar = async (file?: File | null) => {
  const root = 'avatars';
  if (!file) return null;

  const supabase = await createServerClient();
  // fetch the user
  const user = await currentUser(supabase);

  if (!user) {
    return;
  }
  const bucket = resolveBucket(root, user.id);

  const fname = `${user.id}.${file.name.split('.').pop()}`;

  if (!supabase.storage.from(root).exists(user.id)) {
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

  const { error: tableErr } = await supabase
    .from('profiles')
    .update({ avatar_url: url })
    .eq('id', user.id);

  if (tableErr) {
    throw tableErr;
  }

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

type OnProfileChangeCallback = <T extends any>(
  profile?: T
) => void | Promise<void> | PromiseLike<void>;

type SupaSubscriptionCallback = (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => void;

export const profileChannel = async (username?: string) => {
  username ??= await getUsername();
  if (!username) {
    throw new Error('Channel Error: Current user is not authenticated');
  }
  return await createServerClient().then((supabase) =>
    supabase.channel(`profiles:${username}`)
  );
}

export const onProfileChange = async (
  username?: string,
  onChange?: OnProfileChangeCallback,
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
        if (payload.new) onChange?.(payload.new as any);
      }
    )
    .subscribe(onSubscribe);
};
