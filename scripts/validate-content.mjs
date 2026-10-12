import {existsSync, readFileSync, readdirSync, statSync} from "node:fs";
import {join} from "node:path";
import {parsePostSource} from "../src/lib/post-frontmatter.mjs";
import {extractPostFaq} from "../src/lib/post-faq.mjs";
import {inspectPostMedia} from "../src/lib/post-media.mjs";

const root = join(process.cwd(), "content", "posts");
const legacySlugs = new Set(["automate-social-media-posts", "chatgpt-linkedin-posts", "chatgpt-instagram-posts"]);
const publishedTitles = new Set();
const failures = [];
const today = new Date().toISOString().slice(0, 10);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const posts = existsSync(root) ? readdirSync(root, {withFileTypes: true}).filter((entry) => entry.isDirectory() && !entry.name.startsWith("_")) : [];

for (const {name: slug} of posts) {
  const label = `content/posts/${slug}/README.md`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {failures.push(`${label}: slug must be lowercase words separated by hyphens`); continue;}
  if (legacySlugs.has(slug)) failures.push(`${label}: duplicates an existing guide`);
  const file = join(root, slug, "README.md");
  if (!existsSync(file)) {failures.push(`${label}: missing README.md`); continue;}
  let data; let content;
  try {
    ({data, content} = parsePostSource(readFileSync(file, "utf8")));
  } catch (error) {
    failures.push(`${label}: ${error instanceof Error ? error.message : "invalid frontmatter"}`);
    continue;
  }
  for (const key of ["title", "description", "category", "author", "published", "updated"]) {
    if (typeof data[key] !== "string" || !data[key].trim()) failures.push(`${label}: ${key} must be a nonempty quoted string`);
  }
  if (typeof data.title === "string") {
    if (data.title.length < 25 || data.title.length > 90) failures.push(`${label}: title must be 25–90 characters`);
    const key = data.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (publishedTitles.has(key)) failures.push(`${label}: duplicate title`);
    publishedTitles.add(key);
  }
  if (typeof data.description === "string" && (data.description.length < 70 || data.description.length > 170)) failures.push(`${label}: description must be 70–170 characters`);
  for (const key of ["published", "updated"]) {
    const value = data[key];
    if (typeof value === "string" && (!datePattern.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`)))) failures.push(`${label}: ${key} must be a valid YYYY-MM-DD date`);
  }
  if (typeof data.published === "string" && data.published > today) failures.push(`${label}: published is in the future`);
  if (typeof data.published === "string" && typeof data.updated === "string" && data.updated < data.published) failures.push(`${label}: updated is before published`);
  if ((content.match(/^## /gm) ?? []).length < 2) failures.push(`${label}: article needs at least two H2 sections`);
  const faqs = extractPostFaq(content);
  if (faqs.length > 0 && faqs.length < 3) failures.push(`${label}: an FAQ section must contain at least three question-and-answer pairs`);
  if (faqs.length > 20) failures.push(`${label}: keep the FAQ section to 20 or fewer useful questions`);
  const faqQuestions = faqs.map(({question}) => question.toLowerCase());
  if (new Set(faqQuestions).size !== faqQuestions.length) failures.push(`${label}: FAQ questions must be unique`);
  if (faqs.some(({question, answer}) => !question || !answer)) failures.push(`${label}: every FAQ question needs a visible answer`);
  if (slug === "schedule-linkedin-posts-free" && faqs.length < 12) failures.push(`${label}: the pilot needs at least 12 visible FAQs`);
  if (/^# /m.test(content)) failures.push(`${label}: put the H1 in title frontmatter, not the body`);
  if (!/\]\(\/(?:blog|connections|mcp|pricing|support)(?:[\/#?][^)]*)?\)/.test(content)) failures.push(`${label}: include a relevant internal link`);
  if (!/\]\(https:\/\/[^)]+\)/.test(content)) failures.push(`${label}: cite at least one external source`);
  if (data.image !== undefined) {
    if (typeof data.image !== "string" || !/^\/blog\/[a-z0-9][a-z0-9._-]*\.(?:webp|png|jpe?g)$/i.test(data.image)) failures.push(`${label}: image must be a local /blog/ WebP, PNG, or JPEG path`);
    else {
      const imagePath = join(process.cwd(), "public", data.image.slice(1));
      if (!existsSync(imagePath)) failures.push(`${label}: image file does not exist under public/`);
      else if (statSync(imagePath).size > 2_000_000) failures.push(`${label}: blog image must be 2 MB or smaller`);
    }
    if (typeof data.imageAlt !== "string" || data.imageAlt.trim().length < 12) failures.push(`${label}: imageAlt must describe the image for readers using assistive technology`);
  }
  if (data.primaryKeyword !== undefined && (typeof data.primaryKeyword !== "string" || data.primaryKeyword.trim().length < 3)) failures.push(`${label}: primaryKeyword must be a useful phrase`);
  for (const issue of inspectPostMedia(content).issues) failures.push(`${label}: ${issue}`);
  for (const [, alt, imageUrl] of content.matchAll(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    if (alt.trim().length < 12) failures.push(`${label}: each article image needs descriptive alt text of at least 12 characters`);
    if (!/^\/blog\/[a-z0-9][a-z0-9._-]*\.(?:webp|png|jpe?g)$/i.test(imageUrl)) {
      failures.push(`${label}: article images must be local /blog/ WebP, PNG, or JPEG files`);
      continue;
    }
    const imagePath = join(process.cwd(), "public", imageUrl.slice(1));
    if (!existsSync(imagePath)) failures.push(`${label}: article image ${imageUrl} does not exist under public/`);
    else if (statSync(imagePath).size > 2_000_000) failures.push(`${label}: article image ${imageUrl} must be 2 MB or smaller`);
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`Validated ${posts.length} Markdown posts.`);
