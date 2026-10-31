---
title: "How to add an MCP server to Codex (CLI, config.toml, approvals)"
description: "Add an MCP server to Codex with codex mcp add or a config.toml table, then set the approval mode and timeouts so its tools appear and stay under your control."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-31"
updated: "2026-10-31"
primaryKeyword: "how to add an mcp server to codex"
image: "/blog/codex-add-mcp-server-hero.webp"
imageAlt: "Title card with the words How to add an MCP server to Codex over a deep teal and orange panel."
---

Add an MCP server to Codex with one command — `codex mcp add SERVER-NAME -- SERVER-COMMAND` — or by adding a `[mcp_servers.NAME]` table to `~/.codex/config.toml` when you need headers, OAuth or approval settings. Both routes write the same configuration file, and OpenAI's documentation says the ChatGPT desktop app, Codex CLI and the IDE extension share it for the same Codex host, so you configure a server once and switch clients without redoing it.

The part most guides skip is what happens after the server appears: whether Codex runs its tools silently or asks first, and how long it waits for a slow server. Both are settings in the same table.

![Flowchart with two starting boxes, Local server command and Server at a URL, leading to codex mcp add and a url table in config.toml, which meet at one config.toml entry, then pass through codex mcp list to Set approval mode.](/blog/codex-add-mcp-server-two-routes.webp)

## What you need before you start

- **A Codex client on the machine you are configuring.** Configuration is per Codex host, so a server added on your laptop is not available from a different machine.
- **The server's start command, or its URL.** Local servers start from a command such as `npx -y @upstash/context7-mcp`; hosted servers are reached at an address such as `https://mcp.example.com`.
- **Any credential the server needs, in an environment variable.** Codex can read a bearer token from a named environment variable, which keeps the token out of the file you might commit.

## Add a local server with the CLI

The short form for a server that runs as a local process:

```bash
codex mcp add SERVER-NAME --env VAR1=VALUE1 --env VAR2=VALUE2 -- STDIO-COMMAND
```

Everything after the standalone `--` is the command that starts the server. Everything before it configures it. OpenAI's own example adds Context7, a documentation server:

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

For a hosted server, pass its address instead of a command:

```bash
codex mcp add example --url https://mcp.example.com
```

Three follow-up commands cover the rest of the workflow:

- `codex mcp list` prints the servers Codex has configured.
- `codex mcp login SERVER-NAME` starts the OAuth login for a server that needs it.
- `/mcp` inside the Codex terminal UI shows the servers active in that session.

## Add a server in config.toml

Editing the file directly is the route for anything the CLI does not expose: static headers, a bearer token pulled from the environment, per-tool approval, tool allow lists and timeouts. The default file is `~/.codex/config.toml`. You can also drop the same table into `.codex/config.toml` inside a project, which OpenAI documents for trusted projects only, so a server can be scoped to one repository.

Every server is one `[mcp_servers.SERVER-NAME]` table. A local (STDIO) server uses `command`, and optionally `args`, `env`, `env_vars` and `cwd`:

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

A hosted (Streamable HTTP) server uses `url`, and optionally `auth`, `bearer_token_env_var`, `http_headers` or `env_http_headers`:

```toml
[mcp_servers.example]
url = "https://mcp.example.com"
bearer_token_env_var = "EXAMPLE_MCP_TOKEN"
```

Two details in that second block matter in practice. `bearer_token_env_var` names an environment variable rather than holding the token, so the file stays safe to share. And `auth` defaults to `oauth`, which uses stored MCP OAuth credentials; `chatgpt` is the alternative for the trusted first-party ChatGPT origin and falls back to stored OAuth.

If no credential source resolves, OpenAI documents that Codex can still connect without authentication and that you start the login separately with `codex mcp login SERVER-NAME`.

## Set approvals before the first tool call

A connected server is not the same as a trusted one. Approval behaviour sits in the same table:

- `default_tools_approval_mode` accepts `auto`, `prompt`, `writes` and `approve`. The `writes` value is the useful middle ground: OpenAI describes it as prompting for tools that are not marked read-only.
- `tools.TOOL.approval_mode` overrides that default for one tool, which is how you let a lookup run freely while a publish or delete still asks.
- `enabled_tools` and `disabled_tools` limit what Codex can call at all; the deny list is applied after the allow list.

![Decision flowchart: Codex calls a tool, then asks whether it is a read-only tool; yes leads to auto mode running it, no leads to writes mode prompting, and then you approve or deny.](/blog/codex-add-mcp-server-approval-mode.webp)

Three more settings decide how much a bad server can cost you:

- `startup_timeout_sec` defaults to `10` and `tool_timeout_sec` to `60`.
- `enabled = false` disables a server without deleting it, and `required = true` makes startup fail when that server cannot initialise.
- `mcp_optional_startup_grace_ms`, a top-level setting, controls how long Codex waits for optional servers while it builds the initial tool catalog. It defaults to `1000` milliseconds.

## Verify the server actually connected

A file edit is not a connection. Check in this order:

1. Run `codex mcp list` and confirm the server name is there.
2. Open `/mcp` in the Codex terminal UI, or start a new session in the desktop app or IDE extension, and confirm the server shows as active.
3. Ask a question the server's tools can answer. If your approval mode is `prompt` or `writes`, you should see the request before anything runs.
4. If the tool list is empty, the server initialised but exposed nothing — that is usually missing authentication, not a broken config file.

One more field is worth knowing about if you write servers rather than use them: Codex reads the MCP `instructions` field returned at initialisation and treats it as server-wide guidance. OpenAI recommends keeping the first 512 characters self-contained, because that is what Codex sees when deciding how to use the server.

## Fix the four failures that look like config problems

- **The server never starts.** It ran out of time. Raise `startup_timeout_sec` above its default of 10 seconds, especially for a command that installs a package on first run.
- **Codex fails at startup instead of continuing.** A server marked `required = true` could not initialise. Either fix that server or drop the flag.
- **Every call returns 401 or 403.** Check the token: `bearer_token_env_var` must name a variable that exists in the environment Codex runs in. Codex caches helper headers and retries once after a `401` or `403`, but only if `http_headers_helper` returns changed values; an OAuth `403` reporting insufficient scope does not trigger a refresh.
- **You are on a setup where local processes run elsewhere.** `experimental_environment = "remote"` starts a STDIO server through a remote executor environment when one is available, and `env_vars` entries can name `source = "remote"` to read the variable there instead of locally.

## What this looks like for a publishing server

The same steps connect Codex to a hosted publishing server such as [SceneSmith's MCP server](/mcp): it is a Streamable HTTP server, so it needs a `url` and OAuth rather than a local command. SceneSmith's [connection guide](/connections) lists ChatGPT, Codex, Cursor, VS Code and Devin, and the Codex walk-through — including the exact `[mcp_servers.scenesmith]` block and the draft-then-approve habit — is in [how to post to Instagram from ChatGPT Codex](/blog/codex-instagram-publishing). If you use ChatGPT's own plugin flow instead of Codex, the plan and surface rules are in [how to add an MCP server to ChatGPT](/blog/chatgpt-mcp-support).

The approval setting is the one to get right on a publishing server. A drafting tool and a publishing tool can sit behind the same connection, and `default_tools_approval_mode` is what decides whether Codex asks you before the second kind runs.

## Questions readers ask

### Where does Codex keep its MCP configuration?

In `config.toml`: by default `~/.codex/config.toml`, or `.codex/config.toml` inside a trusted project for a per-repository scope. The ChatGPT desktop app, Codex CLI and the IDE extension share that configuration for the same Codex host.

### Should I use codex mcp add or edit config.toml?

Use `codex mcp add` for a quick local server or a plain URL. Edit `config.toml` when you need static headers, a bearer token from an environment variable, a pre-registered OAuth client, per-tool approval modes, tool allow or deny lists, or custom timeouts.

### How do I stop Codex from running a server's tools without asking?

Set `default_tools_approval_mode` to `prompt` for every tool, or to `writes` to prompt only for tools that are not marked read-only. Then override individual tools with `tools.TOOL.approval_mode` where a lookup should run without a prompt.

### How do I remove a server without losing its settings?

Set `enabled = false` in its `[mcp_servers.NAME]` table. Codex keeps the configuration and stops loading the server, so you can switch it back on later.

### Why does a hosted server need codex mcp login?

Because Streamable HTTP servers can require OAuth, and adding the `url` alone does not complete that sign-in. Run `codex mcp login SERVER-NAME`, and if your provider requires a pre-registered client, add it with `--oauth-client-id` (and `--oauth-client-secret` for a confidential client) when you add the server. Codex prints the callback URL to register, which is `http://127.0.0.1/callback`.

### Does a project-level config file override my home config?

They are separate scopes, not an override chain: `~/.codex/config.toml` applies to your Codex host generally, and `.codex/config.toml` adds configuration for that project. OpenAI documents the project file for trusted projects only, so an untrusted checkout does not silently load servers.

## Sources

- OpenAI, [Model Context Protocol — Codex](https://developers.openai.com/codex/mcp), read 2026-10-31: the `codex mcp add` forms, `codex mcp list`, `codex mcp login`, the `/mcp` terminal command, `~/.codex/config.toml` and project-scoped `.codex/config.toml`, STDIO and Streamable HTTP key lists, approval modes, timeout defaults, the OAuth callback URL and the `instructions` guidance.
- OpenAI, [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference), linked from that page as the searchable list of MCP options.
- SceneSmith, [connections](/connections) and [MCP server](/mcp) pages, read 2026-10-31: which clients the setup guide covers and the hosted server address used in the walk-through.
