import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import React from "react";
import ReactMarkdown from "react-markdown";
import {renderToStaticMarkup} from "react-dom/server";
import {parsePostSource} from "../src/lib/post-frontmatter.mjs";
import {serializeJsonLd} from "../src/lib/json-ld.mjs";

const source = readFileSync("content/posts/schedule-linkedin-posts-free/README.md", "utf8");
const parsed = parsePostSource(source);
assert.equal(parsed.data.title, "How to Schedule LinkedIn Posts for Free");
assert.ok(parsed.content.startsWith("Yes."));

const executableFrontmatter = `---js\nglobalThis.__scenesmithFrontmatterCodeRan = true\n---\ncontent`;
assert.throws(() => parsePostSource(executableFrontmatter), /frontmatter block/);
assert.equal(globalThis.__scenesmithFrontmatterCodeRan, undefined, "frontmatter is data and must never execute JavaScript");

const aliasedFrontmatter = `---\ntitle: &title Safe title\ndescription: *title\n---\ncontent`;
assert.throws(() => parsePostSource(aliasedFrontmatter), /alias|frontmatter/i);

const duplicateKey = `---\ntitle: First title\ntitle: Second title\n---\ncontent`;
assert.throws(() => parsePostSource(duplicateKey), /frontmatter/i);

const customTag = `---\ntitle: !custom unexpected\n---\ncontent`;
assert.throws(() => parsePostSource(customTag), /frontmatter/i);

const unknownField = `---\ntitle: Safe title\nconstructor: unexpected\n---\ncontent`;
assert.throws(() => parsePostSource(unknownField), /unsupported frontmatter field/);

const rawMarkup = renderToStaticMarkup(React.createElement(ReactMarkdown, {skipHtml: true},
  'Safe text\n\n<script>globalThis.xss = true</script><img src=x onerror="alert(1)">\n\n[bad](javascript:alert%281%29)'));
assert.doesNotMatch(rawMarkup, /<script|onerror=/i, "raw HTML in Markdown is discarded");
assert.doesNotMatch(rawMarkup, /href="javascript:/i, "dangerous link schemes are blocked");

const jsonLdInput = {headline: "</script><script>alert(1)</script>&\u2028"};
const jsonLd = serializeJsonLd(jsonLdInput);
assert.doesNotMatch(jsonLd, /[<>&\u2028\u2029]/, "JSON-LD cannot break out of its script element");
assert.deepEqual(JSON.parse(jsonLd), jsonLdInput, "escaped JSON-LD retains its original data");

console.log("Content safety checks passed: executable frontmatter, YAML aliases, duplicate keys, custom tags, raw HTML, unsafe links, and JSON-LD injection are handled safely.");
