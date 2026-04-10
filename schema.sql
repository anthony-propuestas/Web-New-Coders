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

-- ============================================
-- Tabla: sessions
-- Sesiones server-side (cookie HTTP-only)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT    PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at   TEXT    NOT NULL,
  last_used_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ============================================
-- Tabla: enrollments
-- Inscripciones por temporada/cohorte
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  season       TEXT    NOT NULL DEFAULT 'S1',
  enrolled_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, season)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_season ON enrollments(season);

-- ============================================
-- Tabla: hackathon_registrations
-- Inscripciones a hackathones por usuario
-- ============================================
CREATE TABLE IF NOT EXISTS hackathon_registrations (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name    TEXT    NOT NULL,
  github_profile  TEXT    NOT NULL,
  category        TEXT    NOT NULL CHECK (category IN ('starter', 'deployer')),
  registered_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_user ON hackathon_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_category ON hackathon_registrations(category);

-- ============================================
-- Tabla: hackathon_rounds
-- Rondas por categoría para la hackathon
-- ============================================
CREATE TABLE IF NOT EXISTS hackathon_rounds (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  round_number  INTEGER NOT NULL CHECK (round_number >= 1),
  category      TEXT    NOT NULL CHECK (category IN ('starter', 'deployer')),
  status        TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  started_at    TEXT    DEFAULT NULL,
  closed_at     TEXT    DEFAULT NULL,
  UNIQUE(round_number, category)
);

CREATE INDEX IF NOT EXISTS idx_hackathon_rounds_category_status ON hackathon_rounds(category, status);

-- ============================================
-- Tabla: hackathon_pairings
-- Emparejamientos dentro de una ronda
-- ============================================
CREATE TABLE IF NOT EXISTS hackathon_pairings (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  round_id              INTEGER NOT NULL REFERENCES hackathon_rounds(id) ON DELETE CASCADE,
  pair_number           INTEGER NOT NULL CHECK (pair_number >= 1),
  participant_a_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_b_user_id INTEGER DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE,
  winner_user_id        INTEGER DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
  votes_for_a           INTEGER NOT NULL DEFAULT 0,
  votes_for_b           INTEGER NOT NULL DEFAULT 0,
  status                TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at            TEXT    NOT NULL DEFAULT (datetime('now')),
  closed_at             TEXT    DEFAULT NULL,
  UNIQUE(round_id, pair_number)
);

CREATE INDEX IF NOT EXISTS idx_hackathon_pairings_round ON hackathon_pairings(round_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_pairings_status ON hackathon_pairings(status);

-- ============================================
-- Tabla: hackathon_votes
-- Votos por emparejamiento
-- ============================================
CREATE TABLE IF NOT EXISTS hackathon_votes (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  pairing_id        INTEGER NOT NULL REFERENCES hackathon_pairings(id) ON DELETE CASCADE,
  voter_user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  voted_for_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(pairing_id, voter_user_id)
);

CREATE INDEX IF NOT EXISTS idx_hackathon_votes_pairing ON hackathon_votes(pairing_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_votes_voter ON hackathon_votes(voter_user_id);

-- ============================================
-- Tabla: lesson_completions
-- Registro de lecciones completadas por usuario
-- ============================================
CREATE TABLE IF NOT EXISTS lesson_completions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_number   INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  completed_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_completions_user ON lesson_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_completed_at ON lesson_completions(completed_at);

-- ============================================
-- Tabla: rate_limit
-- Control de peticiones por IP o usuario
-- ============================================
CREATE TABLE IF NOT EXISTS rate_limit (
  key          TEXT    PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 0,
  window_start TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================
-- Tabla: audit_log
-- Registro de acciones administrativas y sensibles
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action     TEXT    NOT NULL,
  details    TEXT    DEFAULT NULL,
  ip_address TEXT    DEFAULT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

-- ============================================
-- Tabla: achievements
-- Logros/badges ganados por el usuario
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT    NOT NULL,
  earned_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, type)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);

-- ============================================
-- Tabla: user_settings
-- Preferencias y configuración del usuario
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id              INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_notifications  INTEGER NOT NULL DEFAULT 1,
  language             TEXT    NOT NULL DEFAULT 'es',
  updated_at           TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================
-- Columnas adicionales en users (GDPR + certificados)
-- NOTA: Ejecutar ALTER TABLE en producción si la DB ya existe
-- ============================================
-- ALTER TABLE users ADD COLUMN deleted_at TEXT DEFAULT NULL;
-- ALTER TABLE users ADD COLUMN certificate_generated_at TEXT DEFAULT NULL;
