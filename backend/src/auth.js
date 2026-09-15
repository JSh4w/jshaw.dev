// Logging in with GitHub. GitHub confirms who the visitor is; the Worker only
// lets in the one account whose numeric id is GITHUB_USER_ID, then issues its
// own session cookie. The id, unlike the username, never changes or gets reused.
// There is no sessions table: the cookie holds the id and an expiry,
// HMAC-signed with SESSION_SECRET, so it cannot be forged or extended.

import { deniedPage } from "./pages.js";

const WEEK = 7 * 24 * 60 * 60;
const encoder = new TextEncoder();

const toHex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (hex) => Uint8Array.from(hex.match(/../g) || [], (pair) => parseInt(pair, 16));

// Fails closed: without a secret, every cookie would be forgeable.
function hmacKey(env) {
  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
  return crypto.subtle.importKey(
    "raw", encoder.encode(env.SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]
  );
}

const isOwner = (env, id) => Boolean(env.GITHUB_USER_ID) && String(id) === env.GITHUB_USER_ID;

function readCookie(request, name) {
  const match = (request.headers.get("Cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}

const cookie = (name, value, maxAge) =>
  `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

function redirect(location, cookies) {
  const headers = new Headers({ Location: location });
  for (const value of cookies) headers.append("Set-Cookie", value);
  return new Response(null, { status: 302, headers });
}

// Returns the GitHub user id for a valid, unexpired session, or null.
export async function getUser(request, env) {
  const [id, expires, signature] = (readCookie(request, "session") || "").split(".");
  if (!signature || !(Number(expires) > Date.now() / 1000)) return null;

  const valid = await crypto.subtle.verify(
    "HMAC", await hmacKey(env), fromHex(signature), encoder.encode(`${id}.${expires}`)
  );
  return valid && isOwner(env, id) ? id : null;
}

// Sends the visitor to GitHub. The random state, echoed back in the callback
// and matched against a short-lived cookie, stops a forged login response.
export function login(request, env) {
  const state = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const url = new URL("https://github.com/login/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: new URL("/auth/github/callback", request.url).href,
    state,
    allow_signup: "false"
  });
  return redirect(url.href, [cookie("oauth_state", state, 600)]);
}

// GitHub returns here with a one-time code. Swap it for a token, ask GitHub who
// the token belongs to, then discard it: no GitHub access is kept.
export async function callback(request, env) {
  const params = new URL(request.url).searchParams;
  const state = readCookie(request, "oauth_state");
  if (!state || params.get("state") !== state) {
    return new Response("Login expired. Go back and try again.", { status: 400 });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: params.get("code") || ""
    })
  });
  const { access_token } = await tokenResponse.json();
  if (!access_token) return new Response("GitHub login failed.", { status: 400 });

  const userResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${access_token}`, "User-Agent": "jshaw-dev-backend" }
  });
  if (!userResponse.ok) return new Response("GitHub login failed.", { status: 400 });

  const { id } = await userResponse.json();
  if (!isOwner(env, id)) return deniedPage();

  const expires = Math.floor(Date.now() / 1000) + WEEK;
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(env), encoder.encode(`${id}.${expires}`));
  return redirect("/", [
    cookie("session", `${id}.${expires}.${toHex(signature)}`, WEEK),
    cookie("oauth_state", "", 0)
  ]);
}

export function logout(env) {
  return redirect(env.SITE_URL, [cookie("session", "", 0)]);
}
