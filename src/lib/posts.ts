import {existsSync, readFileSync, readdirSync, statSync} from "node:fs";
import {join} from "node:path";
import {parsePostSource} from "./post-frontmatter.mjs";
import {extractPostFaq} from "./post-faq.mjs";
import type {PostFaq} from "./post-faq.mjs";
import {parsePostVideos} from "./post-media.mjs";

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
  faqs: PostFaq[];
  videos: ReturnType<typeof parsePostVideos>;
  image?: string;
  imageAlt?: string;
};

export function allPosts(): MarkdownPost[] {
  if (!existsSync(postsDirectory)) return [];
  return readdirSync(postsDirectory, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map(({name: slug}) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid marketing post slug: ${slug}`);
      const file = join(postsDirectory, slug, "README.md");
      if (!existsSync(file)) throw new Error(`Missing marketing post: ${slug}/README.md`);
      const {data, content} = parsePostSource(readFileSync(file, "utf8"));
      for (const key of ["title", "description", "category", "author", "published", "updated"]) {
        if (!data[key]?.trim()) throw new Error(`Post ${slug} is missing required frontmatter: ${key}`);
      }
      const words = content.trim().split(/\s+/).length;
      const image = data.image;
      if (image !== undefined && !/^\/blog\/[a-z0-9][a-z0-9._-]*\.(?:webp|png|jpe?g)$/i.test(image)) {
        throw new Error(`Post ${slug} has an invalid image path`);
      }
      if (image) {
        const imagePath = join(process.cwd(), "public", image.slice(1));
        if (!existsSync(imagePath)) throw new Error(`Post ${slug} is missing its public image`);
        if (statSync(imagePath).size > 2_000_000) throw new Error(`Post ${slug} image must be 2 MB or smaller`);
      }
      if (image && (!data.imageAlt || data.imageAlt.trim().length < 12)) throw new Error(`Post ${slug} image needs descriptive alt text`);
      return {
        slug,
        title: String(data.title),
        description: String(data.description),
        category: String(data.category),
        author: String(data.author),
        published: String(data.published),
        updated: String(data.updated),
        readTime: `${Math.max(1, Math.ceil(words / 220))} min read`,
        body: content,
        faqs: extractPostFaq(content),
        videos: parsePostVideos(content),
        image,
        imageAlt: data.imageAlt
      };
    })
    .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
}

export function postBySlug(slug: string): MarkdownPost | undefined {
  return allPosts().find((post) => post.slug === slug);
}
