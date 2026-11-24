"use client";

import { useState, useTransition, type ButtonHTMLAttributes, type ReactNode } from "react";
import { logOut } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/**
 * Wraps any trigger markup (icon button, text link, mobile menu row) with a
 * "Log out?" confirm step — logging out used to fire the instant you
 * clicked, with no way to back out of an accidental click.
 */
export function LogoutButton({
  children,
  onClick,
  ...triggerProps
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function confirmLogout() {
    startTransition(async () => {
      await logOut();
    });
  }

  return (
    <>
      <button
        type="button"
        {...triggerProps}
        onClick={(e) => {
          onClick?.(e);
          setOpen(true);
        }}
      >
        {children}
      </button>
      {open && (
        <div className="fixed inset-0 z-[997] flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm p-6" shadow="dark">
            <h3 className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
              Log out?
            </h3>
            <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
              You&apos;ll need to sign in again to get back to your dashboard, messages, and
              projects.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-[var(--color-danger)] text-white"
                onClick={confirmLogout}
                loading={isPending}
              >
                Log out
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
