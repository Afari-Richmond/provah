import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Leftover Framer "page link" targets from the template this site was
      // adapted from — these pages were never exported, only the route
      // manifest baked into the Framer JS bundle still points at them.
      { source: "/tracks", destination: "/categories", permanent: true },
      { source: "/tracks/coding", destination: "/categories/engineering", permanent: true },
      { source: "/tracks/chemistry", destination: "/categories/health", permanent: true },
      { source: "/tracks/french", destination: "/categories/fintech", permanent: true },
      { source: "/pricing", destination: "/about", permanent: true },
    ];
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
