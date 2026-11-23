-- Atomic view-count increment, callable by any signed-in user viewing a
-- published project (bypasses RLS via security definer so a viewer who
-- isn't the owner can still bump the counter).
create function public.increment_project_views(p_project_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.projects set views = views + 1 where id = p_project_id;
end;
$$;

grant execute on function public.increment_project_views(uuid) to authenticated;
