import { getSessionId, clearSessionCookie } from '../../lib/session.js';
import { handleOptions } from '../../lib/cors.js';
import { corsHeaders } from '../../lib/cors.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  const sessionId = getSessionId(request);
  if (sessionId) {
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookie(),
      ...corsHeaders(request),
    },
  });
}
