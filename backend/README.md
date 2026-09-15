# Backend

The authenticated half of jsh4w.dev. The public site at the repo root stays a
static Eleventy build; anything needing a login or a database lives here and is
served from a subdomain (`app.jsh4w.dev`).

### Tools
- **Cloudflare Workers** — runs the backend code at the edge. No server to manage.
- **GitHub OAuth** — does the logging in. Only usernames listed in
  `ALLOWED_GITHUB_USERS` get in; the Worker then issues a signed session cookie.
- **D1** — Cloudflare's managed SQLite database.
- **Wrangler** — Cloudflare's CLI. Runs the local dev server, applies migrations, deploys.

Workers is not Node. Native modules and long-running processes are unavailable;
code is written against web APIs (`fetch`, `crypto.subtle`).

### Structure
- `wrangler.toml` — config: the D1 binding, the allowlist, the custom domain.
- `migrations/0001_init.sql` — the schema. Just `oauth_tokens`.
- `src/index.js` — the router. Every route except the login ones needs a session.
- `src/auth.js` — the GitHub login flow and the signed session cookie.
- `src/pages.js` — the shared layout (sidebar plus content) and each page.
- `src/projects.js` — the project links shown on the Projects tab. Edit this
  file to add a project or fill in a missing hosting URL.
- `src/netlify.js` — calls the Netlify API for the Hosting tab.
- `src/render.js` — calls the Render API for the same tab.
- `src/vercel.js` — calls the Vercel API for the same tab.

### Routes
| Path | Purpose |
| --- | --- |
| `/projects` | Links for each project: GitHub, deployments, docs, key tech. |
| `/hosting` | Netlify, Render and Vercel deployments, read live from their APIs. |
| `/todo` | Placeholder until the list is stored in D1. |
| `/calendar` | Placeholder until the calendar source is chosen. |
| `/login` | Sends you to GitHub to sign in. |
| `/auth/github/callback` | Where GitHub sends you back; sets the session. |
| `/logout` | Clears the session. |

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
npx wrangler secret put SESSION_SECRET       # paste the random string above
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET

# 4. Run and deploy
npm run dev
npm run deploy
```

On GitHub, go to Settings → Developer settings → OAuth Apps → New OAuth App.
Set the callback URL to the Worker's address plus `/auth/github/callback`, e.g.
`https://jshaw-dev-backend.jshaw-dev-backend.workers.dev/auth/github/callback`.
An OAuth app allows one callback URL, so for local dev make a second app with
`http://localhost:8787/auth/github/callback` and put its values in `.dev.vars`:
```
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
SESSION_SECRET=...
```

Uncomment the `[[routes]]` block in `wrangler.toml` once `app.jsh4w.dev` exists
in Cloudflare DNS. Until then it deploys to a `workers.dev` subdomain.

### Notes
- The GitHub token is used once to read your username, then discarded. The app
  asks for no scopes, so it can only see public profile information.
- The session lasts a week. The allowlist is rechecked on every request, so
  removing a username locks it out at once; changing `SESSION_SECRET` signs
  everyone out.
- The allowlist matches usernames. If you rename your GitHub account, update
  `ALLOWED_GITHUB_USERS`, because someone else could claim the old name.
