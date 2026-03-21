# Analisis y Mejoras de Seguridad

## Reporte de Auditoria de Seguridad

### Resumen Ejecutivo
- **Tipo de Aplicacion**: React SPA + API REST serverless (Cloudflare Workers + D1)
- **Tipo de Datos**: Contenido educativo + Perfil Google (nombre, email, foto) + Progreso en servidor
- **Autenticacion**: Google OAuth 2.0 con verificacion JWT criptografica server-side (RS256 + JWKS)
- **Sesiones**: HTTP-only cookies server-side persistidas en Cloudflare D1
- **Nivel de Riesgo General**: BAJO

---

## Controles de Seguridad Implementados

### 1. **Autenticacion Server-Side con Google OAuth**

#### Flujo de autenticacion
```
Usuario -> GoogleLogin (boton) -> Google OAuth -> JWT credential
-> POST /api/auth/google -> verifyGoogleJwt() (RS256 + JWKS)
-> INSERT sessions (D1) -> Set-Cookie: session=... (HttpOnly; Secure; SameSite=Strict)
-> useAuth.jsx setUser(data.user)
```

#### Implementacion (`src/hooks/useAuth.jsx`)
```javascript
// Login: envia credential al servidor, no procesa nada en cliente
const login = useCallback(async (credentialResponse) => {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ credential: credentialResponse.credential }),
  });
  if (res.ok) {
    const data = await res.json();
    setUser(data.user);
  }
}, []);
```

#### Restauracion de sesion
```javascript
// Al cargar la app: consulta al servidor, no lee localStorage/sessionStorage
useEffect(() => {
  async function restoreSession() {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
    // Limpieza de datos legacy de versiones anteriores
    localStorage.removeItem('google_auth_credential');
    sessionStorage.removeItem('google_auth_user');
  }
  restoreSession();
}, []);
```

#### Logout con revocacion
```javascript
const logout = useCallback(async () => {
  // Elimina sesion en servidor (borra de D1 + limpia cookie)
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  setUser(null);
  // Revoca el token de Google
  if (email && window.google?.accounts?.id) {
    window.google.accounts.id.revoke(email, () => {});
  }
}, [user?.email]);
```

---

### 2. **Verificacion Criptografica de JWT (RS256 + JWKS)**

#### Implementacion (`functions/lib/google-jwt.js`)
```javascript
export async function verifyGoogleJwt(token, clientId) {
  const { header, payload, signatureB64, signedContent } = decodeJwtParts(token);

  // 1. Verificar algoritmo RS256
  if (header.alg !== 'RS256') throw new Error('Unsupported algorithm');

  // 2. Obtener claves publicas de Google (con cache de 1h)
  const certs = await fetchGoogleCerts(); // https://www.googleapis.com/oauth2/v3/certs
  const jwk = certs.find((k) => k.kid === header.kid);

  // 3. Verificar firma criptografica con Web Crypto API
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
  if (!valid) throw new Error('Invalid JWT signature');

  // 4. Validar claims
  if (!GOOGLE_ISSUERS.includes(payload.iss)) throw new Error('Invalid issuer');
  if (payload.aud !== clientId) throw new Error('Invalid audience');
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
  if (payload.nbf && payload.nbf > now) throw new Error('Token not yet valid');
  if (!payload.email) throw new Error('Missing email claim');
  if (!payload.sub) throw new Error('Missing sub claim');
}
```

**Validaciones realizadas:**
| # | Validacion | Descripcion |
|---|-----------|-------------|
| 1 | Estructura | Token debe tener 3 partes (header.payload.signature) |
| 2 | Algoritmo | Solo RS256 aceptado |
| 3 | Firma | Verificacion criptografica con clave publica Google (JWKS) |
| 4 | Issuer | Debe ser `accounts.google.com` o `https://accounts.google.com` |
| 5 | Audience | Debe coincidir con `GOOGLE_CLIENT_ID` (server-side) |
| 6 | Expiracion | `payload.exp` debe ser mayor al tiempo actual |
| 7 | nbf | Token no valido antes de su tiempo de emision |
| 8 | Email | Campo `email` debe existir |
| 9 | Sub | Campo `sub` (Google ID unico) debe existir |

> **Diferencia clave vs version anterior**: La verificacion anterior usaba `atob()` sin verificar la firma criptografica. La version actual verifica la firma RS256 con las claves publicas de Google via Web Crypto API.

---

### 3. **Gestion de Sesiones Server-Side**

#### Cookie HTTP-only (`functions/lib/session.js`)
```javascript
export function sessionCookie(sessionId, maxAge = 72 * 3600) {
  return `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${maxAge}`;
}
```

**Atributos de la cookie:**
| Atributo | Valor | Proposito |
|----------|-------|-----------|
| `HttpOnly` | — | Inaccesible desde JavaScript (previene robo via XSS) |
| `Secure` | — | Solo se envia por HTTPS |
| `SameSite=Strict` | — | Previene CSRF (no se envia en requests cross-site) |
| `Path=/api` | — | Solo se envia a endpoints de la API |
| `Max-Age=259200` | 72h | Expiracion absoluta |

#### Ciclo de vida de la sesion (`functions/lib/session.js`)
```javascript
export async function getAuthenticatedUser(db, request) {
  const sessionId = getSessionId(request);

  // Validar formato del session ID (hex 64 chars)
  const row = await db.prepare(`
    SELECT u.*, s.expires_at, s.last_used_at
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.id = ? AND u.is_active = 1
  `).bind(sessionId).first();

  // Verificar expiracion absoluta (72h)
  if (new Date(row.expires_at) < now) {
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    return null;
  }

  // Verificar idle timeout (24h sin actividad)
  const idleHours = (now - new Date(row.last_used_at)) / (1000 * 60 * 60);
  if (idleHours > 24) {
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    return null;
  }

  // Actualizar last_used_at en cada request autenticado
  await db.prepare('UPDATE sessions SET last_used_at = datetime(\'now\') WHERE id = ?').bind(sessionId).run();
}
```

**Propiedades de la sesion:**
- **Expiracion absoluta**: 72 horas desde creacion
- **Idle timeout**: 24 horas sin actividad invalida la sesion
- **Auto-limpieza**: sesiones expiradas se eliminan al primer acceso fallido
- **Verificacion de usuario activo**: `is_active = 1` en cada request

---

### 4. **Rate Limiting (`functions/lib/rate-limit.js`)**

Rate limiting por ventana deslizante implementado en D1:

| Tipo | Limite | Ventana | Identificador |
|------|--------|---------|---------------|
| `auth` | 10 requests | 60 segundos | IP (`CF-Connecting-IP`) |
| `progress` | 30 requests | 60 segundos | user_id |
| `migrate` | 3 requests | 300 segundos | user_id |
| `profile` | 20 requests | 60 segundos | user_id |

```javascript
// Respuesta cuando se supera el limite
return new Response(JSON.stringify({ error: 'Too many requests.' }), {
  status: 429,
  headers: { 'Retry-After': String(rateCheck.retryAfter) },
});
```

**Comportamiento fail-open**: si la DB de rate limiting falla, se permite el request para no bloquear usuarios legitimos.

---

### 5. **Audit Log (`functions/lib/audit.js`)**

Registro de acciones sensibles en la tabla `audit_log`:

| Accion | Cuando se registra |
|--------|--------------------|
| `profile_update` | Usuario actualiza display_name |
| `account_deleted` | Usuario elimina su cuenta |
| `data_export` | Usuario exporta sus datos |
| `certificate_generated` | Usuario genera certificado |
| `admin_stats_view` | Admin accede a estadisticas |
| `admin_users_list` | Admin lista usuarios |
| `admin_user_activated` | Admin activa/desactiva usuario |

Campos registrados: `user_id`, `action`, `details` (JSON), `ip_address`, `created_at`.

---

### 6. **Sanitizacion de Entrada**

#### display_name (`functions/api/users/me.js`)
```javascript
// Validaciones en PATCH /api/users/me
if (typeof display_name !== 'string') return error('must be string', 400);

const trimmed = display_name.trim();
if (trimmed.length > 100) return error('max 100 chars', 400);

// Rechazar caracteres HTML peligrosos
if (/[<>&"']/.test(trimmed)) return error('invalid characters', 400);

// Eliminar null bytes y caracteres de control
const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
```

#### Validacion de dia en progress
```javascript
// CHECK constraint en schema.sql
day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 30)
```

#### Admin: paginacion segura
```javascript
const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
```

---

### 7. **GDPR y Privacidad**

#### Soft-delete con anonimizacion (`functions/api/users/me.js`)
```javascript
// DELETE /api/users/me — anonimiza datos personales, no elimina registros de progreso
await db.prepare(`
  UPDATE users
  SET email = ?, name = 'Usuario eliminado', display_name = NULL,
      picture_url = NULL, is_active = 0, google_sub = ?
  WHERE id = ?
`).bind(`deleted_${user.id}@deleted.invalid`, `deleted_${user.id}`, user.id).run();

// Elimina todas las sesiones activas
await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();
```

#### Exportacion de datos (`functions/api/users/export.js`)
```javascript
// GET /api/users/export — descarga JSON con todos los datos del usuario
const exportData = {
  profile: { id, name, email, role, created_at },
  progress: { lessons_completed, total },
  enrollments,
  achievements,
  active_sessions: count, // sin IDs por seguridad
};
// Content-Disposition: attachment; filename="newcoders-datos-{id}.json"
```

---

### 8. **Control de Acceso por Roles**

```javascript
// Endpoints admin requieren role = 'admin' en DB
const user = await getAuthenticatedUser(db, request);
if (!user) return errorResponse('Not authenticated', 401, request);
if (user.role !== 'admin') return errorResponse('Forbidden', 403, request);

// Proteccion adicional: admin no puede desactivarse a si mismo
if (user_id === admin.id) {
  return errorResponse('Cannot modify your own account status', 400, request);
}
```

---

### 9. **Proteccion contra XSS**

#### React escapa HTML automaticamente
```jsx
<p>{lesson.theory}</p>          // HTML escapado por React
<code>{lesson.codeExample.code}</code>  // HTML escapado por React
```

#### Sin uso de innerHTML peligroso
No se usa `dangerouslySetInnerHTML`, `eval()`, ni `Function()` en toda la aplicacion.

#### Sanitizacion adicional en servidor
Todos los datos editables por el usuario (display_name) pasan por sanitizacion estricta antes de guardarse en DB.

---

### 10. **Content Security Policy (CSP)**

#### Configuracion actual (`index.html`)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://accounts.google.com https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://lh3.googleusercontent.com https://placehold.co;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://accounts.google.com;
  connect-src 'self' https://accounts.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none'
" />
```

| Directiva | Valor | Proposito |
|-----------|-------|-----------|
| `default-src` | `'self'` | Solo recursos del mismo origen |
| `script-src` | `'self'` + Google | Scripts propios + Google OAuth SDK |
| `style-src` | `'self' 'unsafe-inline'` + Google Fonts | Estilos propios + Tailwind inline |
| `img-src` | `'self' data:` + Google + placehold.co | Fotos de perfil Google + placeholders |
| `connect-src` | `'self'` + Google | Fetch a la API propia + Google OAuth |
| `frame-ancestors` | `'none'` | Previene clickjacking |
| `object-src` | `'none'` | Bloquea plugins (Flash, etc.) |

---

### 11. **Security Headers**

#### Desarrollo (`vite.config.js`)
```javascript
headers: {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}
```

#### Produccion (`public/_headers`)
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
```

---

### 12. **Seguridad de Enlaces Externos**

```jsx
// Prevencion de tabnabbing en todos los enlaces externos
<a href={url} target="_blank" rel="noopener noreferrer">...</a>

// Fotos de perfil sin filtrado de referrer
<img src={user.picture} referrerPolicy="no-referrer" />
```

---

### 13. **Variables de Entorno**

| Variable | Ubicacion | Descripcion |
|----------|-----------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | `.env.local` (frontend) | Client ID visible en bundle (OAuth requiere exposicion) |
| `GOOGLE_CLIENT_ID` | Cloudflare Dashboard | Client ID para validacion server-side |
| `GOOGLE_CLIENT_SECRET` | Cloudflare Dashboard | Secret nunca expuesto al cliente |

- `.env.local` incluido en `.gitignore`
- `GOOGLE_CLIENT_SECRET` solo en el servidor, nunca en el bundle del cliente

---

## Checklist de Seguridad

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **XSS Protection** | BIEN | React escapa HTML, sanitizacion server-side de inputs |
| **Input Validation** | BIEN | display_name: tipo, longitud, chars peligrosos, null bytes |
| **JWT Signature Verification** | BIEN | RS256 + JWKS via Web Crypto API (server-side) |
| **HTTP-only Cookies** | BIEN | `HttpOnly; Secure; SameSite=Strict; Path=/api` |
| **Session Expiry** | BIEN | 72h absoluto + 24h idle timeout, eliminacion activa |
| **Rate Limiting** | BIEN | Por IP (auth) y por user_id (progreso, perfil, migrate) |
| **Audit Log** | BIEN | Acciones sensibles y administrativas registradas |
| **GDPR** | BIEN | Soft-delete con anonimizacion + exportacion de datos |
| **RBAC** | BIEN | Endpoints admin validados por `role = 'admin'` en DB |
| **CSRF** | BIEN | `SameSite=Strict` en cookie + Google OAuth SDK |
| **SQL Injection** | BIEN | Prepared statements con `.bind()` en toda la API |
| **Tabnabbing** | BIEN | `rel="noopener noreferrer"` en todos los enlaces |
| **CSP** | IMPLEMENTADA | Meta tag completa en index.html |
| **Security Headers** | BIEN | Dev (vite.config.js) + Prod (public/_headers con HSTS) |
| **Variables de Entorno** | BIEN | `.env.local` en `.gitignore`, secrets solo en servidor |
| **Dependencias** | BIEN | Minimas (3 deps produccion), sin vulnerabilidades conocidas |
| **localStorage Auth** | N/A | Eliminado — auth solo via HTTP-only cookie server-side |
| **Tests de Seguridad** | PENDIENTE | No existen tests automatizados |
| **CI/CD Security** | PENDIENTE | No hay pipeline de CI/CD |

---

## Vulnerabilidades Identificadas (Bajo Riesgo)

### 1. **Progreso editable via DevTools (si se usa antes de login)**
Antes del primer login, el progreso podria estar en localStorage si el usuario nunca inicio sesion. La migracion al iniciar sesion mueve estos datos al servidor y los valida (solo dias 1-30).

**Impacto**: BAJO — solo contenido educativo, validado al migrar

---

### 2. **Codigo educativo mostrado como texto**
```javascript
// Leccion 9 muestra un prompt() como codigo de ejemplo
adivinanza = parseInt(prompt('Adivina el numero (1-10):'));
```

**Impacto**: BAJO — es codigo educativo intencional, nunca se ejecuta

---

### 3. **`unsafe-inline` en style-src**
Necesario para Tailwind CSS y estilos inline de React. Mitiga el riesgo el hecho de que `script-src` no incluye `unsafe-inline`.

**Impacto**: BAJO

---

### 4. **Rate limiting fail-open**
Si la tabla `rate_limit` en D1 falla, los requests se permiten para no afectar a usuarios legitimos.

**Impacto**: BAJO — un atacante podria explotar una falla de D1 para evitar el rate limit temporalmente

---

## Recomendaciones para Produccion

### 1. **Tests automatizados de seguridad**
```javascript
// Tests para verifyGoogleJwt()
// - Token con firma invalida -> debe lanzar error
// - Token con issuer invalido -> debe lanzar error
// - Token con audience incorrecta -> debe lanzar error
// - Token expirado -> debe lanzar error
// - Token sin email/sub -> debe lanzar error
// - Token valido -> debe retornar objeto con sub, email, name, picture

// Tests para checkRateLimit()
// - Superar limite -> debe retornar { ok: false, retryAfter: N }
// - Dentro del limite -> debe retornar { ok: true }
```

### 2. **CI/CD con escaneo de seguridad**
```yaml
# GitHub Actions
- name: Security audit
  run: npm audit --audit-level=moderate

# Habilitar Dependabot para actualizaciones automaticas
# .github/dependabot.yml
```

### 3. **Rotacion de sesiones post-login**
Considerar invalidar la sesion anterior del usuario al hacer login desde un nuevo dispositivo.

### 4. **Auditoria periodica de dependencias**
```bash
npm audit
npm audit fix
npx snyk test
```

---

## Referencias de Seguridad Web

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/es/docs/Web/Security)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
- [Content Security Policy](https://developer.mozilla.org/es/docs/Web/HTTP/CSP)
- [Google OAuth Security](https://developers.google.com/identity/protocols/oauth2)
- [JWT Security Best Practices (RFC 8725)](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## Conclusion

La aplicacion **tiene un nivel de seguridad SOLIDO** para una plataforma educativa con autenticacion Google OAuth y backend serverless.

**Arquitectura de seguridad actual:**
- Verificacion JWT criptografica server-side (RS256 + JWKS) — sin vulnerabilidades de validacion client-side
- Sesiones HTTP-only en servidor con doble timeout (absoluto + idle)
- Rate limiting multi-capa por IP y por usuario
- Audit log completo de acciones sensibles
- Cumplimiento GDPR con soft-delete y exportacion de datos
- Sin datos de autenticacion en localStorage/sessionStorage

**Datos manejados:**
- Contenido educativo publico (lecciones de programacion)
- Perfil basico de Google (nombre, email, foto) — almacenado en D1, no en cliente
- Progreso del curso (dias completados) — persistido en D1

**Fortalezas principales:**
- Autenticacion criptograficamente verificada en servidor
- Cookie HTTP-only inaccesible desde JavaScript
- Rate limiting previene abuso de API
- Audit trail para trazabilidad de acciones

---

**Fecha del Analisis:** Marzo 21, 2026
**Version de la App:** 2.0.0
**Nivel de Severidad:** BAJO
