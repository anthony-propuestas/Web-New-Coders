import { describe, it, expect } from 'vitest';
import { corsHeaders, handleOptions, jsonResponse, errorResponse } from '../functions/lib/cors.js';

function makeRequest(origin) {
  return new Request('https://newcoders.org/api/test', {
    headers: origin ? { Origin: origin } : {},
  });
}

describe('corsHeaders', () => {
  it('permite el origen de producción', () => {
    const headers = corsHeaders(makeRequest('https://newcoders.org'));
    expect(headers['Access-Control-Allow-Origin']).toBe('https://newcoders.org');
  });

  it('permite localhost:5173 (Vite dev)', () => {
    const headers = corsHeaders(makeRequest('http://localhost:5173'));
    expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
  });

  it('permite localhost:8788 (Wrangler dev)', () => {
    const headers = corsHeaders(makeRequest('http://localhost:8788'));
    expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:8788');
  });

  it('rechaza orígenes desconocidos y devuelve el origen de producción', () => {
    const headers = corsHeaders(makeRequest('https://sitio-malicioso.com'));
    expect(headers['Access-Control-Allow-Origin']).toBe('https://newcoders.org');
  });

  it('incluye Access-Control-Allow-Methods con todos los verbos necesarios', () => {
    const headers = corsHeaders(makeRequest('https://newcoders.org'));
    const methods = headers['Access-Control-Allow-Methods'];
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
    expect(methods).toContain('PATCH');
    expect(methods).toContain('DELETE');
    expect(methods).toContain('OPTIONS');
  });

  it('incluye Access-Control-Allow-Headers con Content-Type', () => {
    const headers = corsHeaders(makeRequest('https://newcoders.org'));
    expect(headers['Access-Control-Allow-Headers']).toContain('Content-Type');
  });

  it('incluye Access-Control-Allow-Credentials en true', () => {
    const headers = corsHeaders(makeRequest('https://newcoders.org'));
    expect(headers['Access-Control-Allow-Credentials']).toBe('true');
  });

  it('devuelve producción cuando no hay header Origin', () => {
    const headers = corsHeaders(makeRequest(null));
    expect(headers['Access-Control-Allow-Origin']).toBe('https://newcoders.org');
  });
});

describe('handleOptions', () => {
  it('devuelve status 204', () => {
    const res = handleOptions(makeRequest('https://newcoders.org'));
    expect(res.status).toBe(204);
  });

  it('incluye headers CORS en la respuesta', () => {
    const res = handleOptions(makeRequest('https://newcoders.org'));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://newcoders.org');
  });

  it('tiene cuerpo vacío (preflight)', async () => {
    const res = handleOptions(makeRequest('https://newcoders.org'));
    const body = await res.text();
    expect(body).toBe('');
  });
});

describe('jsonResponse', () => {
  it('devuelve status 200 por defecto', () => {
    const res = jsonResponse({ ok: true }, 200, makeRequest('https://newcoders.org'));
    expect(res.status).toBe(200);
  });

  it('usa el status code proporcionado', () => {
    const res = jsonResponse({}, 201, makeRequest('https://newcoders.org'));
    expect(res.status).toBe(201);
  });

  it('tiene Content-Type: application/json', () => {
    const res = jsonResponse({ ok: true }, 200, makeRequest('https://newcoders.org'));
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  it('serializa el objeto correctamente', async () => {
    const res = jsonResponse({ mensaje: 'hola mundo' }, 200, makeRequest('https://newcoders.org'));
    const body = await res.json();
    expect(body).toEqual({ mensaje: 'hola mundo' });
  });

  it('incluye headers CORS', () => {
    const res = jsonResponse({}, 200, makeRequest('http://localhost:5173'));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
  });
});

describe('errorResponse', () => {
  it('envuelve el mensaje en { error }', async () => {
    const res = errorResponse('No encontrado', 404, makeRequest('https://newcoders.org'));
    const body = await res.json();
    expect(body).toEqual({ error: 'No encontrado' });
  });

  it('usa status 400 por defecto', () => {
    const res = errorResponse('Petición incorrecta', undefined, makeRequest('https://newcoders.org'));
    expect(res.status).toBe(400);
  });

  it('usa el status code proporcionado', () => {
    const res = errorResponse('No autorizado', 401, makeRequest('https://newcoders.org'));
    expect(res.status).toBe(401);
  });

  it('devuelve 403 para acceso prohibido', () => {
    const res = errorResponse('Prohibido', 403, makeRequest('https://newcoders.org'));
    expect(res.status).toBe(403);
  });

  it('incluye Content-Type: application/json', () => {
    const res = errorResponse('Error', 500, makeRequest('https://newcoders.org'));
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });
});
