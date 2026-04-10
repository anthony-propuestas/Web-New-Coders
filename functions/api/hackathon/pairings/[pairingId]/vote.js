import { getAuthenticatedUser } from '../../../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../../../lib/cors.js';
import { checkRateLimit } from '../../../../lib/rate-limit.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestPost(context) {
  const { request, env, params } = context;
  const db = env.DB;

  const voter = await getAuthenticatedUser(db, request);
  if (!voter) return errorResponse('Not authenticated', 401, request, env);

  const rateCheck = await checkRateLimit(db, `user:${voter.id}:hackathon_vote`, 'hackathon_vote');
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheck.retryAfter) },
    });
  }

  const pairingId = Number(params?.pairingId);
  if (!Number.isInteger(pairingId) || pairingId < 1) {
    return errorResponse('Invalid pairing id', 400, request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid request body', 400, request, env);
  }

  const votedForUserId = Number(body?.voted_for_user_id);
  if (!Number.isInteger(votedForUserId) || votedForUserId < 1) {
    return errorResponse('voted_for_user_id must be a positive integer', 400, request, env);
  }

  const pairing = await db
    .prepare(
      `SELECT p.id, p.participant_a_user_id, p.participant_b_user_id, p.status,
              r.status AS round_status
       FROM hackathon_pairings p
       JOIN hackathon_rounds r ON r.id = p.round_id
       WHERE p.id = ?`
    )
    .bind(pairingId)
    .first();

  if (!pairing) return errorResponse('Pairing not found', 404, request, env);
  if (pairing.round_status !== 'active' || pairing.status !== 'active') {
    return errorResponse('Voting is closed for this pairing', 409, request, env);
  }
  if (!pairing.participant_b_user_id) {
    return errorResponse('This pairing already has an automatic winner', 409, request, env);
  }
  if (votedForUserId !== pairing.participant_a_user_id && votedForUserId !== pairing.participant_b_user_id) {
    return errorResponse('Vote must target a participant in this pairing', 400, request, env);
  }

  const existingVote = await db
    .prepare('SELECT id FROM hackathon_votes WHERE pairing_id = ? AND voter_user_id = ?')
    .bind(pairingId, voter.id)
    .first();
  if (existingVote) {
    return errorResponse('You have already voted in this pairing', 409, request, env);
  }

  try {
    await db
      .prepare(
        `INSERT INTO hackathon_votes (pairing_id, voter_user_id, voted_for_user_id)
         VALUES (?, ?, ?)`
      )
      .bind(pairingId, voter.id, votedForUserId)
      .run();

    return jsonResponse({ ok: true, pairing_id: pairingId, voted_for_user_id: votedForUserId }, 201, request, env);
  } catch (err) {
    console.error('Hackathon vote error:', err.message);
    if (/UNIQUE constraint failed/i.test(err.message)) {
      return errorResponse('You have already voted in this pairing', 409, request, env);
    }
    return errorResponse('Failed to record vote', 500, request, env);
  }
}