import { getUser, login, callback, logout } from "./auth.js";
import { page, projectsPage, hostingPage, todoPage, calendarPage } from "./pages.js";
import { listSites } from "./netlify.js";
import { listServices } from "./render.js";
import { listProjects } from "./vercel.js";
import { listCloudflare } from "./cloudflare.js";
import { listSupabase } from "./supabase.js";

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

    switch (path) {
      case "/":
      case "/projects":
        return projectsPage();

      // All providers are fetched together, in the order pages.js lists them.
      case "/hosting":
        return hostingPage(await Promise.allSettled([
          listSites(env), listServices(env), listProjects(env), listCloudflare(env), listSupabase(env)
        ]));

      case "/todo":
        return todoPage();

      case "/calendar":
        return calendarPage();

      default:
        return page("Not found", null, "<h1>Not found</h1>", 404);
    }
  }
};
