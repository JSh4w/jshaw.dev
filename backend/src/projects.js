// Working links for each project.
//
//   site      the live thing, as a visitor sees it
//   frontend  where the frontend is hosted, i.e. the admin dashboard
//   backend   where the backend is hosted, likewise
//   github    the repository
//   docs      the write-up on the public site
//
// Any of them may be null. Hosting links point at the dashboard rather than
// the deployment, so they land somewhere you can actually change something.
export const projects = [
  {
    name: "GamJam",
    site: "https://gamjam2026.com/",
    frontend: "https://app.netlify.com/projects/gamjam/overview",
    backend: null,
    github: null,
    docs: null,
    tech: []
  },
  {
    name: "jsh4w.dev",
    site: "https://jsh4w.dev",
    frontend: "https://app.netlify.com/projects/jsh4w/overview",
    backend: "https://dash.cloudflare.com/63b444e071196e6c21c8d932308e697e/workers/services/view/jshaw-dev-backend",
    github: "https://github.com/JSh4w/jshaw.dev",
    docs: null,
    tech: ["eleventy", "netlify", "cloudflare-workers", "d1"]
  },
  {
    name: "Automated Financial Analysis Tool",
    site: "https://lucrum-stack.vercel.app",
    frontend: "https://vercel.com/jsh4ws-projects/lucrum-stack",
    backend: null,
    github: "https://github.com/JSh4w/financial_analyzer",
    docs: "https://jsh4w.dev/projects/Financial-Platform/",
    tech: ["python", "DuckDB", "PostgreSQL", "T212", "Alpaca"]
  },
  {
    name: "FloatVar",
    site: "https://floatvar.netlify.app/",
    frontend: "https://app.netlify.com/projects/floatvar/overview",
    backend: null,
    github: null,
    docs: "https://jsh4w.dev/projects/floatvar/",
    tech: ["javascript", "floating-point"]
  },
  {
    name: "House Hunter",
    site: null,
    frontend: null,
    backend: null,
    github: "https://github.com/JSh4w/House_hunter",
    docs: "https://jsh4w.dev/projects/house-hunter/",
    tech: ["python", "web-scraping", "nlp", "google-sheets"]
  },
  {
    name: "Train Delay Web Application",
    site: "https://trelay.netlify.app/",
    frontend: "https://app.netlify.com/projects/trelay/overview",
    backend: null,
    github: "https://github.com/jsh4w/hackathon",
    docs: "https://jsh4w.dev/projects/Train-Delay/",
    tech: ["react", "fastapi", "openai", "sqlite"]
  },
  {
    name: "Soft Robotic Manipulator Control",
    site: null,
    frontend: null,
    backend: null,
    github: null,
    docs: "https://jsh4w.dev/projects/system-identification/",
    tech: ["robotics", "machine-learning", "matlab"]
  },
  {
    name: "Molecular Electronic Devices",
    site: null,
    frontend: null,
    backend: null,
    github: null,
    docs: "https://jsh4w.dev/projects/molecular-electronics/",
    tech: ["research", "nanotechnology", "quantum-mechanics"]
  },
  {
    name: "Floating Point Arithmetic Tool",
    site: "https://jsh4w.github.io/",
    frontend: null,
    backend: null,
    github: "https://github.com/JSh4w/JSh4w.github.io",
    docs: "https://jsh4w.dev/projects/floating-point-tool/",
    tech: ["javascript", "floating-point"]
  },
  {
    name: "Stock Analysis Platform",
    site: null,
    frontend: null,
    backend: null,
    github: "https://github.com/JSh4w/stock_analyser",
    docs: "https://jsh4w.dev/projects/stock-analyser/",
    tech: ["react", "node.js", "mongodb"]
  }
];
