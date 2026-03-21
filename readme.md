# New Coders: Dev Path — 30 Dias de Codigo

Plataforma educativa interactiva tipo calendario que guia a programadores principiantes a traves de un curriculo de 30 dias. Cada dia desbloquea una leccion con teoria, ejemplos de codigo, retos practicos y recursos externos.

---

## Caracteristicas

- **Calendario interactivo de 30 dias** con desbloqueo progresivo por fecha
- **Autenticacion con Google OAuth 2.0** validada criptograficamente en servidor (RS256 + JWKS)
- **Sesiones server-side** con HTTP-only cookies (72h expiry, 24h idle timeout)
- **7 vistas**: Calendario, Leccion, Introduccion, Herramientas, Nosotros, Mi Perfil, Admin
- **Seguimiento de progreso** persistido en Cloudflare D1 (no localStorage)
- **Rachas de aprendizaje** — racha actual y racha maxima calculadas en servidor
- **Perfil editable** — nombre guardado en servidor via API con sanitizacion estricta
- **Logros (achievements)** — badges ganados por el usuario
- **Certificado de completado** — generado al completar los 30 dias
- **Exportacion de datos** — descarga JSON con datos completos (GDPR)
- **Eliminacion de cuenta** — soft-delete con anonimizacion de datos (GDPR)
- **Rate limiting** — por IP (auth) y por usuario (progreso, perfil, migracion)
- **Audit log** — registro de acciones sensibles y administrativas
- **Panel de administrador** — estadisticas y gestion de usuarios (role-gated)
- **API REST serverless** con Cloudflare Workers (auth, progreso, usuarios, admin)
- **Migracion automatica** de progreso de localStorage a servidor al iniciar sesion
- **Carrusel de aliados** con auto-scroll responsive
- **Cuenta regresiva** hasta la fecha de inicio del curso
- **Tema cyberpunk/neon** con fondo oscuro, bordes brillantes y animaciones
- **Responsive** — grid de 2 columnas (movil) a 5 columnas (desktop)
- **SEO** — robots.txt, sitemap.xml, llms.txt
- **Seguridad** — CSP headers, verificacion JWT criptografica server-side, HTTP-only cookies, headers Cloudflare

---

## Tech Stack

| Tecnologia | Version | Uso |
|---|---|---|
| React | 18.2 | UI y manejo de estado |
| Vite | 6.2 | Build tool y dev server |
| Tailwind CSS | 3.3 | Estilos utilitarios |
| @react-oauth/google | 0.13 | Google OAuth 2.0 (frontend) |
| Cloudflare Workers | — | Backend serverless (API REST) |
| Cloudflare D1 | — | Base de datos SQLite-compatible |
| Cloudflare Pages | — | Hosting y despliegue |
| Wrangler | — | CLI para deploy de Workers y Pages |
| PostCSS + Autoprefixer | — | Procesamiento de CSS |

---

## Estructura del Proyecto

```
Web New Coders/
├── src/
│   ├── App.jsx              # Componente principal (vistas, lecciones, logica)
│   ├── main.jsx             # Entry point con AuthProvider
│   ├── index.css            # Estilos globales (cyberpunk theme)
│   ├── hooks/
│   │   └── useAuth.jsx      # Context y logica de autenticacion (server-side)
│   └── views/
│       └── LoginPage.jsx    # Pantalla de login con Google
├── functions/               # Cloudflare Workers — API REST
│   ├── api/
│   │   ├── auth/
│   │   │   ├── google.js    # Verificacion JWT Google (RS256/JWKS) + creacion de sesion
│   │   │   ├── logout.js    # Cierre de sesion (borra cookie + elimina sesion en DB)
│   │   │   └── me.js        # Obtener usuario de la sesion activa
│   │   ├── users/
│   │   │   ├── me.js        # GET perfil + PATCH display_name + DELETE cuenta (GDPR)
│   │   │   ├── achievements.js  # GET logros del usuario
│   │   │   ├── certificate.js   # GET certificado de completado (30 dias)
│   │   │   ├── export.js    # GET exportacion de datos personales (GDPR)
│   │   │   └── delete.js    # Soft-delete con anonimizacion de datos
│   │   ├── progress/
│   │   │   ├── index.js     # GET progreso, rachas y estadisticas del usuario
│   │   │   ├── [day].js     # POST marcar leccion completada (valida 1-30)
│   │   │   └── migrate.js   # POST migrar progreso de localStorage a servidor
│   │   └── admin/
│   │       ├── stats.js     # GET estadisticas globales (solo admin)
│   │       └── users.js     # GET/PATCH gestion de usuarios (solo admin)
│   └── lib/
│       ├── cors.js          # Helpers CORS
│       ├── google-jwt.js    # Verificacion criptografica de JWT Google (RS256 + JWKS)
│       ├── session.js       # Gestion de sesiones server-side con HTTP-only cookies
│       ├── rate-limit.js    # Rate limiting por IP y por usuario (D1)
│       └── audit.js         # Registro de acciones en audit_log
├── public/
│   ├── _headers             # Headers de seguridad para Cloudflare Pages
│   ├── _redirects           # Configuracion SPA routing
│   ├── robots.txt           # SEO — instrucciones para crawlers
│   ├── sitemap.xml          # SEO — mapa del sitio
│   ├── llms.txt             # Configuracion para LLMs
│   └── favicon.svg
├── schema.sql               # Esquema de base de datos D1 (7 tablas)
├── wrangler.toml            # Configuracion de Cloudflare Workers/Pages
├── index.html               # HTML base con CSP headers
├── tailwind.config.js       # Colores neon y animaciones personalizadas
├── vite.config.js           # Configuracion de Vite con security headers
├── postcss.config.js        # Configuracion PostCSS
├── package.json             # Dependencias y scripts
├── .env.local               # VITE_GOOGLE_CLIENT_ID (no incluido en repo)
└── readme.md
```

---

## Instalacion

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd "Web New Coders"

# 2. Instalar dependencias del frontend
npm install

# 3. Instalar Wrangler (CLI de Cloudflare)
npm install -g wrangler
wrangler login

# 4. Configurar variables de entorno del frontend
# Crear archivo .env.local con tu Google OAuth Client ID:
echo "VITE_GOOGLE_CLIENT_ID=tu-client-id-aqui" > .env.local

# 5. Inicializar la base de datos D1
wrangler d1 create new-coders-db
# Actualizar el database_id en wrangler.toml con el ID generado

# 6. Aplicar el esquema de la base de datos
wrangler d1 execute new-coders-db --file=schema.sql

# 7. Iniciar servidor de desarrollo (frontend + Workers + D1)
wrangler pages dev --compatibility-date=2024-01-01
```

### Variables de entorno en Cloudflare Dashboard (produccion)

Configurar en el dashboard de Cloudflare Pages > Settings > Environment Variables:

| Variable | Descripcion |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID de Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google OAuth |

### Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite (solo frontend) |
| `npm run build` | Build de produccion en `/dist` |
| `npm run preview` | Preview del build de produccion |
| `wrangler pages dev` | Dev server completo con Workers y D1 |
| `wrangler pages deploy dist/` | Deploy a Cloudflare Pages |

---

## API REST

### Autenticacion

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `POST` | `/api/auth/google` | Login: verifica JWT Google, crea sesion, devuelve cookie HTTP-only |
| `POST` | `/api/auth/logout` | Logout: elimina sesion de DB y limpia cookie |
| `GET` | `/api/auth/me` | Devuelve usuario autenticado desde la sesion activa |

### Progreso

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/api/progress` | Progreso completo: dias completados, rachas, porcentaje |
| `POST` | `/api/progress/:day` | Marcar dia (1-30) como completado |
| `POST` | `/api/progress/migrate` | Migrar progreso de localStorage a servidor |

### Usuarios

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/api/users/me` | Perfil + progreso + enrollment |
| `PATCH` | `/api/users/me` | Actualizar display_name (sanitizado, max 100 chars) |
| `DELETE` | `/api/users/me` | Eliminar cuenta (soft-delete GDPR) |
| `GET` | `/api/users/achievements` | Logros ganados por el usuario |
| `GET` | `/api/users/certificate` | Certificado de completado (requiere 30 dias) |
| `GET` | `/api/users/export` | Exportar datos personales en JSON (GDPR) |

### Administrador (role: admin)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/api/admin/stats` | Estadisticas globales, tasa de completado por leccion |
| `GET` | `/api/admin/users` | Lista de usuarios con paginacion y busqueda |
| `PATCH` | `/api/admin/users` | Activar/desactivar usuario |

---

## Vistas de la Aplicacion

### 1. Login
Pantalla de autenticacion con Google OAuth 2.0. El token se envia al servidor (Cloudflare Worker), que lo verifica criptograficamente con las claves publicas de Google (JWKS/RS256), crea una sesion en D1 y devuelve una HTTP-only cookie. El acceso al contenido requiere sesion activa.

### 2. Calendario (vista principal)
Grid de 30 casillas con estados visuales:
- **Bloqueada** — opacidad baja, icono de candado
- **Disponible** — borde neon con efecto glow
- **Dia actual** — badge "HOY" con animacion pulse
- **Completada** — checkmark verde

Incluye barra de progreso, cuenta regresiva, y botones de acceso a Intro, Herramientas y Nosotros.

### 3. Leccion
Contenido detallado de cada dia:
- Teoria explicativa
- Instrucciones paso a paso
- Prompt para aprender con IA
- Ejemplo de codigo con boton de copiar
- Reto practico
- Recursos externos
- Navegacion entre lecciones (anterior/siguiente)
- Boton "Marcar como completada" (guarda en base de datos)

### 4. Introduccion
Descripcion del programa, como funciona, y carrusel de aliados/partners.

### 5. Herramientas
Guia de instalacion de herramientas necesarias (VS Code, Chrome, Python, Git, GitHub) y opcionales (Node.js, Netlify, Render). Incluye extensiones recomendadas de VS Code.

### 6. Nosotros
Mision del equipo, valores (Constancia, Comunidad, Practica, Accesibilidad) y enlaces a la comunidad.

### 7. Mi Perfil
Perfil del usuario accesible desde el icono de persona en la esquina superior derecha (visible en todas las vistas). Contiene:
- Avatar de Google con nombre y badge de miembro
- Campo de nombre editable con boton "Guardar cambios" (persiste en servidor via `/api/users/me`)
- Email de Google (solo lectura, vinculado a cuenta)
- Barra de progreso con lecciones completadas
- Racha actual y racha maxima de dias consecutivos (calculadas en servidor)
- Logros ganados
- Opcion de exportar datos (GDPR)
- Opcion de eliminar cuenta (GDPR)
- Boton de cierre de sesion

---

## Curriculo de 30 Dias

| Semana | Dias | Tema |
|---|---|---|
| 1 | 1–7 | **HTML** — Que es programar, herramientas, estructura HTML, etiquetas, formularios, enlaces, imagenes |
| 2 | 8–14 | **CSS** — Selectores, colores, box model, Flexbox, Grid, responsive design, mini proyecto |
| 3 | 15–21 | **JavaScript** — Variables, condicionales, bucles, funciones, arrays, objetos, DOM |
| 4 | 22–26 | **Eventos, Proyectos y Python** — Eventos JS, To-Do List, Python basico, funciones, estructuras de datos |
| 5 | 27–30 | **Fullstack y Deploy** — Flask, conexion frontend-backend, Git/GitHub, despliegue en produccion |

---

## Esquema de Base de Datos (D1)

| Tabla | Descripcion |
|---|---|
| `users` | Usuarios registrados via Google OAuth (id, email, name, display_name, role, is_active, login_count, etc.) |
| `sessions` | Tokens de sesion HTTP-only con expiracion (72h) e idle timeout (24h) |
| `enrollments` | Registro de temporadas/cohortes por usuario |
| `lesson_completions` | Progreso individual — dia completado + timestamp |
| `rate_limit` | Estado de rate limiting por clave (IP o usuario) |
| `audit_log` | Registro de acciones administrativas y sensibles |
| `achievements` | Logros/badges ganados por el usuario |
| `user_settings` | Preferencias del usuario (notificaciones, idioma) |

---

## Seguridad

- **Verificacion JWT criptografica** — RS256 + JWKS de Google (`functions/lib/google-jwt.js`)
- **HTTP-only cookies** para sesiones (inaccesibles desde JavaScript)
- **Sesiones server-side** en D1 con expiracion absoluta (72h) e idle timeout (24h)
- **Rate limiting** en D1: auth (10/min por IP), progreso (30/min), migracion (3/5min), perfil (20/min)
- **Audit log** — registro de acciones sensibles (login, eliminacion, exportacion, admin)
- **Sanitizacion de entrada** — display_name: max 100 chars, sin caracteres HTML (`<>&"'`), sin null bytes
- **GDPR** — soft-delete con anonimizacion de datos, exportacion de datos personal
- **Content Security Policy (CSP)** configurada en `index.html`
- **`public/_headers`** con headers de seguridad para Cloudflare Pages (HSTS, X-Frame-Options, etc.)
- **Headers en Vite config** para desarrollo (X-Content-Type-Options, X-Frame-Options, etc.)
- **Validacion de entrada** para numeros de dia (rango 1-30, CHECK en DB)
- **Control de acceso por roles** — endpoints admin requieren `role = 'admin'`
- **`rel="noopener noreferrer"`** en todos los enlaces externos
- **Migracion automatica** de progreso de localStorage a servidor al iniciar sesion

---

## Despliegue en Produccion (Cloudflare Pages)

```bash
# 1. Generar build optimizado
npm run build

# 2. Desplegar en Cloudflare Pages
wrangler pages deploy dist/
```

**Notas:**
- Configurar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en el dashboard de Cloudflare Pages
- El binding D1 (`DB`) debe estar configurado en `wrangler.toml` con el `database_id` correcto
- El archivo `public/_headers` configura los headers de seguridad automaticamente en Cloudflare Pages
- El archivo `public/_redirects` maneja el SPA routing

---

## Comunidad

- **WhatsApp** — Grupo de la comunidad New Coders
- **X (Twitter)** — @NewCodersOrg
