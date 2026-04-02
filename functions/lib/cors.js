const ALLOWED_ORIGIN = 'https://newcoders.org';

export function corsHeaders(request, env = null) {
  const origin = request.headers.get('Origin') || '';
  const devOrigins = env?.DEV_ORIGINS
    ? env.DEV_ORIGINS.split(',').map((o) => o.trim())
    : [];
  const isAllowed = origin === ALLOWED_ORIGIN || devOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function handleOptions(request, env = null) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });
}

export function jsonResponse(data, status = 200, request, env = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request, env),
    },
  });
}

export function errorResponse(message, status = 400, request, env = null) {
  return jsonResponse({ error: message }, status, request, env);
}
