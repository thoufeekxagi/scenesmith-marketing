# Hermes daily publishing procedure

## Boundary

Hermes works only in `thoufeekxagi/scenesmith-marketing`. Give its GitHub identity access to **this repository only**. Do not give it the `scenesmithgptapp` repository, a Netlify token, SSH access, VM credentials, database credentials, or social-provider credentials. The Netlify site builds `main` from this repository and forwards application paths to `app.scenesmith.design`.

The private repository currently uses GitHub Free. GitHub does not enforce branch protection on this private repository under that plan. Until it is made public or the GitHub plan supports private-repo rules, the PR and CI requirement is an agent operating rule, not a GitHub-enforced barrier. Do not give Hermes unattended merge authority while that barrier is absent if enforced review is required.

## One-time setup

1. Give Hermes a fine-grained GitHub credential scoped to `thoufeekxagi/scenesmith-marketing` only. It needs repository contents and pull-request write permissions, and read access to Actions/checks. Store the credential in Hermes's secret store, never in this repo or Netlify.
2. Point the Hermes working directory at a separate clone of this repo. Its daily schedule should run in Hermes, not on the SceneSmith VM and not as a Netlify build hook.
3. Set the daily task prompt to follow this file and `AGENTS.md`. Do not set a mandatory post count. Limit a run to three posts so research and verification remain manageable.
4. Verify the Google Search Console domain property for `scenesmith.design` and submit `https://scenesmith.design/sitemap.xml` once. The site also advertises it in `/robots.txt`. Google says the old sitemap ping endpoint is deprecated, and sitemap submission does not guarantee indexing. Check the Search Console Pages and Sitemaps reports after publishing.

## Every daily run

1. Pull `main`. Read the existing `/blog`, sitemap, recent PRs, current product facts, and current official provider documentation. Pick a specific search question that SceneSmith can answer well. Update an existing article when it is the better answer. Publish nothing if no useful, verified topic is ready.
2. Create `content/posts/<slug>/README.md` from `content/TEMPLATE.md`. Write the direct answer first, then practical steps, limits, an internal link, and source links. Use accurate dates. Do not claim that the submitted ChatGPT plugin is publicly available until its published status is verified.
3. Make a new branch. For a routine content PR, the changed files must be only `content/posts/<slug>/README.md` files. Run `pnpm validate:content`, `pnpm typecheck`, `pnpm build`, and `pnpm verify:marketing`.
4. Open a PR with the search question, intended reader, primary sources, what was verified, and the URLs that will be added or updated. Wait for Marketing CI and the Netlify Deploy Preview to succeed. Inspect the preview page, its mobile layout, links, title, canonical, Article schema, and sitemap. Preview pages should carry `noindex`.
5. Merge only when the diff is limited to approved content, the facts are supported, CI passes, and preview checks pass. If any check fails, fix the PR; do not merge a broken build to reach a daily quota.
6. Wait for Netlify to publish the merged commit. Fetch each live article and `/sitemap.xml`; verify 200 status, correct canonical, Article schema, a sitemap entry with the intended `lastmod`, an internal link, and no `noindex` on `scenesmith.design`. Verify `/api/mcp` still redirects to `https://app.scenesmith.design/api/mcp`.
7. Record the PR URL, merge SHA, Netlify deploy, live article URLs, source links, and validation results in the run log. If Netlify does not publish or a live check fails, stop and alert the owner. Do not retry by making unrelated changes.

## Repository restrictions

- Routine Hermes PRs may change Markdown articles only. A website code, redirect, workflow, policy, or pricing change needs a separate owner-reviewed PR.
- Do not call the VM deploy workflow or change the application repository.
- Do not write `robots.txt`, `sitemap.xml`, `site.xml`, `agents.md`, or `llms.txt` for each post. The sitemap is generated from article metadata; robots points to it. Add other machine-readable files only when they have a defined consumer and an owner-reviewed schema.
- A good article can be updated after publishing. Keep its slug and canonical stable; change `updated` only when the page's substantive content changes.
