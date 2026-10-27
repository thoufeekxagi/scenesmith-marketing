---
title: "Why ChatGPT asks for permission before an MCP tool runs"
description: "OpenAI's help page ties each confirmation prompt to app permissions and the action itself. What decides the prompt, and the part only an admin can switch off."
category: "ChatGPT guide"
author: "Thoufeek Baber"
published: "2026-10-26"
updated: "2026-10-26"
primaryKeyword: "chatgpt mcp always asks for permission"
image: "/blog/chatgpt-mcp-permission-prompts-hero.webp"
imageAlt: "Title card reading \"Why ChatGPT asks for permission before an MCP tool runs\", subtitled app permissions, action context and what an admin controls, on a cream background with teal and orange shapes."
---

If ChatGPT asks for confirmation nearly every time your connected server runs a tool, that is usually the permission model doing its job, not a broken connection. OpenAI's help page for custom MCP servers (read 26 October 2026) says ChatGPT "may ask for confirmation based on app permissions and the action's context", that this applies to "write or modify actions", and that "some especially risky actions may be blocked instead of being presented for approval."

Scheduling or publishing a post is that kind of write action — it changes something outside the chat — so a publishing connector is the case that prompts most often. The question worth answering is which of the prompts you can actually remove. On ChatGPT, most of them are decided by the app's approved action list, which is admin-side, not by a switch in the chat.

## The four things that decide whether you see a prompt

![Flowchart: plan and surface lead to the workspace role and the approved action list, then a decision on whether the call is a write call. A write call means ChatGPT confirms each call, then the post publishes; a read or fetch call takes the other branch.](/blog/chatgpt-mcp-permission-prompts-four-gates.webp)

Each gate is documented separately on that page, and they fail differently:

1. **Plan and surface.** Custom MCP servers and full MCP support are available on ChatGPT Business and Enterprise/Edu on web. Pro users "can connect custom MCP servers with read/fetch permissions", and the page answers "Can I connect custom MCP servers on mobile?" with a flat no. The [plan and surface guide](/blog/chatgpt-mcp-support) walks through which ChatGPT route can hold a connection.
2. **Who may create the connection.** The workspace permission that matters is called "Create plugins with MCPs". On Business, only admins and owners create and publish custom apps. On Enterprise/Edu, admins can grant creation rights to selected members with role-based access control, and "Only Admins/Owners can publish".
3. **Which actions the app may use.** Publishing a connection is where the action list is set, and it can be changed afterwards. This is the gate most people miss, and it is where a prompt can honestly be removed.
4. **The call itself.** For write or modify actions, confirmation depends on the app permissions and on the action's context, so two calls to the same server can differ.

## What an admin can change, and where

The page names two controls, and both live in workspace settings rather than in a conversation:

- **At publish time, Enterprise/Edu.** After selecting Publish, "Configure Actions" in the modal lets you select or deselect each action the app is allowed to take. The Refresh button pulls new actions from the server, "deselected by default", and Configure Access restricts the app to specific groups before it is published.
- **After publishing, Business and Enterprise/Edu.** Find the app under Workspace settings > Apps, open the more options menu next to it, and choose **Action control**. New actions from the server are not enabled automatically: you "can select the Refresh button to obtain the latest set of actions", and "changes to existing actions are shown as a diff".

Users then reach an approved app through Settings > Plugins, and select it in a conversation by typing @ in the prompt box and picking it.

So the practical sequence for a workspace that publishes social posts is: approve only the actions the team needs, leave the destructive ones off, and confirm the tool list still matches what the server serves today. Anything you leave enabled keeps its own confirmation behaviour — deselecting an action removes the tool, it does not make the remaining write tools prompt less.

## Why a publishing connector prompts on the action you care about

Two independent confirmations sit between a draft and a live post, and neither replaces the other.

On the ChatGPT side, the write action is the scheduling or publishing call, which is exactly the kind of action the help page describes. On SceneSmith's side, the [hosted MCP server](/mcp) refuses a bare "post this now": its live tool schema (read 26 October 2026, via `tools/list` on `https://app.scenesmith.design/api/mcp`) shows `schedule_draft` requires `draftId`, `version`, `confirmationHash`, `scheduledForUtc`, `displayTimezone` and `idempotencyKey`, and `publish_draft_now` requires `draftId`, `version`, `confirmationHash` and `idempotencyKey`. A version and a confirmation hash are mandatory fields, so the post that goes out is the draft version you previewed, not whatever the conversation drifted into.

![Sequence: you ask for a post, ChatGPT calls create_draft on the connector and gets a draft version, calls preview_draft and shows you the exact draft and time, you approve that version, ChatGPT asks you to confirm the write action, then sends schedule_draft with the confirmation hash and the connector publishes to the platform at the set time, with list_calendar as the check.](/blog/chatgpt-mcp-permission-prompts-sequence.webp)

That is the honest reason the prompt is not noise: it is the last gate before something leaves your account. Reading it as "ChatGPT is being annoying" leads people to look for a setting that does not exist.

## Why the same tool asks on Codex and not somewhere else

Clients decide this from what the server advertises about each tool, not from the tool's name. OpenAI's agent approvals documentation (read 26 October 2026) says Codex "can also elicit approval for app (connector) tool calls that advertise side effects", and that "destructive app/MCP tool calls always require approval when the tool advertises a destructive annotation (unless the tool advertises a read annotation, which takes priority)".

If you are testing the same server from a terminal, that page also documents the escape hatches that do exist there — `--ask-for-approval` policies and `-a never` — and the documentation for those is worth reading before you use them on an account that publishes.

## What no setting fixes

Four behaviours on the same page are often mistaken for permission problems:

- **A frozen tool list.** After a connection is approved, ChatGPT "uses a 'frozen' snapshot of its available tools and inputs", so changes the server developer ships later do not appear until an admin refreshes and publishes them. If a tool you know exists is missing, this is the cause, and it is also the first thing to check in the [connector troubleshooting guide](/blog/chatgpt-mcp-connector-stopped-working).
- **Errors after a definition change.** If the live app no longer matches the snapshot, calls can error, and "error messages today do not include an auto-prompt to update" — admins are not notified either.
- **Read-only surfaces.** Deep research can use custom apps for read and fetch actions only, and company knowledge only includes apps with search or fetch access. A publish tool will not appear there.
- **Personal plans.** Pro can connect custom MCP servers with read/fetch permissions, so a "permission denied" on your first publish may be a plan boundary rather than a prompt you dismissed.

## Questions readers ask

### Why does ChatGPT ask permission every single time I schedule a post?

Because the call that schedules a post is a write action, and OpenAI's page says confirmation for write or modify actions depends on "app permissions and the action's context". The page does not describe a per-user "always allow" switch for those actions; the levers it documents are the workspace's approved action list and the risk warnings admins see. Expect a confirmation on each publishing call rather than one prompt for the whole session.

### Can I turn the confirmation prompt off for one MCP tool?

Not by asking in the chat, and not from a per-tool toggle in a conversation. An admin can remove the action entirely — deselect it under Configure Actions when publishing, or under Action control afterwards — but then the tool is unavailable rather than unconfirmed. Some especially risky actions may be blocked outright instead of being offered for approval.

### Where do I change which actions a custom MCP app can take?

On Business and Enterprise/Edu: Workspace settings > Apps, the more options menu next to the app, then Action control. At publish time on Enterprise/Edu the same list appears as Configure Actions. New actions the server adds stay disabled until someone refreshes, and updates to existing actions are shown as a diff before they are accepted.

### Do read-only tools also ask for confirmation?

OpenAI's page ties confirmation to write or modify actions and the action's context, and does not describe a confirmation step for read or fetch tools. If a read tool is prompting, check the workspace's action control and the app's permissions first, and treat the prompt as a signal about that app rather than about read tools in general.

### The app works in one place and not another — is that permissions?

Often it is surface. Custom MCP servers are web-only in ChatGPT, deep research is limited to read and fetch, and company knowledge only includes apps with search or fetch access. If the option to add the server is missing entirely, the cause is usually plan, workspace permission or surface rather than a confirmation prompt.

### Does OpenAI's confirmation replace the tool's own approval step?

No. They are separate: ChatGPT confirms the write action, and the server can still require its own approval before anything is sent. On SceneSmith a scheduling call must carry a confirmation hash tied to one draft version, so a changed caption needs a new approval even if you already clicked through ChatGPT's prompt.

## Sources

- [OpenAI Help Center: Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) — read 26 October 2026. Source for the confirmation wording on write or modify actions, blocked risky actions, "Create plugins with MCPs", the Business and Enterprise/Edu creation rules, Configure Actions and Action control, new actions being deselected by default, the frozen tool snapshot, the missing update prompt for admins, Pro read/fetch limits, web-only mobile answer, and the deep research and company knowledge restrictions.
- [OpenAI: Agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security) — read 26 October 2026. Source for side-effect and destructive annotations in Codex, and the `--ask-for-approval` policies.
- SceneSmith MCP tool schema, `POST https://app.scenesmith.design/api/mcp` with `tools/list` — read 26 October 2026. Source for the required `schedule_draft` and `publish_draft_now` fields, including `confirmationHash`, `version` and `scheduledForUtc`.
- [SceneSmith connections](/connections) — read 26 October 2026. Source for the clients the hosted MCP server is documented with: ChatGPT, Codex, Cursor, VS Code and Devin.
