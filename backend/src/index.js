import { getIdentity } from "./access.js";
import { page, projectsPage, todoPage, calendarPage, deniedPage } from "./pages.js";

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
