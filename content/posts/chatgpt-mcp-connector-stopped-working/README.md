---
title: "ChatGPT MCP connector stopped working? Check the token, then the snapshot"
description: "OpenAI's help page names the two reasons a working MCP connection stops: an authorization that cannot renew, and a frozen tool list. How to tell which."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-17"
updated: "2026-10-17"
primaryKeyword: "chatgpt mcp connector not working"
image: "/blog/chatgpt-mcp-connector-stopped-working-hero.webp"
imageAlt: "Two large rounded blocks, deep teal on the left and vivid orange on the right, separated by a narrow cream gap on a cream background."
---

A connector that worked yesterday and fails today usually has one of two causes, and both are written down in OpenAI's own help page. Either ChatGPT no longer holds a usable authorization for the server, or the server's tools changed after the connection was approved and the call no longer matches what ChatGPT recorded.

The two look different from the outside. A dead authorization shows up as a sign-in prompt or a tool that suddenly demands reconnecting. A stale tool list shows up as a tool that is missing, or a tool call that errors even though the server is up. Fixing the wrong one wastes the afternoon, so identify the symptom first.

This page is about connections that were working. If the option to add a custom MCP server was never there, the problem is plan, workspace permission or surface, and [the MCP support guide](/blog/chatgpt-mcp-support) covers that case instead.

## What OpenAI's help page says

The help article [Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) (read 2026-10-17) is the primary source for both causes.

On authorization, it asks builders to confirm that the OAuth or OpenID Connect provider is "configured to issue refresh tokens, as additional configurations are required in order to maintain connectivity". It then spells out the failure: "If OAuth is configured without offline_access, ChatGPT may lose access after the original authorization expires because refresh-token renewal may be unavailable, and users may need to reauthenticate."

On tools, the FAQ answers "Do MCP server changes auto-update in my workspace?" with a no: after an admin first approves a connection, ChatGPT "uses a "frozen" snapshot of its available tools and inputs", and changes the server makes later "are not applied until an admin reviews and publishes an update". The next answer is the one that saves time: "If the live app no longer matches the frozen snapshot, tool calls can error." And the page states plainly that error messages "do not include an auto-prompt to update, and admins are not proactively notified when an app needs review."

So the error text is not going to tell you which cause you are in. You have to check both sides yourself.

## How to tell the two apart

- **You are asked to sign in again, or every tool call returns an authorization error.** That is the token. The connection object still exists; the credential behind it does not work any more.
- **The tool is gone from the list, or one specific call errors while others succeed.** That is the snapshot. The authorization is fine, but the tool definition ChatGPT holds is not the one the server now serves.
- **Everything fails immediately after a server deploy.** Start with the snapshot, then re-read the server's discovery document before touching the client.
- **It fails weeks later with no deploy in between.** Start with the token. An authorization that cannot renew fails on its own expiry clock, so the timing is the clue.

## If it is the token: five checks

![A thick vivid orange arrow curving up and to the right above a thick deep teal arrow curving down and to the left, on a cream background.](/blog/chatgpt-mcp-connector-stopped-working-renewal.webp)

1. **Read the discovery document.** Fetch `/.well-known/oauth-authorization-server` (or `/.well-known/openid-configuration`) from the server's domain. This is the metadata ChatGPT reads before it ever asks a user to authorize, so a wrong document here breaks renewal for everyone, not just you.
2. **Check the grant types.** `grant_types_supported` should list `refresh_token` next to `authorization_code`. If only the authorization-code grant is advertised, there is nothing for ChatGPT to renew with.
3. **Check the scopes.** For OpenID Connect providers, OpenAI's page says the standard way to request a refresh token is to include `offline_access` in the authorization request, and for the provider to advertise support for it. Look for `offline_access` (or the provider's equivalent) in `scopes_supported`.
4. **Change the metadata, then recreate the connection.** OpenAI's instruction is explicit: enable offline or refresh access in the provider's settings "then recreate the app so ChatGPT fetches the updated metadata". Editing the server alone leaves the old metadata cached in the connection.
5. **Re-authenticate once and write down the expiry.** After reconnecting, run one harmless read call and note the date. If the connection dies again around the same interval, the refresh path is still not working, whatever the document claims.

## If it is the snapshot: three checks

1. **Compare the tool list.** Ask the client what the server exposes, then compare it with the tool that failed. A call that errors with a schema or argument problem usually means the definition changed, not that the server is down.
2. **Refresh the actions, do not recreate the app.** OpenAI's page says Business and Enterprise/Edu admins "can refresh an existing custom MCP server's tool list from workspace app settings without recreating the app", and that this needs permission to manage the app and a valid connection to it.
3. **Turn the new action on deliberately.** The same page says new actions arrive disabled by default and changes to existing actions are shown as a diff. A tool that appears in the settings but never runs is often simply switched off.

## What this looks like on SceneSmith's connector

SceneSmith publishes through a remote MCP server, so the same two causes apply. Three facts from the live configuration, read 2026-10-17, are useful when you are checking:

- **The endpoint** is `https://app.scenesmith.design/api/mcp`, and the [connection guide](/connections) lists the clients that can hold it today: ChatGPT, Codex, Cursor, VS Code and Devin.
- **The discovery document** at `https://app.scenesmith.design/.well-known/oauth-authorization-server` advertises authorization-code and refresh-token grants, PKCE with `S256`, a dynamic registration endpoint at `/api/oauth/register`, and eight scopes covering account, workspace, media, draft, schedule and publish access. It is an OAuth 2.0 server rather than an OpenID Connect provider, so it does not list `offline_access`; the refresh-token grant is where renewal comes from.
- **Revoking and reconnecting** is a supported path: the connection guide says you can open your SceneSmith MCP settings to review the endpoint and revoke the ChatGPT connection.

The safe first test after any reconnect is the same on every client: ask for the setup status, confirm the identity, workspace and destination handles, then create a draft without publishing. Approving the exact draft is separate from connecting, and the [batch guide](/blog/batch-create-social-media-posts) walks through that review order when several drafts are waiting.

If the SceneSmith tool you expected is missing rather than the connection being dead, check the tool list on the [MCP page](/mcp) before assuming the server dropped it. Publishing, scheduling and rescheduling are separate tools, and a workflow that expects one of them to do another's job will look broken when it is not.

## Questions readers ask

### Why did my ChatGPT connector stop working after a few weeks?

The most common documented reason is an authorization that cannot renew. OpenAI's help page says that when OAuth is configured without `offline_access`, ChatGPT "may lose access after the original authorization expires because refresh-token renewal may be unavailable". Reconnecting fixes it for a while; fixing the provider's refresh support fixes it properly.

### How do I know if it is the token or the tool list?

Look at what fails. A sign-in prompt, or every call failing with an authorization error, points at the token. One tool missing or one call erroring while the rest work points at the frozen snapshot, which OpenAI documents as a list that does not update until an admin refreshes it.

### Does re-adding the connector fix a stale tool list?

Usually not on its own. Recreating the app is what OpenAI recommends after changing OAuth metadata, because ChatGPT has to fetch the new metadata. For a changed tool definition, the documented route is refreshing the tool actions from workspace app settings, which does not require recreating the app.

### Why does ChatGPT not warn me when a connector needs an update?

It does not. OpenAI's page answers that question directly: error messages today "do not include an auto-prompt to update, and admins are not proactively notified when an app needs review". Someone has to notice and refresh the actions, which is why a note in the team's runbook is worth more than another retry.

### Does a connected MCP server publish as soon as a tool call succeeds?

No. Two confirmations stand between a draft and a live post: ChatGPT asks for confirmation before write actions, and SceneSmith shows the exact draft, media, destination and time for approval. A successful tool call means the connection works, not that anything was published.

## Sources

- [OpenAI Help Center: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) — read 2026-10-17. Source for the refresh-token and `offline_access` guidance, the instruction to recreate the app so ChatGPT fetches updated metadata, the frozen tool snapshot, tool calls erroring when the live app no longer matches it, refreshing a tool list from workspace app settings without recreating the app, new actions arriving disabled by default with changes shown as a diff, and the absence of any automatic update prompt or admin notification.
- [SceneSmith: connection guide](/connections) — read 2026-10-17. Source for the production MCP endpoint, the clients listed today (ChatGPT, Codex, Cursor, VS Code, Devin), the OAuth 2.1 with PKCE requirement, the scope families advertised during discovery, the revoke-and-reconnect path, and the safe first test.
- [SceneSmith OAuth discovery document](https://app.scenesmith.design/.well-known/oauth-authorization-server) — read 2026-10-17. Source for the authorization, token and registration endpoints, the advertised grant types, PKCE `S256`, the public-client token auth method, and the eight scopes.
- [SceneSmith: does ChatGPT support MCP](/blog/chatgpt-mcp-support) — read 2026-10-17. Source for the plan, workspace-permission and surface rules that apply before a connection exists at all.
