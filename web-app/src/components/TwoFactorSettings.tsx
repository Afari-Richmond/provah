"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  enrollMfa,
  verifyMfaEnrollment,
  unenrollMfa,
  cancelMfaEnrollment,
  type MfaFactor,
} from "@/lib/actions/mfa";
import { showErrorPopup, showSuccessPopup } from "@/lib/popup";

export function TwoFactorSettings({ initialFactors }: { initialFactors: MfaFactor[] }) {
  const [factors, setFactors] = useState(initialFactors);
  const [enrolling, setEnrolling] = useState<{ factorId: string; qrCode: string; secret: string } | null>(
    null,
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDisable, setConfirmDisable] = useState(false);
  const titleId = useId();

  const enabled = factors.some((f) => f.status === "verified");

  async function startEnroll() {
    setBusy(true);
    setError(null);
    try {
      const result = await enrollMfa();
      setEnrolling(result);
    } catch (err) {
      showErrorPopup("Couldn't start setup", err instanceof Error ? err.message : undefined);
    } finally {
      setBusy(false);
    }
  }

  async function cancelEnroll() {
    if (enrolling) await cancelMfaEnrollment(enrolling.factorId).catch(() => {});
    setEnrolling(null);
    setCode("");
    setError(null);
  }

  async function confirmEnroll() {
    if (!enrolling) return;
    setBusy(true);
    setError(null);
    try {
      await verifyMfaEnrollment(enrolling.factorId, code);
      setFactors((f) => [...f, { id: enrolling.factorId, status: "verified", createdAt: new Date().toISOString() }]);
      setEnrolling(null);
      setCode("");
      showSuccessPopup("Two-factor authentication enabled");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't verify that code.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDisableFactor() {
    const factor = factors.find((f) => f.status === "verified");
    setConfirmDisable(false);
    if (!factor) return;
    setBusy(true);
    try {
      await unenrollMfa(factor.id);
      setFactors((f) => f.filter((x) => x.id !== factor.id));
      showSuccessPopup("Two-factor authentication disabled");
    } catch (err) {
      showErrorPopup("Couldn't disable 2FA", err instanceof Error ? err.message : undefined);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mt-6 flex flex-col gap-4 p-6 sm:p-8" shadow="dark">
      <div className="flex items-center justify-between">
        <h2 className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-black/40">
          Two-factor authentication
        </h2>
        {enabled && (
          <span className="rounded-full bg-[var(--color-success)]/10 px-2.5 py-1 font-(family-name:--font-space-mono) text-[10px] font-bold uppercase tracking-[0.03em] text-[var(--color-success)]">
            Enabled
          </span>
        )}
      </div>

      {enrolling ? (
        <div className="flex flex-col gap-4">
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/60">
            Scan this code with your authenticator app (Google Authenticator, 1Password, Authy),
            then enter the 6-digit code it shows.
          </p>
          <div
            className="pv-border w-fit rounded-xl bg-white p-3"
            // Supabase returns a trusted, self-generated SVG string for the QR code.
            dangerouslySetInnerHTML={{ __html: enrolling.qrCode }}
          />
          <p className="font-(family-name:--font-space-mono) text-xs text-black/50">
            Can&apos;t scan it? Enter this code manually: <strong>{enrolling.secret}</strong>
          </p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            placeholder="123456"
            maxLength={6}
            className="w-40 rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-4 py-3 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] outline-none placeholder:text-black/30 focus:border-[var(--color-primary)]"
          />
          {error && (
            <p role="alert" aria-live="assertive" className="font-(family-name:--font-space-grotesk) text-sm text-[var(--color-danger)]">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={cancelEnroll} disabled={busy}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmEnroll} loading={busy} disabled={code.length !== 6}>
              Confirm
            </Button>
          </div>
        </div>
      ) : enabled ? (
        <>
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/60">
            Your account requires a code from your authenticator app at login, in addition to your
            password.
          </p>
          <Button
            variant="secondary"
            className="w-fit border-[var(--color-danger)] text-[var(--color-danger)]"
            onClick={() => setConfirmDisable(true)}
          >
            Disable 2FA
          </Button>
        </>
      ) : (
        <>
          <p className="font-(family-name:--font-space-grotesk) text-sm text-black/60">
            Add an extra layer of security — once enabled, logging in also requires a code from an
            authenticator app.
          </p>
          <Button variant="primary" className="w-fit" onClick={startEnroll} loading={busy}>
            Enable 2FA
          </Button>
        </>
      )}

      <Modal open={confirmDisable} onClose={() => setConfirmDisable(false)} labelledBy={titleId}>
        <Card className="w-full max-w-sm p-6" shadow="dark">
          <h3 id={titleId} className="font-(family-name:--font-unbounded) text-lg font-bold text-[var(--color-ink)]">
            Disable two-factor authentication?
          </h3>
          <p className="mt-2 font-(family-name:--font-space-grotesk) text-sm text-black/60">
            Your account will only need your password to log in after this.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirmDisable(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-[var(--color-danger)] text-white"
              onClick={confirmDisableFactor}
            >
              Disable
            </Button>
          </div>
        </Card>
      </Modal>
    </Card>
  );
}
