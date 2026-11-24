"use client";

/**
 * Minimal pub/sub so any client component can trigger the app-wide
 * success/error popup (components/ui/PopupHost.tsx, mounted once in the
 * app layout) without prop-drilling or a context provider — call
 * showSuccessPopup()/showErrorPopup() straight after a server action
 * resolves or rejects.
 */
export type PopupKind = "success" | "error";
export type PopupState = { kind: PopupKind; title: string; description?: string };
type Listener = (state: PopupState) => void;

let listener: Listener | null = null;

export function registerPopupListener(fn: Listener): () => void {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

export function showSuccessPopup(title: string, description?: string): void {
  listener?.({ kind: "success", title, description });
}

export function showErrorPopup(title: string, description?: string): void {
  listener?.({ kind: "error", title, description });
}
