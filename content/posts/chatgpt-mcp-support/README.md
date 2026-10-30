---
title: "How to add an MCP server to ChatGPT (and the plan you need)"
description: "The current clicks for adding a custom MCP server in ChatGPT, which plan OpenAI documents, and what to do when your account cannot add one."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-15"
updated: "2026-10-30"
primaryKeyword: "how to add mcp server to chatgpt"
image: "/blog/chatgpt-mcp-support-hero.webp"
imageAlt: "A large deep teal rounded square joined by a vivid orange rounded block to a vivid orange crescent on a cream background."
---

OpenAI's help page for connecting custom MCP servers (read 2026-10-30) gives one current route inside ChatGPT: open **Plugins**, select the plus button, choose **Add custom MCP server**, enter the server's public HTTPS endpoint, set up authentication, acknowledge the risk warning, and select **Create as a plugin**. The same page says that in the current Plugins experience "you don't need to turn on Developer Mode first", which retires the step most older tutorials still lead with.

Two things decide whether that route exists for you. **Availability:** the page states that "Custom MCP server connections and full MCP support are available for ChatGPT Business and Enterprise/Edu customers on ChatGPT web", and its FAQ adds that Pro users "can connect custom MCP servers with read/fetch permissions". **Surface:** the page's answer for mobile is "No - web only", so the phone app cannot add a server at all.

If your account cannot add one, or you need a write action such as publishing a social post, the practical route is a client that holds its own MCP configuration. OpenAI's Model Context Protocol documentation lists the ChatGPT desktop app, Codex CLI and the IDE extension as clients that "support MCP servers and share MCP configuration for the same Codex host".

## The steps OpenAI documents today

The route below is the Plugins experience on ChatGPT web, quoted from the help page read on 2026-10-30. It assumes a Business or Enterprise/Edu workspace.

1. **Confirm you are allowed to create the connection.** On Business, "only admins and owners can create and publish plugins for custom MCP servers". On Enterprise/Edu, admins and owners create and test, and admins can use role-based access control to grant selected members permission to create connections to custom MCP servers. The permission is named **Create plugins with MCPs**.
2. **Open Plugins** in ChatGPT and select the plus button.
3. **Select Add custom MCP server.** Enter a name and, optionally, a description.
4. **Add the connection.** Paste the server's public HTTPS MCP endpoint. If the server runs on a private network, on-premises or on a developer machine, select **Tunnel** and choose an available Secure MCP Tunnel or enter its `tunnel_id` instead.
5. **Configure authentication.** If the server uses OAuth, check first that your provider issues refresh tokens. OpenAI's page warns that without refresh-token renewal, "ChatGPT may lose access after the original authorization expires because refresh-token renewal may be unavailable", and users then have to reauthenticate.
6. **Read the risk warning** and select the **I understand and want to continue** checkbox. Then select **Create as a plugin**.
7. **Review the discovered tools and metadata**, then install the plugin, start a new conversation, type `@` in the prompt box and select the plugin. Try a prompt and confirm any action ChatGPT asks you to confirm.
8. **Publish it for the workspace** if you are the admin rolling this out: Admin console → the workspace → Plugins → Manage Legacy Apps → Drafts → Publish. Enterprise/Edu admins can set which actions are allowed with **Configure Actions**, and who gets access with **Configure Access**.

There is also a legacy path, still documented: Workspace settings → Apps → Create for admins and owners, or user settings → Apps → Create for authorised users, then the endpoint and metadata, an authentication choice, **Scan Tools**, and **Create**. A legacy draft appears in Workspace Settings → Apps → Drafts, or under Settings → Apps → Enabled Apps with a **Dev** label. If you are following an older guide that starts with Security and login → Developer Mode, that article is describing the route OpenAI has since replaced.

## Which plan can add a custom MCP server

This is where most attempts stop, so it is worth reading before you hunt for a missing button. These are the plan statements on the same help page, read 2026-10-30:

- **Business:** custom MCP server connections and full MCP support are available on ChatGPT web. Only admins and owners create and publish; members use what an admin published.
- **Enterprise/Edu:** the same availability, plus RBAC. Admins and owners create and test, admins can grant the creation permission to selected members, and "only admins and owners can publish apps for the workspace".
- **Pro:** the FAQ says "Full MCP is only available for Business and Enterprise/Edu users, currently. Pro users can connect custom MCP servers with read/fetch permissions." Read/fetch means the assistant can look things up through the server; it cannot publish, because sending a post is a write action.
- **Plus:** the article never uses the word. That is not a documented yes and not a documented no — it means OpenAI has not published a Plus rule on this page. Do not build a publishing workflow on the assumption that it works; check your own account for the plus button inside Plugins, and if it is not offered, treat Plus as unsupported for this task rather than as a bug.
- **Deep research and company knowledge:** both are read/fetch only. OpenAI's FAQ says deep research can use custom apps "but for read/fetch actions only - not for write actions".

![A decision flowchart: adding MCP to ChatGPT splits on whether the workspace is Business, Enterprise or Edu; the yes branch goes to Plugins and Add custom MCP server, the no branch goes to a Codex host — desktop app, Codex CLI or IDE — and both paths end at authorize, then test.](/blog/chatgpt-mcp-support-route-by-plan.webp)

## Add the server to a Codex host instead

A client connection is the route that works without a workspace admin, and it is the one to use when a plan limit or a personal account blocks the ChatGPT route.

1. **Open the configuration.** The file is `~/.codex/config.toml`; you can also scope servers to one trusted project with `.codex/config.toml`. The ChatGPT desktop app, Codex CLI and the IDE extension share this configuration, so you set a server up once.
2. **Add the server.** With the CLI:

   ```bash
   codex mcp add scenesmith --url https://app.scenesmith.design/api/mcp
   ```

   Or write the block yourself:

   ```toml
   [mcp_servers.scenesmith]
   url = "https://app.scenesmith.design/api/mcp"
   ```

3. **Restart the client** so it reads the change, then confirm the server is registered with `codex mcp list`.
4. **Authorise it.** A server that requires OAuth finishes the connection through a browser prompt; until that completes, the tool list can stay empty even though the endpoint is correct.

OpenAI's developer documentation describes both STDIO servers and Streamable HTTP servers for these clients, with bearer token or OAuth authentication, so a hosted server and a locally run one are configured in the same place.

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

Two confirmations exist, and both are deliberate. ChatGPT can ask you to confirm before a write action, and SceneSmith shows the exact draft, media, destination and time for approval before anything is published or scheduled. Read the version you are approving — the caption, the image or video, the handle and the time zone — then check the delivery record afterwards. A draft is not a scheduled post, and a scheduled post is not a published one; the [batch guide](/blog/batch-create-social-media-posts) walks through the same review order when you approve several drafts at once.

## Check the connection before you trust it

- **Nothing here is verified by OpenAI.** The help page says "custom MCP servers are not developed or verified by OpenAI, and are third-party services that are subject to their own terms and conditions". Only connect a server whose owner you trust.
- **Write actions sit behind a confirmation.** OpenAI's developer documentation states that "ChatGPT currently requires manual confirmation in any conversation before write actions can be taken", and the help page adds that some especially risky actions "may be blocked instead of being presented for approval".
- **A server can be published with a misleading tool label.** Because a tool can describe itself, read the tool name and description before you approve an action, not just the prompt.
- **Tools are a frozen snapshot.** After an admin approves a server, ChatGPT "uses a 'frozen' snapshot of its available tools", so a tool the server adds later will not appear until an admin refreshes the tool list from the workspace app settings. A tool definition that changed after approval can make calls error instead.

## When the option is missing

- **The plus button is not there.** Check the plan and the surface first: connecting a custom MCP server is documented for Business and Enterprise/Edu on ChatGPT web, and the page says it is web-only. On a personal account, use a client that takes MCP servers directly.
- **You are not the admin.** On Business, only admins and owners create and publish custom connections. Ask an admin to review the risk warning and publish the server for the workspace.
- **The server runs on your laptop or a private network.** ChatGPT connects to remote servers, not local processes; OpenAI's answer is Secure MCP Tunnel. The alternative is a client that starts a local STDIO server.
- **A tool you need is missing after an update.** The approved tool list is a frozen snapshot. An admin has to refresh the actions from the workspace app settings before the new tool appears.
- **You tried the IDE extension and no plugin appeared.** The IDE extension supports MCP servers, so add the endpoint as a remote MCP server in its configuration instead of looking for a directory entry.
- **You are looking for SceneSmith in the plugin directory.** The public listing is still pending review, and approval is separate from connecting a custom client. The same production endpoint works now in the clients listed in the [connection guide](/connections); [linking ChatGPT to Instagram](/blog/link-chatgpt-to-instagram) covers the Instagram-specific preconditions once the connection is live.

## Questions readers ask

### How do I add an MCP server to ChatGPT?

On ChatGPT web in a Business or Enterprise/Edu workspace, open **Plugins**, select the plus button, choose **Add custom MCP server**, enter the server's public HTTPS endpoint or a Secure MCP Tunnel, configure authentication, acknowledge the risk warning and select **Create as a plugin**. Older guides that start with Developer Mode describe a route OpenAI no longer requires.

### Do I need to turn on Developer Mode to add an MCP server?

No. OpenAI's page says: "In the current Plugins experience, add a custom MCP server directly from Plugins. You don't need to turn on Developer Mode first." Developer Mode appears in older write-ups and in some tutorials still ranking for this question.

### Does ChatGPT Plus support custom MCP servers?

OpenAI's help page does not say. It names Business and Enterprise/Edu for full MCP support and Pro for read/fetch connections, and the word Plus never appears in the article read on 2026-10-30. Treat Plus as undocumented for this task and check whether the add-server button appears in your own Plugins menu instead of assuming either answer.

### Which plan can actually publish, not just look things up?

Any plan where the connection has write actions, which today means the full MCP support OpenAI documents for Business and Enterprise/Edu on ChatGPT web. Pro is limited to read/fetch, and publishing a post is a write. If you are on a personal plan, connect the server to a Codex host — the desktop app, Codex CLI or IDE extension — where the connection is yours to configure.

### Can I add a custom MCP server in the ChatGPT mobile app?

No. OpenAI answers the mobile question with "No - web only" for custom MCP server connections. Plugins that already exist are a different case, so check whether you are adding a new server or using a published one before looking for the button on a phone.

### Can ChatGPT connect to an MCP server running on my own computer?

Not directly. ChatGPT connects to remote MCP servers, and OpenAI's suggested route for a server on a private network or a developer machine is Secure MCP Tunnel. Locally started STDIO servers belong to the client path — the desktop app, Codex CLI or an IDE extension.

### Does ChatGPT publish a post as soon as the connector is connected?

No, and two approval steps sit in front of it. OpenAI states that ChatGPT requires manual confirmation before write actions, and SceneSmith shows the exact draft, media, destination and time for approval before publishing or scheduling. If you want the assistant to draft without sending, say so in the prompt and stop at the preview.

### Is SceneSmith's ChatGPT plugin published yet?

No. SceneSmith's [connection guide](/connections) says directory review is still pending and that approval is separate from connecting a custom MCP client. Until it is approved, connect the production endpoint `https://app.scenesmith.design/api/mcp` in a client that accepts a remote MCP server, or use the web composer. The [ChatGPT-to-LinkedIn connector guide](/blog/chatgpt-connector-to-linkedin) covers the destination side of the same connection.

## Sources

- [OpenAI Help Center: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) — read 2026-10-30. Source for the Plugins → plus → Add custom MCP server steps, the Secure MCP Tunnel option, the OAuth refresh-token warning, the Business and Enterprise/Edu availability line, the Pro read/fetch FAQ answer, the web-only mobile answer, the confirmation and blocked-action wording, the frozen tool snapshot, and the risk warning that custom MCP servers are not verified by OpenAI.
- [OpenAI: Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp.md) — read 2026-10-30. Source for the ChatGPT desktop app, Codex CLI and IDE extension supporting MCP servers and sharing one MCP configuration, the `~/.codex/config.toml` and project `.codex/config.toml` paths, and the STDIO and Streamable HTTP server options.
- [OpenAI: Building MCP servers for plugins and API integrations](https://developers.openai.com/api/docs/mcp.md) — read 2026-10-30. Source for the requirement of manual confirmation before write actions, for custom MCP servers being third-party services not developed or verified by OpenAI, and for the warning that a server can mislabel a write action as read-only.
- [SceneSmith: connection guide](/connections) — read 2026-10-30. Source for the production MCP endpoint, the clients listed today (ChatGPT, Codex, Cursor, VS Code, Devin), the OAuth step, the setup-status prompt, and the note that directory review is pending.
- [SceneSmith: MCP server page](/mcp) — read 2026-10-30. Source for the production endpoint, the client configuration examples, and the note that directory review is separate from connecting a custom client.
