import { AppNavBar } from "@/components/layout/AppNavBar";
import { ConversationList } from "@/components/messages/ConversationList";
import { requireProfile } from "@/lib/auth";
import { getConversations } from "@/lib/data/messaging";

export default async function MessagesPage() {
  const profile = await requireProfile();
  const conversations = await getConversations(profile.id);

  return (
    <div className="flex h-screen flex-col bg-white">
      <AppNavBar active="/messages" />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-full max-w-sm shrink-0 overflow-y-auto border-r border-[var(--color-border)] sm:block">
          <div className="px-4 py-5">
            <h1 className="font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
              Messages
            </h1>
          </div>
          <ConversationList conversations={conversations} />
        </aside>
        <div className="hidden flex-1 flex-col items-center justify-center sm:flex">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/40">
            Select a conversation to start chatting.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto sm:hidden">
          <div className="px-4 py-5">
            <h1 className="font-(family-name:--font-unbounded) text-xl font-bold text-[var(--color-ink)]">
              Messages
            </h1>
          </div>
          <ConversationList conversations={conversations} />
        </div>
      </div>
    </div>
  );
}
