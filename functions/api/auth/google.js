import { verifyGoogleJwt } from '../../lib/google-jwt.js';
import { generateSessionId, sessionCookie } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
import { checkRateLimit, getClientIP } from '../../lib/rate-limit.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  try {
    // Rate limiting por IP: máximo 10 intentos de login por minuto
    const ip = getClientIP(request);
    const rateCheck = await checkRateLimit(db, `ip:${ip}:auth`, 'auth');
    if (!rateCheck.ok) {
      return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateCheck.retryAfter),
        },
      });
    }

    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return errorResponse('Missing credential', 400, request);
    }

    const clientId = env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return errorResponse('Server configuration error', 500, request);
    }

    // Verificar JWT con claves públicas de Google
    const googleUser = await verifyGoogleJwt(credential, clientId);

    // Upsert usuario
    const existingUser = await db
      .prepare('SELECT id, login_count FROM users WHERE google_sub = ?')
      .bind(googleUser.sub)
      .first();

    let userId;

    if (existingUser) {
      await db
        .prepare(
          `UPDATE users
           SET email = ?, name = ?, picture_url = ?, last_login_at = datetime('now'), login_count = login_count + 1
           WHERE id = ?`
        )
        .bind(googleUser.email, googleUser.name, googleUser.picture, existingUser.id)
        .run();
      userId = existingUser.id;
    } else {
      const result = await db
        .prepare(
          `INSERT INTO users (google_sub, email, name, picture_url)
           VALUES (?, ?, ?, ?)`
        )
        .bind(googleUser.sub, googleUser.email, googleUser.name, googleUser.picture)
        .run();
      userId = result.meta.last_row_id;

      // Inscribir automáticamente en la temporada actual (INSERT OR IGNORE para idempotencia)
      try {
        await db
          .prepare('INSERT OR IGNORE INTO enrollments (user_id, season) VALUES (?, ?)')
          .bind(userId, 'S1')
          .run();
      } catch (enrollErr) {
        console.error('Enrollment error (non-fatal):', enrollErr.message);
      }
    }

    // Crear sesión
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    await db
      .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
      .bind(sessionId, userId, expiresAt)
      .run();

    // Obtener datos completos del usuario
    const user = await db
      .prepare(
        `SELECT id, email, name, display_name, picture_url, role, created_at
         FROM users WHERE id = ?`
      )
      .bind(userId)
      .first();

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          name: user.display_name || user.name,
          email: user.email,
          picture: user.picture_url,
          role: user.role,
          created_at: user.created_at,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': sessionCookie(sessionId),
          ...Object.fromEntries(
            Object.entries({
              'Access-Control-Allow-Origin': request.headers.get('Origin') || 'https://newcoders.org',
              'Access-Control-Allow-Credentials': 'true',
            })
          ),
        },
      }
    );
  } catch (err) {
    console.error('Auth error:', err.message);
    return errorResponse('Authentication failed', 401, request);
  }
}
