-- Social/collaboration layer: feed posts, connection requests, generalized
-- (role-agnostic) direct messaging, richer profiles, and storage buckets
-- for avatars and project media.
--
-- Safe to restructure conversations/messages here: confirmed 0 rows in
-- either table in production at the time of this migration.

-- ============================================================
-- richer profiles
-- ============================================================
alter table public.profiles
  add column cover_image_url text,
  add column skills text[] not null default '{}',
  add column linkedin_url text,
  add column portfolio_url text;

-- ============================================================
-- connections (friend/connection requests, role-agnostic)
-- ============================================================
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint connections_not_self check (requester_id <> recipient_id),
  unique (requester_id, recipient_id)
);

create index connections_requester_id_idx on public.connections (requester_id);
create index connections_recipient_id_idx on public.connections (recipient_id);

alter table public.connections enable row level security;

create policy "participants can read their own connections"
  on public.connections for select
  to authenticated
  using (requester_id = auth.uid() or recipient_id = auth.uid());

create policy "users can send connection requests"
  on public.connections for insert
  to authenticated
  with check (requester_id = auth.uid());

create policy "recipient can respond, requester can cancel"
  on public.connections for update
  to authenticated
  using (requester_id = auth.uid() or recipient_id = auth.uid())
  with check (requester_id = auth.uid() or recipient_id = auth.uid());

create policy "participants can delete their own connection"
  on public.connections for delete
  to authenticated
  using (requester_id = auth.uid() or recipient_id = auth.uid());

-- ============================================================
-- generalize conversations to be role-agnostic, project optional
-- ============================================================
alter table public.conversations
  rename column student_id to participant_a_id;
alter table public.conversations
  rename column professional_id to participant_b_id;
alter table public.conversations
  alter column project_id drop not null;
alter table public.conversations
  drop constraint conversations_project_id_student_id_professional_id_key;
alter table public.conversations
  add constraint conversations_participants_unique
  unique (project_id, participant_a_id, participant_b_id);
alter table public.conversations
  add constraint conversations_not_self
  check (participant_a_id <> participant_b_id);

drop policy "participants can read their conversations" on public.conversations;
drop policy "participants can start a conversation" on public.conversations;
drop policy "participants can read messages" on public.messages;
drop policy "participants can send messages" on public.messages;

create policy "participants can read their conversations"
  on public.conversations for select
  to authenticated
  using (participant_a_id = auth.uid() or participant_b_id = auth.uid() or public.is_admin());

create policy "participants can start a conversation"
  on public.conversations for insert
  to authenticated
  with check (participant_a_id = auth.uid() or participant_b_id = auth.uid());

create policy "participants can read messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.participant_a_id = auth.uid() or c.participant_b_id = auth.uid() or public.is_admin())
    )
  );

create policy "participants can send messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.participant_a_id = auth.uid() or c.participant_b_id = auth.uid())
    )
  );

-- notify_on_new_message() referenced the old column names directly
create or replace function public.notify_on_new_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  conv record;
  recipient uuid;
  sender_name text;
begin
  select * into conv from public.conversations where id = new.conversation_id;
  recipient := case when conv.participant_a_id = new.sender_id then conv.participant_b_id else conv.participant_a_id end;
  select name into sender_name from public.profiles where id = new.sender_id;

  insert into public.notifications (user_id, type, title, description)
  values (
    recipient,
    'new_message',
    coalesce(sender_name, 'Someone') || ' sent you a message',
    left(new.body, 140)
  );
  return new;
end;
$$;

-- ============================================================
-- feed: posts, likes, comments
-- ============================================================
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null default '',
  image_url text,
  project_id uuid references public.projects (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.post_likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index posts_author_id_idx on public.posts (author_id);
create index posts_created_at_idx on public.posts (created_at desc);
create index post_likes_post_id_idx on public.post_likes (post_id);
create index post_comments_post_id_idx on public.post_comments (post_id);

alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;

create policy "any signed-in user can read posts"
  on public.posts for select
  to authenticated
  using (true);

create policy "users create their own posts"
  on public.posts for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "users manage their own posts"
  on public.posts for all
  to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

create policy "any signed-in user can read likes"
  on public.post_likes for select
  to authenticated
  using (true);

create policy "users manage their own likes"
  on public.post_likes for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "any signed-in user can read comments"
  on public.post_comments for select
  to authenticated
  using (true);

create policy "users create their own comments"
  on public.post_comments for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "users manage their own comments"
  on public.post_comments for all
  to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

-- notify the recipient of a new connection request / acceptance
create function public.notify_on_connection_request()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requester_name text;
begin
  select name into requester_name from public.profiles where id = new.requester_id;
  insert into public.notifications (user_id, type, title, description)
  values (
    new.recipient_id,
    'new_interest',
    coalesce(requester_name, 'Someone') || ' wants to connect',
    'Review their profile and respond.'
  );
  return new;
end;
$$;

create trigger on_connection_request
  after insert on public.connections
  for each row execute procedure public.notify_on_connection_request();

-- ============================================================
-- storage buckets: avatars + project media
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

create policy "anyone can view avatar files"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "signed-in users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "signed-in users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "signed-in users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "anyone can view project media"
  on storage.objects for select
  to public
  using (bucket_id = 'project-media');

create policy "signed-in users can upload their own project media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "signed-in users can update their own project media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "signed-in users can delete their own project media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-media' and (storage.foldername(name))[1] = auth.uid()::text);
