-- The schema and related models for employee data
CREATE SCHEMA IF NOT EXISTS business;

CREATE TABLE IF NOT EXISTS business.roles
(
  id              uuid not null primary key unique default gen_random_uuid(),
  name            text not null unique,
  description     text,
  permissions     text array,
  metadata        jsonb,
  created_at      timestamptz default now(),
  created_by      uuid references public.profiles(id) on delete set null,
  updated_at      timestamptz default now(),
  updated_by      uuid references public.profiles(id) on delete set null
);

CREATE TABLE IF NOT EXISTS business.departments
(
  id              uuid not null primary key unique default gen_random_uuid(),
  name            text not null unique,
  description     text,
  metadata        jsonb,
  created_at      timestamptz default now(),
  created_by      uuid references public.profiles(id) on delete set null,
  updated_at      timestamptz default now(),
  updated_by      uuid references public.profiles(id) on delete set null
);

CREATE TABLE IF NOT EXISTS business.employees
(
  id              uuid not null primary key unique default gen_random_uuid(),
  profile         uuid references public.profiles(id) on delete cascade,
  department      uuid references business.departments(id) on delete set null,
  role            uuid references business.roles(id) on delete set null,
  metadata        jsonb,
  created_at      timestamptz default now(),
  created_by      uuid references public.profiles(id) on delete set null,
  updated_at      timestamptz default now(),
  updated_by      uuid references public.profiles(id) on delete set null
);

-- The shifts table
CREATE TABLE IF NOT EXISTS public.shifts
(
  id              uuid not null primary key unique default gen_random_uuid(),
  assignee        uuid references public.profiles(username) on delete set null,
  date            date not null,
  status          text not null default 'pending',
  tips_cash       numeric(10, 2) not null default 0.00,
  tips_credit     numeric(10, 2) not null default 0.00,
  clocked_in      timestamptz,
  clocked_out     timestamptz,
  start_at        timestamptz,
  ends_at         timestamptz,
  attachments     text array,
  tags            text array,
  metadata        jsonb,
  created_at      timestamptz default now(),
  created_by      uuid references public.profiles(id) on delete set null,
  updated_at      timestamptz default now(),
  updated_by      uuid references public.profiles(id) on delete set null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Any authenticated employee can view posted shifts" on public.shifts
  AS permissive
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employees can manage their shifts" on public.shifts
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT public.username()) = assignee) 
  WITH check (( SELECT public.username()) = assignee);