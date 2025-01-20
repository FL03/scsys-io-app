-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  customer_id     uuid,
  username        text not null unique,
  avatar_url      text,
  bio             text,
  display_name    text,
  name_prefix     text,
  name_suffix     text,
  first_name      text,
  middle_name     text,
  last_name       text,
  role            text default 'user',
  status          text default 'active',
  email           text array,
  phone           text array,
  socials         text array,
  department      text,
  titles          text array,
  metadata        jsonb,
  website         text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE POLICY "Anyone can view a user's profile" on public.profiles
  FOR SELECT 
  USING (true);

CREATE OR REPLACE POLICY "Users can manage their own data" on public.profiles
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid() AS uid) = user_id) 
  WITH check (( SELECT auth.uid() AS uid) = user_id);

-- This trigger automatically updated the updated_at column when the row is updated
CREATE OR REPLACE FUNCTION public.handle_profile_update() 
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- This funciton 
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SET search_path = ''
LANGUAGE plpgsql 
SECURITY definer
AS $$
BEGIN
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT 
  ON auth.users
  FOR each ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE TRIGGER on_user_updated
  AFTER UPDATE 
  ON public.profiles
  FOR each ROW EXECUTE PROCEDURE public.on_new_user();

CREATE OR REPLACE FUNCTION public.username()
AS $$
DECLARE
  current_username text;
BEGIN
  -- Retrieve the username for the current user
  SELECT username INTO current_username
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN current_username;
END;
$$ LANGUAGE plpgsql SECURITY definer;

CREATE OR REPLACE FUNCTION public.username()
AS $$
DECLARE
    user_profile record;
BEGIN
  -- Retrieve the profile for the current user
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN user_profile;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Set up Storage!

-- Create a bucket for avatars
INSERT INTO storage.buckets 
  (id, name, public)
VALUE 
  ('avatars', 'avatars', true);
