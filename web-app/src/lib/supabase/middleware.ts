import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseCookieOptions } from "./cookie-options";

const PUBLIC_APP_ROUTES = ["/login", "/signup"];

const MARKETING_HOST = "provah.live";
const APP_HOST = "app.provah.live";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: supabaseCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const hostname = request.nextUrl.hostname;
  const isMarketingRoute =
    pathname === "/" ||
    ["/about", "/categories", "/showcase", "/how-it-works", "/terms", "/privacy"].some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

  // app.provah.live / provah.live split — only on the real production hosts.
  // Localhost and Vercel preview URLs have no app subdomain, so this is a
  // no-op there and the single-domain behavior below still applies.
  const onAppHost = hostname === APP_HOST;
  const onMarketingHost = hostname === MARKETING_HOST || hostname === `www.${MARKETING_HOST}`;

  if (onAppHost && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (onAppHost && isMarketingRoute) {
    return NextResponse.redirect(new URL(`https://${MARKETING_HOST}${pathname}${search}`));
  }

  if (onMarketingHost && !isMarketingRoute) {
    return NextResponse.redirect(new URL(`https://${APP_HOST}${pathname}${search}`));
  }

  if (isMarketingRoute) {
    return supabaseResponse;
  }

  const isPublicAppRoute =
    PUBLIC_APP_ROUTES.includes(pathname) ||
    pathname === "/signup/check-email" ||
    pathname.startsWith("/auth/");

  if (!user && !isPublicAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isPublicAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, suspended")
      .eq("id", user.id)
      .single();

    if (profile?.suspended) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("suspended", "1");
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
