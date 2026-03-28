import { describe, it, expect, vi } from 'vitest';
import { logAudit } from '../functions/lib/audit.js';

// Helper: crea un mock de D1Database que registra las llamadas
function createMockDB({ shouldThrow = false } = {}) {
  const run = vi.fn().mockResolvedValue({});
  const bind = vi.fn().mockReturnValue({ run });
  const prepare = vi.fn().mockReturnValue({ bind });
  if (shouldThrow) {
    prepare.mockImplementation(() => {
      throw new Error('D1 database error');
    });
  }
  return { prepare, _bind: bind, _run: run };
}

// ─── logAudit ────────────────────────────────────────────────────────────────

describe('logAudit', () => {
  it('inserta un registro en audit_log con todos los campos', async () => {
    const db = createMockDB();
    await logAudit(db, {
      userId: 42,
      action: 'login',
      details: { method: 'google' },
      ip: '1.2.3.4',
    });
    expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO audit_log'));
  });

  it('serializa details como JSON', async () => {
    const db = createMockDB();
    const details = { reason: 'petición del usuario', items: [1, 2] };
    await logAudit(db, { userId: 1, action: 'delete', details, ip: '127.0.0.1' });
    expect(db._bind).toHaveBeenCalledWith(
      1,
      'delete',
      JSON.stringify(details),
      '127.0.0.1'
    );
  });

  it('pasa null cuando details no se proporciona', async () => {
    const db = createMockDB();
    await logAudit(db, { userId: 1, action: 'export' });
    expect(db._bind).toHaveBeenCalledWith(1, 'export', null, null);
  });

  it('pasa null cuando details es null explícitamente', async () => {
    const db = createMockDB();
    await logAudit(db, { userId: 1, action: 'login', details: null, ip: '10.0.0.1' });
    expect(db._bind).toHaveBeenCalledWith(1, 'login', null, '10.0.0.1');
  });

  it('permite userId null (acciones sin usuario autenticado)', async () => {
    const db = createMockDB();
    await expect(
      logAudit(db, { userId: null, action: 'failed_login', ip: '1.2.3.4' })
    ).resolves.not.toThrow();
    expect(db._bind).toHaveBeenCalledWith(null, 'failed_login', null, '1.2.3.4');
  });

  it('NO lanza error si la DB falla (el audit nunca rompe la operación principal)', async () => {
    const db = createMockDB({ shouldThrow: true });
    await expect(
      logAudit(db, { userId: 1, action: 'login', ip: '1.2.3.4' })
    ).resolves.not.toThrow();
  });

  it('registra distintos tipos de acciones sensibles', async () => {
    const acciones = ['login', 'logout', 'delete_account', 'export_data', 'admin_action'];
    for (const action of acciones) {
      const db = createMockDB();
      await logAudit(db, { userId: 1, action, ip: '0.0.0.0' });
      expect(db.prepare).toHaveBeenCalled();
    }
  });
});
