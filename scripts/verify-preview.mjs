import {existsSync, readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";

const root = join(process.cwd(), ".next", "server", "app");
const failures = [];
if (process.env.SCENESMITH_NOINDEX !== "true") failures.push("preview build must set SCENESMITH_NOINDEX=true");
if (!existsSync(root)) failures.push("missing Next.js server output; run pnpm build first");

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
  if (googlebot && !/^noindex(?:,|\s|$)/i.test(googlebot)) failures.push(`${file.slice(root.length + 1)}: Googlebot metadata permits indexing`);
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
  if (!html.includes(`name="twitter:image" content="${imageUrl}"`)) failures.push("pilot article X/Twitter image must use its canonical production URL");
  if (!html.includes('<figure class="blog-post-cover"><img src="/blog/schedule-linkedin-posts-free.webp"')) {
    failures.push("pilot article must render its blog cover image");
  }
  const schemaText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  try {
    const schema = schemaText ? JSON.parse(schemaText) : null;
    if (schema?.["@type"] !== "Article" || schema.mainEntityOfPage !== "https://scenesmith.design/blog/schedule-linkedin-posts-free" || schema.image !== imageUrl) {
      failures.push("pilot Article JSON-LD must include the production canonical URL and article image");
    }
  } catch {
    failures.push("pilot Article JSON-LD must be valid JSON");
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`Preview SEO verified: ${htmlFiles.length} pages are noindex and the article canonical stays on scenesmith.design.`);
