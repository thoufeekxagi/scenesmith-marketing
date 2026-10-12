import {existsSync, readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import {listMermaidPosts, listVideoPosts} from "./content-videos.mjs";
import {YoutubeVideo} from "../src/components/youtube-video.mjs";
import {remarkVideoDirective} from "../src/lib/remark-video-directive.mjs";
import {renderToStaticMarkup} from "react-dom/server";

const root = join(process.cwd(), ".next", "server", "app");
const failures = [];
const videoPosts = listVideoPosts();
if (process.env.SCENESMITH_NOINDEX !== "true") failures.push("preview build must set SCENESMITH_NOINDEX=true");
if (!existsSync(root)) failures.push("missing Next.js server output; run pnpm build first");

const manifestPath = join(process.cwd(), ".next", "server", "app-paths-manifest.json");
if (existsSync(manifestPath)) {
  const routes = Object.keys(JSON.parse(readFileSync(manifestPath, "utf8")));
  for (const route of ["/agent.md/route", "/llms-full.txt/route"]) {
    if (!routes.includes(route)) failures.push(`preview build is missing the ${route.slice(1, -6)} endpoint`);
  }
} else failures.push("missing Next.js route manifest; run pnpm build first");

const htmlFiles = [];
function visit(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (entry.name.endsWith(".html")) htmlFiles.push(path);
  }
}
if (existsSync(root)) visit(root);

if (!htmlFiles.length) failures.push("no prerendered HTML found for preview SEO checks");
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  if (!/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) {
    failures.push(`${file.slice(root.length + 1)}: missing page-level noindex`);
  }
  const googlebot = html.match(/<meta\s+name="googlebot"\s+content="([^"]+)"/i)?.[1];
  if (!googlebot) failures.push(`${file.slice(root.length + 1)}: missing Googlebot page metadata`);
  else {
    if (!/^noindex(?:,|\s|$)/i.test(googlebot)) failures.push(`${file.slice(root.length + 1)}: Googlebot metadata permits indexing`);
    if (!googlebot.includes("max-snippet:-1")) failures.push(`${file.slice(root.length + 1)}: Googlebot metadata must keep max-snippet:-1`);
  }
}

const article = join(root, "blog", "schedule-linkedin-posts-free.html");
if (!existsSync(article)) failures.push("staging build is missing the pilot article HTML");
else {
  const html = readFileSync(article, "utf8");
  if (!html.includes('rel="canonical" href="https://scenesmith.design/blog/schedule-linkedin-posts-free"')) {
    failures.push("pilot article canonical must point to the production URL");
  }
  const imageUrl = "https://scenesmith.design/blog/schedule-linkedin-posts-free.webp";
  if (!html.includes(`property="og:image" content="${imageUrl}"`)) failures.push("pilot article Open Graph image must use its canonical production URL");
  if (!html.includes('property="og:type" content="article"')) failures.push("pilot article must use the Open Graph article type");
  if (!html.includes('property="article:published_time" content="2026-10-11"') || !html.includes('property="article:modified_time" content="2026-10-11"')) failures.push("pilot article Open Graph metadata must include publish and modified dates");
  if (!html.includes(`name="twitter:image" content="${imageUrl}"`)) failures.push("pilot article X/Twitter image must use its canonical production URL");
  if (!html.includes('<figure class="blog-post-cover"><img src="/blog/schedule-linkedin-posts-free.webp"')) {
    failures.push("pilot article must render its blog cover image");
  }
  const schemaText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  try {
    const schema = schemaText ? JSON.parse(schemaText) : null;
    const graph = schema?.["@graph"];
    const articleSchema = graph?.find((item) => item?.["@type"] === "Article");
    const breadcrumbSchema = graph?.find((item) => item?.["@type"] === "BreadcrumbList");
    const faqSchema = graph?.find((item) => item?.["@type"] === "FAQPage");
    if (schema?.["@context"] !== "https://schema.org" || !articleSchema || articleSchema.mainEntityOfPage !== "https://scenesmith.design/blog/schedule-linkedin-posts-free" || articleSchema.image !== imageUrl || !articleSchema.datePublished || !articleSchema.dateModified) {
      failures.push("pilot Article JSON-LD must include canonical URL, dates, and article image");
    }
    if (breadcrumbSchema?.itemListElement?.length !== 2 || breadcrumbSchema.itemListElement[0].name !== "Blog" || breadcrumbSchema.itemListElement[1].name !== "How to Schedule LinkedIn Posts for Free") failures.push("pilot JSON-LD must include a breadcrumb trail matching the article");
    if ((faqSchema?.mainEntity?.length ?? 0) < 12) failures.push("pilot JSON-LD must include the 12 or more visible FAQ pairs");
  } catch {
    failures.push("pilot Article JSON-LD must be valid JSON");
  }
  const faqSection = html.match(/<h2>Questions about free LinkedIn scheduling<\/h2>([\s\S]*?)<h2>Sources<\/h2>/i)?.[1] ?? "";
  const visibleFaqs = (faqSection.match(/<h3>/g) ?? []).length;
  if (visibleFaqs < 12) failures.push("pilot article must visibly render the 12 or more FAQ pairs used by its schema");
}

for (const {slug, videos} of videoPosts) {
  const articlePath = join(root, "blog", `${slug}.html`);
  if (!existsSync(articlePath)) {
    failures.push(`video article ${slug} is missing from the staging build`);
    continue;
  }
  const html = readFileSync(articlePath, "utf8");
  for (const video of videos) {
    if (!html.includes('class="blog-video"') || !html.includes(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)) {
      failures.push(`${slug}: YouTube player thumbnail markup is missing`);
    }
    if (!html.includes(`https://www.youtube.com/watch?v=${video.id}`) || !html.includes(">Watch on YouTube</a>")) {
      failures.push(`${slug}: the plain Watch on YouTube link is missing`);
    }
    const videoObject = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((match) => {try {return JSON.parse(match[1]);} catch {return null;}})
      .flatMap((schema) => schema?.["@graph"] ?? [])
      .find((item) => item?.["@type"] === "VideoObject" && item.name === video.title);
    if (video.uploaded && video.duration && !videoObject) failures.push(`${slug}: VideoObject schema is missing despite supplied upload date and duration`);
    if ((!video.uploaded || !video.duration) && videoObject) failures.push(`${slug}: VideoObject schema was emitted without complete supplied metadata`);
    if (videoObject && (videoObject.uploadDate !== video.uploaded || videoObject.duration !== video.duration || videoObject.thumbnailUrl !== `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg` || videoObject.embedUrl !== `https://www.youtube-nocookie.com/embed/${video.id}`)) {
      failures.push(`${slug}: VideoObject contains values that do not match the supplied video metadata`);
    }
  }
}

for (const {slug} of listMermaidPosts()) {
  const articlePath = join(root, "blog", `${slug}.html`);
  const html = existsSync(articlePath) ? readFileSync(articlePath, "utf8") : "";
  if (!html.includes('class="blog-mermaid"') || !html.includes('class="blog-mermaid-source"')) {
    failures.push(`${slug}: Mermaid diagram or its readable source fallback is missing from the preview HTML`);
  }
}

const videoFixture = renderToStaticMarkup(React.createElement(ReactMarkdown, {
  skipHtml: true,
  remarkPlugins: [remarkDirective, remarkVideoDirective],
  components: {"youtube-video": YoutubeVideo}
}, '::video[abcdefghijk]{title="Preview video fixture"}'));
if (!videoFixture.includes('class="blog-video"') || !videoFixture.includes('href="https://www.youtube.com/watch?v=abcdefghijk"') || !videoFixture.includes(">Watch on YouTube</a>")) {
  failures.push("video directive fixture does not render the player and its text-only Watch link");
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`Preview SEO verified: ${htmlFiles.length} pages are noindex, the article canonical stays on scenesmith.design, and the YouTube player fixture renders its Watch link.${videoPosts.length ? ` ${videoPosts.length} video article(s) were checked.` : " No article currently contains a video."}`);
