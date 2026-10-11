import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";

const root = process.cwd();
const requiredPageRoutes = ["/", "/connections", "/mcp", "/support", "/security", "/privacy", "/terms", "/data-deletion", "/blog"];
const requiredHandlerRoutes = ["/agent.md", "/agents.md", "/llms.txt", "/llms-full.txt"];
const forbiddenPaths = ["apps/worker", "apps/mcp", "supabase", "docker-compose.production.yml", "Dockerfile", "src/app/api", "src/app/app", "src/app/auth"];
const failures = [];

for (const path of forbiddenPaths) if (existsSync(join(root, path))) failures.push(`server-only path exists: ${path}`);

const manifestPath = join(root, ".next/server/app-paths-manifest.json");
if (!existsSync(manifestPath)) failures.push("missing Next.js route manifest; run pnpm build first");
else {
  const routes = Object.keys(JSON.parse(readFileSync(manifestPath, "utf8")));
  for (const route of requiredPageRoutes) if (!routes.some((item) => item === `${route === "/" ? "" : route}/page`)) failures.push(`missing marketing page: ${route}`);
  for (const route of requiredHandlerRoutes) if (!routes.some((item) => item === `${route}/route`)) failures.push(`missing machine-readable route: ${route}`);
  if (routes.some((item) => item.startsWith("/api/") || item.startsWith("/app/"))) failures.push("application or API route entered marketing build");
}

const config = readFileSync(join(root, "netlify.toml"), "utf8");
for (const path of ["/login", "/register", "/app/*", "/api/mcp", "/.well-known/*"]) {
  if (!config.includes(`from = "${path}"`)) failures.push(`missing application redirect: ${path}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`Marketing boundaries verified: ${requiredPageRoutes.length} public pages, ${requiredHandlerRoutes.length} machine-readable routes, application redirects, no server routes.`);
