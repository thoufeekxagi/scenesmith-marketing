import {guides} from "../../lib/blog";
import {allPosts} from "../../lib/posts";
import {SITE_DESCRIPTION, SITE_URL} from "../../lib/seo";

export const dynamic = "force-static";

export function GET() {
  const guideLines = guides.map(({slug, title}) => `- [${title}](${SITE_URL}/blog/${slug})`);
  const postLines = allPosts().map(({slug, title, description}) => `- [${title}](${SITE_URL}/blog/${slug}): ${description}`);
  const body = [
    "# SceneSmith",
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `The canonical public site is ${SITE_URL}. The product application is a separate service; this file describes public marketing pages only.`,
    "",
    "## Product information",
    `- [Home](${SITE_URL}/)`,
    `- [Connections](${SITE_URL}/connections)`,
    `- [MCP overview](${SITE_URL}/mcp)`,
    `- [Pricing](${SITE_URL}/pricing)`,
    `- [Support](${SITE_URL}/support)`,
    "",
    "## Existing guides",
    ...guideLines,
    "",
    "## Articles",
    ...postLines,
    "",
    `- [Blog index](${SITE_URL}/blog)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`
  ].join("\n");

  return new Response(`${body}\n`, {headers: {"content-type": "text/plain; charset=utf-8"}});
}
