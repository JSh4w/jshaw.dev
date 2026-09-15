-- OAuth tokens for third-party services, one row per provider (e.g. 'google').
-- The refresh token is the durable secret; the access token is short-lived and
-- replaced by the scheduled refresh.
--
-- There is no sessions table: the login session lives in a signed cookie.
CREATE TABLE IF NOT EXISTS oauth_tokens (
  provider       TEXT PRIMARY KEY,
  access_token   TEXT,
  refresh_token  TEXT NOT NULL,
  scope          TEXT,
  expires_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL
);
