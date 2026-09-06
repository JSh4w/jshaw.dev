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
  a { color: var(--teal); }
  .muted { color: var(--muted); font-size: 13px; }
  ul.rows { list-style: none; margin: 0; padding: 0; }
  ul.rows > li { padding: 14px 0; border-top: 1px solid var(--rule); }
  .name { font-weight: 600; margin-bottom: 4px; }
  .links { display: flex; flex-wrap: wrap; gap: 14px; font-size: 13px; }
  .tech { font-family: ui-monospace, Menlo, monospace; font-size: 11px; color: var(--muted); margin-top: 4px; }
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
      project.site && `<a href="${project.site}">Site</a>`,
      project.github && `<a href="${project.github}">GitHub</a>`,
      project.frontend && `<a href="${project.frontend}">Frontend host</a>`,
      project.backend && `<a href="${project.backend}">Backend host</a>`,
      project.docs && `<a href="${project.docs}">Docs</a>`
    ].filter(Boolean).join("");

    return `<li>
      <div class="name">${escapeHtml(project.name)}</div>
      <div class="links">${links || '<span class="muted">no links</span>'}</div>
      ${project.tech.length ? `<div class="tech">${escapeHtml(project.tech.join(" · "))}</div>` : ""}
    </li>`;
  }).join("");

  return page("Projects", "/projects", `<h1>Projects</h1><ul class="rows">${rows}</ul>`);
}

export function hostingPage(sites, error) {
  if (error) {
    return page("Hosting", "/hosting",
      `<h1>Hosting</h1><p class="muted">${escapeHtml(error)}</p>`);
  }
  if (sites === null) {
    return page("Hosting", "/hosting", `
      <h1>Hosting</h1>
      <p class="muted">No Netlify token set. Create one at
      <a href="https://app.netlify.com/user/applications">app.netlify.com/user/applications</a>,
      then run <code>npx wrangler secret put NETLIFY_TOKEN</code>.</p>
    `);
  }

  const rows = sites.map((site) => `<li>
      <div class="name">${escapeHtml(site.name)}</div>
      <div class="links">
        <a href="${site.url}">Site</a>
        <a href="${site.admin}">Dashboard</a>
        ${site.repo ? `<a href="${site.repo}">Repo</a>` : ""}
      </div>
      <div class="tech">${site.published
        ? "published " + escapeHtml(formatDate(site.published))
        : "never published"}</div>
    </li>`).join("");

  return page("Hosting", "/hosting",
    `<h1>Hosting</h1><p class="muted">${sites.length} Netlify sites, live from the API.</p>
     <ul class="rows">${rows}</ul>`);
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
