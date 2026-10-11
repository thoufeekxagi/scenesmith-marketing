import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";

const root = process.cwd();
const requiredRoutes = ["/", "/connections", "/mcp", "/support", "/security", "/privacy", "/terms", "/data-deletion", "/blog"];
const forbiddenPaths = ["apps/worker", "apps/mcp", "supabase", "docker-compose.production.yml", "Dockerfile", "src/app/api", "src/app/app", "src/app/auth"];
const failures = [];

for (const path of forbiddenPaths) if (existsSync(join(root, path))) failures.push(`server-only path exists: ${path}`);

const manifestPath = join(root, ".next/server/app-paths-manifest.json");
if (!existsSync(manifestPath)) failures.push("missing Next.js route manifest; run pnpm build first");
else {
  const routes = Object.keys(JSON.parse(readFileSync(manifestPath, "utf8")));
  for (const route of requiredRoutes) if (!routes.some((item) => item === `${route === "/" ? "" : route}/page`)) failures.push(`missing marketing route: ${route}`);
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
console.log(`Marketing boundaries verified: ${requiredRoutes.length} public routes, application redirects, no server routes.`);
