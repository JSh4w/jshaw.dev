// Cloudflare's API, for the Workers and Pages projects on the account.
//
// Create a token at https://dash.cloudflare.com/profile/api-tokens with
// "Workers Scripts: Read" and "Cloudflare Pages: Read", then:
//   npx wrangler secret put CLOUDFLARE_API_TOKEN
//
// The account id is looked up from the token. If that fails, set
// CLOUDFLARE_ACCOUNT_ID in wrangler.toml (it is in the dashboard URL).

const API = "https://api.cloudflare.com/client/v4";

async function get(env, path) {
  const response = await fetch(API + path, {
    headers: { Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` }
  });
  if (!response.ok) {
    throw new Error(`Cloudflare request failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()).result;
}

// Returns Workers and Pages projects, most recently updated first, or null
// when no token is set.
export async function listCloudflare(env) {
  if (!env.CLOUDFLARE_API_TOKEN) return null;

  const accountId = env.CLOUDFLARE_ACCOUNT_ID || (await get(env, "/accounts"))[0]?.id;
  if (!accountId) throw new Error("The Cloudflare token cannot see any account.");
  const account = `/accounts/${accountId}`;
  const dash = `https://dash.cloudflare.com/${accountId}`;

  const [scripts, workersDev, pages] = await Promise.all([
    get(env, `${account}/workers/scripts`),
    // Missing until workers.dev is set up; the links are then just left off.
    get(env, `${account}/workers/subdomain`).catch(() => null),
    get(env, `${account}/pages/projects`)
  ]);

  const workers = scripts.map((script) => ({
    name: script.id,
    url: workersDev?.subdomain ? `https://${script.id}.${workersDev.subdomain}.workers.dev` : null,
    admin: `${dash}/workers/services/view/${script.id}/production`,
    repo: null,
    runtime: "Worker",
    updated: script.modified_on || null
  }));

  const sites = pages.map((project) => {
    const source = project.source?.config;
    return {
      name: project.name,
      url: project.subdomain ? `https://${project.subdomain}` : project.canonical_deployment?.url || null,
      admin: `${dash}/pages/view/${project.name}`,
      repo: source ? `https://${project.source.type === "gitlab" ? "gitlab.com" : "github.com"}/${source.owner}/${source.repo_name}` : null,
      runtime: ["Pages", project.framework].filter(Boolean).join(" · "),
      updated: project.canonical_deployment?.created_on || null
    };
  });

  return [...workers, ...sites].sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
}
