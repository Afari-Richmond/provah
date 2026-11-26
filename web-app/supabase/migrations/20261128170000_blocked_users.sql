create table public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

alter table public.blocked_users enable row level security;

-- A block is private to the person who made it — only the blocker can see,
-- create, or remove their own block. Whether the check applies the other
-- direction too (did THEY block ME) is resolved server-side with the
-- service-role client, not via RLS, so a user can never enumerate who has
-- blocked them.
create policy "users manage their own blocks"
  on public.blocked_users for all
  to authenticated
  using (blocker_id = auth.uid())
  with check (blocker_id = auth.uid());
