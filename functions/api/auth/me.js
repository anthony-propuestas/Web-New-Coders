import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);

  if (!user) {
    return errorResponse('Not authenticated', 401, request);
  }

  return jsonResponse({ user }, 200, request);
}
