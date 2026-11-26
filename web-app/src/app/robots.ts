import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_MARKETING_SITE_URL ?? "https://provah.live";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/discover",
          "/feed",
          "/saved",
          "/search",
          "/messages",
          "/notifications",
          "/settings",
          "/profile",
          "/projects/new",
          "/projects/*/edit",
          "/admin",
          "/login",
          "/signup",
          "/forgot-password",
          "/auth",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
