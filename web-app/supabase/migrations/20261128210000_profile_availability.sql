alter table public.profiles add column availability_status text
  check (availability_status in ('open', 'busy', 'unavailable'));
