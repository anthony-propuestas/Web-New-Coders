import { generateSessionId } from '../../functions/lib/session.js';

export async function createAuthenticatedSession(db, {
  email = 'user@example.com',
  name = 'User',
  displayName = null,
  role = 'student',
  pictureUrl = null,
  season = 'S1',
  expiresAt,
  lastUsedAt,
} = {}) {
  const googleSub = generateSessionId();
  const userInsert = await db
    .prepare(
      `INSERT INTO users (google_sub, email, name, display_name, picture_url, role)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(googleSub, email, name, displayName, pictureUrl, role)
    .run();

  if (season) {
    await db
      .prepare('INSERT INTO enrollments (user_id, season) VALUES (?, ?)')
      .bind(userInsert.meta.last_row_id, season)
      .run();
  }

  const sessionId = generateSessionId();
  await db
    .prepare('INSERT INTO sessions (id, user_id, expires_at, last_used_at) VALUES (?, ?, ?, ?)')
    .bind(
      sessionId,
      userInsert.meta.last_row_id,
      expiresAt || new Date(Date.now() + 72 * 3600_000).toISOString(),
      lastUsedAt || new Date().toISOString()
    )
    .run();

  return { sessionId, userId: userInsert.meta.last_row_id, googleSub };
}