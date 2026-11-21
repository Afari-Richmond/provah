/**
 * Deterministic mascot avatars from Navii (https://navii.dev, MIT licensed,
 * no API key). Seed with a stable record id - never a raw email or other PII,
 * per Navii's own guidance (it warns when a plaintext email is used as the
 * seed) - so the same person always renders the same avatar without leaking
 * their email into the URL.
 *
 * Ported from the same pattern used in oread-erp/frontend/lib/avatar.ts.
 */
export function getAvatarUrl(seed: string, size = 48) {
  return `https://api.navii.dev/avatar/${encodeURIComponent(seed)}?size=${size}&tileBg=auto`;
}
