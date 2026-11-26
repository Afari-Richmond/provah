-- email_notifications was a single all-or-nothing switch covering messages,
-- connections, and project status in one checkbox. Split it into per-category
-- preferences, backfilling everyone's existing choice into all three.
alter table public.profiles add column notification_preferences jsonb not null default
  '{"messages": true, "connections": true, "project_updates": true}'::jsonb;

update public.profiles set notification_preferences = jsonb_build_object(
  'messages', email_notifications,
  'connections', email_notifications,
  'project_updates', email_notifications
);

alter table public.profiles drop column email_notifications;
