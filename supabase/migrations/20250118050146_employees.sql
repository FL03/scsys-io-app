-- The schema and related models for employee data

CREATE SCHEMA IF NOT EXISTS employees;

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
alter table public.shifts
  enable row level security;

create policy "Shifts are viewable by everyone." on public.shifts
  for select using (true);

create policy "Users can insert their own shifts." on public.shifts
  for insert with check ((select auth.uid()) = assignee);

create policy "Users can update own shifts." on public.shifts
  for update using ((select auth.uid()) = assignee);