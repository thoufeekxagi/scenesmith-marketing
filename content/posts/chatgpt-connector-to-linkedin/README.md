---
title: "ChatGPT connector to LinkedIn: what it does and how to set it up"
description: "A ChatGPT-to-LinkedIn connector can only publish if it exposes write tools you approve. Here is the setup, the confirmation step and the checks that matter."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-12"
updated: "2026-10-12"
primaryKeyword: "chatgpt connector to linkedin"
image: "/blog/chatgpt-connector-to-linkedin-hero.webp"
imageAlt: "A large teal speech bubble joined by an orange connector and two round nodes to a rounded card with a white circle on a cream background."
---

A connector is the difference between ChatGPT writing a LinkedIn post and your LinkedIn account actually receiving one. In OpenAI's current developer documentation, a custom MCP server is added to ChatGPT as a plugin, it can expose both read and write tools, and write actions require your confirmation in the conversation before they run. That confirmation is the real publishing gate, and it is the part most people never see until they have already connected something.

If you only need to queue a post you wrote yourself, you do not need a connector. LinkedIn's own composer schedules a post between 10 minutes and three months ahead, free, from your account. A connector earns its place when the draft starts inside ChatGPT, when one post has to reach more than one destination, or when you want the draft, the approval and the delivery result kept together.

## What a ChatGPT connector to LinkedIn actually does

Connectors are built on the Model Context Protocol (MCP), which OpenAI's documentation describes as the open protocol for connecting models over the internet to new data sources and capabilities. Adding a remote MCP server to ChatGPT does not teach ChatGPT about LinkedIn. It gives the model a set of named tools it may call, and every tool is either a read action, which retrieves something, or a write action, which changes something.

That distinction answers the question people ask most: does connecting ChatGPT to LinkedIn post things by itself? No. Only a write tool can publish, and only after you approve that specific call. A connector that exposes read tools can report on a profile or a Page and still have no ability to post.

Authorization is the second half. A connector holds an OAuth grant from you, and on LinkedIn's side the Posts API is explicit about what that grant covers: `w_member_social` posts on behalf of an authenticated member, while `w_organization_social` posts on behalf of an organization and is restricted to members who hold the ADMINISTRATOR, CONTENT_ADMIN or DIRECT_SPONSORED_CONTENT_POSTER role on that Page. If a connection claims it can post as your Page and you hold none of those roles, a new token will not fix it.

## How to add a connector to ChatGPT

OpenAI's page on adding a custom MCP server is short. On ChatGPT on the web:

1. Open ChatGPT Plugins and select the plus button, then **Add custom MCP server**.
2. Enter a name and, optionally, a description. Under **Connection**, enter the server URL, or choose **Tunnel** if the server uses a Secure MCP Tunnel.
3. Configure authentication. The documented options are OAuth, no authentication, or a mixed mode where the initialize and list-tools calls are open and the tools themselves require OAuth.
4. Read the risk warning, then select **I understand and want to continue**.
5. Select **Create as a plugin**. The plugin lands in your personal plugins, or in the workspace where you created it, and must be installed before you can use it in a conversation.
6. In a chat, type `@` and select the installed plugin, or name it explicitly. OpenAI's own prompting guidance is to be literal: name the app and the tool, and state which tools must not be used.

Two limits on the same page are worth knowing before you plan a workflow. Adding and using custom MCP servers happens on ChatGPT on the web, and workspace permissions and security restrictions, Lockdown included, apply to it. The supported MCP protocols are SSE and streaming HTTP.

A hosted connector follows the same shape. SceneSmith's documented path is its production MCP endpoint, `https://app.scenesmith.design/api/mcp`, plus an OAuth 2.1 authorization prompt; the [connection guide](/connections) and the [MCP page](/mcp) list the clients that can connect today: ChatGPT, Codex, Cursor, VS Code and Devin, and other MCP-compatible clients. Anything outside that list is undocumented, so treat it as untested rather than supported. Two useful checks live on those pages: use an HTTPS-capable client that supports server-sent events or streamable HTTP, and never paste a bearer token or provider secret into a client configuration.

## The confirmation step is the publishing gate

![Three shapes joined left to right: a dark card, an orange diamond gate and a rounded tray, linked by a thin orange connector.](/blog/chatgpt-connector-to-linkedin-approval-path.webp)

Write actions in ChatGPT require confirmation by default. Tools that do not carry the read-only annotation are treated as write actions, and you can expand a tool call to inspect the JSON payload that will be sent before you approve it. OpenAI also lets you remember an approve or deny choice for one tool for the rest of a conversation, with its own caution attached: only do that for a tool whose later write actions you are willing to accept without seeing them.

Read that next to the risk guidance in the same documentation. It tells users to review write actions carefully "to ensure they were intended and do not contain any data that shouldn't be shared," because a write action can alter or share data, and because a server can mislabel what it does. Practically, the confirmation prompt is the last place you see the exact text, the media, the destination and the time before a post leaves your account. Treat it as the review, not a formality to click through.

SceneSmith expresses the same idea as a draft-first flow in its own interface: create a draft without publishing, preview the exact text, media, destination and timing, then approve only the version you read and check the delivery receipt afterwards. If your assistant can save a draft but not schedule it, that is still a working setup: you keep the writing inside the chat and the publishing decision outside it.

## What LinkedIn allows, so you can pick a time

LinkedIn's schedule-posts help page, read on 2026-10-12, says a member's post can be scheduled anywhere from 10 minutes to three months ahead. The scheduled time is converted to UTC using your device's time zone setting, so a post planned while travelling is worth re-checking in the composer before you confirm. The same page lists Events and Jobs as post types that cannot currently be scheduled.

LinkedIn Pages follow different rules. The Page help page says a super admin or content admin can schedule a post from one hour to three months ahead, and that scheduled Page posts can be posted immediately, edited, rescheduled or deleted afterwards. If your connector publishes to a Page, confirm the destination the connector authorized is the Page and not your personal profile, and confirm that the person who granted the connection holds a role that can post. When a LinkedIn publishing call fails on permissions, the documented cause is exactly that: a missing OAuth scope, or a member without the necessary Page role.

## How to check a connection before a real post

Run this once in a fresh conversation, before anything is scheduled:

- Ask the connector to show setup status. Confirm the identity, the workspace and the destination handles it reports.
- Create a draft with no schedule attached, and read the full text of it.
- Open the write action's details and check the payload: text, media, destination and time.
- Approve the test only if you would be content to see it live. Otherwise deny, edit, and try again.
- After a real post goes out, find the delivery result. Scheduled and published are different states, and a queued item is not proof of delivery.

## Where a connector is not the answer

If you publish to one LinkedIn destination and you write the words yourself, LinkedIn's scheduler is free and already has a queue; the guide to [scheduling LinkedIn posts for free](/blog/schedule-linkedin-posts-free) covers that path. A connector is worth the setup when the draft starts in ChatGPT: the guide to [scheduling a LinkedIn post from ChatGPT](/blog/chatgpt-linkedin-posts) walks through the drafting and review side. The connector is the plumbing underneath both.

One status note, because it is easy to overstate: connecting a custom MCP server is separate from being listed in a public directory. SceneSmith's public directory submission is still in review, so the connection route documented here is the custom-connector route, not a published directory listing.

## Questions readers ask

### Can ChatGPT post to LinkedIn on its own?

No. ChatGPT can write the post, but publishing needs a connector that exposes a write tool and an authorization from you to the destination. Without one, you are copying the text into LinkedIn yourself.

### What does connecting ChatGPT to LinkedIn actually do?

It adds named tools to the conversation and lets you call them. Read tools retrieve information; write tools create or change something. Each write action still needs your confirmation before it runs, so a connection is not a standing permission to publish.

### Why does ChatGPT ask me to confirm before it posts?

Because write actions require confirmation by default, and any tool without a read-only annotation is treated as a write action. The prompt is your last look at the exact text, media, destination and time before the post leaves your account.

### Which clients can connect to SceneSmith today?

SceneSmith's connection guide lists ChatGPT, Codex, Cursor, VS Code and Devin, plus other MCP-compatible clients. Your client must support MCP initialization and OAuth 2.1 with PKCE. A client the guide does not name should be treated as untested.

### How far ahead can a LinkedIn post be scheduled?

LinkedIn's help says a member post can be set from 10 minutes to three months ahead, with the time converted to UTC using your device's time zone, and that Events and Jobs cannot be scheduled. Page posts can be scheduled one hour to three months ahead by a super admin or content admin. Check the composer or your connector, because platform limits change.

### Can a connector publish to my LinkedIn Page instead of my profile?

Only if you authorize that destination and you hold a Page role that can post. LinkedIn's Posts API restricts the organization scope to members with the ADMINISTRATOR, CONTENT_ADMIN or DIRECT_SPONSORED_CONTENT_POSTER role, while the member scope covers posting on behalf of an authenticated member.

### What happens if the connection has no access to my LinkedIn account?

You will see the draft and nothing will publish, because the tool call fails on authorization. Complete the connector's OAuth prompt from the account that holds the LinkedIn destination, then run the setup-status check again before scheduling anything.

### Do I need a connector to schedule a LinkedIn post?

No. LinkedIn's own composer schedules a post from 10 minutes to three months ahead at no cost. A connector is for keeping the draft, the approval and the delivery record in one place when the work starts in an AI chat.

## Sources

- [Add custom MCP server](https://developers.openai.com/api/docs/guides/custom-mcp-server) — OpenAI developer documentation: adding a custom MCP server as a plugin, read and write tools, web-only access, workspace restrictions, authentication options, confirmation behaviour. Retrieved 2026-10-12.
- [Building MCP servers for plugins and API integrations](https://platform.openai.com/docs/mcp) — OpenAI developer documentation: MCP as the connection standard, manual confirmation before write actions, and write-action risk guidance. Retrieved 2026-10-12.
- [LinkedIn Help: Schedule posts](https://www.linkedin.com/help/linkedin/answer/a1347212) — member scheduling window, UTC conversion, unsupported post types. Retrieved 2026-10-12.
- [LinkedIn Help: Scheduled posts for LinkedIn Pages](https://www.linkedin.com/help/linkedin/answer/a548192/scheduled-posts-for-linkedin-pages) — Page admin roles and the one-hour minimum. Retrieved 2026-10-12.
- [LinkedIn Marketing API: Posts API permissions](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api) — `w_member_social`, `w_organization_social` and the Page roles that scope requires. Retrieved 2026-10-12.
- [SceneSmith connection guide](/connections) and [MCP connections page](/mcp) — supported clients, production endpoint, OAuth 2.1 with PKCE, and the safe first test. Read 2026-10-12.
