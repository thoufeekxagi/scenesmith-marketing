import type {Metadata} from "next";
import {pageMetadata} from "../../lib/seo";
import {LegalPage} from "../../components/legal-page";
import {McpConnectionGuide} from "../../components/mcp-connection-guide";

export const metadata: Metadata = pageMetadata("/mcp", "SceneSmith MCP server: publish to Instagram, X and LinkedIn | SceneSmith", "Use the hosted SceneSmith MCP server to draft, preview, schedule, and publish social posts from any MCP-compatible AI client.");


export default function McpConnectionPage() {
  return <LegalPage eyebrow="MCP connections" title="Bring SceneSmith into the tools you already use." intro="Connect the hosted SceneSmith MCP server to ChatGPT, Codex, Cursor, VS Code, Devin, or another MCP-compatible client. Each person authorizes their own SceneSmith account and social destinations.">
    <McpConnectionGuide />
  </LegalPage>;
}
