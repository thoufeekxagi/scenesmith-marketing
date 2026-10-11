import {LegalCallout, LegalSection} from "./legal-page";

const productionEndpoint = "https://app.scenesmith.design/api/mcp";

export function McpConnectionGuide() {
  return <>
    <LegalCallout>
      <strong>Production MCP endpoint:</strong> <code>{productionEndpoint}</code>
      <br />Use HTTPS-capable clients only. Never paste a bearer token, provider secret, or client secret into a client configuration.
    </LegalCallout>

    <LegalSection title="ChatGPT and Codex">
      <ol>
        <li>Open the client’s MCP, Plugins, or Developer Mode settings.</li>
        <li>Add the production endpoint above.</li>
        <li>Complete the SceneSmith OAuth authorization prompt.</li>
        <li>Start with <code>Show my SceneSmith setup status.</code></li>
        <li>Confirm the Google identity, workspace, and destination handles before creating a draft.</li>
      </ol>
    </LegalSection>

    <LegalSection title="Cursor and compatible JSON clients">
      <p>Add the server to the client’s MCP configuration. The exact file location depends on the client.</p>
      <pre className="mcp-code"><code>{JSON.stringify({mcpServers: {scenesmith: {url: productionEndpoint}}}, null, 2)}</code></pre>
      <p>Reload the client, select SceneSmith, and complete the OAuth prompt when the first protected tool call requests authorization.</p>
    </LegalSection>

    <LegalSection title="VS Code and clients using a servers map">
      <p>Some clients use a <code>servers</code> map and require the transport type explicitly.</p>
      <pre className="mcp-code"><code>{JSON.stringify({servers: {scenesmith: {type: "http", url: productionEndpoint}}}, null, 2)}</code></pre>
      <p>If the client offers a Streamable HTTP option, choose it. If it only supports local stdio servers, use a client-side bridge or choose an HTTP-capable client.</p>
    </LegalSection>

    <LegalSection title="Devin and other AI IDEs">
      <p>Use the client’s remote MCP integration and paste the production endpoint. The client must support MCP initialization, tool discovery, OAuth 2.1 with PKCE, and bearer authorization for tool calls. The server advertises the required account, workspace, media, draft, schedule, and publishing scopes during OAuth discovery.</p>
      <p>There is no requirement to install an NPX package for HTTP-capable clients. An NPX wrapper is only useful for a client that supports local stdio but cannot connect to a remote HTTP server.</p>
    </LegalSection>

    <LegalSection title="Safe first test">
      <ol>
        <li>Show setup status.</li>
        <li>Confirm the exact workspace and provider handles.</li>
        <li>Create a draft without publishing.</li>
        <li>Preview it and verify the exact text, media, destination, and timing.</li>
        <li>Approve and publish only the version you reviewed.</li>
        <li>Verify the delivery receipt.</li>
      </ol>
    </LegalSection>

    <LegalSection title="Public plugin and account access">
      <p>The public directory listing uses this same production MCP endpoint. Approval is separate from connecting a custom MCP client, so friends can test through a compatible client while directory review is pending.</p>
      <p>OpenAI requires the production domain challenge at <code>/.well-known/openai-apps-challenge</code> during submission. The challenge token is configured only in the production runtime and is never included in this page or the plugin package.</p>
      <p>Already signed in? Open <a href="https://app.scenesmith.design/app/mcp">your SceneSmith MCP settings</a> to review the endpoint and revoke the ChatGPT connection if needed.</p>
    </LegalSection>
  </>;
}
