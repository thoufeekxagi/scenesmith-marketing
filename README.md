# SceneSmith Marketing

This **public** repository builds the client-facing site at [scenesmith.design](https://scenesmith.design) through Netlify. The app, MCP server, workers, database, migrations, and VM deployment remain in the separate **private** repository `thoufeekxagi/scenesmithgptapp`.

The only Git remote for this checkout is `thoufeekxagi/scenesmith-marketing`. Do not add the private app repo as a remote, submodule, workflow dependency, or deploy target. The public site keeps its existing customer-facing links and redirects to `app.scenesmith.design`; that is a public product route, not access to the private source repository or VM.

## How a post gets from draft to production

1. Hermes writes a Markdown article in `content/posts/<slug>/README.md` and, when useful, adds its original image under `public/blog/`.
2. Hermes opens a PR to `main`. GitHub Actions checks the article, typechecks the site, builds a preview with `noindex`, and verifies the marketing/server boundary.
3. Netlify creates a temporary Deploy Preview at `https://deploy-preview-<PR>--scene-smith-website.netlify.app`. It is for review; it does not change `scenesmith.design`.
4. You open that preview and review the article and its display on desktop and mobile. Submit an **Approve** review on the PR only after you are happy with the exact preview.
5. The trusted GitHub workflow checks that the reviewer is the repository owner, the review matches the current commit, the PR changes only article Markdown and blog images, and CI plus the Netlify preview passed for that same commit. It then squash-merges the PR.
6. Netlify sees the approved merge on `main` and deploys it to production. We verify the live URL and SEO endpoints after the deploy.

The owner-authored bootstrap PR cannot be approved by its author, and the review workflow is not available until it has merged to `main`. Its staging preview must be reviewed first; the repository owner then uses the one-time admin bypass to merge that bootstrap PR. The default-branch ruleset still requires CI and Netlify's preview status. After this bootstrap, Hermes-authored content PRs require a current owner review and the workflow auto-merges only the allowed content and image paths. The owner-only admin bypass remains available for exceptional maintenance PRs, not for Hermes.

The extra Netlify project `scenesmith-marketing-preview` is unlinked and unused. The staging step uses a PR Deploy Preview from the existing `scene-smith-website` project, keeping the current production Git link and domain in place.

## Safety boundary

The active `main` ruleset requires a PR, passing `verify` and Netlify preview checks, an approving Code Owner review, resolved review threads, and the latest commit to have been reviewed. It blocks branch deletion and force pushes. The repository's only human collaborator is the owner. The single admin bypass is limited to pull requests; it is needed once for the owner-authored bootstrap because GitHub does not let a PR author approve their own PR.

GitHub Actions defaults to read-only permissions outside the trusted merge job. This repository has no GitHub Actions secrets or variables, no Netlify deploy token, and no VM credentials. Blog publishing requires no site secrets. The app/server repository remains private and is not a remote, submodule, workflow dependency, or deployment target here.

Post frontmatter uses a strict YAML 1.2 data-only parser with a small field allowlist; JavaScript frontmatter, YAML aliases, custom tags, and raw HTML are rejected. Markdown renders as React elements with raw HTML skipped and unsafe link schemes filtered. These checks protect the public PR build, which must treat article text and images as untrusted input.

## What updates automatically

- `/sitemap.xml` reads public pages and article metadata. Adding a post adds its canonical URL and updated date.
- `/robots.txt` advertises the production sitemap. Netlify Deploy Preview hosts allow crawlers to see page-level `noindex` metadata and do not advertise the production sitemap.
- `/llms.txt` lists the current product pages, guides, and articles.
- `/llms-full.txt` contains the current public guide and article text in one plain-text response for retrieval systems.
- `/agent.md` and `/agents.md` give assistants safe, public product and citation guidance.
- `/agents.md` lists the public marketing content and tells agents to cite canonical pages and avoid inferring unlisted product features.
- Blog Article, BreadcrumbList, and visible FAQ JSON-LD, canonical URL, Open Graph image, and X/Twitter image come from article metadata and Markdown.
- `max-snippet:-1` is emitted as page-level Googlebot metadata. It is not a `robots.txt` directive.

The `/llms.txt`, `/llms-full.txt`, `/agent.md`, and `/agents.md` files support agent discovery; they do not guarantee Google ranking or indexing. `/site.xml` is not a second sitemap. Google Search Console already has the production sitemap submission; check its reports after publishing. Submitting a sitemap does not guarantee indexing, and Google's Indexing API is not for ordinary blog posts.

## Pilot article from the Hermes handoff

The first article is `content/posts/schedule-linkedin-posts-free/README.md`, targeting **“how to schedule LinkedIn posts for free.”** It answers a direct question the older SceneSmith guides did not cover: the native, no-subscription LinkedIn scheduling path. The private Hermes handoff's query metrics and Search Console exports are intentionally not included in this public repository. No keyword score is represented as a Google search-volume measurement or ranking forecast.

The guide answers the free/native path before mentioning SceneSmith. It distinguishes LinkedIn profile scheduling (10 minutes to three months ahead) from Page scheduling (one hour to three months, with Page admin permissions), and cites LinkedIn's current help pages. The primary intent is distinct from the existing guide about drafting and scheduling from ChatGPT. An original, brand-colored 1200 × 631 WebP cover is included at `public/blog/schedule-linkedin-posts-free.webp` (about 24 KB). The raw Hermes JSON, CSV, and Search Console report are not committed to this public repository.

The canonical article URL after production approval will be `https://scenesmith.design/blog/schedule-linkedin-posts-free`. It is not live in production until the owner approves the staging preview and the PR merges.

## Local verification

```sh
pnpm install --frozen-lockfile
pnpm validate:content
pnpm test:content-safety
pnpm typecheck
SCENESMITH_NOINDEX=true pnpm build
SCENESMITH_NOINDEX=true pnpm verify:preview
pnpm verify:marketing
```

Read [Agent publishing rules](AGENTS.md) and the [Hermes daily procedure](docs/HERMES.md) before changing the automated publishing setup. Routine content PRs may change only the post Markdown and its own images. Never run the publishing job on a SceneSmith VM or give Hermes credentials for the app/server repository.
