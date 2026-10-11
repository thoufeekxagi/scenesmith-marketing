import {guides} from "../../lib/blog";
import {allPosts} from "../../lib/posts";
import {PUBLIC_PATHS, SITE_URL} from "../../lib/seo";

export const dynamic = "force-static";

export function GET() {
  const pages = PUBLIC_PATHS.map((path) => `- ${SITE_URL}${path === "/" ? "" : path}`);
  const articles = [...guides, ...allPosts()].map(({slug, title}) => `- [${title}](${SITE_URL}/blog/${slug})`);
  const body = [
    "# Public content guide for agents",
    "",
    `The canonical origin is ${SITE_URL}. Use canonical URLs on this origin when citing SceneSmith marketing content.`,
    "",
    "## Scope and accuracy",
    "- This is a map of public marketing pages. It does not document private services, credentials, or server internals.",
    "- Treat each linked page as the source for its own product, pricing, and availability statements.",
    "- Cite the specific page used; do not infer unpublished integrations or product capabilities.",
    "- A page on a Netlify deploy-preview host is a temporary, noindex review copy. Use the canonical production URL in citations.",
    "",
    "## Public pages",
    ...pages,
    "",
    "## Blog guides and articles",
    ...articles,
    "",
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- AI-readable index: ${SITE_URL}/llms.txt`
  ].join("\n");

  return new Response(`${body}\n`, {headers: {"content-type": "text/markdown; charset=utf-8"}});
}
