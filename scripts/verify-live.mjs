const args = process.argv.slice(2);
const preview = args.includes("--preview");
let origin = "https://scenesmith.design";
if (preview) {
  const previewIndex = args.indexOf("--preview");
  const pullRequestNumber = args[previewIndex + 1] ?? "";
  if (!/^\d{1,6}$/.test(pullRequestNumber) || Number(pullRequestNumber) < 1) {
    console.error("Preview verification requires a numeric pull request number.");
    process.exit(1);
  }
  origin = `https://deploy-preview-${Number(pullRequestNumber)}--scene-smith-website.netlify.app`;
}
const slug = "schedule-linkedin-posts-free";
const articleUrl = `${origin}/blog/${slug}`;
const failures = [];

async function get(path) {
  const response = await fetch(`${origin}${path}`, {redirect: "follow", signal: AbortSignal.timeout(20_000)});
  const body = await response.text();
  if (!response.ok) failures.push(`${path}: expected HTTP 200, received ${response.status}`);
  return {response, body};
}

const {response: articleResponse, body: html} = await get(`/blog/${slug}`);
if (!articleResponse.headers.get("content-type")?.includes("text/html")) failures.push("article must be served as HTML");
if (!html.includes(`rel="canonical" href="https://scenesmith.design/blog/${slug}"`)) failures.push("production article canonical is incorrect");
if (!html.includes('property="og:type" content="article"') || !html.includes('property="article:published_time" content="2026-10-11"') || !html.includes('property="article:modified_time" content="2026-10-11"')) failures.push("production article Open Graph type or date metadata is incorrect");
const robotsMeta = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i)?.[1] ?? "";
if (preview ? !/\bnoindex\b/i.test(robotsMeta) : /\bnoindex\b/i.test(robotsMeta)) failures.push(preview ? "preview article is missing noindex" : "production article is marked noindex");
if (!/<meta\s+name="googlebot"\s+content="[^"]*max-snippet:-1/i.test(html)) failures.push("production article is missing max-snippet:-1 Googlebot metadata");
if (!html.includes("How to Schedule LinkedIn Posts for Free")) failures.push("article title is missing from production HTML");
if (!html.includes('class="blog-post-cover"')) failures.push("article cover image is missing from production HTML");

let graph = [];
for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  try {
    const data = JSON.parse(match[1]);
    if (Array.isArray(data?.["@graph"])) graph = graph.concat(data["@graph"]);
    else graph.push(data);
  } catch {
    failures.push("production page contains invalid JSON-LD");
  }
}
const article = graph.find((item) => item?.["@type"] === "Article");
const breadcrumb = graph.find((item) => item?.["@type"] === "BreadcrumbList");
const faq = graph.find((item) => item?.["@type"] === "FAQPage");
if (article?.mainEntityOfPage !== `https://scenesmith.design/blog/${slug}` || !article?.datePublished || !article?.dateModified || !article?.image) failures.push("production Article JSON-LD is incomplete");
if (breadcrumb?.itemListElement?.length !== 2 || breadcrumb.itemListElement[1]?.item !== `https://scenesmith.design/blog/${slug}`) failures.push("production BreadcrumbList JSON-LD is missing or incorrect");
if ((faq?.mainEntity?.length ?? 0) < 12) failures.push("production FAQPage JSON-LD must match at least 12 visible questions");
const faqSection = html.match(/<h2>Questions about free LinkedIn scheduling<\/h2>([\s\S]*?)<h2>Sources<\/h2>/i)?.[1] ?? "";
if ((faqSection.match(/<h3>/g) ?? []).length < 12) failures.push("production article must show at least 12 FAQ answers");

const image = await get(`/blog/${slug}.webp`);
if (!image.response.headers.get("content-type")?.startsWith("image/")) failures.push("article image is not served as an image");

const sitemap = await get("/sitemap.xml");
if (!sitemap.response.headers.get("content-type")?.includes("xml")) failures.push("sitemap must be served as XML");
if (!sitemap.body.includes(`<loc>https://scenesmith.design/blog/${slug}</loc>`) || !sitemap.body.includes("<lastmod>2026-10-11</lastmod>")) failures.push("production sitemap is missing the pilot article URL or last-modified date");

const robots = await get("/robots.txt");
if (preview ? robots.body.includes("Sitemap:") : !robots.body.includes("Sitemap: https://scenesmith.design/sitemap.xml")) failures.push(preview ? "preview robots.txt must not advertise the production sitemap" : "production robots.txt does not advertise the sitemap");

for (const [path, expected] of [
  ["/llms.txt", slug],
  ["/llms-full.txt", "How to Schedule LinkedIn Posts for Free"],
  ["/agent.md", "SceneSmith agent guide"],
  ["/agents.md", slug]
]) {
  const {response: textResponse, body} = await get(path);
  const contentType = textResponse.headers.get("content-type") ?? "";
  if (contentType.includes("text/html") || !/(text\/plain|text\/markdown)/i.test(contentType)) failures.push(`${path}: expected a plain-text or Markdown response`);
  if (!body.includes(expected)) failures.push(`${path}: expected public article/agent content is missing`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}

console.log(`${preview ? "Deploy Preview" : "Production"} SEO checks passed for ${articleUrl}: page, index directives, image, structured data, sitemap, robots, and agent text routes.`);
