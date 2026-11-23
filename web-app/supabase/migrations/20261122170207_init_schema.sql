-- Provah core schema: profiles, projects, messaging, notifications, bookmarks.

create extension if not exists "pgcrypto";

-- ============================================================
-- profiles
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('student', 'professional', 'admin')),
  name text not null,
  avatar_url text,
  bio text default '',
  verified boolean not null default false,
  badges text[] not null default '{}',

  -- student-only fields
  university text,
  field_of_study text,

  -- professional-only fields
  title text,
  company text,
  location text,
  areas_of_interest text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
-- Expects role/name/etc to be passed via supabase.auth.signUp({ options: { data: {...} } }).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, role, name, university, field_of_study, title, company, location
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'student'),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'university',
    new.raw_user_meta_data ->> 'field_of_study',
    new.raw_user_meta_data ->> 'title',
    new.raw_user_meta_data ->> 'company',
    new.raw_user_meta_data ->> 'location'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- projects
-- ============================================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  field text not null check (field in ('Engineering', 'Health & Medicine', 'Finance & Technology')),
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'published', 'rejected')),
  problem text default '',
  solution text default '',
  tech_stack text[] not null default '{}',
  tags text[] not null default '{}',
  github_url text,
  demo_url text,
  image_url text,
  university text,
  views integer not null default 0,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null
);

create table public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  label text not null,
  kind text not null check (kind in ('pdf', 'video', 'image')),
  url text not null,
  created_at timestamptz not null default now()
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, project_id)
);

-- ============================================================
-- messaging
-- ============================================================
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  professional_id uuid not null references public.profiles (id) on delete cascade,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (project_id, student_id, professional_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.conversation_reads (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

-- keep conversations.last_message / last_message_at in sync
create function public.handle_new_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.conversations
  set last_message = new.body,
      last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger on_message_created
  after insert on public.messages
  for each row execute procedure public.handle_new_message();

-- ============================================================
-- notifications
-- ============================================================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('project_approved', 'project_rejected', 'new_message', 'new_interest')),
  title text not null,
  description text default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- indexes
-- ============================================================
create index projects_student_id_idx on public.projects (student_id);
create index projects_status_idx on public.projects (status);
create index projects_field_idx on public.projects (field);
create index bookmarks_user_id_idx on public.bookmarks (user_id);
create index bookmarks_project_id_idx on public.bookmarks (project_id);
create index conversations_student_id_idx on public.conversations (student_id);
create index conversations_professional_id_idx on public.conversations (professional_id);
create index messages_conversation_id_idx on public.messages (conversation_id);
create index notifications_user_id_idx on public.notifications (user_id);

-- ============================================================
-- row level security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_team_members enable row level security;
alter table public.project_documents enable row level security;
alter table public.bookmarks enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.conversation_reads enable row level security;
alter table public.notifications enable row level security;

create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: anyone signed in can read (names/avatars show up across the app);
-- only the owner (or admin) can write.
create policy "profiles are readable by any signed-in user"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin());

-- projects: published projects are public to signed-in users; owners and
-- admins can see every status.
create policy "published projects are readable by any signed-in user"
  on public.projects for select
  to authenticated
  using (status = 'published' or student_id = auth.uid() or public.is_admin());

create policy "students can create their own projects"
  on public.projects for insert
  to authenticated
  with check (
    student_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'student')
  );

create policy "owners can update their own non-published fields, admins can update any"
  on public.projects for update
  to authenticated
  using (student_id = auth.uid() or public.is_admin());

create policy "owners can delete their own draft projects"
  on public.projects for delete
  to authenticated
  using (student_id = auth.uid() and status = 'draft');

-- project team members / documents: readable with the parent project,
-- writable by the owning student or admin.
create policy "team members follow project visibility"
  on public.project_team_members for select
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.status = 'published' or p.student_id = auth.uid() or public.is_admin())
    )
  );

create policy "owners manage their own team members"
  on public.project_team_members for all
  to authenticated
  using (
    exists (select 1 from public.projects p where p.id = project_id and (p.student_id = auth.uid() or public.is_admin()))
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and (p.student_id = auth.uid() or public.is_admin()))
  );

create policy "documents follow project visibility"
  on public.project_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.status = 'published' or p.student_id = auth.uid() or public.is_admin())
    )
  );

create policy "owners manage their own documents"
  on public.project_documents for all
  to authenticated
  using (
    exists (select 1 from public.projects p where p.id = project_id and (p.student_id = auth.uid() or public.is_admin()))
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and (p.student_id = auth.uid() or public.is_admin()))
  );

-- bookmarks: fully private to the bookmarking user.
create policy "users manage their own bookmarks"
  on public.bookmarks for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- conversations: only the two participants (or admin) can see/create.
create policy "participants can read their conversations"
  on public.conversations for select
  to authenticated
  using (student_id = auth.uid() or professional_id = auth.uid() or public.is_admin());

create policy "participants can start a conversation"
  on public.conversations for insert
  to authenticated
  with check (student_id = auth.uid() or professional_id = auth.uid());

-- messages: only participants of the parent conversation.
create policy "participants can read messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.student_id = auth.uid() or c.professional_id = auth.uid() or public.is_admin())
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
        and (c.student_id = auth.uid() or c.professional_id = auth.uid())
    )
  );

-- conversation_reads: private per-user read receipts.
create policy "users manage their own read receipts"
  on public.conversation_reads for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- notifications: private to the recipient; only admins/service role write them
-- (regular users should never be able to forge a notification for someone else).
create policy "users read their own notifications"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "users mark their own notifications read"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- notification triggers (run as security definer so they can
-- insert for a user other than the one making the request)
-- ============================================================
create function public.notify_on_new_message()
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
  recipient := case when conv.student_id = new.sender_id then conv.professional_id else conv.student_id end;
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

create trigger on_message_notify
  after insert on public.messages
  for each row execute procedure public.notify_on_new_message();

create function public.notify_on_project_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'published' and old.status is distinct from 'published' then
    insert into public.notifications (user_id, type, title, description)
    values (new.student_id, 'project_approved', 'Your project was approved', new.title || ' is now live on Discover');
  elsif new.status = 'rejected' and old.status is distinct from 'rejected' then
    insert into public.notifications (user_id, type, title, description)
    values (new.student_id, 'project_rejected', 'Your project needs changes', coalesce(new.rejection_reason, new.title));
  end if;
  return new;
end;
$$;

create trigger on_project_status_notify
  after update on public.projects
  for each row execute procedure public.notify_on_project_status_change();

create function public.notify_on_bookmark()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  owner uuid;
  owner_project_title text;
  bookmarker_name text;
begin
  select student_id, title into owner, owner_project_title from public.projects where id = new.project_id;
  select name into bookmarker_name from public.profiles where id = new.user_id;

  if owner is not null and owner <> new.user_id then
    insert into public.notifications (user_id, type, title, description)
    values (owner, 'new_interest', coalesce(bookmarker_name, 'Someone') || ' bookmarked your project', owner_project_title);
  end if;
  return new;
end;
$$;

create trigger on_bookmark_notify
  after insert on public.bookmarks
  for each row execute procedure public.notify_on_bookmark();
