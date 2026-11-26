"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import {
  updateAccount,
  updateNotificationPreferences,
  deleteAccount,
  type AccountFormState,
  type DeleteAccountState,
} from "@/lib/actions/account";
import { cancelConnection, respondToConnectionRequest } from "@/lib/actions/connections";
import { unblockUser } from "@/lib/actions/blocks";
import { exportAccountData } from "@/lib/actions/dataExport";
import { showErrorPopup, showSuccessPopup } from "@/lib/popup";
import { TwoFactorSettings } from "@/components/TwoFactorSettings";
import type { PendingConnectionRequest } from "@/lib/data/connections";
import type { BlockedProfile } from "@/lib/data/blocks";
import type { NotificationPreferences } from "@/lib/types";
import type { MfaFactor } from "@/lib/actions/mfa";

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
const initialDeleteState: DeleteAccountState = { error: null };

export function SettingsClient({
  email,
  notificationPreferences,
  connections,
  pendingRequests,
  blockedUsers,
  mfaFactors,
}: {
  email: string;
  notificationPreferences: NotificationPreferences;
  connections: ConnectionProfile[];
  pendingRequests: PendingConnectionRequest[];
  blockedUsers: BlockedProfile[];
  mfaFactors: MfaFactor[];
}) {
  const router = useRouter();
  const [prefs, setPrefs] = useState(notificationPreferences);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [connectionList, setConnectionList] = useState(connections);
  const [requestList, setRequestList] = useState(pendingRequests);
  const [blockedList, setBlockedList] = useState(blockedUsers);
  const [state, formAction, pending] = useActionState(updateAccount, initialState);
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteAccount,
    initialDeleteState,
  );
  const [, startTransition] = useTransition();

  function toggleNotification(key: keyof NotificationPreferences, checked: boolean) {
    const next = { ...prefs, [key]: checked };
    setPrefs(next);
    startTransition(async () => {
      try {
        await updateNotificationPreferences(next);
      } catch (err) {
        setPrefs(prefs);
        showErrorPopup("Couldn't save preference", err instanceof Error ? err.message : undefined);
      }
    });
  }

  function respond(connectionId: string, accept: boolean) {
    setRespondingId(connectionId);
    startTransition(async () => {
      try {
        await respondToConnectionRequest(connectionId, accept);
        const accepted = requestList.find((r) => r.id === connectionId);
        setRequestList((list) => list.filter((r) => r.id !== connectionId));
        if (accept && accepted) {
          setConnectionList((list) => [
            {
              id: accepted.requester.id,
              name: accepted.requester.name,
              role: accepted.requester.role,
              avatar_url: accepted.requester.avatarUrl,
              university: accepted.requester.university,
              company: accepted.requester.company,
              title: accepted.requester.title,
            },
            ...list,
          ]);
        }
        showSuccessPopup(accept ? "Connection accepted" : "Request declined");
      } catch (err) {
        showErrorPopup("Couldn't respond to request", err instanceof Error ? err.message : undefined);
      } finally {
        setRespondingId(null);
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

  async function downloadData() {
    setExporting(true);
    try {
      const data = await exportAccountData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `provah-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      showErrorPopup("Couldn't export your data", err instanceof Error ? err.message : undefined);
    } finally {
      setExporting(false);
    }
  }

  function unblock(otherUserId: string) {
    setUnblockingId(otherUserId);
    startTransition(async () => {
      try {
        await unblockUser(otherUserId);
        setBlockedList((list) => list.filter((b) => b.id !== otherUserId));
        showSuccessPopup("Unblocked");
      } catch (err) {
        showErrorPopup("Couldn't unblock", err instanceof Error ? err.message : undefined);
      } finally {
        setUnblockingId(null);
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
          <TextField label="Email" defaultValue={email} disabled autoComplete="email" />
          <TextField
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Leave blank to keep current"
            minLength={8}
          />
          <TextField
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            hint="Required to change your password"
            placeholder="Your current password"
          />
          {state.error && (
            <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
              {state.error}
            </p>
          )}
          {state.success && (
            <p role="status" aria-live="polite" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-primary)]">
              Updated ✓
            </p>
          )}
          <Button type="submit" variant="primary" className="self-start" loading={pending}>
            {pending ? "Saving..." : "Update account"}
          </Button>
        </Card>
      </form>

      <TwoFactorSettings initialFactors={mfaFactors} />

      <Card className="mt-6 flex flex-col gap-4 p-6 sm:p-8" shadow="dark">
        <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
          Notifications
        </h2>
        <label className="flex items-center justify-between">
          <span className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
            Email me about new messages
          </span>
          <input
            type="checkbox"
            checked={prefs.messages}
            onChange={(e) => toggleNotification("messages", e.target.checked)}
            className="h-5 w-5 rounded border-2 border-[var(--color-ink)]/20 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
            Email me about connection requests
          </span>
          <input
            type="checkbox"
            checked={prefs.connections}
            onChange={(e) => toggleNotification("connections", e.target.checked)}
            className="h-5 w-5 rounded border-2 border-[var(--color-ink)]/20 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-ink)]">
            Email me about project status updates
          </span>
          <input
            type="checkbox"
            checked={prefs.projectUpdates}
            onChange={(e) => toggleNotification("projectUpdates", e.target.checked)}
            className="h-5 w-5 rounded border-2 border-[var(--color-ink)]/20 accent-[var(--color-primary)]"
          />
        </label>
      </Card>

      {requestList.length > 0 && (
        <Card className="mt-6 flex flex-col gap-4 p-6 sm:p-8" shadow="dark">
          <div className="flex items-center justify-between">
            <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
              Pending requests
            </h2>
            <span className="font-(family-name:--font-space-mono) text-xs text-black/40">
              {requestList.length}
            </span>
          </div>
          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            {requestList.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => router.push(`/profile/${r.requester.id}`)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <Avatar
                    name={r.requester.name}
                    seed={r.requester.id}
                    imageUrl={r.requester.avatarUrl ?? undefined}
                    size={40}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                      {r.requester.name}
                    </p>
                    <p className="truncate font-(family-name:--font-space-grotesk) text-xs text-black/50">
                      {r.requester.role === "student" ? r.requester.university : r.requester.company}
                    </p>
                  </div>
                </button>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="secondary"
                    className="px-4 py-2 text-xs"
                    onClick={() => respond(r.id, false)}
                    loading={respondingId === r.id}
                  >
                    Decline
                  </Button>
                  <Button
                    variant="primary"
                    className="px-4 py-2 text-xs"
                    onClick={() => respond(r.id, true)}
                    loading={respondingId === r.id}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

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

      {blockedList.length > 0 && (
        <Card className="mt-6 flex flex-col gap-4 p-6 sm:p-8" shadow="dark">
          <div className="flex items-center justify-between">
            <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
              Blocked
            </h2>
            <span className="font-(family-name:--font-space-mono) text-xs text-black/40">
              {blockedList.length}
            </span>
          </div>
          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            {blockedList.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar name={b.name} seed={b.id} imageUrl={b.avatarUrl ?? undefined} size={40} />
                  <div className="min-w-0">
                    <p className="truncate font-(family-name:--font-space-grotesk) text-sm font-semibold text-[var(--color-ink)]">
                      {b.name}
                    </p>
                    <p className="truncate font-(family-name:--font-space-grotesk) text-xs text-black/50">
                      {b.role === "student" ? b.university : b.company}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="shrink-0 px-4 py-2 text-xs"
                  onClick={() => unblock(b.id)}
                  loading={unblockingId === b.id}
                >
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-6 flex flex-col gap-3 p-6 sm:p-8" shadow="dark">
        <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
          Your data
        </h2>
        <p className="font-(family-name:--font-space-grotesk) text-sm text-black/60">
          Download a copy of your profile, projects, messages, connections, and activity as a
          JSON file.
        </p>
        <Button variant="secondary" className="self-start" onClick={downloadData} loading={exporting}>
          {exporting ? "Preparing..." : "Download my data"}
        </Button>
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

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} labelledBy="delete-account-title">
          <Card className="w-full max-w-sm p-6" shadow="dark">
            <h3
              id="delete-account-title"
              className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]"
            >
              Delete your account?
            </h3>
            <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
              This removes your profile and every project you&apos;ve submitted.
              This can&apos;t be undone.
            </p>
            <form action={deleteFormAction} className="mt-4 flex flex-col gap-3">
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password to confirm"
                autoFocus
                required
              />
              {deleteState.error && (
                <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
                  {deleteState.error}
                </p>
              )}
              <div className="mt-2 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-[var(--color-danger)]"
                  loading={deletePending}
                >
                  Delete account
                </Button>
              </div>
            </form>
          </Card>
      </Modal>
    </>
  );
}
