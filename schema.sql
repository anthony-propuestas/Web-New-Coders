-- New Coders - Cloudflare D1 Database Schema
-- Bootcamp de 30 días (Dev Path)

-- ============================================
-- Tabla: users
-- Cuentas de usuario vinculadas a Google OAuth
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  google_sub      TEXT    NOT NULL UNIQUE,
  email           TEXT    NOT NULL,
  name            TEXT    NOT NULL DEFAULT '',
  display_name    TEXT    DEFAULT NULL,
  picture_url     TEXT    DEFAULT NULL,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  last_login_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  login_count     INTEGER NOT NULL DEFAULT 1,
  is_active       INTEGER NOT NULL DEFAULT 1,
  role            TEXT    NOT NULL DEFAULT 'student',
  deleted_at      TEXT    DEFAULT NULL,
  certificate_generated_at TEXT DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
