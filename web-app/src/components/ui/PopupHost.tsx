"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/ui/Toast";
import { registerPopupListener, type PopupState } from "@/lib/popup";

const AUTO_DISMISS_MS: Record<PopupState["kind"], number> = {
  success: 3500,
  error: 6000,
};

/** Mounted once in the app layout — renders whatever showSuccessPopup()/
 * showErrorPopup() last triggered as a non-blocking toast in the corner of
 * the screen, auto-dismissing after a few seconds (errors stay up longer). */
export function PopupHost() {
  const [state, setState] = useState<PopupState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () =>
      registerPopupListener((next) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setState(next);
        timeoutRef.current = setTimeout(() => setState(null), AUTO_DISMISS_MS[next.kind]);
      }),
    [],
  );

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  if (!state) return null;

  return (
    <Toast
      kind={state.kind}
      title={state.title}
      description={state.description}
      onDismiss={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setState(null);
      }}
    />
  );
}
