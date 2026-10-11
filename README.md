# SceneSmith marketing site

This repository serves `https://scenesmith.design` through Netlify. It contains the public website, guides, legal pages, metadata, and redirects to the application at `https://app.scenesmith.design`.

The application, MCP server, worker, database migrations, and VM deployment remain in `thoufeekxagi/scenesmithgptapp`. Never add those services or their credentials here.

## Local checks

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm verify:marketing
```

The first version was extracted from the production SceneSmith release `8d414c2da5788e06915916ae4c0a3c1213a18dd4`. Keep the public URLs and `/api/mcp` and `/.well-known/*` redirects stable while changing the website.

Netlify connects directly to this repository. Publishing a marketing change does not deploy the VM.
