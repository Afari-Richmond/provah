// In production, auth cookies need to be visible on both provah.live
// (marketing) and app.provah.live (the product) so a logged-in user shows
// as logged-in on either host. Only set in Vercel's Production environment —
// leaving it unset on localhost/previews keeps cookies scoped to the exact
// host, which is required there anyway (a real domain can't be the cookie
// domain for a *.vercel.app or localhost request).
export const supabaseCookieOptions = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  ? { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, sameSite: "lax" as const }
  : undefined;
