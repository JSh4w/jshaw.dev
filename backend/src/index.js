import { getIdentity, signState, timingSafeEqual } from "./access.js";
import { consentUrl, exchangeCode, getAccessToken, listUpcomingEvents } from "./google.js";
import { html, helloPage, calendarPage, deniedPage } from "./pages.js";

function redirect(location) {
  return new Response(null, { status: 302, headers: { Location: location } });
}

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
        return redirect(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/logout`);

      case "/auth/google": {
        const state = await signState(env, identity.email || "anonymous");
        return redirect(consentUrl(request, env, state));
      }

      case "/auth/google/callback": {
        const expected = await signState(env, identity.email || "anonymous");
        if (!timingSafeEqual(url.searchParams.get("state") || "", expected)) {
          return html("Error", "<h1>Invalid state</h1>", 400);
        }
        const code = url.searchParams.get("code");
        if (!code) return html("Error", "<h1>No authorisation code returned</h1>", 400);
        await exchangeCode(request, env, code);
        return redirect("/calendar");
      }

      case "/calendar": {
        const events = await listUpcomingEvents(env);
        return calendarPage(events || [], events !== null, identity.email);
      }

      // JSON version of the same data, for anything built on top later.
      case "/api/calendar": {
        const events = await listUpcomingEvents(env);
        if (events === null) return Response.json({ error: "not_connected" }, { status: 409 });
        return Response.json({ events });
      }

      default:
        return html("Not found", "<h1>Not found</h1>", 404);
    }
  },

  // Scheduled: keep the Google access token fresh so a page load never waits.
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        await getAccessToken(env);
      } catch (error) {
        console.error("Token refresh failed:", error.message);
      }
    })());
  }
};
