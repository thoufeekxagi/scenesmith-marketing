# Hermes publishing procedure

## Where Hermes is allowed to work

Hermes works in `thoufeekxagi/scenesmith-marketing` only. This is now a public marketing repository. The app and server remain in the separate private `thoufeekxagi/scenesmithgptapp` repository. Do not give Hermes access to that repository, Netlify credentials, SSH, the VM, database credentials, social-provider credentials, or deploy hooks.

The live Netlify project `scene-smith-website` remains connected to this repository with `main` as its production branch. A pull request gets its own Netlify Deploy Preview at `https://deploy-preview-<PR>--scene-smith-website.netlify.app`. The preview build disables analytics and emits `noindex`; it does not publish to `scenesmith.design`. Merging to `main` is the production publish step.

The extra Netlify project named `scenesmith-marketing-preview` is currently unlinked. It is not part of this workflow and must not be linked or changed as part of routine publishing.

## One-time GitHub access

1. Use a separate Hermes GitHub App or bot identity. Do not give Hermes the repository owner's GitHub token: the owner must be able to distinguish an agent PR from their own approval.
2. Install the App on `scenesmith-marketing` only. Give it repository contents read/write, pull request read/write, and Actions/checks read. Do not grant repository administration, secrets, deployments, or access to other repositories.
3. Store its credential in Hermes' secret store. Never put it in this repository or Netlify.
4. The App may create a branch and PR, but it cannot administer the repository. The owner reviews the Netlify preview and submits an approving GitHub review. A workflow on `main` verifies that review is for the current commit, checks CI and Netlify's preview status, and squash-merges only a content-and-image-only PR.
5. Hermes should run from its own workspace/schedule. Do not run the daily researcher or publisher on the SceneSmith VM or through a Netlify build hook.

The public source repository has no Netlify deploy token. Netlify's GitHub integration builds the connected marketing repository. The CI workflow uses a read-only GitHub token for checks and has no production secrets.

## Daily research and writing

1. Pull `main`. Review the existing blog and sitemap, recent marketing PRs, current product facts, the latest Hermes handoff, and primary documentation for the topic.
2. Choose one question the site can answer with first-hand product facts or authoritative sources. Check whether an existing page already satisfies that intent. Update nothing and publish zero posts when the evidence or topic is weak.
3. Treat Hermes scores as a triage signal, not a forecast. Record the source, date, geography, and any data collection failure. Do not describe estimated values as measured Google search volume. Keep raw Search Console and paid research exports outside this public repository.
4. Write `content/posts/<slug>/README.md` from `content/TEMPLATE.md`. State the answer first; include practical steps, relevant limits, a way to verify, internal links, and exact primary-source URLs. Use original, accurately described images only under `public/blog/`. Frontmatter accepts only allowlisted string fields; do not use JavaScript/YAML tags, aliases, or raw HTML. A post file is limited to 120 KB and an image to 2 MB.
5. Do not create near-duplicate pages to reach a posting target. A run may prepare up to three distinct, sourced drafts; daily volume is not a requirement.

## Staging, approval, and production

1. Create a branch and open a PR against `main`. A routine content PR may contain only article `README.md` files under `content/posts/` and their images under `public/blog/`.
2. GitHub Actions runs content validation, adversarial content safety checks, typecheck, the preview build with `SCENESMITH_NOINDEX=true`, and marketing-boundary verification. Netlify builds a Deploy Preview for the PR.
3. Wait for both **Marketing CI / verify** and **netlify/scene-smith-website/deploy-preview** to pass. Open the preview and check the full article on desktop and mobile, its links, title, canonical, Article JSON-LD, image/alt text, and noindex. Read the exact rendered article; a passing build is not editorial approval.
4. Send the preview URL and the PR summary to the owner. Do not merge or publish while waiting.
5. After the owner reviews the preview, the owner submits an **Approve** review on the PR. The workflow reads that event from the trusted default branch, checks that the PR comes from a separate identity and changes only approved content/image paths, rechecks CI and the production site's Netlify preview status for the exact head commit, then squash-merges that same commit. New commits dismiss the old review and require a new preview and approval.
6. Netlify publishes the merge from `main` to `https://scenesmith.design`. Confirm the deploy commit and live page before marking the run complete.

The first pipeline PR is a bootstrap: the owner review workflow cannot run until it has merged into the default branch. The PR is owner-authored, so GitHub will not accept the owner's review of their own PR. Review its staging preview first, then the owner uses the one-time admin bypass to merge it. The default-branch ruleset still requires CI and Netlify's preview status. After this bootstrap, owner Code Owner approval is required for all PRs. Do not install Hermes until the ruleset and workflow are active.

## Search and indexing checks

- `/sitemap.xml` is generated from public page and article metadata. New posts enter it automatically; do not edit it by hand.
- `/robots.txt` points production crawlers to that sitemap. Deploy Preview hosts allow crawlers to read the page-level `noindex` directive and do not advertise the production sitemap.
- `/llms.txt` and `/agents.md` are generated from the current guide and article lists. They help discovery and citation; they are not ranking guarantees or Google indexing controls.
- `/site.xml` is not a second sitemap. Use the standard `/sitemap.xml` endpoint.
- Submit the production sitemap once in Google Search Console and monitor its Sitemaps and Pages reports. Google says a sitemap is a discovery hint, not a guarantee of crawling, indexing, or ranking. The Indexing API is not a general blog-submission API; it is limited to eligible job-posting and livestream pages.
- After production, verify the article's 200 response, production canonical, Article JSON-LD, sitemap `lastmod`, internal links, and indexable production metadata. Check that the Netlify preview still reports `noindex`.

## Stop conditions

Stop and alert the owner if product claims cannot be verified, a preview or CI check fails, a post duplicates an existing page, a source has become unavailable, a routine PR changes server or workflow files, a production URL/canonical is wrong, or the deployed SHA does not match the approved PR. Do not repair a server issue from this repository.
