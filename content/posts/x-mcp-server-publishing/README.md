---
title: "Does X have an MCP server? What it can and cannot post"
description: "X runs two hosted MCP servers. What its own docs list as their tools, why there is no create-post tool, and how a post actually gets queued and published."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-20"
updated: "2026-10-20"
primaryKeyword: "does x have an mcp server"
image: "/blog/x-mcp-server-publishing-hero.webp"
imageAlt: "A deep teal keyhole-shaped arch on the left, a large orange square with a pale cream arrow curving up through it, and a pale teal quarter circle at the right edge, on a cream background."
---

Yes, X runs hosted MCP servers. It does not run one that posts to your timeline for you.

X's developer documentation (read 2026-10-20) lists two of them. The first is the **X MCP** server at `https://api.x.com/mcp`, a hosted Streamable HTTP server that you reach through the open-source `xurl mcp` bridge. The second is a **Docs MCP** server at `https://docs.x.com/mcp`, which searches X's documentation. X announced the hosted server on 30 June 2026.

That is the whole answer to "does X have an MCP server". The useful part is the next question: what can an assistant actually do with it, and where does a post get published from? X's own tool list answers both, and the answer is narrower than most people expect.

## What X's own documentation says the servers can do

The X MCP page groups the capabilities into six areas, all read on 2026-10-20:

- **Posts** — fetch posts, see likers, reposters and quoters, and read recent counts.
- **Search** — full-archive post search, user search and news search.
- **Users** — resolve the current user, look up by id or handle, read a user's posts, timeline and mentions.
- **Bookmarks** — list, add and remove bookmarks, and manage bookmark folders.
- **News and trends** — news stories, and trends for a location by WOEID.
- **Articles** — create draft Articles and publish them.

The docs MCP server is smaller still: two tools, `search_x` and `get_page_x`.

Note what those six areas have in common. Five of them read. The sixth publishes Articles, which is X's long-form Article format, not the composer most people mean when they say "post". The page is explicit about where writes sit: the OAuth user-context route is "required for writes (bookmarks, Articles) and any user-context tool", and its security section names the writes that count against rate limits as "bookmarks, `article_publish`".

There is no create-post, reply or thread tool anywhere in the documented surface.

## Why "X has an MCP server" is not "ChatGPT can post to X"

Three separate facts stack up here, and each one is checkable.

1. **The documented tool surface has no post-creation tool.** The "Posts" category is retrieval: fetch, counts, likers, reposters, quoters.
2. **The only publishing tool named is for Articles.** `article_publish` appears in the rate-limit note, not a timeline composer.
3. **The Create Posts API endpoint documents no scheduling.** The [Create Posts endpoint page](https://docs.x.com/x-api/posts/create-post) (read 2026-10-20) describes creating a post; it says nothing about scheduling one. The only occurrence of "schedule" on that page is inside a permission description for X calls, which is a different product.

So if your goal is "draft in ChatGPT, check the wording, queue it for tomorrow morning", X's MCP server is not the bridge that does it. An assistant connected to it can research your topic, read your own timeline, and file bookmarks — and it can publish an Article — but a normal timeline post still has to be composed somewhere that exposes a create-post operation plus a scheduler.

If your question is really about scheduling, the routes are covered in [what X and OpenAI document about scheduling X posts](/blog/schedule-x-posts-chatgpt): X Pro holds a queue inside X, and a connected publisher holds one outside it.

## What connecting to X's MCP actually takes

This is where most people get stuck, because the server is hosted but the authorization is not self-service. From the same docs page, read 2026-10-20:

- **You need your own X developer app with OAuth 2.0 enabled.** The docs state it plainly: "There is no dynamic client registration, and `api.x.com/mcp` does not advertise native MCP OAuth discovery." The bridge exists because of that gap.
- **You register the redirect URI** `http://localhost:8080/callback` on the app, or set `REDIRECT_URI` and register that instead.
- **You put `CLIENT_ID` and `CLIENT_SECRET` in the client's config**, in an `env` block. If you run `xurl auth oauth2` by hand, export them in that shell first — they are not inherited from the client config.
- **You need Node.js** for the `npx` launcher, and a client config that sets a startup timeout of 300 seconds or more, because the MCP handshake is held while the first browser login finishes.
- **The app-only Bearer route is read-only.** You can point a client straight at `https://api.x.com/mcp` with a static Bearer token, and the docs say what you lose: "no auto-refresh and no user context (no actions as you)". That route cannot write.

One more detail worth reading twice, because it is the kind of thing that publishes to the wrong account: "The OAuth login authorizes whichever X account is logged in when the browser opens — not necessarily the account that owns the app." For a brand or secondary account, switch accounts in the browser before the login, or pass `-u` to pick a previously authorized user.

Writes go through that user-context route, are rate-limited more tightly than reads, and the docs tell you to expect occasional `429`s and back off.

## The route that does publish a normal post

A publishing MCP server is the other half of the picture: it holds your destination account, creates a draft, returns a preview, and then schedules or publishes the exact version you approved.

SceneSmith is one. Its hosted endpoint is `https://app.scenesmith.design/api/mcp`, and the [connection guide](/connections) lists the clients that can hold it today (read 2026-10-20): ChatGPT, Codex, Cursor, VS Code and Devin. The tool list the server returns (read 2026-10-20) includes `create_draft`, `preview_draft`, `schedule_draft`, `publish_draft_now`, `list_calendar`, `get_delivery_status` and `retry_failed_delivery`, with `x_text`, `x_images` and `x_video` as the X draft formats. That separation — a draft call, a preview call, a scheduling call — is the part X's MCP surface does not have.

The [MCP page](/mcp) describes what the server exposes. Three practical limits from the same two pages:

- A free SceneSmith workspace holds one workspace, up to three accounts per channel and three drafts with previews; scheduling and publishing need the trial or a paid plan ([pricing page](/pricing), read 2026-10-20).
- On ChatGPT, custom MCP servers and full MCP support are documented for Business and Enterprise/Edu on ChatGPT web, while Pro users "can connect custom MCP servers with read/fetch permissions" ([OpenAI's custom MCP article](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt), read 2026-10-20). Writes may trigger a confirmation prompt.
- The SceneSmith connection guide's X steps are to connect the account and authorize the server; unlike X's own MCP docs, it does not ask you to create an X developer app.

![A deep teal rounded square on the left with a small orange dot at its top right corner, joined by a thick orange horizontal bar reaching into a pale yellow panel on the right, on a cream background.](/blog/x-mcp-server-publishing-split-path.webp)

So the honest division of labour is: use X's MCP to read X, and use a publisher to write to it. Running both in one client is supported — they are separate servers with separate auth.

## How to check any of this yourself

Four checks, each a few minutes, in the order that answers the question fastest.

1. **List the tools before you trust a claim.** Run `npx -y @xdevplatform/xurl mcp https://api.x.com/mcp` in a terminal, complete the browser login, and read the tool list your client receives. You are looking for a tool that creates a post — not one that fetches posts, and not `article_publish`.
2. **Confirm which account is authorized.** Check the handle the OAuth login authorized before any write. X's docs warn that the browser session, not the app owner, decides this.
3. **Look for the scheduler in the endpoint docs, not the blog posts.** X's [Create Posts endpoint](https://docs.x.com/x-api/posts/create-post) is the primary source for whether scheduling is part of creating a post.
4. **On the publisher side, approve against the preview.** Ask for the setup status first, then create a draft, read the preview, and only then schedule. Read the delivery status afterwards instead of assuming the post went out.

If a client cannot reach X's server at all, the failure is usually configuration rather than protocol: unregistered redirect URI, missing `CLIENT_ID`/`CLIENT_SECRET`, or a startup timeout too short for the login. X's troubleshooting list covers each of those symptoms by name. If a publisher connection breaks after it used to work, the cause is different — start with [why a ChatGPT MCP connector stops working](/blog/chatgpt-mcp-connector-stopped-working).

## Questions readers ask

### Does X have an MCP server?

Yes. X documents two hosted MCP servers (read 2026-10-20): the X MCP server at `https://api.x.com/mcp`, reached through the `xurl mcp` bridge with your own X developer app, and a documentation server at `https://docs.x.com/mcp` with the tools `search_x` and `get_page_x`.

### Can X's MCP server post a tweet for me?

Not through any tool X documents. The documented capabilities are Posts, Search, Users, Bookmarks, News and Trends, and Articles; the writes named in the docs are bookmarks and `article_publish`, which publishes long-form Articles. There is no create-post or thread tool in that list, so a normal post still needs a client that exposes one.

### Why does X's MCP server need a local bridge instead of just a URL?

Because the server does not advertise native MCP OAuth discovery and X does not offer dynamic client registration. Your own X developer app has to hold the client identity, so the `xurl mcp` bridge runs locally, performs the OAuth 2.0 PKCE login once in a browser, caches the token in `~/.xurl` and injects a fresh Bearer token on each call.

### Can I connect to X's MCP server with just a Bearer token?

Only for reads. X documents an app-only Bearer route that points a client straight at `https://api.x.com/mcp` with an `Authorization` header, and states the trade-off: no auto-refresh and no user context, so the model cannot act as you. Writes need the OAuth 2.0 user-context route.

### Does X's MCP server support scheduling posts?

X's MCP documentation lists no scheduling tool, and the Create Posts API endpoint documents no scheduling parameter (both read 2026-10-20). Scheduling lives in X Pro or in a publisher that keeps its own queue — the comparison is in [the scheduling guide](/blog/schedule-x-posts-chatgpt).

## Sources

- [X developer docs: MCP servers for the X API and X developer docs](https://docs.x.com/tools/mcp.md) — read 2026-10-20. Source for both server URLs, the Streamable HTTP transport, protocol version `2025-06-18` and `serverInfo: xmcp`, the six capability groups, the two docs tools, the OAuth 2.0 PKCE bridge and its setup requirements, the absence of dynamic client registration and native MCP OAuth discovery, the app-only Bearer trade-off, the redirect URI, the 300-second startup timeout, the account-selection warning, and the sentence naming bookmarks and `article_publish` as the writes counted against rate limits.
- [X developer community: Announcing the hosted X MCP](https://devcommunity.x.com/t/announcing-the-hosted-x-mcp/269558) — posted 2026-06-30, read 2026-10-20. Source for the launch date and for the same capability list stated at announcement.
- [X API docs: Create Posts](https://docs.x.com/x-api/posts/create-post) — read 2026-10-20. Source for the claim that the endpoint documents no scheduling parameter.
- [OpenAI Help Center: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) — read 2026-10-20. Source for custom MCP servers and full MCP support being available to ChatGPT Business and Enterprise/Edu on ChatGPT web, Pro users connecting with read/fetch permissions, and confirmation being requested for write actions.
- [SceneSmith: connection guide](/connections) — read 2026-10-20. Source for the production endpoint, the client list today, the X connection steps, and the fact that the guide does not ask for an X developer app.
- [SceneSmith MCP server tool list](https://app.scenesmith.design/api/mcp) — `tools/list` read 2026-10-20. Source for the 25 tool names quoted above and for the `x_text`, `x_images` and `x_video` draft formats.
- [SceneSmith: pricing](/pricing) — read 2026-10-20. Source for the free workspace limits (one workspace, three accounts per channel, three drafts with previews) and for scheduling and publishing requiring the trial or a paid plan.
