import { describe, it, expect, vi } from 'vitest';
import { checkRateLimit, getClientIP } from '../functions/lib/rate-limit.js';

// Helper: crea un mock de D1Database
function createMockDB({ count = 0, shouldThrow = false } = {}) {
  const run = vi.fn().mockResolvedValue({});
  const first = vi.fn().mockResolvedValue({ count });
  const bind = vi.fn().mockReturnValue({ run, first });
  const prepare = vi.fn().mockReturnValue({ bind });
  if (shouldThrow) {
    prepare.mockImplementation(() => {
      throw new Error('DB error');
    });
  }
  return { prepare };
}

// Helper: crea un Request con headers opcionales
function makeRequest(headers = {}) {
  return new Request('https://newcoders.org/api/auth/google', { headers });
}

// ─── getClientIP ─────────────────────────────────────────────────────────────

describe('getClientIP', () => {
  it('devuelve el header CF-Connecting-IP (Cloudflare)', () => {
    const req = makeRequest({ 'CF-Connecting-IP': '1.2.3.4' });
    expect(getClientIP(req)).toBe('1.2.3.4');
  });

  it('usa X-Forwarded-For cuando no hay CF-Connecting-IP', () => {
    const req = makeRequest({ 'X-Forwarded-For': '5.6.7.8, 9.10.11.12' });
    expect(getClientIP(req)).toBe('5.6.7.8');
  });

  it('devuelve solo la primera IP de X-Forwarded-For (proxies múltiples)', () => {
    const req = makeRequest({ 'X-Forwarded-For': '10.0.0.1, 10.0.0.2, 10.0.0.3' });
    expect(getClientIP(req)).toBe('10.0.0.1');
  });

  it('devuelve "unknown" si no hay ningún header de IP', () => {
    expect(getClientIP(makeRequest())).toBe('unknown');
  });

  it('prefiere CF-Connecting-IP sobre X-Forwarded-For', () => {
    const req = makeRequest({
      'CF-Connecting-IP': '1.1.1.1',
      'X-Forwarded-For': '2.2.2.2',
    });
    expect(getClientIP(req)).toBe('1.1.1.1');
  });
});

// ─── checkRateLimit ──────────────────────────────────────────────────────────

describe('checkRateLimit — tipo desconocido', () => {
  it('devuelve ok:true para un tipo que no existe en LIMITS', async () => {
    const db = createMockDB();
    const result = await checkRateLimit(db, 'ip:1.2.3.4:X', 'tipo_inexistente');
    expect(result.ok).toBe(true);
  });
});

describe('checkRateLimit — tipo auth (máx 10/min)', () => {
  it('permite la petición cuando el conteo está bajo el límite (5/10)', async () => {
    const db = createMockDB({ count: 5 });
    const result = await checkRateLimit(db, 'ip:1.2.3.4:auth', 'auth');
    expect(result.ok).toBe(true);
  });

  it('permite la petición exactamente en el límite (10/10)', async () => {
    const db = createMockDB({ count: 10 });
    const result = await checkRateLimit(db, 'ip:1.2.3.4:auth', 'auth');
    expect(result.ok).toBe(true);
  });

  it('bloquea la petición cuando supera el límite (11/10)', async () => {
    const db = createMockDB({ count: 11 });
    const result = await checkRateLimit(db, 'ip:1.2.3.4:auth', 'auth');
    expect(result.ok).toBe(false);
  });

  it('devuelve retryAfter de 60 segundos al bloquear auth', async () => {
    const db = createMockDB({ count: 99 });
    const result = await checkRateLimit(db, 'ip:1.2.3.4:auth', 'auth');
    expect(result.retryAfter).toBe(60);
  });
});

describe('checkRateLimit — tipo progress (máx 30/min)', () => {
  it('permite la petición bajo el límite (15/30)', async () => {
    const db = createMockDB({ count: 15 });
    const result = await checkRateLimit(db, 'user:42:progress', 'progress');
    expect(result.ok).toBe(true);
  });

  it('bloquea la petición cuando supera el límite (31/30)', async () => {
    const db = createMockDB({ count: 31 });
    const result = await checkRateLimit(db, 'user:42:progress', 'progress');
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBe(60);
  });
});

describe('checkRateLimit — tipo migrate (máx 3/5min)', () => {
  it('permite bajo el límite (2/3)', async () => {
    const db = createMockDB({ count: 2 });
    const result = await checkRateLimit(db, 'user:42:migrate', 'migrate');
    expect(result.ok).toBe(true);
  });

  it('bloquea cuando supera el límite (4/3)', async () => {
    const db = createMockDB({ count: 4 });
    const result = await checkRateLimit(db, 'user:42:migrate', 'migrate');
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBe(300);
  });
});

describe('checkRateLimit — tipo profile (máx 20/min)', () => {
  it('permite bajo el límite (10/20)', async () => {
    const db = createMockDB({ count: 10 });
    const result = await checkRateLimit(db, 'user:42:profile', 'profile');
    expect(result.ok).toBe(true);
  });

  it('bloquea cuando supera el límite (21/20)', async () => {
    const db = createMockDB({ count: 21 });
    const result = await checkRateLimit(db, 'user:42:profile', 'profile');
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBe(60);
  });
});

describe('checkRateLimit — fail-open (la DB falla)', () => {
  it('devuelve ok:true cuando la DB lanza un error (no bloquea usuarios legítimos)', async () => {
    const db = createMockDB({ shouldThrow: true });
    const result = await checkRateLimit(db, 'ip:1.2.3.4:auth', 'auth');
    expect(result.ok).toBe(true);
    expect(result.retryAfter).toBeUndefined();
  });
});
