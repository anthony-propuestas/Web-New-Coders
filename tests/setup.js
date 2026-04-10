import { afterEach, vi } from 'vitest';
import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

globalThis.atob = (value) => Buffer.from(value, 'base64').toString('binary');
globalThis.btoa = (value) => Buffer.from(value, 'binary').toString('base64');

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});