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

The public source repository has no Netlify deploy token. Netlify's GitHub integration builds the connected marketing repository. GitHub Actions uses its short-lived default `GITHUB_TOKEN` with job-scoped permissions; no Actions secret or variable is needed for blog publishing.

## Exact Hermes inputs and environment variables

Use these as the publishing job's repository and destination settings. They are plain configuration values, not credentials:

```text
repository: thoufeekxagi/scenesmith-marketing
production_branch: main
article_directory: content/posts/<slug>/README.md
image_directory: public/blog/<slug>.<webp|png|jpg>
staging: Netlify Deploy Preview on the pull request
production: https://scenesmith.design after an owner-approved merge
```

The routine content job has **no site environment variables** to set. Do not copy application or VM variables into Hermes. For completeness, these are the public-site build switches currently used by the marketing repo:

| Variable | Where it is used | Needed by Hermes? |
| --- | --- | --- |
| `SCENESMITH_ENABLE_GA` | `netlify.toml` context switch: false in development and previews, true in production | No |
| `SCENESMITH_NOINDEX` | Set to `true` for preview and branch deploy builds; GitHub CI also sets it for its preview build | No; CI/Netlify set it |
| `NEXT_PUBLIC_SCENESMITH_ENABLE_GA` | Derived by `next.config.ts` from the Netlify context; do not set manually | No |
| `SCENESMITH_DEPLOYMENT_ENV` | Optional promo-display feature read by `src/lib/launch-offer.ts` | No |
| `SCENESMITH_LAUNCH_OFFER_CODE` | Optional public promo display code; not a Stripe secret and unrelated to article publishing | No |

GitHub Actions currently reports zero repository Actions secrets and zero Actions variables. Keep it that way for routine blog publishing. If Hermes connects through a GitHub App, install it on this repository only and keep its private key in Hermes' credential store. The App needs contents read/write, pull request read/write, and read-only checks/status access so it can branch, push article files, open a PR, and read preview checks. Do not give it repository administration, Actions write, Netlify, Google Search Console, VM, database, social provider, or app/server access. It must not submit its own approval. The owner review is the production gate; the trusted workflow merges the approved PR.

### Copy-ready scheduled job instruction

```text
Work only in thoufeekxagi/scenesmith-marketing, targeting main. Read AGENTS.md,
content/TEMPLATE.md, and docs/HERMES.md before writing. Each run may create zero
to three genuinely distinct, well-sourced articles; do not publish just to meet
a quota. Confirm the query is not already answered, verify product claims from
the public marketing site and primary sources, and keep raw research exports
out of this public repository. Put each article in
content/posts/<slug>/README.md and original article images only in public/blog/.
Do not edit site code, workflows, configuration, redirects, or any app/server
files. Run pnpm install --frozen-lockfile, pnpm validate:content,
pnpm test:content-safety, pnpm typecheck, SCENESMITH_NOINDEX=true pnpm build,
SCENESMITH_NOINDEX=true pnpm verify:preview, and pnpm verify:marketing. If all
checks pass, open a PR against main and report its Deploy Preview URL, source
quality, factual claims, internal links, images, and test results. Never merge
or deploy. Wait for the repository owner's approval; the protected workflow
will verify the exact commit and preview and publish it through Netlify.
Stop and report any failed check, product claim without a primary source,
duplicate intent, secret, or change outside the permitted content/image paths.
```

## Daily research and writing

1. Pull `main`. Review the existing blog and sitemap, recent marketing PRs, current product facts, the latest Hermes handoff, and primary documentation for the topic.
2. Choose one question the site can answer with first-hand product facts or authoritative sources. Check whether an existing page already satisfies that intent. Update nothing and publish zero posts when the evidence or topic is weak.
3. Treat Hermes scores as a triage signal, not a forecast. Record the source, date, geography, and any data collection failure. Do not describe estimated values as measured Google search volume. Keep raw Search Console and paid research exports outside this public repository.
4. Write `content/posts/<slug>/README.md` from `content/TEMPLATE.md`. State the answer first; include practical steps, relevant limits, a way to verify, internal links, and exact primary-source URLs. Use original, accurately described images only under `public/blog/`. Frontmatter accepts only allowlisted string fields; do not use JavaScript/YAML tags, aliases, or raw HTML. A post file is limited to 120 KB and an image to 2 MB.
5. Do not create near-duplicate pages to reach a posting target. A run may prepare up to three distinct, sourced drafts; daily volume is not a requirement.

## Staging, approval, and production

1. Create a branch and open a PR against `main`. A routine content PR may contain only article `README.md` files under `content/posts/` and their images under `public/blog/`.
2. GitHub Actions runs content validation, adversarial content safety checks, typecheck, the preview build with `SCENESMITH_NOINDEX=true`, and marketing-boundary verification. Netlify builds a Deploy Preview for the PR.
3. Wait for both **Marketing CI / verify** and **netlify/scene-smith-website/deploy-preview** to pass. Run `node scripts/verify-live.mjs --preview <PR-number>`. The verifier constructs the fixed Netlify preview hostname from that number; it does not fetch an arbitrary URL. Open the preview and check the full article on desktop and mobile, its links, title, canonical, Article/Breadcrumb/FAQ JSON-LD, image/alt text, and noindex. Read the exact rendered article; a passing build is not editorial approval.
4. Send the preview URL and the PR summary to the owner. Do not merge or publish while waiting.
5. After the owner reviews the preview, the owner submits an **Approve** review on the PR. The workflow reads that event from the trusted default branch, checks that the PR comes from a separate identity and changes only approved content/image paths, rechecks CI and the production site's Netlify preview status for the exact head commit, then squash-merges that same commit. New commits dismiss the old review and require a new preview and approval.
6. Netlify publishes the merge from `main` to `https://scenesmith.design`. Confirm the deploy commit and live page before marking the run complete.

The first pipeline PR is a bootstrap: the owner review workflow cannot run until it has merged into the default branch. The PR is owner-authored, so GitHub will not accept the owner's review of their own PR. Review its staging preview first, then the owner uses the one-time admin bypass to merge it. The default-branch ruleset still requires CI and Netlify's preview status. After this bootstrap, owner Code Owner approval is required for all PRs. Do not install Hermes until the ruleset and workflow are active.

## Search and indexing checks

- `/sitemap.xml` is generated from public page and article metadata. New posts enter it automatically; do not edit it by hand.
- `/robots.txt` points production crawlers to that sitemap. Deploy Preview hosts allow crawlers to read the page-level `noindex` directive and do not advertise the production sitemap.
- `/llms.txt`, `/llms-full.txt`, `/agent.md`, and `/agents.md` are generated from public marketing content. They help assistants discover and cite the site; they are not Google ranking or indexing guarantees.
- `/site.xml` is not a second sitemap. Use the standard `/sitemap.xml` endpoint.
- Submit the production sitemap once in Google Search Console and monitor its Sitemaps and Pages reports. Google says a sitemap is a discovery hint, not a guarantee of crawling, indexing, or ranking. The Indexing API is not a general blog-submission API; it is limited to eligible job-posting and livestream pages.
- After production, run `pnpm verify:live` to verify the article's 200 response, production canonical, image, Article/Breadcrumb/FAQ JSON-LD, sitemap `lastmod`, robots sitemap reference, text routes, and indexable production metadata. Check that the Netlify preview still reports `noindex`.

## Stop conditions

Stop and alert the owner if product claims cannot be verified, a preview or CI check fails, a post duplicates an existing page, a source has become unavailable, a routine PR changes server or workflow files, a production URL/canonical is wrong, or the deployed SHA does not match the approved PR. Do not repair a server issue from this repository.
