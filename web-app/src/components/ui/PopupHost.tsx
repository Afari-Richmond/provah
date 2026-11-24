"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { registerPopupListener, type PopupState } from "@/lib/popup";

/** Mounted once in the app layout — renders whatever showSuccessPopup()/
 * showErrorPopup() last triggered as a screen-centered confirmation: a
 * colored seal badge, a bold title, optional muted description, and a
 * full-width dismiss button. */
export function PopupHost() {
  const [state, setState] = useState<PopupState | null>(null);

  useEffect(() => registerPopupListener(setState), []);

  if (!state) return null;

  const isSuccess = state.kind === "success";

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-sm p-6" shadow="dark">
        <div className="flex flex-col items-center gap-5 text-center">
          <div
            className="pv-border flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: isSuccess ? "var(--color-success)" : "var(--color-danger)" }}
          >
            {isSuccess ? <CheckIcon /> : <XIcon />}
          </div>
          <div>
            <p className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
              {state.title}
            </p>
            {state.description && (
              <p className="mt-1 font-(family-name:--font-space-grotesk) text-sm text-black/60">
                {state.description}
              </p>
            )}
          </div>
          <Button
            variant={isSuccess ? "primary" : "secondary"}
            className={`w-full ${isSuccess ? "" : "bg-[var(--color-danger)] text-white"}`}
            onClick={() => setState(null)}
          >
            {isSuccess ? "Done" : "Dismiss"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
