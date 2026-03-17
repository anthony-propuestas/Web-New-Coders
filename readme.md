# Prompt: Calendario de Ruta para Programadores Nuevos

## Estilo: "Advent of Code" — Página Principal → Página Lección del Día

---

## EL PROMPT

---

Crea una aplicación web de **una sola página (SPA)** con estilo **"Advent Calendar"** inspirada en Advent of Code, pero enfocada en ser una **guía de aprendizaje paso a paso para programadores principiantes**.

---

### CONCEPTO GENERAL

- Un calendario visual con **30 casillas** (días), cada una representando una lección.
- Las casillas se desbloquean progresivamente (las pasadas están abiertas, las futuras bloqueadas visualmente).
- Al hacer clic en una casilla desuqeada, se navega a la **página de lección del día** correspondiente.
- El diseño debe ser oscuro, con estética de terminal/código, y detalles de color neón (verde, cyan, amarillo).

---

### ESTRUCTURA DE NAVEGACIÓN (solo 2 vistas)

```
📅 Página Principal (Calendario)
 └── 📖 Página Lección del Día (contenido dinámico según el día seleccionado)
```

**No se necesita backend.** Todo el contenido de las lecciones vive en un archivo JSON o un objeto JS dentro del proyecto.

---

### VISTA 1 — PÁGINA PRINCIPAL (Calendario)

**Layout:**
- Header con el título del calendario (ej: "Dev Path: 30 Días de Código") y un subtítulo motivacional.
- Grid de 30 casillas organizadas en filas (5 columnas × 6 filas, o responsive).
- Footer mínimo.

**Cada casilla del calendario debe mostrar:**
- Número del día (grande, centrado).
- Título corto de la lección (ej: "Variables", "Loops", "Tu primera API").
- Estado visual:
  - ✅ **Completada** → borde verde, ícono de check.
  - 🔓 **Disponible (día actual)** → borde brillante/animado, efecto glow o pulso.
  - 🔒 **Bloqueada (futuro)** → opacidad baja, ícono de candado, no clickeable.
- Al hacer hover en una casilla disponible: efecto sutil (scale, glow, o reveal del título).

**Lógica de desbloqueo:**
- Usa una fecha de inicio configurable (ej: `const START_DATE = "2026-04-01"`).
- Calcula qué día es relativo al inicio → desbloquea las casillas correspondientes.
- El estado "completada" se guarda en `localStorage` (el usuario marca como completada desde la página de lección).

---

### VISTA 2 — PÁGINA LECCIÓN DEL DÍA

**Navegación:** Al hacer clic en una casilla, se muestra la vista de lección (puede ser con un router simple, hash routing `#/day/5`, o renderizado condicional).

**Layout de la lección:**
- Botón "← Volver al Calendario" en la parte superior.
- Header: "Día {N}: {Título de la Lección}".
- Sección de contenido con:
  - **Explicación teórica** → texto con formato (puede usar Markdown renderizado o HTML directo).
  - **Ejemplo de código** → bloque `<pre><code>` con estilo de syntax highlighting (puede ser básico con CSS, no requiere librería externa).
  - **Mini reto / ejercicio** → una caja destacada con un reto para que el usuario practique.
  - **Recursos** → 1-3 links externos recomendados (documentación, videos, etc).
- Botón "Marcar como completada ✅" → guarda en `localStorage` y cambia el estado de la casilla en el calendario.
- Navegación inferior: "← Día anterior" | "Día siguiente →" (si están desbloqueados).

---

### DATOS DE LAS LECCIONES

Toda la data de las 30 lecciones debe vivir en un **único archivo/objeto de datos** con esta estructura:

```js
const LESSONS = [
  {
    day: 1,
    title: "¿Qué es programar?",
    category: "fundamentos",
    theory: "Programar es dar instrucciones a una computadora...",
    codeExample: {
      language: "javascript",
      code: "console.log('¡Hola, mundo!');"
    },
    challenge: "Abre la consola de tu navegador (F12) y escribe tu primer console.log con tu nombre.",
    resources: [
      { label: "MDN: ¿Qué es JavaScript?", url: "https://developer.mozilla.org/es/docs/Learn/JavaScript/First_steps/What_is_JavaScript" }
    ]
  },
  // ... días 2-30
];
```

**Genera contenido placeholder realista para los 30 días** siguiendo esta progresión temática:

| Semana | Días | Tema General |
|--------|------|-------------|
| 1 | 1-5 | **Fundamentos**: qué es programar, variables, tipos de datos, operadores, strings |
| 2 | 6-10 | **Control de flujo**: condicionales, if/else, switch, bucles for, bucles while |
| 3 | 11-15 | **Funciones y estructuras**: funciones, parámetros/retorno, arrays, objetos, métodos de array |
| 4 | 16-20 | **DOM y web**: qué es el DOM, seleccionar elementos, eventos, crear/modificar elementos, mini proyecto |
| 5 | 21-25 | **Pensamiento programador**: debugging, leer errores, pseudocódigo, algoritmos básicos, buenas prácticas |
| 6 | 26-30 | **Siguiente nivel**: intro a Git, intro a terminal, APIs y fetch, JSON, proyecto final integrador |

---

### REQUISITOS TÉCNICOS

- **Stack**: React (JSX) con un solo componente raíz, Tailwind CSS para estilos.
- **Sin dependencias externas** más allá de React y Tailwind (ya disponibles en el entorno).
- **Responsive**: debe verse bien en móvil (grid de 2 columnas) y desktop (5 columnas).
- **Persistencia**: `localStorage` para el progreso del usuario.
- **Routing**: usar estado de React (`useState`) para alternar entre vista calendario y vista lección. No se necesita React Router.
- **Accesibilidad**: casillas bloqueadas deben tener `aria-disabled`, botones con labels claros.

---

### ESTILO VISUAL (referencias)

- **Inspiración directa**: [adventofcode.com](https://adventofcode.com) — fondo oscuro, tipografía monoespaciada, estrellas/puntos como decoración.
- **Paleta sugerida**:
  - Fondo: `#0f0f23` (azul muy oscuro)
  - Texto principal: `#cccccc`
  - Acento primario: `#00cc00` (verde terminal)
  - Acento secundario: `#ffff66` (amarillo estrella)
  - Acento terciario: `#00cccc` (cyan)
  - Casilla bloqueada: `#333340`
  - Bordes: `#444466`
- **Tipografía**: monoespaciada (`'Source Code Pro', 'Fira Code', monospace`).
- **Efectos**:
  - Casillas desbloqueadas con `box-shadow` glow sutil.
  - Día actual con animación `pulse` o `glow` CSS.
  - Transición suave al cambiar entre vistas.
  - Estrellas decorativas (caracteres `*` o `✦`) esparcidas como en Advent of Code.

---

### FUNCIONALIDADES EXTRA (nice to have)

- **Barra de progreso** en el header: "12/30 lecciones completadas".
- **Confetti o animación** al marcar una lección como completada.
- **Categoría/badge** visible en cada casilla (color-coded por semana/tema).
- **Easter egg**: si completas las 30, mostrar un mensaje especial de felicitación.

---

### ENTREGABLE

Un **único archivo `.jsx`** (React component) que contenga:
1. El componente principal con ambas vistas.
2. El array completo de las 30 lecciones con contenido realista en español.
3. Todos los estilos usando clases de Tailwind.
4. La lógica de desbloqueo por fecha y persistencia en localStorage.

---

*Este prompt está diseñado para generar la aplicación en un solo paso. Si el resultado es demasiado largo, puedes dividirlo pidiendo primero la estructura + las primeras 10 lecciones, y luego el resto del contenido.*