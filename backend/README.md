# Backend

The authenticated half of jsh4w.dev. The public site at the repo root stays a
static Eleventy build; anything needing a login or a database lives here and is
served from a subdomain (`app.jsh4w.dev`).

### Tools
- **Cloudflare Workers** — runs the backend code at the edge. No server to manage.
- **Cloudflare Access** — does the logging in. A policy in front of the Worker allows
  only listed email addresses; requests arrive already authenticated. This Worker
  has no password and issues no session of its own.
- **D1** — Cloudflare's managed SQLite database. Holds the stored OAuth tokens.
- **Wrangler** — Cloudflare's CLI. Runs the local dev server, applies migrations, deploys.

Workers is not Node. Native modules and long-running processes are unavailable;
code is written against web APIs (`fetch`, `crypto.subtle`).

### Structure
- `wrangler.toml` — config: the D1 binding, the cron trigger, the custom domain.
- `migrations/0001_init.sql` — the schema. Just `oauth_tokens`.
- `src/index.js` — the router. Every route requires a valid Access identity.
- `src/access.js` — verifies the JWT that Access attaches to each request.
- `src/pages.js` — the shared layout (sidebar plus content) and each page.
- `src/projects.js` — the project links shown on the Projects tab. Edit this
  file to add a project or fill in a missing hosting URL.
- `src/netlify.js` — calls the Netlify API for the Hosting tab.
- `src/render.js` — calls the Render API for the same tab.

### Routes
| Path | Purpose |
| --- | --- |
| `/projects` | Links for each project: GitHub, deployments, docs, key tech. |
| `/hosting` | Netlify sites and Render services, read live from their APIs. |
| `/todo` | Placeholder until the list is stored in D1. |
| `/calendar` | Placeholder until the calendar source is chosen. |
| `/logout` | Ends the Cloudflare Access session. |

### Setup
```
cd backend
npm install

# 1. Create the database, then paste the printed id into wrangler.toml
npx wrangler d1 create jshaw-dev

# 2. Apply the schema
npm run db:init:local     # local dev copy
npm run db:init           # the real one

# 3. Set the secrets
openssl rand -hex 32
npx wrangler secret put STATE_SECRET         # paste the random string above
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET

# 4. Run and deploy
npm run dev
npm run deploy
```

In the Google Cloud console, enable the Calendar API, create an OAuth client of
type "Web application", and add both redirect URIs:
`http://localhost:8787/auth/google/callback` and
`https://app.jsh4w.dev/auth/google/callback`.

Uncomment the `[[routes]]` block in `wrangler.toml` once `app.jsh4w.dev` exists
in Cloudflare DNS. Until then it deploys to a `workers.dev` subdomain.

### Access setup
In Cloudflare Zero Trust, add a self-hosted application covering this Worker's
hostname, with an Allow policy listing your email address and One-time PIN as the
login method. Then put two values into `wrangler.toml` under `[vars]`:
`ACCESS_TEAM_DOMAIN` (your `*.cloudflareaccess.com` domain) and `ACCESS_AUD`
(the application's Audience tag, on its Overview tab). Neither is secret.

### Notes
- Access authenticates the person; the Google OAuth flow authorises the app to
  read the calendar. They are separate and both are needed.
- The Worker verifies the Access JWT itself rather than trusting the edge, so it
  stays closed even if something reached it directly.
- The cron trigger refreshes the Google access token every six hours.
