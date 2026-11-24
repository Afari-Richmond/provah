-- Allow anonymous visitors to browse published projects on the public
-- marketing showcase (/showcase, /showcase/[id]), not just signed-in users.

create policy "published projects are readable by anyone"
  on public.projects for select
  to anon
  using (status = 'published');

create policy "profiles are readable by anyone"
  on public.profiles for select
  to anon
  using (true);

create policy "team members are readable by anyone via published projects"
  on public.project_team_members for select
  to anon
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );

create policy "documents are readable by anyone via published projects"
  on public.project_documents for select
  to anon
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );
