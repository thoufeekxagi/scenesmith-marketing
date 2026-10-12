---
title: "How to Post to Instagram from ChatGPT Codex"
description: "Post or schedule an Instagram Reel, carousel or single image from OpenAI Codex with the hosted SceneSmith MCP server, then approve the exact draft before it goes live."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-11"
updated: "2026-10-11"
primaryKeyword: "post to instagram from chatgpt codex"
image: "/blog/codex-instagram-publishing-hero.webp"
imageAlt: "Codex CLI window on the left, SceneSmith draft card in the middle, Instagram post preview on the right."
---

Yes. You can post to Instagram from OpenAI Codex by connecting Codex to the hosted SceneSmith MCP server: Codex drafts and previews the post, you approve the exact version, and SceneSmith publishes it to Instagram. Codex supports remote Streamable HTTP MCP servers on every plan including Free, so the setup is the same whether you use Codex CLI, the Codex IDE extension, or the ChatGPT desktop app.

This guide shows the exact Codex setup, the Instagram account type you need (Business or Creator, linked to a Facebook Page), a safe first test, and how to fix the failures that stop most Codex → Instagram attempts.

## What you need before you start

1. **OpenAI Codex** with MCP support. The Codex desktop app, the Codex CLI, and the Codex IDE extension share one `config.toml`, and all three support Streamable HTTP MCP servers today (verified on the [OpenAI developer docs, Model Context Protocol – Codex](https://learn.chatgpt.com/docs/extend/mcp)). The Codex CLI command is `codex mcp add NAME --url URL`.
2. **A SceneSmith account** with Instagram connected. SceneSmith lists Instagram, X and LinkedIn as the destinations you can authorise inside the app. OAuth happens in the browser, never in a Codex prompt.
3. **An Instagram Business or Creator account** linked to a Facebook Page. Meta's [Instagram Platform documentation](https://developers.facebook.com/docs/instagram-platform/) and the [Instagram Graph API overview](https://developers.facebook.com/docs/instagram-api/) both require an Instagram professional account plus a connected Facebook Page for the publishing endpoints. Personal accounts cannot publish through the Instagram API at all.

If you do not yet have the Instagram side ready, SceneSmith's [connection guide](/connections) walks through the Instagram connection, and Meta's [Instagram for Business setup page](https://business.instagram.com/getting-started) covers switching a personal profile to a Business or Creator account.

## Step-by-step setup in Codex

The Codex MCP configuration lives in `~/.codex/config.toml`. The ChatGPT desktop app, the Codex CLI, and the Codex IDE extension share this file, so you only set the server up once.

### Add SceneSmith as a remote HTTP MCP server

1. Open a terminal and add the production endpoint with the Codex CLI:

   ```bash
   codex mcp add scenesmith --url https://app.scenesmith.design/api/mcp
   ```

   Or edit `~/.codex/config.toml` directly:

   ```toml
   [mcp_servers.scenesmith]
   url = "https://app.scenesmith.design/api/mcp"
   ```

   The `[mcp_servers.scenesmith]` block matches the Streamable HTTP transport that the [OpenAI Codex MCP docs](https://learn.chatgpt.com/docs/extend/mcp) document. If you want a per-project scope, drop the same block into a trusted project's `.codex/config.toml` instead.
2. Restart Codex (CLI, IDE extension, or the desktop app) so it picks up the new server.
3. Confirm the server is registered:

   ```bash
   codex mcp list
   ```

   `scenesmith` should appear with the `https://app.scenesmith.design/api/mcp` URL and an `enabled` flag.
4. Run a setup-status check in Codex:

   ```text
   Show my SceneSmith setup status.
   ```

   This is the same first prompt SceneSmith's [ChatGPT connection section](/connections) recommends. The MCP server returns the Google identity, the workspace handle, and the destination handles you have authorised (Instagram, X and LinkedIn).

### Connect Instagram inside SceneSmith

1. Open [your SceneSmith MCP settings](https://app.scenesmith.design/app/mcp) in a browser.
2. Choose **Instagram** and complete the OAuth flow that hands Meta's Instagram Graph API the permissions SceneSmith needs.
3. Confirm the Business or Creator account and the Facebook Page you want to publish to.

SceneSmith holds the Instagram access token; Codex never sees a Meta token. The MCP server returns `title`, `readOnlyHint` and `destructiveHint` annotations on its tools, which is the metadata [Anthropic's connector directory](https://claude.com/docs/connectors/building/submission) and the [MCP specification](https://modelcontextprotocol.io/) recommend for safe tool discovery.

## Draft, preview and post from Codex

Once the MCP server is connected, you can write or schedule an Instagram post with a single Codex prompt.

### Single image or video (Reel) from Codex

```text
Create an Instagram Reel draft for the SceneSmith account with this 30-second
clip. Caption: two sentences on what the SceneSmith MCP server does, three
relevant hashtags, and the scenesmith.design link in the bio.
```

Codex will call the SceneSmith MCP server, which returns a draft card showing the exact caption, the media URL, and the destination handle. SceneSmith holds the post until you approve it.

### Carousel or multi-image post from Codex

```text
Draft an Instagram carousel for the SceneSmith account using these five
images. First slide: the value proposition. Slides 2-4: one feature each,
ending with a CTA that links to scenesmith.design/connections.
```

Carousels use the same MCP tool as single-image posts; the only difference is the media payload. The MCP server exposes separate draft and publish tools so you can preview every slide before approval.

### Schedule instead of publishing immediately

```text
Schedule this Instagram Reel for Friday 9:00 a.m. America/Iqaluit.
```

SceneSmith accepts an ISO-8601 timestamp and a time zone. The draft stays in your SceneSmith queue, the MCP server returns a scheduled ID, and you can edit or cancel it from the dashboard before the slot fires.

## Verify the post before approving

Before you let SceneSmith publish the draft, check four things in the draft card Codex returns:

1. The exact caption, including line breaks, hashtags, and links.
2. The destination account and any tag mentions.
3. The media that will be uploaded — open the file and confirm it is the version you want.
4. The publish-or-schedule action and the time, if any.

Only confirm the draft when all four match. If anything is wrong, edit the draft inside SceneSmith or send Codex a corrected prompt and recreate it. The SceneSmith MCP server never publishes without your approval.

## Fix common Codex → Instagram errors

**"Missing Instagram Professional account"** — the Instagram account you linked in SceneSmith is still a personal profile. Convert it to a Business or Creator account in the Instagram app, relink it inside SceneSmith, and retry. Meta's [Instagram Platform docs](https://developers.facebook.com/docs/instagram-platform/) require a professional account for the publishing endpoints.

**"Facebook Page not connected to the Instagram account"** — open the Facebook Page connected to that Instagram account and confirm it is published, not in draft mode. SceneSmith needs the Page ID during OAuth.

**"MCP server not reachable"** from Codex — confirm the URL is `https://app.scenesmith.design/api/mcp` with no trailing slash, that you restarted Codex after editing `config.toml`, and that your network can reach `app.scenesmith.design`. The Codex docs treat a Streamable HTTP MCP server as reachable from Anthropic's or OpenAI's cloud, not from your machine.

**"OAuth required"** — Codex opened the server but SceneSmith needs you to log in. Follow the browser prompt SceneSmith returns and complete the OAuth flow there. The token is stored on the SceneSmith side; Codex only sees the bearer credential for the current session.

**"Tool list empty"** — SceneSmith's MCP server requires OAuth before it lists publishing tools. Run `Show my SceneSmith setup status.` again after completing the browser-side login.

## Safety and approval

A Codex → Instagram post only goes live when you approve it inside SceneSmith. The MCP tools expose `readOnlyHint` and `destructiveHint` annotations so Codex itself can tell a draft-only call from a publish call, and SceneSmith never runs the publish tool without an explicit user confirmation. Treat the Codex prompt as the drafter, not the publisher: read every draft card before you approve.

For the full set of safeguards, see [SceneSmith's MCP connection page](/mcp) and the [private-account, page, and rate-limit notes in Meta's Graph API docs](https://developers.facebook.com/docs/instagram-api/).

## Questions readers ask

### Can you post to Instagram from ChatGPT Codex?

Yes. Connect Codex to the SceneSmith MCP server (`https://app.scenesmith.design/api/mcp`) as a Streamable HTTP MCP server, link an Instagram Business or Creator account inside SceneSmith, then ask Codex to create a draft. SceneSmith publishes only after you approve the draft.

### Does Codex need a paid OpenAI plan to post to Instagram?

No. Codex's Streamable HTTP MCP support works on every plan that ships the Codex CLI, IDE extension, or ChatGPT desktop app, including the Free plan. The MCP server is remote HTTP, so the request comes from OpenAI's infrastructure, not from your machine, and you do not need to install an NPX package locally.

### What Instagram account type do I need?

You need an Instagram Business or Creator account linked to a Facebook Page. Personal accounts cannot publish through the Instagram Graph API; Meta's Instagram Platform documentation makes this a hard requirement for any publishing endpoint.

### Does SceneSmith hold my Instagram credentials?

Yes. You complete Meta's OAuth inside SceneSmith, and SceneSmith stores the access token. Codex only sees SceneSmith's MCP tools, never the raw Instagram token, and the SceneSmith server returns `readOnlyHint` and `destructiveHint` annotations so Codex can tell draft calls from publish calls.

### Can Codex schedule an Instagram post for later?

Yes. Pass an ISO-8601 timestamp and a time zone in your Codex prompt, and SceneSmith stores the draft in its queue until the slot fires. You can edit or cancel the scheduled post from the SceneSmith dashboard before it publishes.

### Can Codex post Instagram Reels and carousels?

Yes. SceneSmith's MCP tools support single-image posts, Reels, and multi-image carousels. The Codex prompt specifies the media payload and the caption; the draft card shows every slide or the full Reel before you approve.

### Will SceneSmith publish without my approval?

No. The SceneSmith MCP server exposes separate draft and publish tools and only runs publish after an explicit user confirmation in the dashboard or in the MCP reply. Codex can prepare the post; the publish step is yours.

### What if my Instagram Page is in draft mode?

Open the Facebook Page connected to your Instagram account, publish it, then reconnect the Instagram account inside SceneSmith. Draft-mode Pages cannot be linked to a live Instagram account through the Instagram API.

### Can I use the Codex IDE extension or the ChatGPT desktop app instead of the CLI?

Yes. Codex CLI, the Codex IDE extension, and the ChatGPT desktop app all read the same `~/.codex/config.toml`. Add the `[mcp_servers.scenesmith]` block once and the same SceneSmith connection works in all three.

### What happens if the MCP server URL changes?

Update the `url` value inside `[mcp_servers.scenesmith]` in `~/.codex/config.toml` (or re-run `codex mcp add scenesmith --url URL`), restart Codex, and run `codex mcp list` to confirm the new endpoint. SceneSmith publishes its production endpoint on the [SceneSmith MCP connection page](/mcp); if the URL ever changes, that page is the source of truth.

## Sources

- [OpenAI Codex docs: Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp) — Codex CLI, IDE extension and ChatGPT desktop app support for Streamable HTTP MCP servers and shared `config.toml` configuration.
- [OpenAI Codex developer docs: connect Codex to an MCP server](https://developers.openai.com/codex/extend/mcp) — `codex mcp add NAME --url URL` CLI syntax and the `~/.codex/config.toml` block.
- [Meta: Instagram Platform overview](https://developers.facebook.com/docs/instagram-platform/) — Instagram Graph API requires a Business or Creator account and a connected Facebook Page for publishing endpoints.
- [Meta: Instagram Graph API reference](https://developers.facebook.com/docs/instagram-api/) — current publishing endpoints, required scopes, and rate-limit notes for the Instagram API.
- [SceneSmith connections guide](/connections) — production MCP endpoint and the OAuth steps Codex, ChatGPT, Cursor, VS Code and Devin follow.
- [SceneSmith MCP server page](/mcp) — tool list, safety test sequence, and the difference between custom MCP connections and public directory listings.