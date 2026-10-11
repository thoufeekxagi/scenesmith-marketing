import type {Metadata} from "next";
import {pageMetadata} from "../../lib/seo";
import {LegalPage} from "../../components/legal-page";
import {McpConnectionGuide} from "../../components/mcp-connection-guide";

export const metadata: Metadata = pageMetadata("/connections", "Connect SceneSmith to ChatGPT, Codex, Cursor and VS Code | SceneSmith", "Step-by-step guides to connect the hosted SceneSmith MCP server to ChatGPT, Codex, Cursor, VS Code, Devin, and other MCP clients.");


export default function ConnectionsPage() {
  return <LegalPage eyebrow="Connections" title="Connect SceneSmith wherever you work." intro="Use the hosted SceneSmith MCP server with ChatGPT, Codex, Cursor, VS Code, Devin, and other MCP-compatible clients. Follow the steps below, authorize your own account, then test with a draft before publishing.">
    <McpConnectionGuide />
  </LegalPage>;
}
