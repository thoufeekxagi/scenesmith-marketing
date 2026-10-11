# SceneSmith marketing agent rules

This public repository builds the client-facing Netlify site at `https://scenesmith.design`.

- Work only on public marketing pages and blog content. Never add application/API routes, authentication, provider integrations, workers, migrations, VM deployment files, or credentials.
- Keep `scenesmithgptapp` private and outside this repository. Do not add it as a Git remote, submodule, build dependency, or deployment target.
- User-facing links to `app.scenesmith.design` and existing redirects in `netlify.toml` are part of the published product flow. Do not change those paths in a content PR.
- Verify product, pricing, plugin availability, and platform claims against current product pages or primary provider documentation. Do not call a submitted plugin published.
- For a routine article, change only `content/posts/<slug>/README.md` and its original blog image(s) under `public/blog/`. Do not edit workflows, site routes, redirects, or policy files in a routine content PR.
- Use `content/TEMPLATE.md`; run `pnpm validate:content`. CI runs typecheck, a noindex preview build, and marketing-boundary checks.
- Open a PR to `main`. The owner must submit an approving GitHub review on the exact Netlify Deploy Preview commit. The trusted workflow checks the reviewer, changed paths, CI, and preview status before it auto-merges an article-only PR. Branch rules require an owner Code Owner review and passing CI/Netlify checks.
- Read `docs/HERMES.md` before configuring Hermes. A run may publish zero to three useful posts; never write filler to meet a quota.
- Let the build update `/sitemap.xml`, `/llms.txt`, and `/agents.md` from article metadata. Do not hand-edit per-post crawler indexes or create a duplicate `/site.xml`.
- After production deploy, verify the live URL, canonical, robots metadata, sitemap entry, crawler indexes, and internal links. Record the merged commit and source links.
