// Utilidad de auditoría para registrar acciones administrativas y sensibles

/**
 * Registra una acción en el audit_log.
 * @param {D1Database} db
 * @param {{ userId: number|null, action: string, details?: object, ip?: string }} opts
 */
export async function logAudit(db, { userId = null, action, details = null, ip = null }) {
  try {
    await db
      .prepare(
        `INSERT INTO audit_log (user_id, action, details, ip_address)
         VALUES (?, ?, ?, ?)`
      )
      .bind(userId, action, details ? JSON.stringify(details) : null, ip)
      .run();
  } catch (err) {
    // El audit log nunca debe romper la operación principal
    console.error('Audit log error:', err.message);
  }
}
