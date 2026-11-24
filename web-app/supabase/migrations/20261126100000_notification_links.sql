-- Notifications had no deep link, so clicking one (new message, connection
-- request, bookmark, project status change) could only mark it read, never
-- navigate anywhere. Add a link column and populate it from every trigger
-- that creates a notification.
alter table public.notifications add column link text;

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

  insert into public.notifications (user_id, type, title, description, link)
  values (
    recipient,
    'new_message',
    coalesce(sender_name, 'Someone') || ' sent you a message',
    left(new.body, 140),
    '/messages/' || new.conversation_id
  );
  return new;
end;
$$;

create or replace function public.notify_on_connection_request()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requester_name text;
begin
  select name into requester_name from public.profiles where id = new.requester_id;
  insert into public.notifications (user_id, type, title, description, link)
  values (
    new.recipient_id,
    'new_interest',
    coalesce(requester_name, 'Someone') || ' wants to connect',
    'Review their profile and respond.',
    '/profile/' || new.requester_id
  );
  return new;
end;
$$;

create or replace function public.notify_on_project_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'published' and old.status is distinct from 'published' then
    insert into public.notifications (user_id, type, title, description, link)
    values (new.student_id, 'project_approved', 'Your project was approved', new.title || ' is now live on Discover', '/projects/' || new.id);
  elsif new.status = 'rejected' and old.status is distinct from 'rejected' then
    insert into public.notifications (user_id, type, title, description, link)
    values (new.student_id, 'project_rejected', 'Your project needs changes', coalesce(new.rejection_reason, new.title), '/projects/' || new.id || '/edit');
  end if;
  return new;
end;
$$;

create or replace function public.notify_on_bookmark()
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
    insert into public.notifications (user_id, type, title, description, link)
    values (owner, 'new_interest', coalesce(bookmarker_name, 'Someone') || ' bookmarked your project', owner_project_title, '/projects/' || new.project_id);
  end if;
  return new;
end;
$$;
