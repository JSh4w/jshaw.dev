import { getUser, login, callback, logout } from "./auth.js";
import { page, projectsPage, hostingPage, hostingSection, azurePage, azureSection, todoPage, calendarPage } from "./pages.js";
import { listSites } from "./netlify.js";
import { listServices } from "./render.js";
import { listProjects } from "./vercel.js";
import { listCloudflare } from "./cloudflare.js";
import { listSupabase } from "./supabase.js";
import { listAzure, listAzureProjects } from "./azure.js";

// Hosting providers, keyed as in pages.js. Each loads from /hosting/<key>.
const HOSTING = {
  netlify: listSites,
  render: listServices,
  vercel: listProjects,
  cloudflare: listCloudflare,
  supabase: listSupabase,
  azure: listAzure
};

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";

    // The login routes are the only ones open to anyone.
    if (path === "/login") return login(request, env);
    if (path === "/auth/github/callback") return callback(request, env);
    if (path === "/logout") return logout(env);

    // Everything else needs the owner's GitHub account to be signed in.
    if (!(await getUser(request, env))) {
      return Response.redirect(new URL("/login", request.url).href, 302);
    }

    const provider = path.match(/^\/hosting\/([a-z]+)$/)?.[1];
    if (provider && Object.hasOwn(HOSTING, provider)) {
      return hostingSection(provider, HOSTING[provider](env));
    }

    switch (path) {
      case "/":
      case "/projects":
        return projectsPage();

      case "/hosting":
        return hostingPage();

      case "/azure":
        return azurePage();

      case "/azure/projects":
        return azureSection(listAzureProjects(env));

      case "/todo":
        return todoPage();

      case "/calendar":
        return calendarPage();

      default:
        return page("Not found", null, "<h1>Not found</h1>", 404);
    }
  }
};
