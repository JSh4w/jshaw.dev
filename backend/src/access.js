// Cloudflare Access does the authenticating at the edge. Every request that
// reaches this Worker already passed a policy, but we still verify the JWT it
// attaches: without this, anyone who found a way to reach the Worker directly
// would be trusted. Belt and braces, and it is also where we learn who is here.

const encoder = new TextEncoder();

let cachedKeys = null;
let cachedAt = 0;
const KEY_TTL_MS = 60 * 60 * 1000;

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function decodeJson(value) {
  return JSON.parse(new TextDecoder().decode(base64UrlDecode(value)));
}

// Access publishes its signing keys as a JWKS; they rotate, so cache briefly.
async function getKeys(env) {
  if (cachedKeys && Date.now() - cachedAt < KEY_TTL_MS) return cachedKeys;
  const response = await fetch(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error(`Could not fetch Access keys: ${response.status}`);
  const { keys } = await response.json();
  cachedKeys = keys;
  cachedAt = Date.now();
  return keys;
}

async function verifySignature(env, token) {
  const [headerPart, payloadPart, signaturePart] = token.split(".");
  if (!signaturePart) return false;

  const header = decodeJson(headerPart);
  const keys = await getKeys(env);
  const jwk = keys.find((candidate) => candidate.kid === header.kid);
  if (!jwk) return false;

  const key = await crypto.subtle.importKey(
    "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]
  );
  return crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlDecode(signaturePart),
    encoder.encode(`${headerPart}.${payloadPart}`)
  );
}

// Returns { email } for a valid Access token, or null.
export async function getIdentity(request, env) {
  const token = request.headers.get("Cf-Access-Jwt-Assertion")
    || readCookie(request, "CF_Authorization");
  if (!token) return null;

  try {
    if (!(await verifySignature(env, token))) return null;

    const payload = decodeJson(token.split(".")[1]);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    if (payload.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;

    // aud is the Application Audience tag; it ties the token to this app.
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(env.ACCESS_AUD)) return null;

    return { email: payload.email || null };
  } catch {
    return null;
  }
}

function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

// Signed, self-verifying value for the OAuth state parameter.
export async function signState(env, value) {
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(env.STATE_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
