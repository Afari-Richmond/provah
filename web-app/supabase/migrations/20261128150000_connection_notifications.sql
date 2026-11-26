-- Connection requests were notified under the generic 'new_interest' type
-- (shared with project bookmarks), making the two indistinguishable in the
-- UI, and accepting a request never notified the original requester at all.
-- Give connections their own notification types and add the missing
-- accepted-notification trigger.
alter table public.notifications drop constraint notifications_type_check;
alter table public.notifications add constraint notifications_type_check
  check (type in (
    'project_approved', 'project_rejected', 'new_message', 'new_interest',
    'connection_request', 'connection_accepted'
  ));

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
    'connection_request',
    coalesce(requester_name, 'Someone') || ' wants to connect',
    'Review their profile and respond.',
    '/profile/' || new.requester_id
  );
  return new;
end;
$$;

create or replace function public.notify_on_connection_accepted()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  recipient_name text;
begin
  if new.status = 'accepted' and old.status is distinct from 'accepted' then
    select name into recipient_name from public.profiles where id = new.recipient_id;
    insert into public.notifications (user_id, type, title, description, link)
    values (
      new.requester_id,
      'connection_accepted',
      coalesce(recipient_name, 'Someone') || ' accepted your connection request',
      'You''re now connected.',
      '/profile/' || new.recipient_id
    );
  end if;
  return new;
end;
$$;

create trigger on_connection_accepted
  after update on public.connections
  for each row execute procedure public.notify_on_connection_accepted();
