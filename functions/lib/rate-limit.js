// Rate limiting usando Cloudflare D1
// Ventana deslizante: cuenta peticiones dentro de un intervalo de tiempo

const LIMITS = {
  auth:     { max: 10, windowSeconds: 60  }, // 10 logins/minuto por IP
  progress: { max: 30, windowSeconds: 60  }, // 30 peticiones/minuto por usuario
  migrate:  { max: 3,  windowSeconds: 300 }, // 3 migraciones/5min por usuario
  profile:  { max: 20, windowSeconds: 60  }, // 20 actualizaciones/minuto por usuario
  chat:               { max: 10,   windowSeconds: 60      }, // 10 mensajes/minuto por usuario o IP
  chat_mensual:       { max: 100,  windowSeconds: 2592000 }, // 100 mensajes/30 días por usuario
  chat_global_mensual:{ max: 1000, windowSeconds: 2592000 }, // 1000 mensajes/30 días en total
};

/**
 * Verifica y actualiza el rate limit para una clave y tipo dados.
 * @param {D1Database} db - Base de datos D1
 * @param {string} key    - Identificador único (ej: 'ip:1.2.3.4:auth' o 'user:123:progress')
 * @param {string} type   - Tipo de límite: 'auth', 'progress', 'migrate', 'profile'
 * @returns {{ ok: boolean, retryAfter?: number }}
 */
export async function checkRateLimit(db, key, type) {
  const limit = LIMITS[type];
  if (!limit) return { ok: true };

  try {
    const windowStart = new Date(Date.now() - limit.windowSeconds * 1000).toISOString();

    // INSERT OR REPLACE con lógica de reset de ventana
    await db
      .prepare(
        `INSERT INTO rate_limit (key, count, window_start)
         VALUES (?, 1, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET
           count = CASE
             WHEN window_start < ? THEN 1
             ELSE count + 1
           END,
           window_start = CASE
             WHEN window_start < ? THEN datetime('now')
             ELSE window_start
           END`
      )
      .bind(key, windowStart, windowStart)
      .run();

    const row = await db
      .prepare('SELECT count FROM rate_limit WHERE key = ?')
      .bind(key)
      .first();

    if (row && row.count > limit.max) {
      return { ok: false, retryAfter: limit.windowSeconds };
    }

    return { ok: true };
  } catch (err) {
    console.error('Rate limit error:', err.message);
    return { ok: false, retryAfter: limit.windowSeconds, dbError: true }; // fail-safe: bloquear si la DB no está disponible
  }
}

/**
 * Obtiene la IP del cliente desde los headers de Cloudflare.
 * @param {Request} request
 * @returns {string}
 */
export function getClientIP(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  );
}
