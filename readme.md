# New Coders: Dev Path — 30 Dias de Codigo

Plataforma educativa interactiva tipo calendario que guia a programadores principiantes a traves de un curriculo de 30 dias. Cada dia desbloquea una leccion con teoria, ejemplos de codigo, retos practicos y recursos externos.

---

## Caracteristicas

- **Calendario interactivo de 30 dias** con desbloqueo progresivo por fecha
- **Autenticacion con Google OAuth 2.0** (login obligatorio para acceder)
- **5 vistas**: Calendario, Leccion, Introduccion, Herramientas, Nosotros
- **Seguimiento de progreso** con barra visual y persistencia en `localStorage`
- **Carrusel de aliados** con auto-scroll responsive
- **Cuenta regresiva** hasta la fecha de inicio del curso
- **Tema cyberpunk/neon** con fondo oscuro, bordes brillantes y animaciones
- **Responsive** — grid de 2 columnas (movil) a 5 columnas (desktop)
- **Seguridad** — CSP headers, validacion JWT, sessionStorage para tokens

---

## Tech Stack

| Tecnologia | Version | Uso |
|---|---|---|
| React | 18.2 | UI y manejo de estado |
| Vite | 6.2 | Build tool y dev server |
| Tailwind CSS | 3.3 | Estilos utilitarios |
| @react-oauth/google | 0.13 | Autenticacion Google OAuth 2.0 |
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
│   │   └── useAuth.jsx      # Context y logica de autenticacion
│   └── views/
│       └── LoginPage.jsx    # Pantalla de login con Google
├── public/
│   └── _redirects           # Configuracion de rutas para Netlify
├── index.html               # HTML base con CSP headers
├── tailwind.config.js       # Colores neon y animaciones personalizadas
├── vite.config.js           # Configuracion de Vite
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

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env.local con tu Google OAuth Client ID:
echo "VITE_GOOGLE_CLIENT_ID=tu-client-id-aqui" > .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de produccion en `/dist` |
| `npm run preview` | Preview del build de produccion |

---

## Vistas de la Aplicacion

### 1. Login
Pantalla de autenticacion con Google OAuth 2.0. El acceso al contenido requiere login.

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
- Boton "Marcar como completada"

### 4. Introduccion
Descripcion del programa, como funciona, y carrusel de aliados/partners.

### 5. Herramientas
Guia de instalacion de herramientas necesarias (VS Code, Chrome, Python, Git, GitHub) y opcionales (Node.js, Netlify, Render). Incluye extensiones recomendadas de VS Code.

### 6. Nosotros
Mision del equipo, valores (Constancia, Comunidad, Practica, Accesibilidad) y enlaces a la comunidad.

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

## Seguridad

- **Content Security Policy (CSP)** configurada en `index.html`
- **Validacion JWT** con verificacion de issuer, audience y expiracion
- **sessionStorage** para datos de autenticacion (no localStorage)
- **Validacion de entrada** para numeros de dia (rango 1-30)
- **`rel="noopener noreferrer"`** en todos los enlaces externos
- **Headers de seguridad** en Vite config (X-Content-Type-Options, X-Frame-Options)

---

## Despliegue en Produccion

```bash
# Generar build optimizado
npm run build
```

La carpeta `dist/` contiene los archivos listos para produccion. Desplegar en cualquier servicio de hosting estatico (Netlify, Vercel, etc.).

**Notas:**
- No servir archivos fuente (`src/*.jsx`) en produccion
- El archivo `public/_redirects` ya esta configurado para Netlify SPA routing
- Verificar que el servidor responda con `application/javascript` para archivos `.js`

---

## Comunidad

- **WhatsApp** — Grupo de la comunidad New Coders
- **X (Twitter)** — @NewCodersOrg
