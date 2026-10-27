import {existsSync, readFileSync, readdirSync} from "node:fs";
import {join} from "node:path";
import {parsePostSource} from "../src/lib/post-frontmatter.mjs";
import {parsePostVideos} from "../src/lib/post-media.mjs";

export function listVideoPosts() {
  const root = join(process.cwd(), "content", "posts");
  if (!existsSync(root)) return [];
  return readdirSync(root, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .flatMap(({name: slug}) => {
      const path = join(root, slug, "README.md");
      if (!existsSync(path)) return [];
      const {content} = parsePostSource(readFileSync(path, "utf8"));
      const videos = parsePostVideos(content);
      return videos.length ? [{slug, videos}] : [];
    });
}

export function listMermaidPosts() {
  const root = join(process.cwd(), "content", "posts");
  if (!existsSync(root)) return [];
  return readdirSync(root, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .flatMap(({name: slug}) => {
      const path = join(root, slug, "README.md");
      if (!existsSync(path)) return [];
      const {content} = parsePostSource(readFileSync(path, "utf8"));
      return /^```mermaid[ \t]*\r?$/m.test(content) ? [{slug}] : [];
    });
}
