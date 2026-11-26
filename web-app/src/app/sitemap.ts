import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data/projects";

const SITE_URL = process.env.NEXT_PUBLIC_MARKETING_SITE_URL ?? "https://provah.live";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/categories/engineering`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/categories/fintech`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/categories/health`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/showcase`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const projects = await getPublishedProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/showcase/${p.id}`,
    lastModified: p.createdAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes];
}
