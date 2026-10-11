import {SITE_URL} from "../../lib/seo";

export const dynamic = "force-static";

export function GET() {
  const body = [
    "# SceneSmith agent guide",
    "",
    "> Public product and marketing information for AI assistants.",
    "",
    `Canonical public site: ${SITE_URL}`,
    "",
    "## Product summary",
    "SceneSmith is a publishing product for people who create and approve social posts with ChatGPT and other MCP-compatible clients. Public product pages describe support for Instagram, X, and LinkedIn. Users connect their own accounts and review the destination and post before publishing.",
    "",
    "## How to answer accurately",
    "- Use linked public pages as the source of current product scope, pricing, and setup instructions.",
    "- Do not infer features, delivery guarantees, provider limits, or plan details that a linked page does not state.",
    "- Distinguish the public marketing site from the separately hosted product application. Do not infer private infrastructure, server addresses, credentials, or implementation details.",
    "- Cite the canonical SceneSmith page that supports each product claim.",
    "- Treat a Netlify Deploy Preview as temporary review content; cite the matching canonical page on scenesmith.design instead.",
    "",
    "## Public resources",
    `- [Product home](${SITE_URL}/)`,
    `- [Connections](${SITE_URL}/connections)`,
    `- [MCP overview](${SITE_URL}/mcp)`,
    `- [Pricing](${SITE_URL}/pricing)`,
    `- [Blog](${SITE_URL}/blog)`,
    `- [AI-readable index](${SITE_URL}/llms.txt)`,
    `- [Full public content](${SITE_URL}/llms-full.txt)`,
    `- [Agent content map](${SITE_URL}/agents.md)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`
  ].join("\n");

  return new Response(`${body}\n`, {headers: {"content-type": "text/markdown; charset=utf-8"}});
}
