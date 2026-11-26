-- Messaging had no presence, read receipts, or live delivery: last_seen_at
-- didn't exist, the only conversation_reads policy let a user read their
-- own row but not their counterpart's (so "seen" status can't be shown),
-- and messages/notifications were never added to the realtime publication
-- so nothing pushed to an open tab without a refresh.
alter table public.profiles add column last_seen_at timestamptz;

create policy "participants can read read receipts in their conversations"
  on public.conversation_reads for select
  to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.participant_a_id = auth.uid() or c.participant_b_id = auth.uid())
    )
  );

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.conversation_reads;
