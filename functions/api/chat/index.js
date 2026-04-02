import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
import { checkRateLimit, getClientIP } from '../../lib/rate-limit.js';

const SYSTEM_PROMPT = `Eres un asistente virtual del sitio newcoders.org, un reto de programacion gratuito por temporadas de 30 días para aprender desarrollo de software desde cero en español. Solo puedes responder preguntas sobre:
- El contenido y currículo del curso temporada 1 (HTML días 1-7, CSS días 8-14, JavaScript días 15-21, Eventos/Proyectos/Python días 22-26, Fullstack/Deploy días 27-30)
- Cómo usar y navegar el sitio web newcoders.org
- Conceptos de programación web cubiertos en el programa (HTML, CSS, JavaScript, Python, despliegue web)
- Dudas sobre las lecciones, ejercicios y proyectos del curso
- Cómo inscribirse, completar lecciones, ver progreso y obtener el certificado

Si el usuario pregunta algo que no esté relacionado con newcoders.org o el desarrollo de software enseñado en el curso, responde amablemente y agrega chiste de ves en cuando.

Recuerda que solo puedes ayudar con temas del curso. Responde siempre en español de forma clara y concisa. Mantén las respuestas breves (máximo 3-4 oraciones) a menos que el usuario pida una explicación detallada.`;

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!env.OPENAI_API_KEY) {
    return errorResponse('Servicio no disponible', 503, request, env);
  }

  // Rate limit: por usuario si está autenticado, por IP si es anónimo
  const user = await getAuthenticatedUser(db, request);
  const userKey = user
    ? `user:${user.id}:chat`
    : `ip:${getClientIP(request)}:chat`;

  // 1. Límite global mensual (1000 mensajes/mes entre todos los usuarios)
  const globalCheck = await checkRateLimit(db, 'global:chat', 'chat_global_mensual');
  if (!globalCheck.ok) {
    return new Response(
      JSON.stringify({ error: 'El asistente ha alcanzado su límite mensual. Vuelve el próximo mes.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(globalCheck.retryAfter) } }
    );
  }

  // 2. Límite mensual por usuario (100 mensajes/mes)
  const monthlyKey = user ? `user:${user.id}:chat_mensual` : `ip:${getClientIP(request)}:chat_mensual`;
  const monthlyCheck = await checkRateLimit(db, monthlyKey, 'chat_mensual');
  if (!monthlyCheck.ok) {
    return new Response(
      JSON.stringify({ error: 'Alcanzaste tu límite de 100 mensajes este mes. Vuelve el próximo mes.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(monthlyCheck.retryAfter) } }
    );
  }

  // 3. Límite por minuto (10 mensajes/minuto, anti-spam)
  const rateCheck = await checkRateLimit(db, userKey, 'chat');
  if (!rateCheck.ok) {
    return new Response(
      JSON.stringify({ error: 'Demasiadas peticiones. Intenta de nuevo en un minuto.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheck.retryAfter) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Cuerpo de la petición inválido', 400, request, env);
  }

  const { message, history } = body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return errorResponse('El mensaje no puede estar vacío', 400, request, env);
  }
  if (message.length > 500) {
    return errorResponse('El mensaje es demasiado largo (máximo 500 caracteres)', 400, request, env);
  }

  // Detectar intentos de prompt injection
  const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /forget\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /you\s+are\s+now\s+(?!a\s+(helpful|learning))/i,
    /\bsystem\s*:\s*\[/i,
    /\[INST\]|\[\/INST\]/i,
    /###\s*(system|instruction|prompt)/i,
    /<\|im_start\|>|<\|im_end\|>/i,
  ];
  if (INJECTION_PATTERNS.some((re) => re.test(message))) {
    return errorResponse('Mensaje no permitido', 400, request, env);
  }

  // Construir historial limitado (máximo 10 mensajes previos)
  const safeHistory = Array.isArray(history)
    ? history
        .slice(-10)
        .filter(
          (m) =>
            m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string' &&
            m.content.length > 0
        )
        .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }))
    : [];

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: 'user', content: message.trim() },
  ];

  let openAIResponse;
  try {
    openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
  } catch (err) {
    console.error('Error al conectar con OpenAI:', err.message);
    return errorResponse('Error al conectar con el servicio de IA', 502, request, env);
  }

  if (!openAIResponse.ok) {
    const errText = await openAIResponse.text().catch(() => '');
    console.error('Error de OpenAI:', openAIResponse.status, errText);
    return errorResponse('Error en el servicio de IA', 502, request, env);
  }

  let aiData;
  try {
    aiData = await openAIResponse.json();
  } catch {
    return errorResponse('Respuesta inválida del servicio de IA', 502, request, env);
  }

  const reply = aiData?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return errorResponse('No se obtuvo respuesta del asistente', 502, request, env);
  }

  return jsonResponse({ reply }, 200, request, env);
}
