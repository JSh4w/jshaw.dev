import { getIdentity } from "./access.js";
import { html, helloPage, calendarPage, deniedPage } from "./pages.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    // Cloudflare Access gates every route. If the token is missing or invalid
    // the request never should have got here, so this is a hard stop.
    const identity = await getIdentity(request, env);
    if (!identity) return deniedPage();

    switch (path) {
      case "/":
        return helloPage(identity.email);

      // Ends the Access session, not an app session.
      case "/logout":
        return new Response(null, {
          status: 302,
          headers: { Location: `https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/logout` }
        });

      // Not wired up yet: the calendar source (Apple, via a published ICS feed
      // or CalDAV) has not been chosen. See backend/README.md.
      case "/calendar":
        return calendarPage(identity.email);

      default:
        return html("Not found", "<h1>Not found</h1>", 404);
    }
  }
};
