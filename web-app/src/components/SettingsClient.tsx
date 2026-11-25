"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import {
  updateAccount,
  updateEmailNotifications,
  deleteAccount,
  type AccountFormState,
} from "@/lib/actions/account";
import { cancelConnection } from "@/lib/actions/connections";
import { showErrorPopup, showSuccessPopup } from "@/lib/popup";

type ConnectionProfile = {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  university: string | null;
  company: string | null;
  title: string | null;
};

const initialState: AccountFormState = { error: null };

export function SettingsClient({
  email,
  emailNotifications,
  connections,
}: {
  email: string;
  emailNotifications: boolean;
  connections: ConnectionProfile[];
}) {
  const router = useRouter();
  const [emailNotifs, setEmailNotifs] = useState(emailNotifications);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [connectionList, setConnectionList] = useState(connections);
  const [state, formAction, pending] = useActionState(updateAccount, initialState);
  const [, startTransition] = useTransition();

  function toggleNotifications(checked: boolean) {
    setEmailNotifs(checked);
    startTransition(async () => {
      try {
        await updateEmailNotifications(checked);
      } catch (err) {
        setEmailNotifs(!checked);
        showErrorPopup("Couldn't save preference", err instanceof Error ? err.message : undefined);
      }
    });
  }

  function removeConnection(otherUserId: string) {
    setRemovingId(otherUserId);
    startTransition(async () => {
      try {
        await cancelConnection(otherUserId);
        setConnectionList((list) => list.filter((c) => c.id !== otherUserId));
        showSuccessPopup("Connection removed");
      } catch (err) {
        showErrorPopup("Couldn't remove connection", err instanceof Error ? err.message : undefined);
      } finally {
        setRemovingId(null);
      }
    });
  }

  return (
    <>
      <form action={formAction}>
        <Card className="mt-8 flex flex-col gap-5 p-6 sm:p-8" shadow="dark">
          <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
            Account
          </h2>
          <TextField label="Email" defaultValue={email} disabled />
          <TextField
            label="New password"
            name="password"
            type="password"
            placeholder="Leave blank to keep current"
            minLength={8}
          />
          {state.error && (
            <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-primary)]">
              Updated ✓
            </p>
          )}
          <Button type="submit" variant="primary" className="self-start" loading={pending}>
            {pending ? "Saving..." : "Update account"}
          </Button>
        </Card>
      </form>

      <Card className="mt-6 flex flex-col gap-4 p-6 sm:p-8" shadow="dark">
        <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
          Notifications
        </h2>
        <label className="flex items-center justify-between">
          <span className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
            Email me about new messages and project updates
          </span>
          <input
            type="checkbox"
            checked={emailNotifs}
            onChange={(e) => toggleNotifications(e.target.checked)}
            className="h-5 w-5 rounded border-2 border-[var(--color-ink)]/20 accent-[var(--color-primary)]"
          />
        </label>
      </Card>

      <Card className="mt-6 flex flex-col gap-4 p-6 sm:p-8" shadow="dark">
        <div className="flex items-center justify-between">
          <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
            Connections
          </h2>
          <span className="font-(family-name:--font-space-mono) text-xs text-black/40">
            {connectionList.length}
          </span>
        </div>
        {connectionList.length === 0 ? (
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/50">
            You haven&apos;t connected with anyone yet.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            {connectionList.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => router.push(`/profile/${c.id}`)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <Avatar name={c.name} seed={c.id} imageUrl={c.avatar_url ?? undefined} size={40} />
                  <div className="min-w-0">
                    <p className="truncate font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                      {c.name}
                    </p>
                    <p className="truncate font-(family-name:--font-space-grotesk) text-xs text-black/50">
                      {c.role === "student" ? c.university : c.company}
                    </p>
                  </div>
                </button>
                <Button
                  variant="secondary"
                  className="shrink-0 border-[var(--color-danger)] px-4 py-2 text-xs text-[var(--color-danger)]"
                  onClick={() => removeConnection(c.id)}
                  loading={removingId === c.id}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="mt-6 flex flex-col gap-3 border-[var(--color-danger)]/30 p-6 sm:p-8" shadow="dark">
        <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-danger)]">
          Danger zone
        </h2>
        <p className="font-(family-name:--font-space-grotesk) text-sm text-black/60">
          Deleting your account removes your profile and all your projects permanently.
        </p>
        <Button
          variant="secondary"
          className="self-start border-[var(--color-danger)] text-[var(--color-danger)]"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete account
        </Button>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm p-6" shadow="dark">
            <h3 className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
              Delete your account?
            </h3>
            <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
              This removes your profile and every project you&apos;ve submitted.
              This can&apos;t be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <form action={deleteAccount}>
                <Button type="submit" variant="primary" className="bg-[var(--color-danger)]">
                  Delete account
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
