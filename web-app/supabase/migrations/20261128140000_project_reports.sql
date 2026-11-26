create table public.project_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.project_reports enable row level security;

create index project_reports_status_idx on public.project_reports (status, created_at desc);

-- reporters can file a report and see their own; admins can see and resolve all.
create policy "users can file project reports"
  on public.project_reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

create policy "reporters and admins can read reports"
  on public.project_reports for select
  to authenticated
  using (reporter_id = auth.uid() or public.is_admin());

create policy "admins can resolve reports"
  on public.project_reports for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
