import {existsSync, readFileSync, readdirSync} from "node:fs";
import {join} from "node:path";
import matter from "gray-matter";

const root = join(process.cwd(), "content", "posts");
const legacySlugs = new Set(["automate-social-media-posts", "chatgpt-linkedin-posts", "chatgpt-instagram-posts"]);
const publishedTitles = new Set();
const failures = [];
const today = new Date().toISOString().slice(0, 10);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const posts = existsSync(root) ? readdirSync(root, {withFileTypes: true}).filter((entry) => entry.isDirectory() && !entry.name.startsWith("_")) : [];

for (const {name: slug} of posts) {
  const label = `content/posts/${slug}/README.md`;
  const file = join(root, slug, "README.md");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) failures.push(`${label}: slug must be lowercase words separated by hyphens`);
  if (legacySlugs.has(slug)) failures.push(`${label}: duplicates an existing guide`);
  if (!existsSync(file)) {failures.push(`${label}: missing README.md`); continue;}
  const {data, content} = matter(readFileSync(file, "utf8"));
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
  if (content.trim().split(/\s+/).length < 350) failures.push(`${label}: article must have at least 350 words`);
  if ((content.match(/^## /gm) ?? []).length < 2) failures.push(`${label}: article needs at least two H2 sections`);
  if (/^# /m.test(content)) failures.push(`${label}: put the H1 in title frontmatter, not the body`);
  if (!/\]\(\/(?:blog|connections|mcp|pricing|support)(?:[\/#?][^)]*)?\)/.test(content)) failures.push(`${label}: include a relevant internal link`);
  if (!/\]\(https:\/\/[^)]+\)/.test(content)) failures.push(`${label}: cite at least one external source`);
  if (/<\/?(?:script|iframe|object|embed|form)\b/i.test(content)) failures.push(`${label}: active HTML is not allowed`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`Validated ${posts.length} Markdown posts.`);
