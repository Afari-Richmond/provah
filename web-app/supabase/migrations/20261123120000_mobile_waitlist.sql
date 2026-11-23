create table public.mobile_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.mobile_waitlist enable row level security;

create policy "Anyone can join the mobile waitlist"
  on public.mobile_waitlist for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view the mobile waitlist"
  on public.mobile_waitlist for select
  to authenticated
  using (public.is_admin());
