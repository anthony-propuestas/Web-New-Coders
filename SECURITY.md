# Analisis y Mejoras de Seguridad

## Reporte de Auditoria de Seguridad

### Resumen Ejecutivo
- **Tipo de Aplicacion**: React SPA (Single Page Application) con Google OAuth
- **Tipo de Datos**: Contenido educativo + Perfil Google (nombre, email, foto) + Estado local
- **Autenticacion**: Google OAuth 2.0 con validacion JWT
- **Nivel de Riesgo General**: BAJO

---

## Controles de Seguridad Implementados

### 1. **Autenticacion con Google OAuth**

#### Flujo de autenticacion
```
Usuario -> GoogleLogin (boton) -> Google OAuth -> JWT credential
-> decodeAndValidateJwt() -> sessionStorage -> user state
```

#### Implementacion (`src/hooks/useAuth.jsx`)
```javascript
// Login: validar credential y guardar en sessionStorage
const login = useCallback((credentialResponse) => {
  const token = credentialResponse.credential;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const decoded = decodeAndValidateJwt(token, clientId);
  if (decoded) {
    sessionStorage.setItem('google_auth_user', JSON.stringify(decoded));
    setUser(decoded);
  }
}, []);
```

#### Logout con revocacion
```javascript
const logout = useCallback(() => {
  const email = user?.email;
  setUser(null);
  sessionStorage.removeItem('google_auth_user');
  if (email && window.google?.accounts?.id) {
    window.google.accounts.id.revoke(email, () => {});
  }
}, [user?.email]);
```

#### Auth Gate (`src/App.jsx`)
```javascript
// Si no hay usuario autenticado, mostrar pagina de login
if (!user) return <LoginPage />;
```

---

### 2. **Validacion de JWT**

#### Funcion `decodeAndValidateJwt()` (`src/hooks/useAuth.jsx`)
```javascript
function decodeAndValidateJwt(token, clientId) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // 1. Validar issuer (debe ser Google)
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!validIssuers.includes(payload.iss)) return null;

    // 2. Validar audience (debe coincidir con nuestro Client ID)
    if (payload.aud !== clientId) return null;

    // 3. Validar expiracion
    if (!payload.exp || payload.exp <= Date.now() / 1000) return null;

    // 4. Campos requeridos
    if (!payload.email) return null;

    return {
      name: payload.name || '',
      email: payload.email,
      picture: payload.picture || '',
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
```

**Validaciones realizadas:**
| # | Validacion | Descripcion |
|---|-----------|-------------|
| 1 | Estructura | Token debe tener 3 partes (header.payload.signature) |
| 2 | Issuer | Debe ser `accounts.google.com` o `https://accounts.google.com` |
| 3 | Audience | Debe coincidir con `VITE_GOOGLE_CLIENT_ID` |
| 4 | Expiracion | `payload.exp` debe ser mayor a `Date.now() / 1000` |
| 5 | Email | Campo `email` debe existir |

---

### 3. **Gestion de Sesion**

#### sessionStorage para autenticacion
```javascript
// Restaurar sesion al cargar la app
useEffect(() => {
  try {
    const saved = sessionStorage.getItem('google_auth_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && isTokenValid(parsed)) {
        setUser(parsed);
      } else {
        sessionStorage.removeItem('google_auth_user');
      }
    }
  } catch {
    sessionStorage.removeItem('google_auth_user');
  }
  // Limpieza unica: eliminar token legacy de localStorage
  localStorage.removeItem('google_auth_credential');
  setLoading(false);
}, []);
```

**Ventajas de sessionStorage sobre localStorage:**
- Los datos se eliminan automaticamente al cerrar la pestana/navegador
- Aislado por pestana (cada pestana tiene su propia sesion)
- Reduce la ventana de exposicion de datos de autenticacion

**Validacion de sesion existente:**
```javascript
function isTokenValid(user) {
  if (!user || !user.exp) return false;
  return user.exp > Date.now() / 1000;
}
```

---

### 4. **Proteccion contra XSS (Cross-Site Scripting)**

#### React escapa HTML automaticamente
```jsx
// React automaticamente escapa contenido de texto
<p>{lesson.theory}</p>          // HTML es escapado
<code>{lesson.codeExample.code}</code>  // HTML es escapado
```

#### Sin uso de innerHTML peligroso
```javascript
// NUNCA se usa:
dangerouslySetInnerHTML={{ __html: userInput }}

// Siempre se usa:
<p>{userInput}</p> // React lo escapa automaticamente
```

#### Sin eval() o ejecucion dinamica
No se usa `eval()`, `Function()`, o evaluacion de codigo dinamico en toda la aplicacion.

---

### 5. **Validacion de Entrada y Estado**

#### Validacion de `selectedDay`
```javascript
// SEGURIDAD: Solo aceptar dias validos (1-30)
if (status !== 'locked' &&
    Number.isInteger(lesson.day) &&
    lesson.day >= 1 &&
    lesson.day <= 30) {
  setSelectedDay(lesson.day);
  setCurrentView('lesson');
}
```

#### Validacion de `handleMarkComplete()`
```javascript
// SEGURIDAD: Validar dayNumber antes de procesar
if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
  console.warn('Intento de marcar dia invalido:', dayNumber);
  return; // Rechazar dia invalido
}
```

---

### 6. **Seguridad de localStorage**

> **Nota:** `localStorage` se usa SOLO para datos de progreso educativo (`completedLessons`). Los datos de autenticacion se almacenan en `sessionStorage`.

#### Validacion al leer
```javascript
const saved = localStorage.getItem('completedLessons');
if (!saved) return [];

const parsed = JSON.parse(saved);
if (!Array.isArray(parsed)) return []; // Verificar tipo

// Filtrar solo valores legitimos
return parsed.filter(day =>
  Number.isInteger(day) && day >= 1 && day <= 30
);
```

#### Validacion al escribir con try/catch
```javascript
try {
  localStorage.setItem('completedLessons', JSON.stringify(newCompleted));
} catch (error) {
  console.error('Error al guardar en localStorage:', error);
}
```

---

### 7. **Content Security Policy (CSP) Implementada**

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

#### Explicacion de cada directiva
| Directiva | Valor | Proposito |
|-----------|-------|-----------|
| `default-src` | `'self'` | Solo permite recursos del mismo origen |
| `script-src` | `'self'` + Google | Scripts propios + Google OAuth SDK |
| `style-src` | `'self' 'unsafe-inline'` + Google Fonts | Estilos propios + Tailwind inline + Google Fonts |
| `img-src` | `'self' data:` + Google + placehold.co | Imagenes propias + fotos de perfil Google + placeholders |
| `font-src` | `'self'` + Google Fonts | Fuentes propias + Orbitron/Source Code Pro |
| `frame-src` | Google | Popup de Google Sign-In |
| `connect-src` | `'self'` + Google | Conexiones AJAX al mismo origen + Google |
| `object-src` | `'none'` | Bloquea plugins (Flash, Java, etc.) |
| `base-uri` | `'self'` | Previene inyeccion de `<base>` tag |
| `form-action` | `'self'` | Formularios solo al mismo origen |
| `frame-ancestors` | `'none'` | Previene clickjacking (no se puede incrustar en iframes) |

> **Nota:** `'unsafe-inline'` en `style-src` es necesario para Tailwind CSS y estilos inline usados en la aplicacion.

---

### 8. **Security Headers**

#### Configuracion en desarrollo (`vite.config.js`)
```javascript
server: {
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
},
```

#### Configuracion en produccion (`public/_headers`)
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
```

| Header | Funcion |
|--------|---------|
| `Strict-Transport-Security` | Fuerza HTTPS con HSTS preload (1 ano) |
| `X-Content-Type-Options: nosniff` | Previene MIME type sniffing |
| `X-Frame-Options: DENY` | Previene clickjacking |
| `X-XSS-Protection: 1; mode=block` | Activa filtro XSS del navegador (solo dev) |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limita informacion del referrer |

> Los headers aplican tanto en desarrollo (Vite) como en produccion (Cloudflare Pages via `public/_headers`).

---

### 9. **Seguridad de Enlaces Externos**

#### Prevencion de Tabnabbing
```jsx
<a
  href={resource.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-neon-cyan hover:text-neon-green underline"
>
  {resource.label}
</a>
```

- `noopener`: Impide que la pagina nueva acceda a `window.opener`
- `noreferrer`: No envia informacion del referrer

#### Proteccion de imagenes de perfil
```jsx
<img
  src={user.picture}
  referrerPolicy="no-referrer"
/>
```

---

### 10. **Variables de Entorno**

#### Configuracion (`.env.local`)
```
VITE_GOOGLE_CLIENT_ID=<Google OAuth Client ID>
```

- `.env.local` esta incluido en `.gitignore` (no se sube al repositorio)
- El prefijo `VITE_` indica que la variable se incluye en el bundle del cliente
- El Google Client ID es publico por diseno (OAuth requiere que el cliente lo exponga)
- No se almacenan secretos del servidor (client secret, API keys privadas, etc.)

---

### 11. **Auditoria de Dependencias**

#### Dependencias de produccion (3 total)
```json
{
  "@react-oauth/google": "^0.13.4",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

#### Estado de vulnerabilidades
```bash
$ npm audit
# 0 vulnerabilities found
```

- Superficie de ataque minima con solo 3 dependencias de produccion
- Todas las dependencias son de fuentes confiables (npm oficial, Google)

---

## Vulnerabilidades Identificadas (Bajo Riesgo)

### 1. **localStorage accesible via DevTools**
```javascript
// localStorage es accesible desde la consola del navegador
localStorage.getItem('completedLessons')
// Cualquiera puede modificar su progreso manualmente
```

**Impacto**: BAJO (solo contiene progreso educativo, no datos sensibles)

**Mitigacion actual**: Validacion al leer (tipo, rango 1-30)

---

### 2. **Codigo educativo mostrado como texto**
```javascript
// Leccion 9 tiene un prompt() que es codigo de ejemplo
adivinanza = parseInt(prompt('Adivina el numero (1-10):'));
```

**Impacto**: BAJO (es codigo educativo intencional, no se ejecuta)

---

### 3. **CSRF**
Esta es una SPA sin backend propio. La comunicacion con Google OAuth es manejada por el SDK `@react-oauth/google`, que implementa protecciones CSRF internamente siguiendo las mejores practicas de Google Identity Services.

---

### 4. **JWT sin verificacion criptografica**
```javascript
// La funcion decodeAndValidateJwt() usa atob() para decodificar
const payload = JSON.parse(atob(parts[1]));
// Valida issuer, audience, expiracion y email
// PERO no verifica la firma criptografica del token
```

**Impacto**: BAJO en el contexto actual
- El SDK de Google ya valida el token criptograficamente antes de retornarlo
- No hay backend propio que dependa de este token
- Las validaciones de issuer/audience/expiracion son una capa adicional de defensa

**Si se agrega un backend**: Se DEBE verificar la firma del JWT en el servidor usando las claves publicas de Google (JWKS).

---

### 5. **Security Headers en produccion**
Los headers de seguridad estan configurados tanto en `vite.config.js` (desarrollo) como en `public/_headers` (produccion en Cloudflare Pages), incluyendo HSTS con preload.

**Impacto**: RESUELTO

---

## Checklist de Seguridad

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **XSS Protection** | BIEN | React escapa HTML, sin innerHTML, sin eval |
| **Input Validation** | BIEN | Validacion en handleMarkComplete y selectedDay |
| **localStorage** | PRESENTE | Validacion de datos; solo progreso educativo |
| **sessionStorage Auth** | BIEN | Datos de autenticacion en sessionStorage |
| **Tabnabbing** | BIEN | `rel="noopener noreferrer"` en todos los enlaces |
| **Data Leakage** | BIEN | Solo datos educativos + perfil Google basico |
| **SQL Injection** | N/A | No hay base de datos |
| **CSRF** | N/A | Google OAuth SDK maneja proteccion CSRF |
| **Autenticacion** | BIEN | Google OAuth con validacion JWT |
| **JWT Validation** | BIEN | Issuer, audience, expiracion, email |
| **CSP** | IMPLEMENTADA | Meta tag completa en index.html |
| **Security Headers** | BIEN | Dev (vite.config.js) + Prod (public/_headers con HSTS) |
| **Variables de Entorno** | BIEN | `.env.local` en `.gitignore` |
| **Dependencias** | BIEN | 0 vulnerabilidades, 3 deps produccion |
| **Tests de Seguridad** | PENDIENTE | No existen tests automatizados |
| **CI/CD Security** | PENDIENTE | No hay pipeline de CI/CD |

---

## Recomendaciones para Produccion

### 1. **Headers de seguridad en Cloudflare Pages** (IMPLEMENTADO)
Archivo `public/_headers` configurado con headers de seguridad para produccion:
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
```

### 2. **Tests automatizados de seguridad**
```javascript
// Tests para la funcion decodeAndValidateJwt()
// - Token con issuer invalido -> debe retornar null
// - Token con audience incorrecta -> debe retornar null
// - Token expirado -> debe retornar null
// - Token sin email -> debe retornar null
// - Token valido -> debe retornar objeto con name, email, picture, exp
```

### 3. **CI/CD con escaneo de seguridad**
```yaml
# GitHub Actions ejemplo
- name: Security audit
  run: npm audit --audit-level=moderate

# Habilitar Dependabot para actualizaciones automaticas
# .github/dependabot.yml
```

### 4. **Si se agrega backend:**
```javascript
// Verificar firma JWT en el servidor
// Usar las claves publicas de Google (JWKS)
// https://www.googleapis.com/oauth2/v3/certs

// Implementar rate limiting
// Validar datos en servidor (nunca confiar solo en cliente)
// Usar HTTPS/SSL
```

### 5. **Auditoria periodica de dependencias**
```bash
# Ejecutar periodicamente
npm audit
npm audit fix

# O usar herramientas automatizadas
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

---

## Conclusion

La aplicacion **tiene un nivel de seguridad ACEPTABLE** para una SPA educativa con autenticacion Google OAuth.

**Datos manejados:**
- Contenido educativo publico (lecciones de programacion)
- Perfil basico de Google (nombre, email, foto) — almacenado solo en `sessionStorage`
- Progreso del curso (dias completados) — almacenado en `localStorage`

**Fortalezas principales:**
- Autenticacion robusta con Google OAuth y validacion JWT
- CSP completa implementada
- Superficie de ataque minima (3 dependencias, sin backend)
- Validacion de entrada en todos los puntos criticos

Las vulnerabilidades identificadas son de **riesgo bajo** ya que:
- No hay procesamiento de datos financieros
- No hay almacenamiento server-side de datos personales
- Los datos de sesion se eliminan al cerrar el navegador
- El contenido educativo es publico

---

**Fecha del Analisis:** Marzo 20, 2026
**Version de la App:** 1.1.0
**Nivel de Severidad:** BAJO
