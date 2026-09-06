[![Netlify Status](https://api.netlify.com/api/v1/badges/f7d1417e-0808-48ae-b292-02ff449caf2c/deploy-status)](https://app.netlify.com/sites/jsh4w/deploys)
# Personal website
Now hosted on: https://jsh4w.dev

### Tools
- **Eleventy** — static site generator. Turns the Markdown and Nunjucks files in `src/` into plain HTML in `_site/`.
- **Nunjucks** — templating language. Provides the page layouts that wrap each Markdown file.
- **Netlify** — hosting. Builds and deploys on every push to this repo.

### Structure
- `.eleventy.js` — Eleventy config. Sets `src/` as input and `_site/` as output, copies `assets/` and `styles/` through untouched, and builds the `projects` collection (sorted by each page's `order`).
- `src/index.md` — the home page.
- `src/projects/*.md` — one Markdown file per project; front matter sets the title, layout and `order`.
- `src/_includes/` — Nunjucks layouts. `base.njk` is the page shell, `project.njk` the project page template.
- `styles/` — CSS and web fonts, copied as-is.
- `assets/` — images, PDFs and the CV, copied as-is.
- `_site/` — generated output. Not committed.
- `backend/` — the authenticated app, deployed separately to Cloudflare Workers. Netlify ignores it. See `backend/README.md`.

### Build
```
npm install
npm run build   # build to _site/
npm start       # local dev server with live reload
```
