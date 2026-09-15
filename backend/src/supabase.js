// Supabase's Management API, called with a personal access token held as a
// Worker secret.
//
// Create one at https://supabase.com/dashboard/account/tokens, then:
//   npx wrangler secret put SUPABASE_TOKEN

const PROJECTS_URL = "https://api.supabase.com/v1/projects";

// Returns the projects, newest first, or null when no token is set.
export async function listSupabase(env) {
  if (!env.SUPABASE_TOKEN) return null;

  const response = await fetch(PROJECTS_URL, {
    headers: { Authorization: `Bearer ${env.SUPABASE_TOKEN}` }
  });
  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  }

  const projects = await response.json();
  return projects
    .map((project) => ({
      name: project.name,
      url: `https://${project.ref}.supabase.co`,
      admin: `https://supabase.com/dashboard/project/${project.ref}`,
      repo: null,
      // e.g. ACTIVE_HEALTHY, INACTIVE (paused)
      runtime: [project.status?.toLowerCase().replace(/_/g, " "), project.region].filter(Boolean).join(" · "),
      updated: project.created_at || null
    }))
    .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
}
