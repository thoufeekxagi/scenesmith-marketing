import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import React from "react";
import ReactMarkdown from "react-markdown";
import {renderToStaticMarkup} from "react-dom/server";
import remarkDirective from "remark-directive";
import {YoutubeVideo, youtubeEmbedUrl} from "../src/components/youtube-video.mjs";
import {parsePostSource} from "../src/lib/post-frontmatter.mjs";
import {inspectPostMedia, parseVideoDirective, videoTextReference} from "../src/lib/post-media.mjs";
import {remarkVideoDirective} from "../src/lib/remark-video-directive.mjs";
import {serializeJsonLd} from "../src/lib/json-ld.mjs";
import {videoObjectSchema} from "../src/lib/video-schema.mjs";

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

const validDirective = `::video[abcdefghijk]{title="Workflow tutorial" start="30" uploaded="2026-10-12" duration="PT4M30S" description="A short verified walkthrough of the workflow."}`;
const validMedia = inspectPostMedia(validDirective);
assert.deepEqual(validMedia.issues, [], "a valid video directive is accepted");
assert.equal(validMedia.videos.length, 1);
assert.deepEqual(validMedia.videos[0], {
  id: "abcdefghijk",
  title: "Workflow tutorial",
  start: 30,
  uploaded: "2026-10-12",
  duration: "PT4M30S",
  description: "A short verified walkthrough of the workflow."
});
assert.throws(() => parseVideoDirective('::video[short]{title="Bad ID"}'), /11 letters/);
assert.match(inspectPostMedia("::video[abcdefghijk]{}").issues.join(" "), /title is required/);
assert.match(inspectPostMedia("<iframe src=\"https://example.com\"></iframe>").issues.join(" "), /raw HTML is not allowed/);
assert.match(inspectPostMedia("<script>alert(1)</script>").issues.join(" "), /raw HTML is not allowed/);
assert.deepEqual(inspectPostMedia("```text\n::video[abcdefghijk]{title=\"example only\"}\n```").videos, [], "a directive shown as code is not embedded");
const fourVideos = Array.from({length: 4}, (_, index) => `::video[abcdeFGH${index}__]{title="Video ${index + 1}"}`).join("\n");
assert.match(inspectPostMedia(fourVideos).issues.join(" "), /no more than three videos/);
assert.match(inspectPostMedia("[other player](https://player.vimeo.com/video/123)").issues.join(" "), /video host .*vimeo\.com is not allowed/);
assert.match(inspectPostMedia("https://media.example.test/clip.mp4").issues.join(" "), /video file host media\.example\.test is not allowed/);

const renderedVideo = renderToStaticMarkup(React.createElement(ReactMarkdown, {
  skipHtml: true,
  remarkPlugins: [remarkDirective, remarkVideoDirective],
  components: {"youtube-video": YoutubeVideo}
}, validDirective));
assert.match(renderedVideo, /class="blog-video"/);
assert.match(renderedVideo, /https:\/\/i\.ytimg\.com\/vi\/abcdefghijk\/hqdefault\.jpg/);
assert.match(renderedVideo, /aria-label="Load video: Workflow tutorial"/);
assert.match(renderedVideo, /href="https:\/\/www\.youtube\.com\/watch\?v=abcdefghijk&amp;t=30s"/);
assert.match(renderedVideo, />Watch on YouTube<\/a>/);
assert.doesNotMatch(renderedVideo, /<iframe/, "the embed iframe is not created until the reader clicks");
assert.equal(youtubeEmbedUrl("abcdefghijk", 30), "https://www.youtube-nocookie.com/embed/abcdefghijk?start=30");
assert.throws(() => youtubeEmbedUrl("bad-id"), /Invalid YouTube video ID/);

const mermaid = "```mermaid\nflowchart TD\n  A[Read] --> B[Review]\n```";
assert.deepEqual(inspectPostMedia(mermaid).issues, [], "a safe Mermaid flowchart is accepted");
assert.match(inspectPostMedia("```mermaid\nclick A \"javascript:alert(1)\"\n```").issues.join(" "), /unsafe directive/);
assert.match(inspectPostMedia("```mermaid\nA[<img src=x>] --> B\n```").issues.join(" "), /raw HTML is not allowed/);

const parsedVideo = validMedia.videos[0];
assert.equal(videoTextReference(parsedVideo), "Video: https://www.youtube.com/watch?v=abcdefghijk (Workflow tutorial)");
assert.deepEqual(videoObjectSchema("https://scenesmith.design/blog/example", [{id: "abcdefghijk", title: "Workflow tutorial"}]), [], "schema is omitted when upload date or duration is missing");
assert.deepEqual(videoObjectSchema("https://scenesmith.design/blog/example", [parsedVideo]), [{
  "@type": "VideoObject",
  "@id": "https://scenesmith.design/blog/example#video-1",
  name: "Workflow tutorial",
  description: "A short verified walkthrough of the workflow.",
  thumbnailUrl: "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg",
  uploadDate: "2026-10-12",
  duration: "PT4M30S",
  embedUrl: "https://www.youtube-nocookie.com/embed/abcdefghijk"
}]);

const jsonLdInput = {headline: "</script><script>alert(1)</script>&\u2028"};
const jsonLd = serializeJsonLd(jsonLdInput);
assert.doesNotMatch(jsonLd, /[<>&\u2028\u2029]/, "JSON-LD cannot break out of its script element");
assert.deepEqual(JSON.parse(jsonLd), jsonLdInput, "escaped JSON-LD retains its original data");

console.log("Content safety checks passed: frontmatter, HTML and links, YouTube directives, video limits and hosts, Mermaid source, and video structured data are validated.");
