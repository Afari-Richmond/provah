create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  detail text,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;

create index admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);

create policy "admins can read the audit log"
  on public.admin_audit_log for select
  to authenticated
  using (public.is_admin());

create policy "admins can write to the audit log"
  on public.admin_audit_log for insert
  to authenticated
  with check (public.is_admin() and admin_id = auth.uid());
