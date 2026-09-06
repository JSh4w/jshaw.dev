// Google Calendar via OAuth. Only the refresh token is durable; the access
// token is short-lived and re-minted here or by the scheduled job.

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

export function redirectUri(request) {
  return new URL("/auth/google/callback", request.url).toString();
}

export function consentUrl(request, env, state) {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(request),
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",   // required to receive a refresh token
    prompt: "consent",        // forces a new refresh token on re-consent
    state
  });
  return `${AUTH_URL}?${params}`;
}

async function postToken(env, body) {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      ...body
    })
  });
  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

export async function exchangeCode(request, env, code) {
  const token = await postToken(env, {
    code,
    redirect_uri: redirectUri(request),
    grant_type: "authorization_code"
  });
  if (!token.refresh_token) {
    throw new Error("Google returned no refresh token. Revoke the app's access and try again.");
  }
  await saveToken(env, token, token.refresh_token);
  return token;
}

async function saveToken(env, token, refreshToken) {
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    `INSERT INTO oauth_tokens (provider, access_token, refresh_token, scope, expires_at, updated_at)
     VALUES ('google', ?, ?, ?, ?, ?)
     ON CONFLICT(provider) DO UPDATE SET
       access_token = excluded.access_token,
       refresh_token = excluded.refresh_token,
       scope = excluded.scope,
       expires_at = excluded.expires_at,
       updated_at = excluded.updated_at`
  ).bind(
    token.access_token,
    refreshToken,
    token.scope || null,
    now + (token.expires_in || 3600),
    now
  ).run();
}

// Returns a valid access token, refreshing it if it is close to expiring.
export async function getAccessToken(env) {
  const row = await env.DB.prepare(
    "SELECT access_token, refresh_token, expires_at FROM oauth_tokens WHERE provider = 'google'"
  ).first();
  if (!row) return null;

  const now = Math.floor(Date.now() / 1000);
  if (row.access_token && row.expires_at > now + 120) return row.access_token;

  const token = await postToken(env, {
    refresh_token: row.refresh_token,
    grant_type: "refresh_token"
  });
  // A refresh response usually omits refresh_token; keep the stored one.
  await saveToken(env, token, token.refresh_token || row.refresh_token);
  return token.access_token;
}

export async function listUpcomingEvents(env, limit = 10) {
  const accessToken = await getAccessToken(env);
  if (!accessToken) return null;

  const params = new URLSearchParams({
    timeMin: new Date().toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: String(limit)
  });
  const response = await fetch(`${CALENDAR_URL}?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) {
    throw new Error(`Calendar request failed: ${response.status} ${await response.text()}`);
  }
  const data = await response.json();
  return (data.items || []).map((event) => ({
    id: event.id,
    summary: event.summary || "(no title)",
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
    location: event.location || null
  }));
}
