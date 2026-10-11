# SceneSmith marketing site

This repository serves `https://scenesmith.design` through Netlify. It contains the public website, guides, legal pages, metadata, and redirects to the application at `https://app.scenesmith.design`.

The application, MCP server, worker, database migrations, and VM deployment remain in `thoufeekxagi/scenesmithgptapp`. Never add those services or their credentials here.

New blog posts are Markdown files at `content/posts/<slug>/README.md`. Copy `content/TEMPLATE.md`, write a useful article with verified sources, and open a PR. The build renders the article, updates `/blog`, and adds the URL and `updated` date to `/sitemap.xml` automatically. Do not edit a sitemap or robots file by hand for a normal post. The three original guides remain in `src/lib/blog.ts` until their separate content migration is reviewed.

## Local checks

```sh
pnpm install --frozen-lockfile
pnpm validate:content
pnpm typecheck
pnpm build
pnpm verify:marketing
```

The first version was extracted from the production SceneSmith release `8d414c2da5788e06915916ae4c0a3c1213a18dd4`. Keep the public URLs and `/api/mcp` and `/.well-known/*` redirects stable while changing the website.

Netlify connects directly to this repository. Publishing a marketing change does not deploy the VM.

See [Hermes publishing procedure](docs/HERMES.md) for the daily PR, preview, merge, and live verification steps.
