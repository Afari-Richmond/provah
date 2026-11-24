import { notFound } from "next/navigation";
import { MessageThread } from "@/components/messages/MessageThread";
import { requireProfile } from "@/lib/auth";
import { getConversations, getMessages, getConversationById } from "@/lib/data/messaging";
import { getUnreadNotificationCount } from "@/lib/data/notifications";
import { markConversationRead } from "@/lib/actions/messaging";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();

  const conversationRow = await getConversationById(id);
  if (!conversationRow) notFound();
  if (conversationRow.participant_a_id !== profile.id && conversationRow.participant_b_id !== profile.id) {
    notFound();
  }

  const [conversations, messages, unreadCount] = await Promise.all([
    getConversations(profile.id),
    getMessages(id, profile.id),
    getUnreadNotificationCount(profile.id),
  ]);

  const conversation = conversations.find((c) => c.id === id);
  if (!conversation) notFound();

  await markConversationRead(id);

  return (
    <MessageThread
      conversations={conversations}
      conversation={conversation}
      initialMessages={messages}
      profile={profile}
      unreadCount={unreadCount}
    />
  );
}
