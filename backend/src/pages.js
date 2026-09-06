// Minimal server-rendered pages. Deliberately dependency-free: this is the
// logged-in area, not the public site, so it does not go through Eleventy.

function layout(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.5 system-ui, sans-serif; margin: 0; padding: 3rem 1.25rem; }
  main { max-width: 34rem; margin: 0 auto; }
  h1 { font-size: 1.4rem; margin: 0 0 1.5rem; }
  input, button { font: inherit; padding: .55rem .7rem; border-radius: 6px; border: 1px solid #8886; }
  button { cursor: pointer; }
  ul { list-style: none; padding: 0; }
  li { padding: .75rem 0; border-bottom: 1px solid #8883; }
  time { display: block; font-size: .85rem; opacity: .7; }
  .error { color: #c0392b; }
  .muted { opacity: .7; font-size: .9rem; }
</style>
</head>
<body><main>${body}</main></body>
</html>`;
}

export function html(title, body, status = 200, headers = {}) {
  return new Response(layout(title, body), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", ...headers }
  });
}

export function deniedPage() {
  return html("Not authorised", `
    <h1>Not authorised</h1>
    <p class="muted">This area is protected by Cloudflare Access. If you reached
    this page you are not signed in, or your session has expired.</p>
  `, 403);
}

export function helloPage(email) {
  return html("Hello", `
    <h1>Hello</h1>
    <p>You are signed in as <strong>${escapeHtml(email || "unknown")}</strong>.</p>
    <p class="muted">Cloudflare Access let you through and this Worker verified
    your token, so the private side is working.</p>
    <ul>
      <li><a href="/calendar">Calendar</a></li>
      <li><a href="/logout">Sign out</a></li>
    </ul>
  `);
}

export function calendarPage(email) {
  return html("Calendar", `
    <h1>Calendar</h1>
    <p class="muted">Not connected yet. The Apple calendar source still needs
    choosing: a published ICS feed, or CalDAV with an app-specific password.</p>
    <p><a href="/">Back</a></p>
  `);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
