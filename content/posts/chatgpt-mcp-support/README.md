---
title: "Does ChatGPT support MCP? Which plan and surface you need"
description: "OpenAI's current help page puts full MCP with write actions on Business and Enterprise/Edu web workspaces, and gives Pro read tools only. What to use."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-15"
updated: "2026-10-15"
primaryKeyword: "does chatgpt support mcp"
image: "/blog/chatgpt-mcp-support-hero.webp"
imageAlt: "A large deep teal rounded square joined by a vivid orange rounded block to a vivid orange crescent on a cream background."
---

Yes. ChatGPT supports MCP servers, but the rules depend on which surface you use and which plan the account is on, and OpenAI's current rules are narrower than most tutorials suggest.

OpenAI's help centre article [Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) (read 2026-10-15; the page's own update marker read "Updated: 16 hours ago" at the time it was read) states that "Custom MCP server connections and full MCP support are available for ChatGPT Business and Enterprise/Edu customers on ChatGPT web." The same page answers the plan question in its FAQ: full MCP is "only available to Business and Enterprise/Edu users, currently", while a Pro account "can connect custom MCP servers with read/fetch permissions". Connecting your own server is also web-only: the page's answer for mobile is "No - web only".

That matters if your goal is publishing. Sending a post to Instagram, LinkedIn or X is a write action by definition, so a read/fetch connection cannot finish the job. The two paths that can are a Business or Enterprise/Edu workspace on ChatGPT web, where an admin connects and publishes the server for the team, or a client that connects to MCP servers directly — the ChatGPT desktop app, Codex, Cursor, VS Code or Devin, the clients listed in [SceneSmith's connection guide](/connections).

## What OpenAI's documentation says today

Four primary sources describe the current state, and they are worth reading in this order:

- **Plan.** "Custom MCP server connections and full MCP support are available for ChatGPT Business and Enterprise/Edu customers on ChatGPT web" ([OpenAI Help Center](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt), read 2026-10-15). The FAQ adds that full MCP is only Business and Enterprise/Edu "currently", and that Pro users "can connect custom MCP servers with read/fetch permissions".
- **Who can connect.** On Business, "only admins and owners can create and publish" plugins for custom MCP servers. On Enterprise/Edu, admins and owners create and test, admins can grant the creation permission with role-based access control, and "only admins and owners can publish apps for the workspace". Members of the workspace then use what an admin has published.
- **Surfaces.** The same page states that connecting custom MCP servers is web-only. Separately, OpenAI's [Model Context Protocol page](https://learn.chatgpt.com/docs/extend/mcp.md) (read 2026-10-15) says that "ChatGPT web can use remote MCP-backed tools supplied by plugins" and that "the ChatGPT desktop app, Codex CLI, and IDE extension support MCP servers and share MCP configuration for the same Codex host".
- **Write actions and confirmation.** OpenAI's [developer page on MCP servers](https://developers.openai.com/api/docs/mcp.md) (read 2026-10-15) states that "ChatGPT currently requires manual confirmation in any conversation before write actions can be taken", that some especially risky actions may be blocked instead of offered, and that custom MCP servers "are not developed or verified by OpenAI". The same page warns that a server can mislabel a write action as read-only, which is one reason to connect only servers you trust.

Two smaller details decide a lot of support tickets. First, local servers: ChatGPT connects to remote servers, and the help page's answer for a server running on a private network is to use Secure MCP Tunnel rather than expecting a local process to be reachable. Second, tool snapshots: after an admin approves a server, ChatGPT "uses a "frozen" snapshot of its available tools", so a server that later adds a tool will not show it until an admin refreshes the connection.

If you have read an older guide that tells you to switch on Developer Mode first, note what OpenAI's page says now: "In the current Plugins experience, add a custom MCP server directly from Plugins. You don't need to turn on Developer Mode first."

## Three ways a server actually reaches ChatGPT

The three routes look similar in a screenshot and behave differently in practice.

- **A direct client connection.** In the ChatGPT desktop app, Codex CLI or an IDE extension, you add the server to that client's MCP configuration and reload it. OpenAI's MCP page lists both STDIO servers and Streamable HTTP servers, with bearer token or OAuth authentication. This route needs no workspace admin, which is why it is the fastest way to test whether a server does what its page claims.
- **The plugin directory.** OpenAI's [Plugins page](https://learn.chatgpt.com/docs/plugins.md) (read 2026-10-15) says plugins "work in Chat and Work across ChatGPT on the web, desktop, and mobile, and in Codex in the ChatGPT desktop app", that Codex CLI also has a plugin browser, and that "the IDE extension doesn't support plugins". Anything discoverable there is one install away, but directory approval is separate from connecting a custom client. SceneSmith's own listing is still in review, so the directory route is not the one to plan around yet.
- **A workspace custom connection on the web.** A Business or Enterprise/Edu admin opens Plugins, selects the plus button, chooses Add custom MCP server, pastes the server's HTTPS endpoint, configures authentication, acknowledges the risk warning, and creates the plugin. That is the route OpenAI documents for a team, and it is the only one that makes the tools available to colleagues without touching each person's client configuration.

## Which route fits your job

- **You publish from your own ChatGPT Pro account.** Custom MCP servers on the web are read/fetch only for Pro. Use a client that takes MCP servers directly — the ChatGPT desktop app, Codex, Cursor, VS Code or Devin — or draft in the assistant and finish in SceneSmith's own composer.
- **Your team is on Business, Enterprise or Edu.** An admin or owner connects SceneSmith once from Plugins and publishes it for the workspace. Everyone else installs the published plugin and selects it in a conversation.
- **You only need to look things up.** A read/fetch server is enough, and that is the case OpenAI currently documents for Pro and for deep research.

## Connect SceneSmith as an MCP server in four steps

### Step 1 — Pick a surface that can hold the connection

![A large deep teal circle beside a large vivid orange circle on a cream background.](/blog/chatgpt-mcp-support-step-01.webp)

Decide before you start whether this is a personal test or a workspace rollout. A personal test belongs in the ChatGPT desktop app, Codex, Cursor, VS Code or Devin, where you add the server yourself. A workspace rollout happens on ChatGPT web in a Business or Enterprise/Edu workspace, where an admin or owner connects the server and publishes it for everyone else. The [MCP page](/mcp) prints the endpoint and the client tabs; nothing about the server changes between them.

### Step 2 — Add the endpoint and finish the authorization

![A vivid orange plug with a short dark cable entering a deep teal frame around a cream square with an orange circle, on a cream background.](/blog/chatgpt-mcp-support-step-02.webp)

The production endpoint is `https://app.scenesmith.design/api/mcp`. In a workspace, that goes in through Plugins, the plus button and Add custom MCP server; in a client, it goes into that client's MCP configuration before a reload. Either way, the connection is not finished until the SceneSmith OAuth prompt completes in a browser. The server only advertises its publishing tools after that authorization, so an empty tool list usually means the browser step was never finished rather than that the endpoint is wrong.

### Step 3 — Verify the connection before you draft anything

![A large vivid orange circle holding a deep teal rounded square with a thick cream check mark, on a cream background.](/blog/chatgpt-mcp-support-step-03.webp)

Ask the assistant: `Show my SceneSmith setup status.` The reply should name the identity, the workspace and the destination handles you authorized. Check that list before you write a post, because the MCP authorization and the website session are separate sign-ins. If you see an empty workspace, you signed in with a different account.

### Step 4 — Approve the exact post, then check the delivery result

![A thick deep teal arrow pointing right across a large vivid orange rounded rectangle on a cream background.](/blog/chatgpt-mcp-support-step-04.webp)

Two confirmations exist, and both are deliberate. ChatGPT asks for manual confirmation before a write action, and SceneSmith shows the exact draft, media, destination and time for approval before anything is published or scheduled. Read the version you are approving — the caption, the image or video, the handle and the time zone — then check the delivery record afterwards. A draft is not a scheduled post, and a scheduled post is not a published one; the [batch guide](/blog/batch-create-social-media-posts) walks through the same review order when you approve several drafts at once.

## When the option is missing

- **The option is not there at all.** Check the plan and the surface first: connecting a custom MCP server is a Business and Enterprise/Edu feature on ChatGPT web, and the help page says it is web-only. On a personal Pro account, use a client that takes MCP servers directly.
- **You are not the admin.** On Business, only admins and owners create and publish custom connections. Ask an admin to review the risk warning and publish the server for the workspace.
- **The server runs on your laptop or a private network.** ChatGPT connects to remote servers, not local processes. OpenAI's answer is Secure MCP Tunnel; the alternative is a client that starts a local STDIO server.
- **A tool you need is missing after an update.** The approved tool list is a frozen snapshot. An admin has to refresh the actions from the workspace app settings before the new tool appears.
- **You tried the IDE extension and no plugin appeared.** The IDE extension supports MCP servers but not plugins, so add the endpoint as a remote MCP server there instead of looking for a directory entry.
- **You are looking for SceneSmith in the plugin directory.** The public listing is still in review. The same production endpoint works now in the clients listed in the [connection guide](/connections), and [linking ChatGPT to Instagram](/blog/link-chatgpt-to-instagram) covers the Instagram-specific preconditions once the connection is live.

## Questions readers ask

### Does ChatGPT support MCP servers?

Yes. OpenAI's current help page documents custom MCP server connections with full MCP support for ChatGPT Business and Enterprise/Edu workspaces on ChatGPT web, and its MCP documentation covers MCP servers in the ChatGPT desktop app, Codex CLI and the IDE extension. The restrictions are about plan, surface and who is allowed to publish the connection, not about whether MCP works.

### Which ChatGPT plan do I need to publish to Instagram or LinkedIn from ChatGPT?

Publishing is a write action, and OpenAI's FAQ currently limits full MCP to Business and Enterprise/Edu users, with Pro accounts able to connect custom MCP servers "with read/fetch permissions" only. If you are not in one of those workspaces, use a client that takes MCP servers directly — the ChatGPT desktop app, Codex, Cursor, VS Code or Devin — or draft in the assistant and finish in SceneSmith's composer. The page does not state rules for every tier, so confirm the button exists in your own account before promising the workflow to anyone else.

### Can I connect a custom MCP server in the ChatGPT mobile app?

No. OpenAI's help page answers that question with "No - web only" for custom MCP server connections. Plugins that already exist are a different case: OpenAI's Plugins page says plugins work on the web, desktop and mobile, so you can use a published plugin on a phone even though you cannot add a new custom server there.

### Can ChatGPT connect to an MCP server running on my own computer?

Not directly. ChatGPT connects to remote MCP servers, according to the same help page, and OpenAI's suggested route for a server on a private network or a developer machine is Secure MCP Tunnel. Locally started STDIO servers belong to the client path — the desktop app, Codex CLI or an IDE extension — not to the website.

### Does ChatGPT publish a post as soon as the connector is connected?

No, and two approval steps sit in front of it. OpenAI states that ChatGPT requires manual confirmation before write actions, and SceneSmith shows the exact draft, media, destination and time for approval before publishing or scheduling. If you want the assistant to draft without sending, say so in the prompt and stop at the preview.

### Is SceneSmith's ChatGPT plugin published yet?

No. SceneSmith's [connection guide](/connections) says the public directory listing is still in review and that approval is separate from connecting a custom MCP client. Until it is approved, connect the production endpoint `https://app.scenesmith.design/api/mcp` in a client that accepts a remote MCP server, or use the web composer. The [ChatGPT-to-LinkedIn connector guide](/blog/chatgpt-connector-to-linkedin) covers the destination side of the same connection.

## Sources

- [OpenAI Help Center: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) — read 2026-10-15; the page carried the marker "Updated: 16 hours ago". Source for full MCP support being available to Business and Enterprise/Edu customers on ChatGPT web, the Pro read/fetch limit, who can create and publish, adding a server from Plugins without Developer Mode, the risks of write actions and confirmation prompts, Secure MCP Tunnel, the web-only answer for mobile, and the frozen tool snapshot.
- [OpenAI: Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp.md) — read 2026-10-15. Source for "ChatGPT web can use remote MCP-backed tools supplied by plugins", for the desktop app, Codex CLI and IDE extension supporting MCP servers with shared configuration, and for the supported STDIO and Streamable HTTP server features.
- [OpenAI: Plugins](https://learn.chatgpt.com/docs/plugins.md) — read 2026-10-15. Source for the universal plugin directory, plugins working in Chat and Work on web, desktop and mobile plus Codex in the desktop app, the Codex CLI plugin browser, and the IDE extension not supporting plugins.
- [OpenAI: Building MCP servers for plugins and API integrations](https://developers.openai.com/api/docs/mcp.md) — read 2026-10-15. Source for the requirement of manual confirmation before write actions, for actions that may be blocked, for custom MCP servers being third-party services not verified by OpenAI, and for the warning that a server can mislabel a write action as read-only.
- [SceneSmith: connection guide](/connections) — read 2026-10-15. Source for the production MCP endpoint, the clients listed today (ChatGPT, Codex, Cursor, VS Code, Devin), the OAuth step, the setup-status prompt, and the note that the public directory listing is still in review.
