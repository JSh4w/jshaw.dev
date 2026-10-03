// Bare-bones server-rendered pages: a fixed sidebar and a content column.
// No client-side JavaScript, no framework, no build step.

import { projects } from "./projects.js";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/hosting", label: "Hosting" },
  { href: "/azure", label: "Azure" },
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
  // Filters rows in place, and fills each [data-src] block from its URL once
  // the page is showing. The only script on the page.
  var box = document.querySelector("input[type=search]");
  function filter() {
    var term = box ? box.value.trim().toLowerCase() : "";
    document.querySelectorAll("ul.rows > li").forEach(function (row) {
      row.hidden = term !== "" && row.textContent.toLowerCase().indexOf(term) === -1;
    });
  }
  if (box) box.addEventListener("input", filter);
  document.querySelectorAll("[data-src]").forEach(function (block) {
    fetch(block.dataset.src)
      .then(function (response) { if (!response.ok) throw new Error(); return response.text(); })
      .then(function (html) { block.innerHTML = html; filter(); })
      .catch(function () { block.innerHTML = '<p class="muted">Could not load. Refresh to try again.</p>'; });
  });
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

// One entry per provider, keyed as in index.js and the /hosting/<key> route:
// the secrets it needs, where to create them, and the detail on each row.
const detail = (...parts) => parts.filter(Boolean).join(" \u00b7 ");
const PROVIDERS = {
  netlify: [["NETLIFY_TOKEN"], "https://app.netlify.com/user/applications",
    (site) => site.published ? "published " + formatDate(site.published) : "never published"],
  render: [["RENDER_TOKEN"], "https://dashboard.render.com/u/settings#api-keys",
    (row) => detail(row.runtime, row.region, row.updated && "updated " + formatDate(row.updated))],
  vercel: [["VERCEL_TOKEN"], "https://vercel.com/account/tokens",
    (row) => detail(row.runtime, row.updated && "deployed " + formatDate(row.updated)) || "no production deployment"],
  cloudflare: [["CLOUDFLARE_API_TOKEN"], "https://dash.cloudflare.com/profile/api-tokens",
    (row) => detail(row.runtime, row.updated && "updated " + formatDate(row.updated))],
  supabase: [["SUPABASE_TOKEN"], "https://supabase.com/dashboard/account/tokens",
    (row) => detail(row.runtime, row.updated && "created " + formatDate(row.updated))],
  azure: [["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET"], "https://portal.azure.com/",
    (row) => detail(row.runtime, row.updated && "updated " + formatDate(row.updated))]
};

// The page shows at once with a placeholder per provider; the script then
// loads each from /hosting/<key>, so a slow API only holds up its own section.
export function hostingPage() {
  const sections = Object.keys(PROVIDERS).map((key) =>
    `<h2>${key[0].toUpperCase() + key.slice(1)}</h2>
    <div data-src="/hosting/${key}"><p class="muted">Loading\u2026</p></div>`
  ).join("");

  return page("Hosting", "/hosting",
    `<h1>Hosting</h1>${searchBox("Filter deployments")}${sections}`);
}

// One provider's rows, or why there are none. Cached in the browser for a
// minute, so flicking back to the tab does not call every API again.
export async function hostingSection(key, list) {
  const [secrets, tokenUrl, meta] = PROVIDERS[key];
  let body;
  try {
    const rows = await list;
    body = rows === null
      ? `<p class="muted">Not connected. Create a token at
        <a href="${tokenUrl}">${escapeHtml(new URL(tokenUrl).hostname)}</a>, then run
        ${secrets.map((name) => `<code>npx wrangler secret put ${name}</code>`).join(", ")}.</p>`
      : `<ul class="rows">${rows.map((row) => `<li>
        <span class="name">${escapeHtml(row.name)}</span>
        <span class="links">
          ${row.url ? ext(row.url, "Live") : ""}
          ${row.admin ? ext(row.admin, "Dashboard") : ""}
          ${row.repo ? ext(row.repo, "Repo") : ""}
        </span>
        <span class="tech">${escapeHtml(meta(row))}</span>
      </li>`).join("")}</ul>`;
  } catch (error) {
    body = `<p class="muted">${escapeHtml(error.message)}</p>`;
  }

  return new Response(body, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, max-age=60" }
  });
}

// Azure spending, one row per resource group. Loaded like a hosting section,
// and cached for ten minutes because Cost Management rate-limits hard.
export function azurePage() {
  return page("Azure", "/azure", `<h1>Azure</h1>${searchBox("Filter resource groups")}
    <div data-src="/azure/projects"><p class="muted">Loading\u2026</p></div>`);
}

export async function azureSection(list) {
  let body;
  try {
    const rows = await list;
    if (rows === null) {
      body = `<p class="muted">Not connected. See the top of <code>src/azure.js</code> to create a
        service principal, then run ${PROVIDERS.azure[0].map((name) =>
          `<code>npx wrangler secret put ${name}</code>`).join(", ")}.</p>`;
    } else {
      const total = (field) => Object.entries(rows.reduce((sums, row) => {
        if (row[field]) sums[row[field].currency] = (sums[row[field].currency] || 0) + row[field].cost;
        return sums;
      }, {})).map(([currency, cost]) => money({ cost, currency })).join(" + ") || money(null);

      body = `<h2>Spending</h2>
        <p><span class="name">${total("month")}</span> this month so far
        <span class="muted">\u00b7 ${total("last")} last month \u00b7 can lag by up to a day</span></p>
        <h2>Resource groups</h2>
        <ul class="rows">${rows.map((row) => `<li>
          <span class="name">${escapeHtml(row.name)}</span>
          <span class="links">
            ${row.admin ? ext(row.admin, "Portal") : '<span class="muted">deleted</span>'}
            ${row.costs ? ext(row.costs, "Cost analysis") : ""}
          </span>
          <span class="tech">${escapeHtml(detail(
            money(row.month) + " this month",
            money(row.last) + " last month",
            row.resources + (row.resources === 1 ? " resource" : " resources"),
            row.subscription
          ))}</span>
        </li>`).join("")}</ul>`;
    }
  } catch (error) {
    body = `<p class="muted">${escapeHtml(error.message)}</p>`;
  }

  return new Response(body, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, max-age=600" }
  });
}

function money(amount) {
  if (!amount) return "\u2013";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: amount.currency || "GBP" })
    .format(amount.cost);
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
