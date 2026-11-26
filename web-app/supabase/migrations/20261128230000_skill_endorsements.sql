create table public.skill_endorsements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  skill text not null,
  endorser_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profile_id, skill, endorser_id),
  check (profile_id <> endorser_id)
);

alter table public.skill_endorsements enable row level security;

create index skill_endorsements_profile_id_idx on public.skill_endorsements (profile_id);

create policy "any signed-in user can read endorsements"
  on public.skill_endorsements for select
  to authenticated
  using (true);

-- Endorsing is limited to people you're actually connected with, and only
-- for a skill that's actually on their profile — keeps this from becoming
-- an easy spam/gaming vector.
create policy "connected users can endorse each other's listed skills"
  on public.skill_endorsements for insert
  to authenticated
  with check (
    endorser_id = auth.uid()
    and exists (
      select 1 from public.connections c
      where c.status = 'accepted'
        and (
          (c.requester_id = auth.uid() and c.recipient_id = profile_id)
          or (c.recipient_id = auth.uid() and c.requester_id = profile_id)
        )
    )
    and exists (
      select 1 from public.profiles p
      where p.id = profile_id and skill = any(p.skills)
    )
  );

create policy "users can remove their own endorsement"
  on public.skill_endorsements for delete
  to authenticated
  using (endorser_id = auth.uid());
