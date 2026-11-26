-- admin_list_profiles() fetched every user in one shot — fine at a handful
-- of accounts, not as the platform grows. Add optional paging params,
-- defaulting to the old unbounded behavior so no other caller breaks.
-- Postgres treats a changed argument list as a new overload, not a
-- replacement, so the old zero-arg signature has to be dropped explicitly
-- or it keeps shadowing calls made with no arguments.
drop function if exists public.admin_list_profiles();

create or replace function public.admin_list_profiles(p_limit int default null, p_offset int default 0)
returns table (
  id uuid,
  role text,
  name text,
  email text,
  verified boolean,
  suspended boolean,
  university text,
  field_of_study text,
  title text,
  company text,
  created_at timestamptz
)
language sql
security definer set search_path = public
stable
as $$
  select p.id, p.role, p.name, u.email, p.verified, p.suspended,
         p.university, p.field_of_study, p.title, p.company, p.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where public.is_admin()
  order by p.created_at desc
  limit case when p_limit is null then null else p_limit end
  offset p_offset;
$$;

grant execute on function public.admin_list_profiles(int, int) to authenticated;
