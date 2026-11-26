create table public.profile_reports (
  id uuid primary key default gen_random_uuid(),
  reported_id uuid not null references public.profiles (id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  check (reported_id <> reporter_id)
);

alter table public.profile_reports enable row level security;

create index profile_reports_status_idx on public.profile_reports (status, created_at desc);

create policy "users can file profile reports"
  on public.profile_reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

create policy "reporters and admins can read profile reports"
  on public.profile_reports for select
  to authenticated
  using (reporter_id = auth.uid() or public.is_admin());

create policy "admins can resolve profile reports"
  on public.profile_reports for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
