// Netlify's REST API, called with a personal access token held as a Worker
// secret. The token never reaches the browser.
//
// Create one at https://app.netlify.com/user/applications, then:
//   npx wrangler secret put NETLIFY_TOKEN

const SITES_URL = "https://api.netlify.com/api/v1/sites?per_page=100";

// Returns the sites, newest deploy first, or null when no token is set.
export async function listSites(env) {
  if (!env.NETLIFY_TOKEN) return null;

  const response = await fetch(SITES_URL, {
    headers: { Authorization: `Bearer ${env.NETLIFY_TOKEN}` }
  });
  if (!response.ok) {
    throw new Error(`Netlify request failed: ${response.status} ${await response.text()}`);
  }

  const sites = await response.json();
  return sites
    .map((site) => ({
      name: site.name,
      url: site.ssl_url || site.url,
      admin: site.admin_url,
      repo: site.build_settings?.repo_url || null,
      published: site.published_deploy?.published_at || null
    }))
    .sort((a, b) => (b.published || "").localeCompare(a.published || ""));
}
