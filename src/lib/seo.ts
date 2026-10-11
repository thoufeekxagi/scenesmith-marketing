import type {Metadata} from "next";

export const SITE_URL = "https://scenesmith.design";
export const APP_URL = "https://app.scenesmith.design";
export const SITE_NAME = "SceneSmith";
export const SITE_TITLE = "SceneSmith: Publish from ChatGPT to Instagram, X and LinkedIn";
export const SITE_DESCRIPTION = "SceneSmith is the publishing layer for ChatGPT. Create, preview, approve, and schedule posts to Instagram, X, and LinkedIn from ChatGPT, Codex, Cursor, and other MCP clients.";
export const SITE_KEYWORDS = [
  "ChatGPT social media publishing", "ChatGPT app for Instagram", "schedule posts from ChatGPT", "MCP social media scheduler",
  "publish to X from ChatGPT", "LinkedIn scheduling with ChatGPT", "Codex social media", "AI social media scheduler", "SceneSmith"
];
export const LAST_MODIFIED = "2026-10-06";
export const HOMEPAGE_LAST_MODIFIED = "2026-10-08";
export const PUBLIC_PATHS = ["/", "/connections", "/mcp", "/support", "/security", "/privacy", "/terms", "/data-deletion"] as const;
export const NOINDEX_HOSTS = ["app.scenesmith.design", "staging.scenesmith.design"];
export const BLOCKED_LOCAL_HOSTS = ["localhost", "127.0.0.1"];

export const OG_IMAGE = {url: "/opengraph-image", width: 1200, height: 630, alt: "SceneSmith: publish from ChatGPT to Instagram, X and LinkedIn"};

type MetadataImage = {url: string; width: number; height: number; alt: string};

export function pageMetadata(path: string, title: string, description: string, image: MetadataImage = OG_IMAGE): Metadata {
  return {
    title,
    description,
    alternates: {canonical: path},
    openGraph: {type: "website", url: path, title, description, siteName: SITE_NAME, images: [{...image}]},
    twitter: {card: "summary_large_image", title, description, images: [image.url]}
  };
}

export function articleMetadata(path: string, title: string, description: string, published: string, modified: string, author: string, image?: MetadataImage): Metadata {
  const socialImage = image ?? OG_IMAGE;
  return {
    ...pageMetadata(path, title, description, socialImage),
    openGraph: {
      type: "article",
      url: path,
      title,
      description,
      siteName: SITE_NAME,
      images: [socialImage],
      publishedTime: published,
      modifiedTime: modified,
      authors: [author]
    }
  };
}

export {serializeJsonLd} from "./json-ld.mjs";
