import { getIdentity } from "./access.js";
import { page, projectsPage, hostingPage, todoPage, calendarPage, deniedPage } from "./pages.js";
import { listSites } from "./netlify.js";
import { listServices } from "./render.js";

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";

    // Cloudflare Access gates every route. If the token is missing or invalid
    // the request never should have got here, so this is a hard stop.
    if (!(await getIdentity(request, env))) return deniedPage();

    switch (path) {
      case "/":
      case "/projects":
        return projectsPage();

      // Both providers are fetched together; one failing does not hide the other.
      case "/hosting": {
        const [netlify, render] = await Promise.allSettled([
          listSites(env), listServices(env)
        ]);
        return hostingPage({
          netlify: netlify.status === "fulfilled" ? netlify.value : null,
          render: render.status === "fulfilled" ? render.value : null,
          errors: {
            netlify: netlify.status === "rejected" ? netlify.reason.message : null,
            render: render.status === "rejected" ? render.reason.message : null
          }
        });
      }

      case "/todo":
        return todoPage();

      case "/calendar":
        return calendarPage();

      // Ends the Access session, not an app session.
      case "/logout":
        return new Response(null, {
          status: 302,
          headers: { Location: `https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/logout` }
        });

      default:
        return page("Not found", null, "<h1>Not found</h1>", 404);
    }
  }
};
