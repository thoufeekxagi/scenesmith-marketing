import {guides} from "../../lib/blog";
import {allPosts} from "../../lib/posts";
import {SITE_DESCRIPTION, SITE_URL} from "../../lib/seo";
import {videoTextReference} from "../../lib/post-media.mjs";

export const dynamic = "force-static";

export function GET() {
  const guideText = guides.map((guide) => [
    `## ${guide.title}`,
    `Canonical: ${SITE_URL}/blog/${guide.slug}`,
    `Category: ${guide.category}`,
    `Summary: ${guide.description}`,
    "",
    guide.answer,
    ...guide.intro,
    ...guide.sections.flatMap((section) => [
      `### ${section.heading}`,
      ...(section.paragraphs ?? []),
      ...(section.steps ?? []).map((step, index) => `${index + 1}. ${step}`),
      ...(section.bullets ?? []).map((bullet) => `- ${bullet}`)
    ]),
    "### Questions and answers",
    ...guide.faq.flatMap(({question, answer}) => [`#### ${question}`, answer]),
    "### Sources",
    ...guide.sources.map(({label, url}) => `- ${label}: ${url}`)
  ].join("\n\n"));

  const postText = allPosts().map((post) => [
    `## ${post.title}`,
    `Canonical: ${SITE_URL}/blog/${post.slug}`,
    `Category: ${post.category}`,
    `Author: ${post.author}`,
    `Published: ${post.published}`,
    `Updated: ${post.updated}`,
    `Summary: ${post.description}`,
    ...(post.image ? [`Image: ${SITE_URL}${post.image}`, `Image description: ${post.imageAlt ?? ""}`] : []),
    "",
    post.body,
    ...post.videos.map(videoTextReference)
  ].join("\n"));

  const body = [
    "# SceneSmith full public content",
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `This text contains the public marketing guides and blog articles represented in the site source. The canonical origin is ${SITE_URL}.`,
    "The product application is separate. This file contains no private server documentation, credentials, or infrastructure details.",
    "",
    "## Public product pages",
    `- Home: ${SITE_URL}/`,
    `- Connections: ${SITE_URL}/connections`,
    `- MCP overview: ${SITE_URL}/mcp`,
    `- Pricing: ${SITE_URL}/pricing`,
    `- Support: ${SITE_URL}/support`,
    `- Security: ${SITE_URL}/security`,
    `- Blog index: ${SITE_URL}/blog`,
    "",
    "## Guides",
    guideText,
    "",
    "## Blog articles",
    postText,
    "",
    `- Sitemap: ${SITE_URL}/sitemap.xml`
  ].join("\n");

  return new Response(`${body}\n`, {headers: {"content-type": "text/plain; charset=utf-8"}});
}
