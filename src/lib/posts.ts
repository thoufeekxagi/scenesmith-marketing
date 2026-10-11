import {existsSync, readFileSync, readdirSync} from "node:fs";
import {join} from "node:path";
import matter from "gray-matter";
import {remark} from "remark";
import remarkHtml from "remark-html";

const postsDirectory = join(process.cwd(), "content", "posts");

export type MarkdownPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  published: string;
  updated: string;
  readTime: string;
  body: string;
};

export function allPosts(): MarkdownPost[] {
  if (!existsSync(postsDirectory)) return [];
  return readdirSync(postsDirectory, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map(({name: slug}) => {
      const file = join(postsDirectory, slug, "README.md");
      const {data, content} = matter(readFileSync(file, "utf8"));
      const words = content.trim().split(/\s+/).length;
      return {
        slug,
        title: String(data.title),
        description: String(data.description),
        category: String(data.category),
        author: String(data.author),
        published: String(data.published),
        updated: String(data.updated),
        readTime: `${Math.max(1, Math.ceil(words / 220))} min read`,
        body: content
      };
    })
    .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
}

export function postBySlug(slug: string): MarkdownPost | undefined {
  return allPosts().find((post) => post.slug === slug);
}

export async function postHtml(post: MarkdownPost): Promise<string> {
  return String(await remark().use(remarkHtml, {sanitize: true}).process(post.body));
}
