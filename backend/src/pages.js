// Bare-bones server-rendered pages: a fixed sidebar and a content column.
// No client-side JavaScript, no framework, no build step.

import { projects } from "./projects.js";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/hosting", label: "Hosting" },
  { href: "/todo", label: "To-do" },
  { href: "/calendar", label: "Calendar" }
];

function layout(title, current, body) {
  const nav = NAV.map(({ href, label }) =>
    `<a href="${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>
  :root {
    color-scheme: light dark;
    --bg: #EDE6DA;
    --ink: #23211E;
    --muted: #5C5548;
    --rule: #C3B8A4;
    --teal: #0E4A48;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #191817; --ink: #E8E2D8; --muted: #9A9287; --rule: #35322D; --teal: #6FB3AC; }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font: 15px/1.55 system-ui, sans-serif;
    display: flex;
    min-height: 100vh;
  }
  nav {
    flex: 0 0 160px;
    border-right: 1px solid var(--rule);
    padding: 24px 0;
    display: flex;
    flex-direction: column;
  }
  nav a {
    padding: 8px 20px;
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    letter-spacing: 0.04em;
  }
  nav a:hover { color: var(--ink); }
  nav a[aria-current] { color: var(--ink); font-weight: 600; }
  nav .foot { margin-top: auto; font-size: 11px; }
  main { flex: 1; padding: 24px 28px; max-width: 900px; }
  h1 { font-size: 1.25rem; margin: 0 0 20px; font-weight: 600; }
  h2 { font-size: 0.8rem; margin: 28px 0 4px; font-weight: 600; letter-spacing: 0.08em;
       text-transform: uppercase; color: var(--muted); }
  h2:first-of-type { margin-top: 0; }
  a { color: var(--teal); }
  .muted { color: var(--muted); font-size: 13px; }
  ul.rows { list-style: none; margin: 0; padding: 0; }
  ul.rows > li {
    padding: 6px 0;
    border-top: 1px solid var(--rule);
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px 14px;
  }
  .name { font-weight: 600; }
  .links { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; }
  .tech {
    font-family: ui-monospace, Menlo, monospace;
    font-size: 11px;
    color: var(--muted);
    margin-left: auto;
    text-align: right;
  }
  input[type=search] {
    width: 100%;
    max-width: 280px;
    margin-bottom: 14px;
    padding: 6px 9px;
    font: inherit;
    font-size: 13px;
    color: inherit;
    background: transparent;
    border: 1px solid var(--rule);
    border-radius: 3px;
  }
  input[type=search]:focus { outline: 1px solid var(--teal); border-color: var(--teal); }
  li[hidden] { display: none; }
  @media (max-width: 600px) {
    body { display: block; }
    nav { flex-direction: row; border-right: 0; border-bottom: 1px solid var(--rule); padding: 8px; }
    nav .foot { margin-top: 0; margin-left: auto; }
  }
</style>
</head>
<body>
<nav>${nav}<a class="foot" href="/logout">Sign out</a></nav>
<main>${body}</main>
<script>
  // Filters rows in place. The only script on the page; without it the search
  // box does nothing and every row stays visible.
  var box = document.querySelector("input[type=search]");
  if (box) {
    var rows = Array.prototype.slice.call(document.querySelectorAll("ul.rows > li"));
    box.addEventListener("input", function () {
      var term = box.value.trim().toLowerCase();
      rows.forEach(function (row) {
        row.hidden = term !== "" && row.textContent.toLowerCase().indexOf(term) === -1;
      });
    });
  }
</script>
</body>
</html>`;
}

export function page(title, current, body, status = 200) {
  return new Response(layout(title, current, body), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

export function deniedPage() {
  return new Response("Not authorised", { status: 403 });
}

export function projectsPage() {
  const rows = projects.map((project) => {
    const links = [
      project.site && ext(project.site, "Site"),
      project.github && ext(project.github, "GitHub"),
      project.frontend && ext(project.frontend, "Frontend host"),
      project.backend && ext(project.backend, "Backend host"),
      project.docs && ext(project.docs, "Docs")
    ].filter(Boolean).join("");

    return `<li>
      <span class="name">${escapeHtml(project.name)}</span>
      <span class="links">${links || '<span class="muted">no links</span>'}</span>
      ${project.tech.length ? `<span class="tech">${escapeHtml(project.tech.join(" · "))}</span>` : ""}
    </li>`;
  }).join("");

  return page("Projects", "/projects",
    `<h1>Projects</h1>${searchBox("Filter projects")}<ul class="rows">${rows}</ul>`);
}

export function hostingPage({ netlify, render, vercel, errors }) {
  const sections = [
    hostingSection("Netlify", netlify, errors.netlify, "NETLIFY_TOKEN",
      "https://app.netlify.com/user/applications", (site) => site.published
        ? "published " + formatDate(site.published) : "never published"),
    hostingSection("Render", render, errors.render, "RENDER_TOKEN",
      "https://dashboard.render.com/u/settings#api-keys", (service) =>
        [service.runtime, service.region,
         service.updated && "updated " + formatDate(service.updated)]
          .filter(Boolean).join(" \u00b7 ")),
    hostingSection("Vercel", vercel, errors.vercel, "VERCEL_TOKEN",
      "https://vercel.com/account/tokens", (project) =>
        [project.runtime, project.updated && "deployed " + formatDate(project.updated)]
          .filter(Boolean).join(" \u00b7 ") || "no production deployment")
  ].join("");

  return page("Hosting", "/hosting",
    `<h1>Hosting</h1>${searchBox("Filter deployments")}${sections}`);
}

// One provider's block: a heading, then either its rows or why there are none.
function hostingSection(title, rows, error, secret, tokenUrl, meta) {
  let body;
  if (error) {
    body = `<p class="muted">${escapeHtml(error)}</p>`;
  } else if (rows === null) {
    body = `<p class="muted">No token set. Create one at
      <a href="${tokenUrl}">${escapeHtml(new URL(tokenUrl).hostname)}</a>,
      then run <code>npx wrangler secret put ${secret}</code>.</p>`;
  } else {
    body = `<ul class="rows">${rows.map((row) => `<li>
      <span class="name">${escapeHtml(row.name)}</span>
      <span class="links">
        ${row.url ? ext(row.url, "Live") : ""}
        ${row.admin ? ext(row.admin, "Dashboard") : ""}
        ${row.repo ? ext(row.repo, "Repo") : ""}
      </span>
      <span class="tech">${escapeHtml(meta(row))}</span>
    </li>`).join("")}</ul>`;
  }

  return `<h2>${title}</h2>${body}`;
}

function searchBox(placeholder) {
  return `<input type="search" placeholder="${placeholder}" autocomplete="off" spellcheck="false">`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB",
    { day: "numeric", month: "short", year: "numeric" });
}

export function todoPage() {
  return page("To-do", "/todo", `
    <h1>To-do</h1>
    <p class="muted">Nothing here yet. Items will be stored in D1 once the list
    is wired up.</p>
  `);
}

export function calendarPage() {
  return page("Calendar", "/calendar", `
    <h1>Calendar</h1>
    <p class="muted">Not connected. The Apple calendar source still needs
    choosing: a published ICS feed, or CalDAV with an app-specific password.</p>
  `);
}

// An external link: new tab, and rel=noopener so the opened page cannot reach
// back into this one through window.opener.
function ext(url, label) {
  const href = attr(url);
  return href
    ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    : "";
}

// Only http(s) URLs are emitted, so a javascript: or data: value coming back
// from a provider API cannot become a link.
function attr(value) {
  const url = String(value);
  return /^https?:\/\//i.test(url) ? escapeHtml(url) : "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
