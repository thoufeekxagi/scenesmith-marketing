# SceneSmith marketing agent rules

This repository serves the public Netlify site at `scenesmith.design`.

- Edit public marketing pages, blog content, source records, images with verified rights, metadata, and internal links only.
- Never add application API routes, authentication, provider integrations, worker code, database migrations, VM deployment files, or production secrets.
- The application and MCP server are at `app.scenesmith.design`. Link to them; do not implement them here.
- Confirm product, pricing, plugin availability, and platform claims against the current production app or an owner-approved product fact record. Do not describe a submitted plugin as published.
- Open a PR for every content change. Run typecheck, build, and marketing boundary checks, inspect the Deploy Preview, then merge only after all checks pass.
- For routine blog publishing, change only `content/posts/<slug>/README.md`. Use `content/TEMPLATE.md`; run `pnpm validate:content`. Never change application code, Netlify settings, workflow files, or this policy in a routine content PR.
- Read `docs/HERMES.md` before configuring the daily Hermes job. A daily run may publish zero, one, two, or three useful posts; volume is not a reason to invent claims or duplicate topics.
- After Netlify publishes, verify the live URL, canonical, robots directive, sitemap entry, and at least one internal link. Record the deployed commit and source evidence.
- A daily research run may decide to update an existing page or publish nothing. Do not create duplicate keyword pages to fill a quota.
