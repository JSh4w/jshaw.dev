import { getUser, login, callback, logout } from "./auth.js";
import { page, projectsPage, hostingPage, todoPage, calendarPage } from "./pages.js";
import { listSites } from "./netlify.js";
import { listServices } from "./render.js";
import { listProjects } from "./vercel.js";

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";

    // The login routes are the only ones open to anyone.
    if (path === "/login") return login(request, env);
    if (path === "/auth/github/callback") return callback(request, env);
    if (path === "/logout") return logout(env);

    // Everything else needs a signed-in, allowlisted GitHub user.
    if (!(await getUser(request, env))) {
      return Response.redirect(new URL("/login", request.url).href, 302);
    }

    switch (path) {
      case "/":
      case "/projects":
        return projectsPage();

      // Both providers are fetched together; one failing does not hide the other.
      case "/hosting": {
        const [netlify, render, vercel] = await Promise.allSettled([
          listSites(env), listServices(env), listProjects(env)
        ]);
        return hostingPage({
          netlify: netlify.status === "fulfilled" ? netlify.value : null,
          render: render.status === "fulfilled" ? render.value : null,
          vercel: vercel.status === "fulfilled" ? vercel.value : null,
          errors: {
            netlify: netlify.status === "rejected" ? netlify.reason.message : null,
            render: render.status === "rejected" ? render.reason.message : null,
            vercel: vercel.status === "rejected" ? vercel.reason.message : null
          }
        });
      }

      case "/todo":
        return todoPage();

      case "/calendar":
        return calendarPage();

      default:
        return page("Not found", null, "<h1>Not found</h1>", 404);
    }
  }
};
