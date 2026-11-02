---
title: "Why your scheduled post didn't publish: four checks in order"
description: "A scheduled post can expire before it publishes, lose its media file, or hit an account or rate rule. Four checks that find the cause, in order."
category: "Publishing guide"
author: "Thoufeek Baber"
published: "2026-11-02"
updated: "2026-11-02"
primaryKeyword: "why is my scheduled post not posting"
image: "/blog/scheduled-post-didnt-publish-hero.webp"
imageAlt: "A title card reading: why your scheduled post didn't publish — four checks in order."
---

A scheduled post that never appears usually failed in one of four places: the schedule was never accepted, Instagram dropped the post because its media container expired before publish time, the media file was no longer reachable when the platform fetched it, or the account, format or rate rules refused it. Work through them in that order. Each check rules out a different cause, and you can stop as soon as one fits.

Do one thing before any of that: look at the platform itself. Re-posting a scheduled item that was only delayed is how people end up with duplicates.

![A decision diagram: a post is missing, then a check asks whether it is in the platform queue; if not, check the app; if it is, a second check asks whether the container expired, leading to scheduling again or to checking media and limits.](/blog/scheduled-post-didnt-publish-checks-flow.webp)

## Check 1: Is the post queued where you think it is?

A schedule can live in two different places: the platform's own queue, or the app you drafted in. Mixing those up is the most common false alarm.

On **LinkedIn**, the composer's clock icon shows a badge with the number of scheduled posts when the queue is not empty. Open **Start a post**, select the clock, then **View all scheduled posts** to see the time, preview, and edit or delete controls. A profile post can be scheduled from 10 minutes to three months ahead, and LinkedIn converts scheduled times to UTC using your device's time-zone setting. Events and Jobs cannot be scheduled.

On **Instagram**, native scheduling happens in the app's own tools rather than in the publishing API, and our guide to [scheduling Reels in advance](/blog/schedule-instagram-reels-in-advance) walks through the exact route. That distinction matters here: Instagram's publishing API has no "publish later" call. An app creates a media container and then publishes it, so a post you scheduled inside an AI app is held by that app until publish time — Instagram's own scheduled list may never show it. An empty list on Instagram is not proof that the post was lost.

![A sequence diagram: you approve the exact draft, the AI app creates a media container at the due time, Instagram API returns a container ID, the app publishes within 24 hours, and Instagram returns status PUBLISHED.](/blog/scheduled-post-didnt-publish-who-holds-schedule.webp)

## Check 2: Did the Instagram container expire before it published?

Meta's content publishing flow has two separate steps: create a container for the media, then publish that container. The container is not a post yet, and it does not wait forever. Meta's status values for a container include **EXPIRED**, defined as "the container was not published within 24 hours and has expired", alongside `ERROR`, `FINISHED`, `IN_PROGRESS` and `PUBLISHED`. Meta recommends checking a container's status once per minute, for no more than five minutes.

That 24-hour window explains a specific kind of failure: the post was prepared on schedule but the publish call arrived late. A queue backlog, a host that was unreachable for a day, or a connection that had to be re-authorised before the retry all push the publish past the window. The container is then dead on arrival, and retrying the same item keeps failing. The fix is to create a fresh container and schedule the post again.

## Check 3: Was the media still reachable at publish time?

Meta fetches the media itself at the moment of the publishing attempt, so the image or video must sit on a publicly accessible server at that moment. A signed link that expires in an hour, a file path on your laptop, or storage behind a login will pass at scheduling time and fail at publish time — often hours later, with an error that says nothing about the file.

If the post carries media from a link that expires, the durable fix is to have the publishing app host the file, or to point at storage that stays public until the post is live.

## Check 4: Account type, format and the daily cap

These are the rules that reject a post outright rather than letting it sit and expire.

**Instagram, per Meta's content publishing guide:**

- Publishing through the API works on Instagram professional accounts.
- JPEG is the only supported image format; extended JPEG formats such as MPO and JPS are not supported. Shopping tags and filters are not supported.
- A carousel can hold up to 20 images or videos, and its images are cropped based on the first image in the carousel, with a default 1:1 aspect ratio.
- An account connected to a Page that requires Page Publishing Authorization cannot be published to until that authorisation is completed.
- Accounts are limited to 100 API-published posts within a 24-hour moving period. Carousels count as a single post, and the limit is enforced when the publish call is made. Meta exposes an endpoint to check current usage.

**LinkedIn, per LinkedIn's own help pages:**

- A profile post can be scheduled from 10 minutes ahead; a Page post needs at least an hour, and both cap at three months.
- Scheduling a Page post needs the super admin or content admin role.
- Page posts cannot be events, multiple photos, reshares, polls, jobs or service posts.

A cap that was fine when you planned the batch can also be the cause: a burst of scheduled items all landing inside the same 24 hours will hit the Instagram limit partway through, and only the items after the limit fail.

## What to do once you know which check failed

1. Look at the profile's feed and the platform's scheduled list before you re-post. Duplicates are the usual damage from a retry.
2. Fix the specific cause: a media link that stays public, a JPEG instead of another format, a professional account instead of a personal one, a wait for the rate window to clear, or a re-authorisation of the app.
3. Schedule once more, as a new item, and confirm it appears in the queue you checked in step one.
4. If nothing is in either queue and the app holding the schedule has no record of it, the publish call never ran. In that case the connection is the suspect, not the post — the [connector troubleshooting guide](/blog/chatgpt-mcp-connector-stopped-working) covers the two failure modes OpenAI documents, and the [SceneSmith connection guide](/connections) shows what a working setup looks like.

In SceneSmith, drafting and publishing are separate steps: the OAuth grant covers draft, schedule and publishing scopes, and the publish or schedule call is made after you approve the exact draft. When a scheduled post still fails, the reason sits at the platform end, which is why the four checks above apply whoever queued the post.

## Questions readers ask

### Why did my scheduled Instagram post not publish?

The three most common causes are a container that expired before the publish call arrived (Meta allows 24 hours), media that was no longer publicly reachable when Meta fetched it, and a rule rejection such as a non-JPEG image, a personal rather than professional account, or the 100-post limit in a 24-hour period.

### Where did my scheduled LinkedIn post go?

Open **Start a post**, select the clock icon and choose **View all scheduled posts**. If the clock shows no badge, LinkedIn has nothing queued: the schedule is being held by the app you used, and that app is where to look next.

### How many posts can an app publish to Instagram in a day?

Meta limits an Instagram account to 100 API-published posts within a 24-hour moving period, with carousels counting as one post. The limit is enforced when the publish call is made, so a batch that crosses it fails partway through.

### Can you schedule a post through Instagram's publishing API?

Not directly. The API creates a media container and then publishes it, and Meta expects the container to be published within 24 hours. Scheduling is the job of the app that calls the API, which is why a scheduled post may not appear in Instagram's own queue.

### Does a scheduled post appear on my profile before it publishes?

No. A container is not a post until the publish call succeeds, so nothing appears on the profile until then. That is also why checking the profile feed is a reliable way to confirm whether a scheduled post went live.

### Why does a scheduled post fail after it was accepted?

Acceptance happens when the item is queued; the platform rules are applied later, at publish time. A container that expires, a media link that stops working, an account that stops qualifying, or a rate cap that has already been reached will all reject a post that was accepted days earlier.

## Sources

- [Meta: Instagram Platform content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing) — container status values including EXPIRED within 24 hours, the public-server requirement for media, JPEG-only images, carousel limits, Page Publishing Authorization, and the 100-post rate limit per 24-hour period. Page states it was updated 20 October 2026; read 2 November 2026.
- [LinkedIn Help: Schedule posts](https://www.linkedin.com/help/linkedin/answer/a1347212) — clock badge, "View all scheduled posts", the 10-minute to three-month window, UTC conversion, and the Events and Jobs exception. Read 2 November 2026.
- [LinkedIn Help: Scheduled posts for LinkedIn Pages](https://www.linkedin.com/help/linkedin/answer/a548192/scheduled-posts-for-linkedin-pages) — super admin or content admin role, one-hour minimum, three-month maximum, and the unsupported Page post types. Read 2 November 2026.
- [SceneSmith connection guide](/connections) — which clients SceneSmith lists, and the draft, schedule and publishing scopes advertised during OAuth discovery.
