// La eliminación de cuenta está implementada en me.js como onRequestDelete (DELETE /api/users/me)
// Este archivo no se usa pero se mantiene para evitar 404s si algún cliente lo invoca

import { handleOptions, errorResponse } from '../../lib/cors.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestDelete(context) {
  return errorResponse('Use DELETE /api/users/me to delete your account', 410, context.request, context.env);
}
