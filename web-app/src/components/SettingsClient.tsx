"use client";

import { useActionState, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { updateAccount, deleteAccount, type AccountFormState } from "@/lib/actions/account";

const initialState: AccountFormState = { error: null };

export function SettingsClient({ email }: { email: string }) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [state, formAction, pending] = useActionState(updateAccount, initialState);

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
          <Button type="submit" variant="primary" className="self-start" disabled={pending}>
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
            onChange={(e) => setEmailNotifs(e.target.checked)}
            className="h-5 w-5 rounded border-2 border-[var(--color-ink)]/20 accent-[var(--color-primary)]"
          />
        </label>
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
