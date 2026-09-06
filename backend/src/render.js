// Render's REST API, called with an API key held as a Worker secret.
//
// Create one at https://dashboard.render.com/u/settings#api-keys, then:
//   npx wrangler secret put RENDER_TOKEN

const SERVICES_URL = "https://api.render.com/v1/services?limit=100";

// Returns the services, most recently updated first, or null when no key is set.
export async function listServices(env) {
  if (!env.RENDER_TOKEN) return null;

  const response = await fetch(SERVICES_URL, {
    headers: {
      Authorization: `Bearer ${env.RENDER_TOKEN}`,
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Render request failed: ${response.status} ${await response.text()}`);
  }

  // Render wraps each item as { cursor, service }.
  const items = await response.json();
  return items
    .map(({ service }) => ({
      name: service.name,
      url: service.serviceDetails?.url || null,
      admin: service.dashboardUrl,
      repo: service.repo || null,
      runtime: service.serviceDetails?.runtime || service.type || null,
      region: service.serviceDetails?.region || null,
      updated: service.updatedAt || null
    }))
    .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
}
