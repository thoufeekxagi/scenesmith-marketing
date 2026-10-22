---
title: "How to add an MCP server to Codex (CLI, app and IDE)"
description: "Add a remote or local MCP server to Codex with codex mcp add or a config.toml table, finish the OAuth login, then confirm it with codex mcp list and one real tool call."
category: "Setup guide"
author: "Thoufeek Baber"
published: "2026-10-22"
updated: "2026-10-22"
primaryKeyword: "how to add mcp server to codex"
image: "/blog/add-mcp-server-codex-hero.webp"
imageAlt: "Flat illustration of a plug on a cable entering the side of a teal server block, an orange panel behind it, and a check mark inside a circle above."
---

Codex keeps its MCP servers in one file. Add a remote server with `codex mcp add` and the server's address as `--url`, open `~/.codex/config.toml` when you need finer options, and finish with `codex mcp login` plus the server name if it uses OAuth. Confirm the result with `codex mcp list`, or `/mcp` inside the Codex terminal UI.

The ChatGPT desktop app, the Codex CLI and the Codex IDE extension read that same configuration, so you add a server once and switch between those clients without redoing the setup. This guide follows the steps against OpenAI's own Codex documentation, read on 22 October 2026, and uses SceneSmith's publishing server as the worked remote example. Everything except the last step applies to any MCP server: Context7, Figma, Sentry, GitHub.

## What Codex supports before you add anything

OpenAI's Codex MCP page lists two server types and one extra feature:

- **STDIO servers** run as a local process that Codex starts, with environment variables you pass in.
- **Streamable HTTP servers** are reached at an address, with bearer token authentication or OAuth, including Client ID Metadata Documents (CIMD) and Dynamic Client Registration (DCR).
- **Server instructions** are read from the MCP `instructions` field at initialization and used as guidance across the server's tools. OpenAI asks server authors to keep the first 512 characters self-contained.

One distinction worth knowing before you start: the ChatGPT desktop app connects to MCP servers as a Codex host, but ChatGPT on the web reaches MCP tools through plugins instead. If you are following a tutorial that says "settings" and you are in the CLI, you are on a different surface.

## How to add an MCP server to Codex

![Illustration of a laptop, a monitor and a phone standing together on one wide teal desk](/blog/add-mcp-server-codex-step-01.webp)

### Step 1: Know which surface you are configuring

Codex stores MCP configuration in `config.toml` alongside its other settings. By default that is `~/.codex/config.toml`. You can also scope servers to a single project with `.codex/config.toml`, which Codex only reads in trusted projects.

The desktop app, the CLI and the IDE extension share this configuration for the same Codex host, so Step 2 is a one-time job. If a project-scoped server is not appearing, check that the project is trusted before you edit anything else.

![Illustration of an orange server block resting on top of two stacked teal server blocks](/blog/add-mcp-server-codex-step-02.webp)

### Step 2: Add the server with the CLI or a TOML table

For a remote HTTP server, the CLI takes the name and the address:

```bash
codex mcp add scenesmith --url https://app.scenesmith.design/api/mcp
```

If your provider requires a pre-registered OAuth client, add it in the same command with `--oauth-client-id`, and `--oauth-client-secret` for a confidential client. The docs show the secret read from an environment variable rather than typed into the file, and Codex stores it as `oauth.client_secret` inside that server's table in `config.toml`. Keep that file private and out of version control.

The same server as a table in `~/.codex/config.toml`:

```toml
[mcp_servers.scenesmith]
url = "https://app.scenesmith.design/api/mcp"
```

A local STDIO server takes a command instead of a URL. OpenAI's own example adds Context7:

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

Which is this table, with `args` and optional `env`, `env_vars` or `cwd`:

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

![Illustration of a browser window holding a padlock, set on a teal cloud shape with a wide arrow beneath](/blog/add-mcp-server-codex-step-03.webp)

### Step 3: Finish the OAuth login

For a server that supports OAuth, run:

```bash
codex mcp login scenesmith
```

Codex is the OAuth client here, and it runs on your machine. During login it shows the callback it needs registered with the provider:

```text
OAuth callback URL: http://127.0.0.1/callback
```

For a `127.0.0.1` callback without an explicit port, Codex leaves the port out of the URL it shows and stores, then inserts whichever port its listener picked at authorization time. That is why authorization servers have to accept variable loopback ports, as [RFC 8252 section 7.3](https://www.rfc-editor.org/rfc/rfc8252#section-7.3) requires. If you need a fixed port, set `mcp_oauth_callback_port` globally or the per-server `oauth.callback_port` for one server.

Two things people get backwards: the *server* is what is remote, and the OAuth approval happens in a browser that returns to a listener on your own machine. A locked-down workstation, a container without a browser, or a remote box is the failure case, not a slow network.

SceneSmith's [connection guide](/connections) describes its side of this: OAuth 2.1 with PKCE, bearer authorization on tool calls, and account, workspace, media, draft, schedule and publishing scopes advertised during discovery. No local package is needed for an HTTP-capable client. Authorize your own SceneSmith account in the browser prompt, never a shared account.

![Illustration of a clipboard with three tick marks and lines of text, next to three stacked cards](/blog/add-mcp-server-codex-step-04.webp)

### Step 4: Verify before you rely on it

Run `codex mcp list` to see the servers Codex has configured, or type `/mcp` in the Codex terminal UI to see the active ones. Then make one read-only call before anything that writes.

With SceneSmith connected, the first call to make is setup status, which returns the signed-in email, the workspace, and the destination names and handles. Only after that matches what you expect should you ask Codex to create a draft, preview the exact text, media, destination and time, and publish the version you approved. The tool surface that answers today is `get_setup_status`, `create_draft`, `validate_draft`, `preview_draft`, `schedule_draft`, `publish_draft_now` and `list_calendar`, among others.

If you want the full publishing flow rather than the setup, the [Codex to Instagram guide](/blog/codex-instagram-publishing) walks through drafts, carousels and Reels, and [which plans and surfaces support MCP](/blog/chatgpt-mcp-support) covers the ChatGPT side.

## Set the approval rule before you connect anything that publishes

Codex lets you decide, per server, when a tool call needs you. `default_tools_approval_mode` accepts `auto`, `prompt`, `writes` and `approve`. The `writes` mode prompts for every tool that is not marked read-only, which is the setting that turns "the model can publish" into "the model prepares a post and I publish it". A single tool can override the server default:

```toml
[mcp_servers.scenesmith]
url = "https://app.scenesmith.design/api/mcp"
default_tools_approval_mode = "writes"

[mcp_servers.scenesmith.tools.publish_draft_now]
approval_mode = "approve"
```

The same table takes `enabled_tools` and `disabled_tools` (the deny list is applied after the allow list), `enabled = false` to switch a server off without deleting it, `required = true` to make startup fail when the server cannot initialize, and `startup_timeout_sec` and `tool_timeout_sec`, which default to 10 and 60 seconds.

## CLI or config.toml?

- Use `codex mcp add` for a normal addition. It is one line, it writes the same table, and it prints the callback to register when the provider needs one.
- Open `config.toml` when you need options the CLI does not take: `http_headers`, `env_http_headers`, `http_headers_helper`, tool allow and deny lists, per-tool approval modes and output token limits.
- Use `.codex/config.toml` inside a project when the server is only for that repository, and remember it applies in trusted projects only.
- `codex mcp --help` lists every command if you forget the syntax.

## When the server does not appear

- **Nothing in `codex mcp list`.** You are probably editing a different `config.toml` than the one the client reads, or relying on a project scope in an untrusted project.
- **A `401` or `403` on a tool call.** Codex tries configured bearer tokens and authorization headers before OAuth. After a same-origin `POST` returns `401` or `403` it refreshes `http_headers_helper` output once and retries only if the helper printed different values, and an OAuth `403` that reports insufficient scope does not trigger a refresh. `http_headers_helper` also only works for connections made from the local environment, not through a remote execution environment.
- **The browser never comes back.** The loopback listener is the problem: pick a free port with `callback_port`, or set `mcp_oauth_callback_url` when the callback has to arrive through an ingress in front of a remote box. Codex rejects a mismatched `iss` in the authorization response, and a missing one when the provider advertises issuer support.
- **Connected, but the tools you expect are missing.** Check `enabled_tools` and `disabled_tools`, and raise `startup_timeout_sec` for a slow local STDIO server.

If a client-side setting still fails, the [MCP connector troubleshooting guide](/blog/chatgpt-mcp-connector-stopped-working) covers the token and stale-snapshot cases on the ChatGPT side, and [SceneSmith's MCP page](/mcp) describes the endpoint and what it publishes to.

## Questions readers ask

### Do I need a paid ChatGPT plan to add an MCP server to Codex?

OpenAI's Codex MCP page, read on 22 October 2026, documents the configuration without tying any of it to a plan, and the same configuration serves the desktop app, the CLI and the IDE extension. The limits usually come from the service you connect. SceneSmith's own setup-status tool states that free accounts can connect up to three accounts per destination and create or preview three drafts, and that scheduling and publishing need a paid plan or an active trial.

### Should I edit config.toml or use codex mcp add?

Either works, because the CLI writes the same `[mcp_servers.example]` table. Use the CLI for a straightforward remote URL or a local command, and edit the file when you want headers, tool allow lists, approval modes or timeouts that the command does not take.

### Why does the OAuth login go to a 127.0.0.1 address?

Because Codex is the OAuth client and it runs on your machine; the MCP server is the remote half. Codex listens on a local port, the browser redirects there with the authorization code, and the provider has to accept the varying loopback port. Set `mcp_oauth_callback_port` or the per-server `callback_port` if you need that port fixed.

### Does one setup cover the CLI, the IDE extension and the desktop app?

Yes for the same Codex host: OpenAI documents that the three share MCP configuration, so a server you add once appears in all of them. Plugin-provided servers are the exception, because the plugin launches them from its own manifest; your config only controls whether they are enabled and which of their tools are allowed.

### Can I add a local STDIO server as well as a remote one?

Yes, and the two live side by side in the same file. A STDIO entry uses `command` plus `args`, with `env` or `env_vars` for credentials, while a remote entry uses `url` and the OAuth or header options.

## Sources

- [OpenAI Codex: Model Context Protocol](https://developers.openai.com/codex/mcp), read 22 October 2026: config location and project scope, shared configuration across the desktop app, CLI and IDE extension, supported STDIO and Streamable HTTP features, `codex mcp add`, `codex mcp list`, `codex mcp login`, `/mcp` in the terminal UI, `config.toml` keys, approval modes, and the OAuth callback and CIMD/DCR rules.
- [RFC 8252 section 7.3](https://www.rfc-editor.org/rfc/rfc8252#section-7.3), the loopback redirect rule the Codex docs cite.
- [SceneSmith connection guide](https://scenesmith.design/connections), read 22 October 2026: the production MCP endpoint, the clients the guide names, the OAuth 2.1 with PKCE requirement, and the advertised scopes.
- SceneSmith MCP endpoint `https://app.scenesmith.design/api/mcp`, `tools/list` read 22 October 2026: the tool names and the setup-status description quoted above.
