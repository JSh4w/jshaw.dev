// Azure, through a service principal with the Reader role, held as Worker
// secrets. Create one (it prints all three values) with:
//   az ad sp create-for-rbac --name jshaw-dev-hosting --role Reader --scopes /subscriptions/<id>
// then:
//   npx wrangler secret put AZURE_TENANT_ID       # "tenant"
//   npx wrangler secret put AZURE_CLIENT_ID       # "appId"
//   npx wrangler secret put AZURE_CLIENT_SECRET   # "password"
//
// One Resource Graph query lists App Service and Functions apps, Static Web
// Apps and Container Apps across every subscription the principal can read.
// The Azure tab adds spending per resource group from Cost Management, which
// the Reader role can also see. Cost data lags by up to a day.

const QUERY = `resources
| where type in~ ('microsoft.web/sites', 'microsoft.web/staticsites', 'microsoft.app/containerapps')
| project id, name, type, kind, location, properties`;

const KINDS = {
  "microsoft.web/staticsites": "Static Web App",
  "microsoft.app/containerapps": "Container App"
};

async function getToken(env) {
  const response = await fetch(`https://login.microsoftonline.com/${env.AZURE_TENANT_ID}/oauth2/v2.0/token`, {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.AZURE_CLIENT_ID,
      client_secret: env.AZURE_CLIENT_SECRET,
      scope: "https://management.azure.com/.default"
    })
  });
  const body = await response.json();
  if (!body.access_token) throw new Error(`Azure login failed: ${body.error_description || response.status}`);
  return body.access_token;
}

const configured = (env) => Boolean(env.AZURE_TENANT_ID && env.AZURE_CLIENT_ID && env.AZURE_CLIENT_SECRET);

async function arm(token, path, body) {
  const response = await fetch(`https://management.azure.com${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body && JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`Azure request failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

const graph = async (token, query) =>
  (await arm(token, "/providers/Microsoft.ResourceGraph/resources?api-version=2024-04-01", { query })).data;

// Returns the apps, most recently modified first, or null when not configured.
export async function listAzure(env) {
  if (!configured(env)) return null;

  const data = await graph(await getToken(env), QUERY);
  return data
    .map((resource) => {
      const p = resource.properties || {};
      const host = p.defaultHostName || p.defaultHostname || p.configuration?.ingress?.fqdn;
      const type = resource.type.toLowerCase();
      return {
        name: resource.name,
        url: host ? `https://${host}` : null,
        admin: `https://portal.azure.com/#resource${resource.id}`,
        repo: p.repositoryUrl || null,
        runtime: [KINDS[type] || (resource.kind?.includes("functionapp") ? "Function App" : "App Service"),
          resource.location].join(" · "),
        updated: p.lastModifiedTimeUtc || null
      };
    })
    .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
}

const GROUPS = `resourcecontainers
| where type == 'microsoft.resources/subscriptions/resourcegroups'
| project subscriptionId, name, key = tolower(name)
| join kind=leftouter (resources
    | summarize resources = count() by subscriptionId, key = tolower(resourceGroup)) on subscriptionId, key
| project subscriptionId, name, resources = coalesce(resources, 0)`;

// Cost per resource group for one subscription over one timeframe, as a map
// from lowercased group name to { cost, currency }.
async function costs(token, subscriptionId, timeframe) {
  const { properties } = await arm(token,
    `/subscriptions/${subscriptionId}/providers/Microsoft.CostManagement/query?api-version=2023-11-01`, {
      type: "ActualCost",
      timeframe,
      dataset: {
        granularity: "None",
        aggregation: { cost: { name: "Cost", function: "Sum" } },
        grouping: [{ type: "Dimension", name: "ResourceGroupName" }]
      }
    });
  const column = (name) => properties.columns.findIndex((c) => c.name.toLowerCase() === name.toLowerCase());
  const [cost, group, currency] = [column("Cost"), column("ResourceGroupName"), column("Currency")];
  return new Map(properties.rows.map((row) =>
    [String(row[group] || "(no resource group)").toLowerCase(), { cost: row[cost], currency: row[currency] }]));
}

// Every resource group with its resource count and spend this month and last,
// highest spend first, or null when not configured. A group that has been
// deleted but still cost money this month or last appears with no resources.
export async function listAzureProjects(env) {
  if (!configured(env)) return null;

  const token = await getToken(env);
  const [{ value: subscriptions }, groups] = await Promise.all([
    arm(token, "/subscriptions?api-version=2022-12-01"),
    graph(token, GROUPS)
  ]);

  const rows = [];
  for (const { subscriptionId, displayName } of subscriptions) {
    const [month, last] = await Promise.all([
      costs(token, subscriptionId, "MonthToDate"),
      costs(token, subscriptionId, "TheLastMonth")
    ]);
    const named = new Map(groups.filter((g) => g.subscriptionId === subscriptionId)
      .map((g) => [g.name.toLowerCase(), g]));
    for (const key of new Set([...named.keys(), ...month.keys(), ...last.keys()])) {
      const group = named.get(key);
      const base = `https://portal.azure.com/#resource/subscriptions/${subscriptionId}/resourceGroups/${group?.name || key}`;
      rows.push({
        name: group?.name || key,
        subscription: displayName,
        resources: group ? group.resources : 0,
        month: month.get(key) || null,
        last: last.get(key) || null,
        admin: group ? `${base}/overview` : null,
        costs: group ? `${base}/costanalysis` : null
      });
    }
  }
  return rows.sort((a, b) => (b.month?.cost || 0) - (a.month?.cost || 0) || (b.last?.cost || 0) - (a.last?.cost || 0));
}
