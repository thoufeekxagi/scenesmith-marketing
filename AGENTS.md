# SceneSmith marketing agent rules

This repository serves the public Netlify site at `scenesmith.design`.

- Edit public marketing pages, blog content, source records, images with verified rights, metadata, and internal links only.
- Never add application API routes, authentication, provider integrations, worker code, database migrations, VM deployment files, or production secrets.
- The application and MCP server are at `app.scenesmith.design`. Link to them; do not implement them here.
- Confirm product, pricing, plugin availability, and platform claims against the current production app or an owner-approved product fact record. Do not describe a submitted plugin as published.
- Open a PR for every content change. Run typecheck, build, and marketing boundary checks, inspect the Deploy Preview, then merge only after all checks pass.
- After Netlify publishes, verify the live URL, canonical, robots directive, sitemap entry, and at least one internal link. Record the deployed commit and source evidence.
- A daily research run may decide to update an existing page or publish nothing. Do not create duplicate keyword pages to fill a quota.
