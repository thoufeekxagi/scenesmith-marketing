---
title: "ChatGPT MCP not working? Check the surface, the token, then the snapshot"
description: "Most broken ChatGPT MCP connections come down to three documented causes. Check the surface, the refresh token, then the frozen tool list, in that order."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-17"
updated: "2026-11-12"
primaryKeyword: "chatgpt mcp not working"
image: "/blog/chatgpt-mcp-connector-stopped-working-hero.webp"
imageAlt: "Two large rounded blocks, deep teal on the left and vivid orange on the right, separated by a narrow cream gap on a cream background."
---

A custom MCP server that worked yesterday and fails today is usually not a broken server. OpenAI's help article for custom MCP servers describes three causes that explain almost every case: you are on a surface that cannot hold the connection, ChatGPT can no longer renew the authorization, or the tool list it approved no longer matches what the server serves.

The order matters. Checking the token first, when the real problem is that full MCP is not on your plan or that you are testing in the mobile app, wastes the afternoon. Start with the surface, then the token, then the tool list. Each check below comes from that article, read on 2026-11-12.

![A four-step vertical flow: the connector fails, then check the surface, then check the refresh token, then check the tool list.](/blog/chatgpt-mcp-connector-stopped-working-check-order.webp)

If the option to add a custom MCP server was never there at all, nothing broke. That is a plan, workspace-permission or surface question, and [the MCP support guide](/blog/chatgpt-mcp-support) covers it instead.

## Check the surface before you blame the server

Four things in the current documentation look like a broken connector and are not.

- **You are in the mobile app.** The article's FAQ asks "Can I connect custom MCP servers on mobile?" and answers "No - web only." A connection that works in the browser and seems missing on a phone is behaving as documented.
- **Your plan does not include full MCP.** "Custom MCP server connections and full MCP support are available for ChatGPT Business and Enterprise/Edu customers on ChatGPT web." Pro is narrower: Pro users "can connect custom MCP servers with read/fetch permissions", while "Full MCP is only available to Business and Enterprise/Edu users, currently." If your tools can read but never write, that is the likely reason.
- **The app is not selected for this message.** "App selection applies to the message where you use it, not the entire conversation", and the article tells users to "@mention the app again when a follow-up needs new data or another app action." A follow-up that ignores your publishing tools is often just a follow-up without the app selected. Type `@` in the prompt box and choose it.
- **The server runs on your own machine.** "Not directly. ChatGPT connects to remote MCP servers." A local server needs OpenAI's Secure MCP Tunnel to be reachable at all.

## Where the settings are now

The help article has been rewritten around the current **Plugins** experience. If you learned this workflow in Developer Mode, the paths changed under you, and a menu that no longer exists is not a broken connection.

In the article's words: "In the current Plugins experience, add a custom MCP server directly from Plugins. You don't need to turn on Developer Mode first." The documented sequence:

1. Go to Plugins.
2. Select the plus button, then **Add custom MCP server**.
3. Enter a name and, optionally, a description.
4. Under **Connection**, enter the server's public HTTPS MCP endpoint. For SceneSmith that is `https://app.scenesmith.design/api/mcp`.
5. Configure authentication for the server.
6. Review the risk warning, tick **I understand and want to continue**.
7. Select **Create as a plugin**, then review the discovered tools and metadata.

Testing is documented as its own step: "Install the resulting plugin, then start a new conversation. Type @ in the prompt box and select the plugin."

Publishing for a whole workspace still runs through the older admin path: open the Admin console, select the workspace, open **Plugins**, then **Manage Legacy Apps**, then **Drafts**, then **Publish**. "Once published, apps appear in the workspace's approved apps list. Users can find available apps through Settings > Plugins." The older route (Workspace settings, Apps, Create, Scan Tools, Drafts) is still described in the same article as legacy app configuration.

SceneSmith's own [connection guide](/connections) stays deliberately surface-neutral: "Open the client's MCP, Plugins, or Developer Mode settings. Add the production endpoint above. Complete the SceneSmith OAuth authorization prompt." Use whichever of those your workspace actually shows.

## What the article says about the other two causes

Both of the remaining causes are written down plainly, and neither announces itself in an error message.

On authorization, the article asks builders to confirm the OAuth or OpenID Connect provider is "configured to issue refresh tokens, as additional configurations are required in order to maintain connectivity". Then it states the failure: "If OAuth is configured without offline_access, ChatGPT may lose access after the original authorization expires because refresh-token renewal may be unavailable, and users may need to reauthenticate."

On tool definitions, the FAQ "Do MCP server changes auto-update in my workspace?" gets a no: after an admin first approves a connection, ChatGPT "uses a "frozen" snapshot of its available tools and inputs", and changes the server makes later "are not applied until an admin reviews and publishes an update". The follow-up answer is the one that saves time: "If the live app no longer matches the frozen snapshot, tool calls can error." Backward-compatible changes, such as a new optional parameter, may keep working; a breaking one will not.

And the article confirms there is no safety net: error messages "do not include an auto-prompt to update, and admins are not proactively notified when an app needs review."

## How to tell the two apart

- **You are asked to sign in again, or every tool call returns an authorization error.** That is the token. The connection object still exists; the credential behind it no longer works.
- **One tool is missing, a tool call errors on its arguments, or the tool list in settings looks stale.** That is the snapshot. The authorization is fine, but the tool definition ChatGPT holds — name, parameters, description — is not the one the server now serves.
- **Everything fails immediately after a server deploy.** Start with the snapshot, then re-read the server's discovery document before touching the client.
- **It fails weeks later with no deploy in between.** Start with the token. An authorization that cannot renew fails on its own expiry clock, so the timing is the clue.

## If it is the token: five checks

![A thick vivid orange arrow curving up and to the right above a thick deep teal arrow curving down and to the left, on a cream background.](/blog/chatgpt-mcp-connector-stopped-working-renewal.webp)

1. **Read the discovery document.** Fetch `/.well-known/oauth-authorization-server` (or `/.well-known/openid-configuration`) from the server's domain. This is the metadata ChatGPT reads before it asks anyone to authorize, so a wrong document here breaks renewal for every user, not just you.
2. **Check the grant types.** `grant_types_supported` should list `refresh_token` next to `authorization_code`. With only the authorization-code grant advertised, there is nothing to renew with.
3. **Check the scopes.** For OpenID Connect providers, the article's instruction is to include the `offline_access` scope in the authorization request and to advertise support for it in discovery metadata. Look for `offline_access` (or your provider's equivalent) in `scopes_supported`.
4. **Fix the provider, then recreate the app.** The article's instruction is to enable offline or refresh access in the provider's settings, "then recreate the app so ChatGPT fetches the updated metadata". Editing the server alone leaves the old metadata cached in the connection.
5. **Re-authenticate once and write down the expiry.** After reconnecting, run one harmless read call and note the date. If the connection dies again around the same interval, renewal is still failing, whatever the document claims.

## If it is the snapshot: three checks

1. **Compare the tool list.** Ask the client what the server exposes, then compare it with the call that failed. An error about a schema, an argument or an unknown tool usually means the definition changed, not that the server is down.
2. **Refresh the actions instead of recreating the app.** "Business and Enterprise/Edu admins can refresh an existing custom MCP server's tool list from workspace app settings without recreating the app", and the article notes this needs permission to manage the app plus a valid connection to it.
3. **Turn the new action on deliberately.** In the Action control panel under workspace settings, "Updates to the MCP server are not automatically enabled - you can select the Refresh button to obtain the latest set of actions, or updates to existing actions. New actions are disabled by default, and changes to existing actions are shown as a diff." A tool that shows up in settings but never runs is often simply switched off.

## What this looks like on SceneSmith's connector

SceneSmith publishes through a remote MCP server, so the same three causes apply. Four facts from the live configuration, read on 2026-11-12:

- **The endpoint** is `https://app.scenesmith.design/api/mcp`, and the [connection guide](/connections) lists the clients that can hold it today: ChatGPT, Codex, Cursor, VS Code and Devin.
- **The discovery document** advertises `authorization_code` and `refresh_token` grants, PKCE with `S256`, a dynamic registration endpoint at `/api/oauth/register`, and eight scopes covering account, workspace, media, draft, schedule and publish access. The client is public — `token_endpoint_auth_methods_supported` is `none`, so there is no client secret to paste.
- **Renewal is advertised, not assumed.** SceneSmith's discovery document is an OAuth 2.0 authorization-server document, not an OpenID Connect one, so it does not list `offline_access`; the advertised `refresh_token` grant is the renewal path, and that is what to check first if a connection dies on its own schedule.
- **Revoking and reconnecting is supported.** The connection guide says you can open your SceneSmith MCP settings to review the endpoint and revoke the ChatGPT connection.

The safe first test after any reconnect is the same on every client: ask for the setup status, confirm the identity, workspace and destination handles, then create a draft without publishing. Approving an exact draft is a separate step, and the [batch guide](/blog/batch-create-social-media-posts) walks through that review order when several drafts are waiting.

If a SceneSmith tool you expected is missing, check the tool list on the [MCP page](/mcp) before assuming the server dropped it. Publishing, scheduling and rescheduling are separate tools, and a workflow that asks one of them to do another's job will look broken when it is not.

## Questions readers ask

### Why does ChatGPT MCP say not working when the server is up?

Because "not working" covers three failures with nothing in common. Check the surface (web only, plan, app selected for this message), check whether the authorization can renew, then check whether the tool list still matches. OpenAI's article also notes that error messages "do not include an auto-prompt to update", so nothing will tell you which one you are in.

### Does ChatGPT support MCP on mobile?

No. The help article's FAQ says custom MCP server connections are "web only", and the availability section limits full MCP to ChatGPT Business and Enterprise/Edu on ChatGPT web.

### Why did my MCP tools disappear after they worked?

Two documented reasons. An authorization that could not renew has expired, so the connection needs re-authenticating; or the server changed its tool definitions and ChatGPT is still using the frozen snapshot it approved earlier. The first shows a sign-in prompt, the second shows a missing or failing tool.

### Do I need Developer Mode to add a custom MCP server?

Not any more. The article says to add the server directly from Plugins and that "You don't need to turn on Developer Mode first"; you acknowledge a risk warning per server instead. The older Apps and Developer Mode routes are still described as legacy configuration.

### Do I have to approve tools again after the server updates?

Yes, for anything that is not backward compatible. The article says new actions arrive disabled by default and changes to existing actions are shown as a diff, so an admin has to refresh the tool list and enable what should run.

### Does ChatGPT publish a post as soon as a tool call succeeds?

No. "For write or modify actions, ChatGPT may ask for confirmation based on app permissions and the action's context", and some actions can be blocked outright rather than offered for approval. On SceneSmith, the exact draft, media, destination and time are shown for approval before anything is sent. A successful tool call means the connection works, not that a post went live.

## Sources

- [OpenAI Help Center: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) — read 2026-11-12. Source for plan and surface availability, the web-only answer for mobile, read/fetch limits for Pro, the Plugins navigation and the note that Developer Mode is no longer needed, the "Create as a plugin" flow and `@` invocation, publishing through Manage Legacy Apps, the frozen tool snapshot, tool calls erroring when the live app no longer matches it, refreshing a tool list without recreating the app, new actions arriving disabled with changes shown as a diff, per-message app selection, the refresh-token and `offline_access` guidance, and the absence of any automatic update prompt or admin notice.
- [SceneSmith: connection guide](/connections) — read 2026-11-12. Source for the production MCP endpoint, the clients listed today (ChatGPT, Codex, Cursor, VS Code, Devin), the OAuth 2.1 with PKCE requirement, the "MCP, Plugins, or Developer Mode settings" instruction, and the revoke-and-reconnect path.
- [SceneSmith OAuth discovery document](https://app.scenesmith.design/.well-known/oauth-authorization-server) — read 2026-11-12. Source for the authorization, token and registration endpoints, the advertised `authorization_code` and `refresh_token` grants, PKCE `S256`, the public-client token auth method (`none`), and the eight advertised scopes.
- [SceneSmith: does ChatGPT support MCP](/blog/chatgpt-mcp-support) — read 2026-11-12. Source for the plan, workspace-permission and surface rules that apply before a connection exists at all.
