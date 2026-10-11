import type {MetadataRoute} from "next";
import {HOMEPAGE_LAST_MODIFIED, LAST_MODIFIED, PUBLIC_PATHS, SITE_URL} from "../lib/seo";
import {BLOG_UPDATED, guides} from "../lib/blog";

const priority: Record<string, number> = {"/": 1, "/connections": 0.8, "/mcp": 0.7, "/support": 0.5, "/security": 0.5};

export default function sitemap(): MetadataRoute.Sitemap {
  const established: MetadataRoute.Sitemap = PUBLIC_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: path === "/" ? HOMEPAGE_LAST_MODIFIED : LAST_MODIFIED,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: priority[path] ?? 0.3
  }));
  return [...established, {url: `${SITE_URL}/blog`, lastModified: BLOG_UPDATED, changeFrequency: "weekly" as const, priority: 0.8}, ...guides.map(({slug}) => ({url: `${SITE_URL}/blog/${slug}`, lastModified: BLOG_UPDATED, changeFrequency: "monthly" as const, priority: 0.7}))];
}
