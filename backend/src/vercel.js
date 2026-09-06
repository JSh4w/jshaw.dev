// Vercel's REST API, called with a token held as a Worker secret.
//
// Create one at https://vercel.com/account/tokens, then:
//   npx wrangler secret put VERCEL_TOKEN
//
// Dashboard links need the account slug, which the projects endpoint does not
// return; it is set as VERCEL_SLUG in wrangler.toml.

const PROJECTS_URL = "https://api.vercel.com/v9/projects?limit=100";

// Returns the projects, most recently updated first, or null when no token.
export async function listProjects(env) {
  if (!env.VERCEL_TOKEN) return null;

  const response = await fetch(PROJECTS_URL, {
    headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` }
  });
  if (!response.ok) {
    throw new Error(`Vercel request failed: ${response.status} ${await response.text()}`);
  }

  const { projects } = await response.json();
  return projects
    .map((project) => {
      // targets.production holds the current production deployment, whose
      // alias list carries the tidy domain rather than the hashed one.
      const production = project.targets?.production;
      const alias = production?.alias?.find((name) => !name.includes("-projects.vercel.app"))
        || production?.alias?.[0]
        || null;

      return {
        name: project.name,
        url: alias ? `https://${alias}` : null,
        admin: `https://vercel.com/${env.VERCEL_SLUG}/${project.name}`,
        repo: project.link?.repo
          ? `https://github.com/${project.link.org}/${project.link.repo}`
          : null,
        runtime: project.framework || null,
        updated: production?.createdAt ? new Date(production.createdAt).toISOString() : null
      };
    })
    .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
}
