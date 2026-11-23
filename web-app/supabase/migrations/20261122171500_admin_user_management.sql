alter table public.profiles add column suspended boolean not null default false;

-- Admins can read every profile's auth email via this view (profiles alone
-- doesn't carry email; join against auth.users through a security-definer
-- function instead of exposing auth.users directly).
create function public.admin_list_profiles()
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
  where public.is_admin();
$$;

grant execute on function public.admin_list_profiles() to authenticated;
