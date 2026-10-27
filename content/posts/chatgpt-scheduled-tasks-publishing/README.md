---
title: "ChatGPT scheduled tasks: limits, and the approval that pauses them"
description: "A scheduled task can run your prompt on a cadence, but OpenAI's own docs say an action that needs approval may pause it. Plan caps and steps inside."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-10-27"
updated: "2026-10-27"
primaryKeyword: "chatgpt scheduled tasks limit"
image: "/blog/chatgpt-scheduled-tasks-publishing-hero.webp"
imageAlt: "Title card reading 'ChatGPT scheduled tasks: limits, and the approval that pauses them', with the subtitle 'What a task can run, what it cannot, and where approval stops it'."
---

A scheduled task is real: ChatGPT can run one-time or recurring work, watch for changes and answer supported events. What it is not is an unattended publisher. Two things sit between a task and a live post, and both are written into OpenAI's own documentation rather than left to chance.

The first is the cap. OpenAI's scheduled tasks article gives the active-task limit per plan: 3 for Free and Go, 5 for Plus, 10 for Business and Edu, and 15 for Pro and Enterprise.

The second is approval. The same article says plainly that "actions that require approval may pause the task." OpenAI's custom MCP article says ChatGPT "may ask for confirmation" on write or modify actions "based on app permissions and the action's context," and that some especially risky actions "may be blocked instead of being presented for approval."

Read those two sentences together and the practical answer falls out: a task can carry the drafting job on a cadence, but the moment it reaches a tool that changes something, you may be the one who finishes it. Plan for that instead of fighting it.

## What a task can actually run

OpenAI's task page describes three modes: a schedule you pick, monitoring for changes, and event-triggered work. It also lists what does not work, and those exclusions matter before you build a publishing routine around a task.

- Supported: one-time tasks, recurring tasks, and management from the **Scheduled** list (also reachable from Settings > Notifications > Manage tasks, or a conversation's more options menu > See scheduled tasks).
- Not supported: voice chats, GPTs, and locked chats. A task cannot live in a locked chat at all, so delete it before you lock that conversation.
- Project files are out of reach. A task created inside a project cannot access files uploaded or stored in that project, so paste the brief into the task instructions or keep it in the conversation.
- Connected apps are possible, but connecting is not the same as triggering. OpenAI's wording: "A plugin can include a connected app used by a task. Installing the plugin or connecting the app does not create an event-triggered task or make every event available."
- Event triggers are narrow. They run in Work and respond to supported Gmail, Slack or GitHub activity, on Plus, Pro, Business, Enterprise and Edu. Free and Go accounts cannot create them, FedRAMP workspaces do not have them, and Enterprise, Edu and Healthcare admins must switch them on first.
- A task that runs only on your computer cannot be scheduled from a shared task link, which matters if you hand a routine to a teammate.

## The plan limits, exactly as documented

- **3 active tasks** on Free and Go, **5** on Plus, **10** on Business and Edu, **15** on Pro and Enterprise. Other eligible plans depend on the account or workspace.
- **Free** accounts get a one-time task or a recurring task no more than once a day. Free tasks use flexible windows such as morning, afternoon or night.
- **Hourly schedules and exact delivery times** require an eligible paid plan. That is the line that separates "a daily nudge" from "publish at 09:00 every Tuesday."
- **At the cap**, pause or delete an active task, or wait for one to finish before creating or resuming another.

## Where your approval stops the task

This is the part that decides whether a task can publish for you. OpenAI splits the work into read actions, which retrieve something, and write actions, which change something. Confirmation is tied to the second kind, and it is conditional: it depends on the app's permissions, the action's context and, per the same article, the action's potential impact.

A publishing connector is all write actions by nature. In SceneSmith's public tool list, the path is explicit and versioned: `create_draft` makes a private draft, `preview_draft` returns the exact content, media, handles, time and confirmation material, and `schedule_draft` approves one exact preview version and schedules deliveries to named accounts. Nothing reaches Instagram, X or LinkedIn without a preview version being approved first.

So the honest shape of a task-plus-connector routine is: the task drafts and previews on a cadence, and the approval happens at the preview. If you want a post to go out while you are away, schedule the delivery at approval time rather than hoping a task approves its own output. SceneSmith's [connection guide](/connections) lists ChatGPT, Codex, Cursor, VS Code and Devin for the connector itself; task-specific behaviour is not something the guide documents yet, so test it with a draft before you rely on it.

![A flowchart: a task runs on schedule, calls the connected tool, a write action needing approval pauses the task, you approve the preview, and delivery is scheduled; an action without approval goes straight to delivery scheduled.](/blog/chatgpt-scheduled-tasks-publishing-approval-path.webp)

## Set up a drafting task that stops for you

1. **Connect the app once, outside the task.** In ChatGPT, add the custom MCP server under plugins with the endpoint `https://app.scenesmith.design/api/mcp` and complete the OAuth authorization prompt, then scan tools. The [MCP page](/mcp) and the [connection guide](/connections) cover the exact fields.
2. **Describe the whole job in the task instructions.** Name the app, the tool and the stopping point, because a task repeats exactly what you wrote. Something like: "Using SceneSmith, create a draft for my X account from this idea. Then show me the preview of that exact draft. Do not schedule or publish anything until I reply with the word approve."
3. **Run it once by hand.** Do not create the schedule first. Run the same prompt in a normal conversation and watch where it stops. If it jumped past the preview, tighten the instruction.
4. **Create the task in Scheduled** and pick a time you will actually be awake for. With a daily or weekly cadence and a paid plan, you can set an exact time; on Free, expect a flexible window.
5. **Approve at the preview, then schedule.** Read the exact text, media and handles. Approve a version and set the delivery time in the same step, so the post does not depend on your being present later.
6. **Check the calendar.** `list_calendar` returns scheduled and completed deliveries for a bounded date range, and `get_delivery_status` returns the state and any actionable fault for one delivery. That is your evidence that the post is queued rather than merely drafted.

![A bar chart titled 'Active task limit by plan' showing 3 active tasks on Free/Go, 5 on Plus, 10 on Business/Edu and 15 on Pro/Enterprise.](/blog/chatgpt-scheduled-tasks-publishing-task-limits-by-plan.webp)

## When a task looks broken

- **It went quiet.** OpenAI's own advice is to check Scheduled for a paused task or a pending approval, and to confirm the required app account is still connected and authorized. A paused approval looks identical to a broken task from the outside.
- **It cannot see your files.** The task is inside a project. Move the instructions into the task itself.
- **You hit the cap.** The limit is per plan, and a paused task still occupies a slot until you delete it.
- **No notification arrived.** Notifications live under Settings > Notifications, where you choose push, email or both. Browser notification permission has to be granted, and mobile push only works for tasks created in a supported ChatGPT mobile app.
- **Your event task never fires.** Event triggers only cover Gmail, Slack and GitHub, connected under Settings > Apps, and Free and Go accounts cannot create them at all.
- **The chat is locked.** Locked chats do not support tasks. If you want to keep the routine, leave that conversation unlocked.

For the plan gate that decides whether a connector is available to you at all, the [ChatGPT and MCP plan guide](/blog/chatgpt-mcp-support) covers it. If you are drafting a week at a time rather than one post, the [batch drafting walkthrough](/blog/batch-create-social-media-posts) is the closer fit, and the [free scheduling comparison](/blog/schedule-social-media-posts-free) covers which platforms accept a scheduled post without any connector.

## Questions readers ask

### Can a ChatGPT scheduled task publish without my approval?

Not reliably, and that is by design. OpenAI's task documentation says actions that require approval may pause the task, and its MCP documentation says ChatGPT may ask for confirmation on write actions depending on app permissions and context. Some risky actions can be blocked rather than offered for approval. With SceneSmith, scheduling a delivery means approving one exact preview version, so the approval happens before the task would need it.

### How many scheduled tasks can I have at once?

3 on Free and Go, 5 on Plus, 10 on Business and Edu, and 15 on Pro and Enterprise, per OpenAI's scheduled tasks article. Other eligible plans depend on the account or workspace, and reached limits are cleared by pausing or deleting a task, or by waiting for one to finish.

### Can I run a task hourly on the free plan?

No. Free accounts get a one-time task or a recurring task no more than once a day, using flexible windows such as morning, afternoon or night. Hourly schedules and exact delivery times need an eligible paid plan.

### Why did my scheduled task stop running?

The three common causes are a pending approval that paused the task, a connected app account that is no longer authorized, and the active-task cap. OpenAI's documentation points to the Scheduled list for a paused task or pending approval, and to the app connection as the second check.

### Can a scheduled task read files inside a project?

No. A task created inside a project cannot access files uploaded to or stored in that project, so the instructions have to carry the content themselves.

## Sources

- [Scheduled tasks in ChatGPT](https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt), OpenAI Help Center. Read 2026-10-27. Source for the plan caps, the Free-plan cadence rules, event-trigger support, the unsupported surfaces, project-file limits, the share-link limit, the notification settings, and the sentence that actions requiring approval may pause a task.
- [Connecting custom MCP servers in ChatGPT](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt), OpenAI Help Center. Read 2026-10-27. Source for "may ask for confirmation" on write or modify actions, blocked risky actions, and the add-server and OAuth scan flow.
- SceneSmith's public MCP tool list (`https://app.scenesmith.design/api/mcp`, `tools/list`), read 2026-10-27, for `create_draft`, `preview_draft`, `schedule_draft`, `list_calendar` and `get_delivery_status` and what each returns.
- SceneSmith's [connection guide](/connections) for the clients it documents today: ChatGPT, Codex, Cursor, VS Code and Devin.
