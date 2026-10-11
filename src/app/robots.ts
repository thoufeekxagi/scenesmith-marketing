import type {MetadataRoute} from "next";
import {headers} from "next/headers";
import {BLOCKED_LOCAL_HOSTS, NOINDEX_HOSTS, SITE_URL} from "../lib/seo";

export const dynamic = "force-dynamic";

const AI_AND_SEARCH_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-User", "Claude-SearchBot", "Google-Extended", "Applebot-Extended", "CCBot"];
const PRIVATE_PATHS = ["/app/", "/api/", "/auth/", "/login", "/register"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get("host") ?? "").split(":")[0]!.toLowerCase();
  if (BLOCKED_LOCAL_HOSTS.includes(host)) return {rules: [{userAgent: "*", disallow: "/"}]};
  if (NOINDEX_HOSTS.includes(host) || host.endsWith(".netlify.app")) {
    // These hosts send X-Robots-Tag: noindex. Crawlers must be able to fetch
    // pages to see that header; robots.txt is not an indexing directive.
    return {rules: [{userAgent: "*", allow: "/"}]};
  }
  return {
    rules: [
      {userAgent: "*", allow: "/", disallow: PRIVATE_PATHS},
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({userAgent, allow: "/", disallow: PRIVATE_PATHS}))
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: "scenesmith.design"
  };
}
