import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
import { logAudit } from '../../lib/audit.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  try {
    // Verificar que completó los 30 días
    const progress = await db
      .prepare('SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?')
      .bind(user.id)
      .first();

    if (progress.count < 30) {
      return jsonResponse(
        { eligible: false, completed: progress.count, required: 30 },
        200,
        request,
        env
      );
    }

    // Obtener o registrar la fecha del certificado
    const userData = await db
      .prepare('SELECT name, display_name, certificate_generated_at FROM users WHERE id = ?')
      .bind(user.id)
      .first();

    let certDate = userData?.certificate_generated_at;

    if (!certDate) {
      certDate = new Date().toISOString();
      try {
        await db
          .prepare('UPDATE users SET certificate_generated_at = ? WHERE id = ?')
          .bind(certDate, user.id)
          .run();
      } catch {
        // La columna puede no existir aún en DBs previas (migration pendiente)
        certDate = new Date().toISOString();
      }

      await logAudit(db, { userId: user.id, action: 'certificate_generated' });
    }

    return jsonResponse(
      {
        eligible: true,
        completed: 30,
        name: userData?.display_name || userData?.name || user.name,
        issued_at: certDate,
      },
      200,
      request,
      env
    );
  } catch (err) {
    console.error('Certificate error:', err.message);
    return errorResponse('Failed to get certificate', 500, request, env);
  }
}
