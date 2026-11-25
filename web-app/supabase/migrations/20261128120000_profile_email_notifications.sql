-- Settings had a notification checkbox that was purely local React state —
-- never read from or written to the database. Give it something real.
alter table public.profiles add column email_notifications boolean not null default true;
