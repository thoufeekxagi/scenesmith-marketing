---
title: "Can you link ChatGPT to Instagram? What works today"
description: "Yes, through an MCP connector, and two checks decide whether it works for you: the ChatGPT surface you use and the Instagram account you connect."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-14"
updated: "2026-10-14"
primaryKeyword: "can you link chatgpt to instagram"
image: "/blog/link-chatgpt-to-instagram-hero.webp"
imageAlt: "A large deep teal speech bubble beside a vivid orange rounded square on a cream background."
---

Yes. ChatGPT can reach Instagram through an MCP connector, and SceneSmith is one of those connectors: you draft the post in the conversation, the assistant returns a preview, and SceneSmith publishes or schedules it to the Instagram account you authorised. Two things decide whether the link works for you — the ChatGPT surface you connect from, and the type of Instagram account you connect. One of Meta's two Instagram API setups also requires that account to be linked to a Facebook Page, and the other one does not.

There is one honest limit today. SceneSmith's public plugin listing is still in review, so ChatGPT on the web cannot install it from the plugin directory yet. The same production MCP endpoint works now in the ChatGPT desktop app, in Codex, Cursor, VS Code and Devin — the clients listed in SceneSmith's [connection guide](/connections).

## What "linking ChatGPT to Instagram" actually means

There is no Instagram account inside ChatGPT, and no setting in ChatGPT that hands it your Instagram password. A link is a connector: a hosted server that advertises tools, plus an authorisation step where you sign in and approve the scopes it asks for.

- **The connector holds the account access, not the model.** You complete Meta's OAuth flow inside SceneSmith, and SceneSmith stores the Instagram access token. ChatGPT only ever sees tools, drafts and results.
- **Never paste credentials into a chat or a config file.** SceneSmith's [connection guide](/connections) repeats the same rule on every client tab: no bearer token, provider secret or client secret belongs in a client configuration, and support asks for the account email, workspace and provider handle instead.
- **Publishing is your decision, not the assistant's.** The flow SceneSmith documents is draft, preview, approve, then publish or schedule — the [pricing page](/pricing) describes it as one approval before every post, and the [support page](/support) requires an exact preview and explicit approval before anything public goes out.

If you are connecting LinkedIn later, the mechanics are the same and the destination checks are different; [the ChatGPT-to-LinkedIn connector guide](/blog/chatgpt-connector-to-linkedin) covers that side.

## The Instagram account you need first

Meta's [Instagram Platform overview](https://developers.facebook.com/docs/instagram-platform/overview) (page header: *Updated Sep 28, 2026*, read 2026-10-14) says plainly that there are two API configurations, and the difference is what decides the Facebook Page question:

- **Instagram API with Instagram Login** serves Instagram professional accounts *without* requiring a linked Facebook Page. It signs the user in with Instagram credentials, uses `graph.instagram.com`, and the `instagram_business_*` permission family.
- **Instagram API with Facebook Login** serves Instagram professional accounts *linked to a Facebook Page*. It signs the user in with Facebook credentials, uses `graph.facebook.com`, and the `instagram_*` permission family with Page permissions.

Both configurations list content publishing as supported, so neither path is the "wrong" one — they simply carry different preconditions. What is identical on both: the account must be an **Instagram professional account (Business or Creator)**. Meta's platform is built for professional accounts, and a personal profile is not served by the publishing endpoints at all.

The practical check for you:

1. **You signed in to the connection with Instagram credentials.** You are on the Instagram-Login path, and no Facebook Page is involved. Meta documents it as an API setup that "does not require a Facebook Page to be linked to the Instagram professional account" ([Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login), *Updated Jan 21, 2025*, read 2026-10-14).
2. **The connection opened Facebook Login.** You are on the Facebook-Login path, and the linked Page is a real requirement — the account you publish to is reached through that Page.

If you already manage a Page that is linked to the Instagram account, both paths work for you. If you do not, path 1 is the one that can connect today, so it is worth checking before you convert anything.

## Linking it in four steps

### Step 1 — Choose a ChatGPT surface that can reach an MCP server

![A deep teal rounded block overlapping a dark teal square, with a vivid orange block beside them on a cream background.](/blog/link-chatgpt-to-instagram-step-01.webp)

OpenAI's [Model Context Protocol page](https://learn.chatgpt.com/docs/extend/mcp) (read 2026-10-14) states that the ChatGPT desktop app, the Codex CLI and the IDE extension support MCP servers and share MCP configuration for the same Codex host, while ChatGPT on the web uses remote MCP-backed tools supplied by plugins. OpenAI's [plugins page](https://learn.chatgpt.com/docs/plugins) (read 2026-10-14) describes one universal plugin directory used by both ChatGPT and Codex, browsed from the **Plugins** tab.

So the fastest route today is the ChatGPT desktop app, Codex, Cursor, VS Code or Devin: add `https://app.scenesmith.design/api/mcp` as a Streamable HTTP server, then restart the client. The [connection guide](/connections) prints the exact JSON block for Cursor-style clients and for clients that use a `servers` map with an explicit transport type.

### Step 2 — Connect the Instagram account inside SceneSmith

![A deep teal rounded card holding a cream circle, joined to a vivid orange rounded card on a cream background.](/blog/link-chatgpt-to-instagram-step-02.webp)

Sign in at [app.scenesmith.design](https://app.scenesmith.design), open the Instagram connection, and complete Meta's OAuth prompt. Confirm the exact handle you want to publish to rather than assuming every account you own is available. If the account is still a personal profile, switch it to Business or Creator in the Instagram app first, then reconnect — that conversion is done on Instagram's side, not in SceneSmith.

### Step 3 — Verify the link before you draft anything

![A deep teal speech bubble beside a vivid orange rounded square containing a large cream check mark, on a cream background.](/blog/link-chatgpt-to-instagram-step-03.webp)

Ask the assistant: `Show my SceneSmith setup status.` The reply should name your Google identity, the workspace, and the authorised destination handles. If the tool list comes back empty or the client asks for OAuth again, finish the browser authorisation the server returns and repeat the prompt. This one check prevents the most common false start: a connection that looks finished but has no approved account behind it.

### Step 4 — Draft, read the preview, approve

![Two large overlapping rounded rectangles, one deep teal and one vivid orange, on a cream background.](/blog/link-chatgpt-to-instagram-step-04.webp)

Ask for one Instagram post at a time: the caption, the image or Reel, the destination handle, and the time if you want it scheduled. Read the draft card the way a customer would — line breaks, hashtags, links, the media file, the account, the publish-or-schedule action. Approve only the version you actually read, then check the delivery result afterwards. A queued post and a published post are different states; the [batch guide](/blog/batch-create-social-media-posts) walks through the same review order when you are approving several drafts in one sitting.

If you would rather see the Instagram flow end to end from Codex, [the Codex-to-Instagram walkthrough](/blog/codex-instagram-publishing) follows the same connection with Codex-specific prompts and errors.

## When the link fails

- **"Missing Instagram professional account."** The linked account is still personal. Convert it to Business or Creator, relink it inside SceneSmith, then retry.
- **A Facebook Page is being requested and the account has none.** You are on the Facebook-Login path. Link the Instagram account to a Page you manage, or ask SceneSmith support whether the connection can authorise the Instagram-Login configuration instead. Do not invent a Page that the account is not linked to; Meta still validates the link.
- **Empty tool list, or the client keeps asking for OAuth.** The authorisation was never completed in the browser. SceneSmith's MCP server only lists publishing tools after OAuth, so finish that flow and run the setup-status prompt again.
- **An empty workspace, or no destinations listed.** The MCP authorisation and the website session are separate sign-ins. Sign in with the Google account that owns the workspace; if you see an empty workspace, sign out and return to the dashboard with the owner's account.
- **A delivery failure.** Use the delivery ID and correlation ID SceneSmith records instead of retrying immediately — the provider may already have accepted the post.

## Questions readers ask

### Can you link ChatGPT to Instagram without a Facebook Page?

Sometimes, and it depends on which of Meta's two configurations the connection uses. The Instagram-Login setup "does not require a Facebook Page to be linked to the Instagram professional account", while the Facebook-Login setup serves accounts that are linked to a Page. Both configurations support content publishing. If your Instagram account is already linked to a Page you manage, either path works; if it is not, the Instagram-Login path is the one that fits.

### Do you need a Business or Creator account to link it?

Yes, for publishing. Meta's platform serves Instagram professional accounts — business and creator — and publishing is supported on both configurations. A personal profile is not served by the publishing endpoints, so convert the account type in the Instagram app, relink it, and then ask ChatGPT for a draft.

### Is the SceneSmith plugin in ChatGPT's plugin directory yet?

No. SceneSmith's [connection guide](/connections) says the public directory listing is still in review, and that approval is separate from connecting a custom MCP client. Until it is approved, connect through a client that accepts a custom remote MCP server: the ChatGPT desktop app, Codex, Cursor, VS Code or Devin.

### Does ChatGPT publish to Instagram on its own once it is linked?

No. The connector drafts and returns a preview, and SceneSmith publishes or schedules only after you approve the exact version you read. That approval is part of the product, not a setting you can switch off.

### Can you schedule the Instagram post instead of publishing now?

Yes. Put the time you want in the prompt, review the scheduled draft, and approve it; the app keeps the queue and the delivery record. If you only need to schedule something you already wrote inside Instagram, Instagram's own scheduler is free and may be enough — the connector earns its place when the drafting happens in your assistant.

## Sources

- [Meta: Instagram Platform overview](https://developers.facebook.com/docs/instagram-platform/overview) — page header *Updated Sep 28, 2026*, read 2026-10-14. Source for "two Instagram API configurations", the Facebook Page row (*Not required* for Instagram Login, *Required* for Facebook Login), content publishing being supported on both, the login credentials, API hosts and permission families.
- [Meta: Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login) — page header *Updated Jan 21, 2025*, read 2026-10-14. Source for the quoted sentence that this setup does not require a linked Facebook Page.
- [OpenAI: Plugins](https://learn.chatgpt.com/docs/plugins) — read 2026-10-14. Source for the **Plugins** tab, the universal plugin directory shared by ChatGPT and Codex, plugins being unavailable in the IDE extension, and plugins that prompt you to connect an external service.
- [OpenAI: Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp) — read 2026-10-14. Source for ChatGPT web using remote MCP-backed tools supplied by plugins, and for the ChatGPT desktop app, Codex CLI and IDE extension supporting MCP servers that share configuration.
- [SceneSmith: connection guide](/connections) — read 2026-10-14. Source for the clients listed (ChatGPT, Codex, Cursor, VS Code, Devin), the production MCP endpoint, the safe first test, and the note that the public directory listing is still in review.
- [SceneSmith: MCP connections](/mcp) — read 2026-10-14. Source for the client-specific configuration blocks and the OAuth requirement before tools are listed.
- [SceneSmith: pricing](/pricing) — read 2026-10-14. Source for Instagram, X and LinkedIn being the live destinations and for approval before every post.
