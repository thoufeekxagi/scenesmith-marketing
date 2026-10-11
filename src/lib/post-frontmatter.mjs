import {parseDocument} from "yaml";

const allowedKeys = new Set([
  "title",
  "description",
  "category",
  "author",
  "published",
  "updated",
  "primaryKeyword",
  "image",
  "imageAlt"
]);
const frontmatterPattern = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/** Parse the small, data-only frontmatter format used by marketing posts. */
export function parsePostSource(source) {
  if (Buffer.byteLength(source, "utf8") > 120_000) throw new Error("post must be 120 KB or smaller");
  const match = frontmatterPattern.exec(source);
  if (!match) throw new Error("post must start with a YAML frontmatter block");
  if (Buffer.byteLength(match[1], "utf8") > 16_000) throw new Error("frontmatter must be 16 KB or smaller");

  const document = parseDocument(match[1], {
    schema: "failsafe",
    version: "1.2",
    uniqueKeys: true,
    merge: false,
    logLevel: "error"
  });
  if (document.errors.length || document.warnings.length) throw new Error("frontmatter contains invalid or unsupported YAML");

  const values = document.toJS({mapAsMap: true, maxAliasCount: 0});
  if (!(values instanceof Map) || values.size > allowedKeys.size) throw new Error("frontmatter must be a small mapping of string fields");

  const data = Object.create(null);
  for (const [key, value] of values) {
    if (typeof key !== "string" || !allowedKeys.has(key)) throw new Error(`unsupported frontmatter field: ${String(key)}`);
    if (typeof value !== "string") throw new Error(`frontmatter field ${key} must be a string`);
    data[key] = value;
  }

  return {data, content: source.slice(match[0].length).replace(/^\r?\n/, "")};
}
