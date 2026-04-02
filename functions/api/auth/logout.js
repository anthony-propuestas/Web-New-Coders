import { getSessionId, clearSessionCookie } from '../../lib/session.js';
import { handleOptions } from '../../lib/cors.js';
import { corsHeaders } from '../../lib/cors.js';
import { logAudit } from '../../lib/audit.js';
import { getClientIP } from '../../lib/rate-limit.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  const sessionId = getSessionId(request);
  let userId = null;
  if (sessionId) {
    const row = await db.prepare('SELECT user_id FROM sessions WHERE id = ?').bind(sessionId).first();
    userId = row?.user_id ?? null;
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  }

  const ip = getClientIP(request);
  await logAudit(db, { userId, action: 'logout', ip });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookie(),
      ...corsHeaders(request, env),
    },
  });
}
