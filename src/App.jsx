import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './hooks/useAuth.jsx';
import LoginPage from './views/LoginPage';

const LESSONS = [
  // ============================================
  // SEMANA 1: FUNDAMENTOS + HTML
  // ============================================
  {
    day: 1,
    title: "¿Qué es programar?",
    category: "Fundamentos",
    theory: "Programar es dar instrucciones precisas a una computadora para que realice tareas. Estas instrucciones se escriben en lenguajes de programación que la máquina puede entender. Es como escribir una receta de cocina: paso a paso, sin ambigüedades. En este curso aprenderás tres lenguajes: HTML/CSS para la parte visual, JavaScript para la lógica, y Python para el servidor.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "crea un archivo HTML y escribe en texto simple (Hola mundo) solo eso.",
    codeExample: {
      language: "html",
      code: "<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Hola mundo</title>\n</head>\n<body>\n  Hola mundo\n</body>\n</html>"
    },
    challenge: "Abre la consola de tu navegador (presiona F12, ve a la pestaña 'Console') y escribe: console.log('¡Hola, soy un programador!'); Luego presiona Enter y observa el resultado.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 2,
    title: "Conociendo las herramientas",
    category: "Fundamentos",
    theory: "Todo programador necesita herramientas básicas: un editor de código (VS Code es el más popular y gratuito), un navegador web moderno (Chrome o Firefox) y una terminal o consola. El editor es donde escribes tu código, el navegador donde ves el resultado, y la terminal donde ejecutas comandos. Instalar VS Code es el primer paso real para comenzar.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "html",
      code: "<!-- Esto es un comentario en HTML -->\n<!-- Tu primer archivo se llamará index.html -->\n<p>¡Hola desde VS Code!</p>"
    },
    challenge: "Descarga e instala VS Code desde code.visualstudio.com. Crea una carpeta llamada 'mi-primer-proyecto', ábrela en VS Code y crea un archivo llamado index.html.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 3,
    title: "Tu primera página web",
    category: "HTML",
    theory: "HTML (HyperText Markup Language) es el lenguaje que estructura el contenido de las páginas web. No es un lenguaje de programación, sino de marcado: usas etiquetas para decirle al navegador qué tipo de contenido estás mostrando. Todo documento HTML tiene una estructura base con las etiquetas <!DOCTYPE html>, <html>, <head> y <body>. El contenido visible va dentro de <body>.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "html",
      code: "<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Mi primera página</title>\n</head>\n<body>\n  <h1>¡Hola, mundo!</h1>\n  <p>Esta es mi primera página web.</p>\n</body>\n</html>"
    },
    challenge: "Copia la estructura HTML del ejemplo en tu archivo index.html y ábrelo en el navegador haciendo doble clic sobre el archivo. Cambia el texto del <h1> y del <p> por tu nombre y una frase sobre ti.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 4,
    title: "Encabezados y párrafos",
    category: "HTML",
    theory: "Los encabezados van de <h1> (el más importante) a <h6> (el menos importante). Sirven para organizar el contenido jerárquicamente, como los títulos y subtítulos de un libro. Los párrafos se crean con <p> y representan bloques de texto. Cada etiqueta tiene una apertura (<p>) y un cierre (</p>). También puedes usar <br> para saltos de línea y <hr> para líneas horizontales divisorias.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "html",
      code: "<h1>Título principal</h1>\n<h2>Subtítulo</h2>\n<p>Este es un párrafo con texto.</p>\n<p>Este es otro párrafo separado.</p>\n<hr>\n<h3>Otra sección</h3>\n<p>Más contenido aquí.</p>"
    },
    challenge: "Crea una página tipo 'blog personal' con un <h1> con tu nombre, un <h2> que diga 'Sobre mí', un párrafo de presentación, otro <h2> que diga 'Mis hobbies' y un párrafo listando tus pasatiempos.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 5,
    title: "Enlaces e imágenes",
    category: "HTML",
    theory: "Los enlaces (<a>) conectan páginas entre sí y son la base de la web. Usan el atributo href para indicar hacia dónde llevan. Las imágenes (<img>) muestran archivos visuales usando el atributo src para la ruta de la imagen y alt para un texto alternativo que describe la imagen. La etiqueta <img> es especial porque no tiene cierre (es 'auto-cerrada'). Los enlaces pueden apuntar a otras páginas, archivos, o secciones dentro de la misma página.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "html",
      code: "<a href=\"https://google.com\" target=\"_blank\">Ir a Google</a>\n\n<img src=\"foto.jpg\" alt=\"Descripción de la foto\" width=\"300\">\n\n<a href=\"pagina2.html\">Ir a otra página</a>"
    },
    challenge: "Agrega a tu página personal un enlace a tu red social favorita (con target='_blank' para que abra en nueva pestaña) y una imagen. Puedes usar cualquier imagen de internet copiando su URL en el atributo src.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 6,
    title: "Listas en HTML",
    category: "HTML",
    theory: "Existen dos tipos principales de listas: ordenadas (<ol>) que muestran números automáticamente, y no ordenadas (<ul>) que muestran viñetas. Cada elemento dentro de la lista se envuelve con <li>. Las listas son muy comunes en la web: menús de navegación, pasos de instrucciones, listas de productos, etc. También puedes anidar listas dentro de otras listas para crear subniveles.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "html",
      code: "<h3>Mis lenguajes favoritos:</h3>\n<ul>\n  <li>JavaScript</li>\n  <li>Python</li>\n  <li>HTML/CSS</li>\n</ul>\n\n<h3>Pasos para aprender a programar:</h3>\n<ol>\n  <li>Elige un lenguaje</li>\n  <li>Practica todos los días</li>\n  <li>Construye proyectos</li>\n</ol>"
    },
    challenge: "Crea una lista no ordenada con 5 cosas que te gustaría programar y una lista ordenada con los 3 pasos que seguirás para lograrlo. Añádelas a tu página personal.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 7,
    title: "Formularios básicos",
    category: "HTML",
    theory: "Los formularios (<form>) permiten que los usuarios envíen información. Son la base de registros, logins, buscadores y más. Los campos más comunes son: <input> para texto, email, contraseñas y números; <textarea> para textos largos; <select> para menús desplegables; y <button> para enviar. Cada campo debería tener un <label> asociado que describa qué información se pide. El atributo type del input define qué tipo de dato acepta.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "html",
      code: "<form>\n  <label for=\"nombre\">Nombre:</label>\n  <input type=\"text\" id=\"nombre\" placeholder=\"Tu nombre\">\n\n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" placeholder=\"tu@email.com\">\n\n  <label for=\"mensaje\">Mensaje:</label>\n  <textarea id=\"mensaje\" rows=\"4\"></textarea>\n\n  <button type=\"submit\">Enviar</button>\n</form>"
    },
    challenge: "Crea un formulario de contacto con campos para: nombre, email, asunto (un select con 3 opciones) y mensaje. Añade un botón de enviar. No te preocupes si no funciona aún, eso lo veremos con JavaScript.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
 
  // ============================================
  // SEMANA 2: CSS
  // ============================================
  {
    day: 8,
    title: "Introducción a CSS",
    category: "CSS",
    theory: "CSS (Cascading Style Sheets) es el lenguaje que le da estilo visual a tu HTML: colores, tamaños, espaciados, fuentes y posiciones. Se puede escribir de tres formas: en línea (dentro de la etiqueta con style='...'), interno (en un bloque <style> en el <head>) o externo (en un archivo .css separado, que es la forma recomendada). Un archivo CSS se conecta al HTML con la etiqueta <link>. Las reglas CSS se componen de un selector (qué elemento), una propiedad (qué cambiar) y un valor (cómo cambiarlo).",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "css",
      code: "/* archivo: styles.css */\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}\n\np {\n  color: #666;\n  line-height: 1.6;\n}"
    },
    challenge: "Crea un archivo styles.css, conéctalo a tu index.html con <link rel='stylesheet' href='styles.css'> y cambia el color de fondo de la página, el color del texto y la fuente. Experimenta con al menos 5 propiedades diferentes.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 9,
    title: "Selectores y colores",
    category: "CSS",
    theory: "Los selectores CSS definen a qué elementos aplicas estilos. Los más comunes son: por etiqueta (h1, p, div), por clase (.mi-clase) y por ID (#mi-id). Las clases se asignan con el atributo class y se pueden reutilizar; los IDs con el atributo id y son únicos. Los colores se pueden definir por nombre (red, blue), hexadecimal (#FF5733), RGB (rgb(255, 87, 51)) o HSL. La buena práctica es usar clases para estilos reutilizables e IDs solo para elementos únicos.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "css",
      code: "/* Selector por etiqueta */\np { color: #333; }\n\n/* Selector por clase */\n.destacado {\n  background-color: #fff3cd;\n  padding: 10px;\n  border-left: 4px solid #ffc107;\n}\n\n/* Selector por ID */\n#titulo-principal {\n  color: #2c3e50;\n  font-size: 2rem;\n}\n\n/* En HTML: <p class=\"destacado\">Texto</p> */"
    },
    challenge: "En tu página personal, agrega clases a diferentes elementos y dales estilos únicos. Crea al menos 3 clases distintas: una para texto destacado, una para secciones con fondo de color, y una para bordes decorativos.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 10,
    title: "El modelo de caja (Box Model)",
    category: "CSS",
    theory: "Cada elemento HTML es una caja rectangular compuesta por 4 capas: content (el contenido), padding (espacio interno entre el contenido y el borde), border (el borde visible) y margin (espacio externo entre la caja y otros elementos). Entender el box model es fundamental para controlar el diseño. Por defecto, width y height solo afectan al content, pero con box-sizing: border-box puedes hacer que incluyan padding y border, lo cual simplifica los cálculos.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "css",
      code: "/* Aplicar border-box a todo (buena práctica) */\n* {\n  box-sizing: border-box;\n}\n\n.tarjeta {\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #ddd;\n  margin: 15px;\n  border-radius: 8px;\n  background-color: white;\n}\n\n.tarjeta:hover {\n  border-color: #007bff;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}"
    },
    challenge: "Crea 3 tarjetas (divs con clase 'tarjeta') cada una con un título y un párrafo. Usa padding, margin, border y border-radius para que se vean como tarjetas de presentación. Añade un efecto :hover que cambie el borde o la sombra.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 11,
    title: "Flexbox: diseños flexibles",
    category: "CSS",
    theory: "Flexbox es un sistema de diseño que facilita alinear y distribuir elementos en una dirección (fila o columna). Se activa con display: flex en el contenedor padre. Las propiedades principales del padre son: flex-direction (fila o columna), justify-content (alineación horizontal), align-items (alineación vertical) y gap (espacio entre hijos). Es la herramienta más usada hoy para crear layouts modernos sin complicaciones.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "css",
      code: ".contenedor {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n  flex-wrap: wrap;\n}\n\n/* Centrar algo en toda la pantalla */\n.centrado-total {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n\n/* Navbar horizontal */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 20px;\n}"
    },
    challenge: "Usa Flexbox para crear un navbar con un logo a la izquierda y 3 enlaces a la derecha. Luego, debajo del navbar, muestra tus 3 tarjetas del día anterior en fila, centradas y con espacio uniforme entre ellas.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 12,
    title: "CSS Grid: cuadrículas poderosas",
    category: "CSS",
    theory: "CSS Grid permite crear diseños en dos dimensiones (filas y columnas simultáneamente). Se activa con display: grid en el contenedor. Con grid-template-columns defines cuántas columnas y su ancho, y con grid-template-rows las filas. La unidad 'fr' (fracción) distribuye el espacio disponible proporcionalmente. Es ideal para layouts de página completos, galerías de imágenes y dashboards.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "css",
      code: ".galeria {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 15px;\n  padding: 20px;\n}\n\n/* Layout de página completo */\n.pagina {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 60px 1fr 50px;\n  min-height: 100vh;\n}\n\n/* Responsive: 1 columna en móvil */\n@media (max-width: 768px) {\n  .galeria {\n    grid-template-columns: 1fr;\n  }\n}"
    },
    challenge: "Crea una galería de 6 elementos (pueden ser divs con colores de fondo diferentes) usando CSS Grid con 3 columnas en escritorio y 1 columna en móvil. Usa la media query del ejemplo para hacerlo responsive.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 13,
    title: "Diseño responsive",
    category: "CSS",
    theory: "Un diseño responsive se adapta a diferentes tamaños de pantalla: móvil, tablet y escritorio. Las herramientas principales son: unidades relativas (%, rem, vw, vh en lugar de px fijos), media queries (@media) para aplicar estilos según el ancho de pantalla, y la meta etiqueta viewport en el HTML. La estrategia 'mobile first' consiste en diseñar primero para móvil y luego agregar estilos para pantallas más grandes.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "css",
      code: "/* Mobile first: estilos base para móvil */\n.container {\n  width: 100%;\n  padding: 15px;\n}\n\n.titulo {\n  font-size: 1.5rem;\n}\n\n/* Tablet */\n@media (min-width: 768px) {\n  .container {\n    width: 750px;\n    margin: 0 auto;\n  }\n  .titulo {\n    font-size: 2rem;\n  }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .container {\n    width: 960px;\n  }\n}"
    },
    challenge: "Toma tu página personal y hazla completamente responsive: el navbar debe colapsar en móvil, las tarjetas deben mostrarse en 1 columna en móvil y 3 en desktop, y los textos deben ajustar su tamaño. Pruébalo redimensionando la ventana del navegador.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 14,
    title: "Mini proyecto: landing page",
    category: "CSS",
    theory: "Es hora de combinar todo lo aprendido de HTML y CSS en un proyecto real. Una landing page es una página de presentación con secciones típicas: hero (sección principal con título grande y botón), features (características o servicios), testimonios y footer. Usarás estructura HTML semántica (header, main, section, footer), Flexbox/Grid para el layout, y media queries para responsive.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "html",
      code: "<header class=\"hero\">\n  <h1>Bienvenido a Mi Proyecto</h1>\n  <p>La mejor solución para aprender a programar</p>\n  <a href=\"#features\" class=\"btn\">Conoce más</a>\n</header>\n\n<section id=\"features\" class=\"features\">\n  <div class=\"feature-card\">\n    <h3>Fácil</h3>\n    <p>Aprende paso a paso</p>\n  </div>\n  <!-- más cards... -->\n</section>\n\n<footer>\n  <p>&copy; 2025 Mi Proyecto</p>\n</footer>"
    },
    challenge: "Construye una landing page completa con: un hero section con fondo de color y texto centrado, una sección de 3 features en Grid/Flex, y un footer. Debe ser responsive. Este es tu primer proyecto de portafolio.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
 
  // ============================================
  // SEMANA 3: JAVASCRIPT
  // ============================================
  {
    day: 15,
    title: "JavaScript: tu primer script",
    category: "JavaScript",
    theory: "JavaScript (JS) es el lenguaje de programación de la web. A diferencia de HTML y CSS que son declarativos, JS permite crear lógica: tomar decisiones, repetir acciones, responder a clics, manipular la página en tiempo real y comunicarse con servidores. Se puede ejecutar en el navegador (frontend) y en servidores (backend con Node.js). Para incluirlo en HTML usas la etiqueta <script> al final del <body> o un archivo .js externo.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "// En un archivo script.js\nconsole.log('¡JavaScript está funcionando!');\n\nalert('¡Bienvenido a mi página!');\n\n// En HTML:\n// <script src=\"script.js\"></script>\n// (justo antes de </body>)"
    },
    challenge: "Crea un archivo script.js, conéctalo a tu HTML con <script src='script.js'></script> antes del cierre de </body>. Escribe un console.log con tu nombre y un alert de bienvenida. Verifica que funcione en el navegador.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 16,
    title: "Variables y tipos de datos",
    category: "JavaScript",
    theory: "Las variables son contenedores donde almacenas información. En JS moderno se declaran con let (puede cambiar) y const (no puede cambiar). Los tipos de datos principales son: string (texto entre comillas), number (números), boolean (true o false), null (vacío intencional), undefined (sin valor asignado), array (lista de valores) y object (colección de pares clave-valor). Usa const por defecto y let solo cuando necesites reasignar.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "const nombre = 'Ana';        // string\nlet edad = 25;               // number\nconst activo = true;         // boolean\nlet altura = 1.65;           // number\n\n// Template literals (plantillas de texto)\nconsole.log(`Hola, soy ${nombre} y tengo ${edad} años`);\n\n// Verificar tipo\nconsole.log(typeof nombre);  // 'string'\nconsole.log(typeof edad);    // 'number'"
    },
    challenge: "Crea variables con tu información personal (nombre, edad, ciudad, lenguaje favorito, si te gusta el café). Usa template literals para imprimir un párrafo completo en consola que diga algo como: 'Hola, soy [nombre], tengo [edad] años, vivo en [ciudad]...'.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 17,
    title: "Condicionales: tomando decisiones",
    category: "JavaScript",
    theory: "Los condicionales permiten que tu código tome decisiones basándose en condiciones. La estructura if/else evalúa una condición: si es verdadera ejecuta un bloque, si no, ejecuta otro. Puedes encadenar múltiples condiciones con else if. Los operadores de comparación son: === (igual estricto), !== (diferente), >, <, >=, <=. Los operadores lógicos && (y), || (o), ! (no) permiten combinar condiciones.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "const edad = 18;\n\nif (edad >= 18) {\n  console.log('Eres mayor de edad');\n} else {\n  console.log('Eres menor de edad');\n}\n\n// Múltiples condiciones\nconst nota = 85;\n\nif (nota >= 90) {\n  console.log('Excelente');\n} else if (nota >= 70) {\n  console.log('Aprobado');\n} else {\n  console.log('Reprobado');\n}\n\n// Operador ternario (versión corta)\nconst mensaje = edad >= 18 ? 'Adulto' : 'Menor';"
    },
    challenge: "Crea un sistema de calificaciones: declara una variable 'nota' y usando if/else if/else imprime 'A' (90-100), 'B' (80-89), 'C' (70-79), 'D' (60-69) o 'F' (menos de 60). Prueba cambiando el valor de la nota.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 18,
    title: "Bucles: repitiendo acciones",
    category: "JavaScript",
    theory: "Los bucles repiten un bloque de código mientras se cumpla una condición. El bucle for es ideal cuando sabes cuántas veces repetir (tiene inicializador, condición y actualización). El bucle while repite mientras una condición sea verdadera. El for...of recorre los elementos de un array directamente. Cuidado con los bucles infinitos: siempre asegúrate de que la condición eventualmente sea falsa.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "// for clásico\nfor (let i = 1; i <= 5; i++) {\n  console.log(`Iteración número ${i}`);\n}\n\n// for...of con arrays\nconst frutas = ['manzana', 'banana', 'naranja'];\nfor (const fruta of frutas) {\n  console.log(`Me gusta la ${fruta}`);\n}\n\n// while\nlet contador = 0;\nwhile (contador < 3) {\n  console.log(`Contador: ${contador}`);\n  contador++;\n}"
    },
    challenge: "Usa un bucle for para imprimir la tabla de multiplicar del número que quieras (del 1 al 10). Luego crea un array con 5 nombres de amigos y usa for...of para saludar a cada uno con: '¡Hola, [nombre]!'.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 19,
    title: "Funciones: bloques reutilizables",
    category: "JavaScript",
    theory: "Las funciones son bloques de código reutilizables que realizan una tarea específica. Se definen una vez y se pueden llamar (ejecutar) muchas veces. Pueden recibir parámetros (datos de entrada) y devolver un resultado con return. Hay dos formas principales: funciones declaradas (function nombre()) y funciones flecha (const nombre = () => {}). Las funciones flecha son más modernas y concisas.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "// Función declarada\nfunction saludar(nombre) {\n  return `¡Hola, ${nombre}!`;\n}\nconsole.log(saludar('Carlos'));\n\n// Función flecha\nconst sumar = (a, b) => a + b;\nconsole.log(sumar(5, 3)); // 8\n\n// Función con lógica\nconst esMayorDeEdad = (edad) => {\n  if (edad >= 18) {\n    return 'Sí, es mayor de edad';\n  }\n  return 'No, es menor de edad';\n};"
    },
    challenge: "Crea 3 funciones: una que reciba tu nombre y edad y retorne una presentación, otra que calcule el área de un rectángulo (base × altura), y otra que reciba una temperatura en Celsius y la convierta a Fahrenheit (°F = °C × 9/5 + 32).",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 20,
    title: "Arrays y objetos",
    category: "JavaScript",
    theory: "Los arrays son listas ordenadas de valores que se acceden por índice (empezando en 0). Los objetos son colecciones de pares clave-valor que representan entidades con propiedades. Los métodos más útiles de arrays son: push (agregar), pop (quitar último), map (transformar cada elemento), filter (filtrar), find (buscar uno) y length (contar). Los objetos se acceden con punto (objeto.propiedad) o corchetes (objeto['propiedad']).",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "// Arrays\nconst numeros = [10, 20, 30, 40, 50];\nconsole.log(numeros[0]); // 10\nconsole.log(numeros.length); // 5\n\nconst dobles = numeros.map(n => n * 2);\nconst mayores = numeros.filter(n => n > 25);\n\n// Objetos\nconst usuario = {\n  nombre: 'María',\n  edad: 28,\n  ciudad: 'Caracas',\n  hobbies: ['leer', 'programar']\n};\n\nconsole.log(usuario.nombre); // 'María'\nconsole.log(usuario.hobbies[1]); // 'programar'"
    },
    challenge: "Crea un array de 5 objetos 'estudiante' con nombre, edad y nota. Luego usa .filter() para obtener solo los aprobados (nota >= 70), .map() para crear un array solo con los nombres, y .find() para buscar un estudiante específico por nombre.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 21,
    title: "El DOM: manipulando la página",
    category: "JavaScript",
    theory: "El DOM (Document Object Model) es la representación de tu HTML como un árbol de objetos que JavaScript puede leer y modificar. Con el DOM puedes seleccionar elementos (querySelector, getElementById), cambiar su contenido (textContent, innerHTML), modificar estilos (style), agregar/quitar clases (classList) y crear nuevos elementos (createElement). Es el puente entre tu código JS y lo que el usuario ve en pantalla.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "// Seleccionar elementos\nconst titulo = document.querySelector('h1');\nconst parrafos = document.querySelectorAll('p');\n\n// Modificar contenido\ntitulo.textContent = '¡Nuevo título!';\n\n// Modificar estilos\ntitulo.style.color = 'blue';\ntitulo.style.fontSize = '3rem';\n\n// Agregar/quitar clases\ntitulo.classList.add('destacado');\ntitulo.classList.toggle('activo');\n\n// Crear un elemento nuevo\nconst nuevoP = document.createElement('p');\nnuevoP.textContent = 'Párrafo creado con JS';\ndocument.body.appendChild(nuevoP);"
    },
    challenge: "En tu HTML crea un <div id='resultado'> vacío. Desde JavaScript, selecciónalo y agrega dinámicamente: un título, un párrafo con la fecha actual (new Date().toLocaleDateString()) y 3 items de una lista creados con createElement. Todo sin tocar el HTML.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
 
  // ============================================
  // SEMANA 4: EVENTOS + PYTHON + PROYECTO FINAL
  // ============================================
  {
    day: 22,
    title: "Eventos: interactividad real",
    category: "JavaScript",
    theory: "Los eventos son acciones del usuario (clics, teclas, scroll, envío de formularios) que JavaScript puede detectar y responder. Se asignan con addEventListener, que recibe el tipo de evento y una función callback que se ejecuta cuando ocurre. Los eventos más comunes son: click, input, submit, keydown, mouseover, scroll y load. El objeto event (e) contiene información sobre lo que pasó, como e.target (el elemento que disparó el evento) y e.preventDefault() para evitar el comportamiento por defecto.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "const boton = document.querySelector('#miBoton');\nconst input = document.querySelector('#miInput');\nconst display = document.querySelector('#display');\n\n// Evento click\nboton.addEventListener('click', () => {\n  display.textContent = '¡Botón presionado!';\n});\n\n// Evento input (en tiempo real)\ninput.addEventListener('input', (e) => {\n  display.textContent = `Escribiste: ${e.target.value}`;\n});\n\n// Prevenir envío de formulario\nconst form = document.querySelector('form');\nform.addEventListener('submit', (e) => {\n  e.preventDefault();\n  console.log('Formulario capturado con JS');\n});"
    },
    challenge: "Crea una mini-app con: un input de texto, un botón y un div para resultados. Al escribir en el input, muestra el texto en tiempo real en el div. Al hacer clic en el botón, convierte el texto a mayúsculas. Agrega un segundo botón que limpie todo.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 23,
    title: "Proyecto JS: lista de tareas",
    category: "JavaScript",
    theory: "Es momento de combinar todo lo aprendido de JavaScript en un proyecto funcional. Una lista de tareas (To-Do List) usa: manipulación del DOM para agregar y eliminar elementos, eventos para responder al usuario, arrays para almacenar los datos, y funciones para organizar la lógica. localStorage del navegador permite guardar datos que persisten incluso al cerrar la pestaña. Este es un proyecto clásico que todo principiante debe construir.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "const tareas = [];\n\nconst agregarTarea = (texto) => {\n  const tarea = {\n    id: Date.now(),\n    texto: texto,\n    completada: false\n  };\n  tareas.push(tarea);\n  renderTareas();\n};\n\nconst renderTareas = () => {\n  const lista = document.querySelector('#lista');\n  lista.innerHTML = '';\n  tareas.forEach(tarea => {\n    const li = document.createElement('li');\n    li.textContent = tarea.texto;\n    li.addEventListener('click', () => {\n      tarea.completada = !tarea.completada;\n      renderTareas();\n    });\n    if (tarea.completada) li.classList.add('done');\n    lista.appendChild(li);\n  });\n};"
    },
    challenge: "Construye una To-Do List completa con: input para escribir tareas, botón para agregar, las tareas se muestran en una lista, clic en una tarea la marca como completada (texto tachado), y un botón para eliminar tareas completadas. Bonus: guárdalas en localStorage.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 24,
    title: "Introducción a Python",
    category: "Python",
    theory: "Python es uno de los lenguajes más populares del mundo por su sintaxis limpia y legible. Se usa en backend web, ciencia de datos, inteligencia artificial y automatización. A diferencia de JavaScript, Python usa indentación (espacios) para definir bloques de código en lugar de llaves {}. Para ejecutarlo necesitas instalar Python desde python.org. Se escribe en archivos .py y se ejecuta desde la terminal con 'python archivo.py'. print() es el equivalente a console.log().",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "python",
      code: "# Mi primer script en Python\nprint('¡Hola, mundo desde Python!')\n\n# Variables (no necesitan let/const)\nnombre = 'Carlos'\nedad = 25\naltura = 1.75\nes_programador = True\n\n# f-strings (como template literals en JS)\nprint(f'Hola, soy {nombre} y tengo {edad} años')\n\n# Tipos de datos\nprint(type(nombre))  # <class 'str'>\nprint(type(edad))    # <class 'int'>"
    },
    challenge: "Instala Python, crea un archivo hola.py y escribe un programa que declare variables con tu información personal y las imprima usando f-strings. Ejecútalo desde la terminal con 'python hola.py'. Experimenta con los tipos: str, int, float y bool.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 25,
    title: "Condicionales y bucles en Python",
    category: "Python",
    theory: "Python usa if, elif (equivalente a else if) y else para condicionales. Los bucles más comunes son for (para recorrer secuencias) y while (mientras se cumpla una condición). La función range(inicio, fin) genera una secuencia de números. La sintaxis es más limpia que en JS: no usa paréntesis en las condiciones ni llaves para los bloques, solo dos puntos (:) e indentación. Las listas en Python son equivalentes a los arrays de JavaScript.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "python",
      code: "# Condicionales\nnota = 85\n\nif nota >= 90:\n    print('Excelente')\nelif nota >= 70:\n    print('Aprobado')\nelse:\n    print('Reprobado')\n\n# Bucle for con range\nfor i in range(1, 6):\n    print(f'Número: {i}')\n\n# Bucle for con lista\nfrutas = ['manzana', 'banana', 'naranja']\nfor fruta in frutas:\n    print(f'Me gusta la {fruta}')\n\n# While\ncontador = 0\nwhile contador < 3:\n    print(f'Contador: {contador}')\n    contador += 1"
    },
    challenge: "Escribe un programa en Python que: 1) Pida al usuario un número con input(), 2) Determine si es par o impar, 3) Imprima la tabla de multiplicar de ese número del 1 al 10 usando un bucle for. Recuerda convertir el input a número con int().",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 26,
    title: "Funciones y estructuras de datos en Python",
    category: "Python",
    theory: "Las funciones en Python se definen con def nombre(parametros): y retornan valores con return. Python tiene dos estructuras de datos clave: listas (como arrays en JS, se definen con []) y diccionarios (como objetos en JS, se definen con {}). Las listas tienen métodos como append, remove, sort, y se pueden recorrer con for. Los diccionarios almacenan pares clave-valor y se acceden con corchetes o .get(). Las list comprehensions permiten crear listas de forma concisa.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "python",
      code: "# Funciones\ndef calcular_promedio(notas):\n    return sum(notas) / len(notas)\n\nnotas = [85, 92, 78, 95, 88]\nprint(f'Promedio: {calcular_promedio(notas)}')\n\n# Diccionarios\nusuario = {\n    'nombre': 'María',\n    'edad': 28,\n    'ciudad': 'Caracas'\n}\nprint(usuario['nombre'])\n\n# List comprehension\nnumeros = [1, 2, 3, 4, 5]\ndobles = [n * 2 for n in numeros]\npares = [n for n in numeros if n % 2 == 0]"
    },
    challenge: "Crea un programa que maneje una lista de estudiantes (diccionarios con nombre, edad y nota). Escribe funciones para: agregar estudiante, buscar por nombre, calcular el promedio general, y filtrar los aprobados (nota >= 70). Imprime los resultados.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 27,
    title: "Tu primer servidor con Python",
    category: "Python",
    theory: "Un servidor web es un programa que escucha peticiones HTTP y responde con datos (HTML, JSON, etc.). Flask es un micro-framework de Python que permite crear servidores web con muy poco código. Se instala con 'pip install flask'. Con Flask defines rutas (URLs) y qué función se ejecuta cuando alguien visita esa ruta. Puedes devolver HTML, texto o datos JSON. El servidor se ejecuta localmente en http://localhost:5000. Tip: en proyectos reales, guarda la URL del servidor en una variable o variable de entorno para no repetirla en cada archivo.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "python",
      code: "# archivo: app.py\n# Instalar: pip install flask\nfrom flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route('/')\ndef inicio():\n    return '<h1>¡Mi primer servidor!</h1>'\n\n@app.route('/api/saludo/<nombre>')\ndef saludo(nombre):\n    return jsonify({\n        'mensaje': f'¡Hola, {nombre}!',\n        'status': 'ok'\n    })\n\nif __name__ == '__main__':\n    app.run(debug=True)"
    },
    challenge: "Instala Flask y crea un servidor con 3 rutas: '/' que muestre un HTML de bienvenida, '/api/fecha' que devuelva la fecha actual en JSON, y '/api/saludo/<nombre>' que salude al nombre que reciba en la URL. Ejecútalo y prueba cada ruta en tu navegador.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 28,
    title: "Conectando frontend y backend",
    category: "Fullstack",
    theory: "La comunicación entre frontend (navegador) y backend (servidor) se hace mediante peticiones HTTP usando fetch() en JavaScript. El frontend envía una petición a una URL del servidor (API), el servidor procesa la petición y devuelve datos (generalmente en formato JSON), y el frontend usa esos datos para actualizar la interfaz. Las peticiones más comunes son GET (obtener datos) y POST (enviar datos). Esto es la base de toda aplicación web moderna.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "javascript",
      code: "// Frontend: pidiendo datos al backend\n// Tip: centraliza la URL del servidor en una variable\nconst API_URL = 'http://localhost:5000';\n\nconst cargarDatos = async () => {\n  try {\n    const respuesta = await fetch(`${API_URL}/api/tareas`);\n    const datos = await respuesta.json();\n    console.log(datos);\n    \n    // Mostrar en el DOM\n    const lista = document.querySelector('#lista');\n    datos.forEach(tarea => {\n      const li = document.createElement('li');\n      li.textContent = tarea.texto;\n      lista.appendChild(li);\n    });\n  } catch (error) {\n    console.error('Error:', error);\n  }\n};\n\ncargarDatos();"
    },
    challenge: "Crea un backend Flask con una ruta '/api/tareas' que devuelva una lista de tareas en JSON. Luego crea un frontend HTML con JavaScript que use fetch() para obtener esas tareas y mostrarlas en la página. Habrás creado tu primera app fullstack.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 29,
    title: "Git y GitHub: guardando tu código",
    category: "Herramientas",
    theory: "Git es un sistema de control de versiones que registra cada cambio en tu código, permitiéndote volver atrás si algo falla. GitHub es una plataforma en la nube donde almacenas tus repositorios Git y compartes tu código con el mundo. Los comandos esenciales son: git init (iniciar repositorio), git add . (preparar cambios), git commit -m 'mensaje' (guardar cambios), git push (subir a GitHub) y git pull (descargar cambios). Todo desarrollador profesional usa Git a diario.",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "bash",
      code: "# Configuración inicial (solo una vez)\ngit config --global user.name \"Tu Nombre\"\ngit config --global user.email \"tu@email.com\"\n\n# Flujo básico de trabajo\ngit init                          # Iniciar repositorio\ngit add .                         # Agregar todos los archivos\ngit commit -m \"primer commit\"     # Guardar cambios\n\n# Conectar con GitHub\ngit remote add origin https://github.com/tu-usuario/tu-repo.git\ngit push -u origin main           # Subir a GitHub"
    },
    challenge: "Instala Git, crea una cuenta en GitHub, y sube tu proyecto de landing page (día 14) o tu To-Do List (día 23) a un repositorio público. Haz al menos 3 commits con mensajes descriptivos. Comparte el enlace de tu repo con la comunidad.",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  },
  {
    day: 30,
    title: "Tu primera app en producción",
    category: "Deployment",
    theory: "Poner tu proyecto 'en producción' significa que cualquier persona en el mundo pueda acceder a él desde internet. Para proyectos frontend (HTML/CSS/JS) existen opciones gratuitas como GitHub Pages, Netlify y Vercel. Para proyectos con backend (Python/Flask) puedes usar Render, Railway o Fly.io. El proceso general es: subir tu código a GitHub, conectar el repositorio con la plataforma de hosting, y ella se encarga de publicarlo con una URL pública. ¡Hoy tu código sale al mundo!",
    instructions: "Aqui van las instrucciones para completar esta tarea.",
    prompt: "#",
    codeExample: {
      language: "bash",
      code: "# Opción 1: GitHub Pages (solo frontend)\n# 1. Sube tu proyecto a GitHub\n# 2. Ve a Settings > Pages\n# 3. Selecciona la rama 'main'\n# 4. Tu sitio estará en: tu-usuario.github.io/tu-repo\n\n# Opción 2: Netlify (frontend, más fácil)\n# 1. Ve a netlify.com\n# 2. Arrastra tu carpeta del proyecto\n# 3. ¡Listo! Te da una URL pública\n\n# Opción 3: Render (frontend + backend)\n# 1. Conecta tu repo de GitHub en render.com\n# 2. Selecciona 'Web Service' para Python\n# 3. Deploy automático en cada push"
    },
    challenge: "Despliega al menos uno de tus proyectos en internet. Si es solo frontend usa GitHub Pages o Netlify. Si tiene backend usa Render. Comparte la URL con la comunidad de New Coders. ¡Felicidades, completaste el curso de 30 días!",
    resources: [
      { label: "Aprende con IA", url: "https://github.com/" }
    ],
    aiLink: '#'
  }
];

const START_DATE = new Date('2026-04-01T00:00:00'); // Fecha de inicio del curso

// Datos del carrusel de Aliados — reemplazar con imagenes y URLs reales
const CAROUSEL_ITEMS = [
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+1', url: 'https://example.com', title: 'Aliado 1', alt: 'Aliado 1' },
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+2', url: 'https://example.com', title: 'Aliado 2', alt: 'Aliado 2' },
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+3', url: 'https://example.com', title: 'Aliado 3', alt: 'Aliado 3' },
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+4', url: 'https://example.com', title: 'Aliado 4', alt: 'Aliado 4' },
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+5', url: 'https://example.com', title: 'Aliado 5', alt: 'Aliado 5' },
];

const SocialLinks = () => (
  <div className="flex justify-center items-center gap-5 mt-3">
    <a
      href="https://chat.whatsapp.com/EBB9GtaKths1ND1CrgAobi"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Únete a nuestra comunidad en WhatsApp"
      className="text-text-light hover:text-neon-green transition-colors duration-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.74 5.494 2.035 7.807L0 32l8.418-2.01A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.25a13.21 13.21 0 0 1-6.73-1.84l-.482-.286-4.997 1.194 1.222-4.862-.314-.5A13.22 13.22 0 0 1 2.75 16C2.75 8.682 8.682 2.75 16 2.75S29.25 8.682 29.25 16 23.318 29.25 16 29.25zm7.27-9.77c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.633-.199-.9.2-.266.398-1.031 1.295-1.264 1.562-.233.266-.465.299-.863.1-.398-.2-1.682-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.216-2.759-.233-.398-.025-.613.175-.811.18-.179.398-.465.597-.698.199-.233.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.199-.9-2.169-1.232-2.967-.325-.779-.655-.673-.9-.686l-.765-.013c-.266 0-.697.1-1.063.498-.365.398-1.396 1.364-1.396 3.326 0 1.963 1.43 3.86 1.63 4.126.199.266 2.814 4.296 6.82 6.026.954.412 1.698.657 2.279.842.957.305 1.83.262 2.519.159.768-.115 2.355-.963 2.688-1.893.332-.93.332-1.729.232-1.893-.1-.166-.366-.266-.764-.465z"/>
      </svg>
    </a>
    <a
      href="https://x.com/NewCodersOrg"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Síguenos en X (Twitter)"
      className="text-text-light hover:text-neon-green transition-colors duration-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>
  </div>
);

export default function App() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;
  if (!user) return <LoginPage />;

  const [currentView, setCurrentView] = useState('calendar');
  const [selectedDay, setSelectedDay] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('completedLessons');
      if (!saved) return [];
      
      // ✅ SEGURIDAD: Validar datos recuperados de localStorage
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      
      // ✅ SEGURIDAD: Filtrar solo números válidos entre 1-30
      return parsed.filter(day => Number.isInteger(day) && day >= 1 && day <= 30);
    } catch (error) {
      console.warn('Error al recuperar datos de localStorage:', error);
      return [];
    }
  });

  const today = new Date();

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, started: false });
  const [copied, setCopied] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselTransition, setCarouselTransition] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(() => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  });

  useEffect(() => {
    const calc = () => {
      const diff = START_DATE - new Date();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        started: false,
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, []);

  // Resize listener para el carrusel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll infinito del carrusel
  useEffect(() => {
    if (CAROUSEL_ITEMS.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => {
        const next = prev + 1;
        if (next >= CAROUSEL_ITEMS.length) {
          // Reset invisible: desactivar transición, saltar a 0
          setCarouselTransition(false);
          setTimeout(() => setCarouselTransition(true), 50);
          return 0;
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [itemsPerView]);

  const stars = useMemo(() =>
    Array.from({ length: 160 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  , []);

  const getDayStatus = (dayNumber) => {
    const lessonDate = new Date(START_DATE);
    lessonDate.setDate(lessonDate.getDate() + (dayNumber - 1));
    
    if (lessonDate > today) {
      return 'locked';
    } else if (completedLessons.includes(dayNumber)) {
      return 'completed';
    } else {
      return 'available';
    }
  };

  const getCurrentDayNumber = () => {
    const diffTime = today.getTime() - START_DATE.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(30, diffDays));
  };

  const handleMarkComplete = (dayNumber) => {
    // ✅ SEGURIDAD: Validar que dayNumber sea válido
    if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
      console.warn('Intento de marcar día inválido:', dayNumber);
      return;
    }

    if (!completedLessons.includes(dayNumber)) {
      const newCompleted = [...completedLessons, dayNumber];
      setCompletedLessons(newCompleted);
      // ✅ SEGURIDAD: Validar antes de guardar en localStorage
      try {
        localStorage.setItem('completedLessons', JSON.stringify(newCompleted));
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }
    }
  };

  const progressPercent = (completedLessons.length / 30) * 100;

  if (currentView === 'herramientas') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(191,0,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button onClick={() => setCurrentView('calendar')} className="text-neon-cyan hover:text-neon-green transition mb-4">
            ← Volver al Calendario
          </button>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCurrentView('perfil')}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              title="Mi Perfil"
              aria-label="Mi Perfil"
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-4xl font-bold text-neon-green">Herramientas del curso</h1>
          <p className="text-neon-yellow mt-1 text-lg">New Coders — 30 días</p>
        </header>

        <main className="max-w-4xl mx-auto p-6 space-y-8">
          <section className="card-base p-6 border-2 border-neon-cyan">
            <p className="text-text-light leading-relaxed">
              Todo lo que necesitas instalar para completar el curso. Descarga siempre desde los sitios oficiales.
            </p>
          </section>

          {/* Obligatorias */}
          <section className="card-base p-6 border-2 border-neon-green">
            <h2 className="text-2xl font-bold text-neon-green mb-5">🛠️ Obligatorias</h2>
            <ul className="space-y-5">
              {[
                {
                  name: 'VS Code',
                  desc: 'Editor de código gratuito de Microsoft. Es donde escribirás todo tu código durante los 30 días.',
                  detail: 'Descárgalo desde code.visualstudio.com/download, ejecuta el instalador y en Windows marca "Agregar a PATH".',
                  url: 'https://code.visualstudio.com/download',
                },
                {
                  name: 'Google Chrome',
                  desc: 'Navegador con herramientas de desarrollo (DevTools) que usarás para inspeccionar HTML, depurar JS y probar CSS.',
                  detail: 'Descárgalo desde google.com/chrome, la instalación es automática.',
                  url: 'https://www.google.com/chrome',
                },
                {
                  name: 'Python',
                  desc: 'Lenguaje para crear tu primer servidor web (día 24 en adelante).',
                  detail: 'Descárgalo desde python.org/downloads. En Windows es crítico marcar "Add to PATH" durante la instalación. En macOS/Linux el comando es python3.',
                  url: 'https://www.python.org/downloads',
                },
                {
                  name: 'Git',
                  desc: 'Sistema de control de versiones que registra cada cambio en tu código (día 29).',
                  detail: 'Descárgalo desde git-scm.com, acepta las opciones por defecto y luego configura tu nombre y email con git config --global.',
                  url: 'https://git-scm.com',
                },
                {
                  name: 'GitHub (cuenta)',
                  desc: 'Plataforma donde almacenas tu código en la nube y despliegas tus proyectos.',
                  detail: 'Crea una cuenta gratuita en github.com con un nombre de usuario profesional.',
                  url: 'https://github.com',
                },
              ].map(tool => (
                <li key={tool.name} className="border border-border-dark rounded-lg p-4" style={{ background: 'rgba(0,212,255,0.03)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-neon-green font-bold text-lg">{tool.name}</span>
                      <p className="text-text-light text-sm mt-1">{tool.desc}</p>
                      <p className="text-neon-yellow text-xs mt-2 leading-relaxed">{tool.detail}</p>
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-bold px-3 py-1 rounded border border-neon-cyan text-neon-cyan hover:text-neon-green hover:border-neon-green transition whitespace-nowrap">
                      Descargar ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Opcionales */}
          <section className="card-base p-6 border-2 border-neon-yellow">
            <h2 className="text-2xl font-bold text-neon-yellow mb-5">⚡ Opcionales</h2>
            <ul className="space-y-5">
              {[
                {
                  name: 'Node.js',
                  desc: 'Permite ejecutar JavaScript fuera del navegador.',
                  detail: 'Descarga la versión LTS desde nodejs.org.',
                  url: 'https://nodejs.org',
                },
                {
                  name: 'Netlify / Render (cuentas)',
                  desc: 'Hosting gratuito para publicar tus proyectos en internet el día 30.',
                  detail: 'Netlify (netlify.com) para frontend, Render (render.com) para backend. Regístrate con tu cuenta de GitHub.',
                  url: 'https://netlify.com',
                },
              ].map(tool => (
                <li key={tool.name} className="border border-border-dark rounded-lg p-4" style={{ background: 'rgba(255,0,153,0.03)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-neon-yellow font-bold text-lg">{tool.name}</span>
                      <p className="text-text-light text-sm mt-1">{tool.desc}</p>
                      <p className="text-neon-cyan text-xs mt-2 leading-relaxed">{tool.detail}</p>
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-bold px-3 py-1 rounded border border-neon-yellow text-neon-yellow hover:text-neon-green hover:border-neon-green transition whitespace-nowrap">
                      Ver ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Extensiones VS Code */}
          <section className="card-base p-6 border-2 border-neon-cyan">
            <h2 className="text-2xl font-bold text-neon-cyan mb-3">🧩 Extensiones de VS Code</h2>
            <p className="text-neon-yellow text-xs mb-4">Instálalas con <code className="bg-dark-bg px-2 py-0.5 rounded border border-border-dark">Ctrl+Shift+X</code></p>
            <ul className="space-y-2">
              {[
                { name: 'Live Server',       desc: 'Recarga automática al guardar.' },
                { name: 'Prettier',          desc: 'Formatea tu código.' },
                { name: 'Python (Microsoft)', desc: 'Autocompletado para archivos .py.' },
                { name: 'ES7+ Snippets',     desc: 'Atajos de teclado para JavaScript.' },
              ].map(ext => (
                <li key={ext.name} className="flex gap-3 text-sm">
                  <span className="text-neon-green font-bold min-w-fit">{ext.name}</span>
                  <span className="text-text-light">— {ext.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 text-center">
            <a
              href="https://notebooklm.google.com/notebook/8167d8cc-9006-4d0b-97ae-256aa7b74790?pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-bold py-3 px-6 rounded-lg border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg transition-all duration-300"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Aprende a instalar los recursos con IA
            </a>
          </div>
        </main>

        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-cyan">✦ Instala todo antes del Día 1 y arranca sin fricciones ✦</p>
          <SocialLinks />
        </footer>
      </div>
    );
  }

  if (currentView === 'intro') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        {/* Header */}
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(191,0,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button
            onClick={() => setCurrentView('calendar')}
            className="text-neon-cyan hover:text-neon-green transition mb-4"
          >
            ← Volver al Calendario
          </button>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCurrentView('perfil')}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              title="Mi Perfil"
              aria-label="Mi Perfil"
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-neon-cyan text-neon-cyan uppercase tracking-widest" style={{ fontFamily: 'Orbitron, monospace' }}>
              Temporada 1
            </span>
          </div>
          <h1 className="text-4xl font-bold text-neon-green">
            New Coders
          </h1>
          <p className="text-neon-yellow mt-1 text-lg">First Commit</p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Bienvenida */}
          <section className="card-base p-6 border-2 border-neon-cyan">
            <h2 className="text-2xl font-bold text-neon-cyan mb-4">🚀 Bienvenida al Calendario Practico</h2>
            <p className="text-text-light leading-relaxed">
              <strong className="text-neon-green">New Coders</strong> es un programa 100% practico de 30 días diseñado para llevarte paso a paso desde cero en programación con los lenguajes mas usados en 2026. Cada día Practicaras un concepto nuevo: desde cómo funciona la web, hasta escribir código real en HTML, CSS, JavaScript y Python. No necesitas experiencia previa — solo ganas de aprender y constancia.
            </p>
          </section>

          {/* Cómo funciona */}
          <section className="card-base p-6 border-2 border-neon-green">
            <h2 className="text-2xl font-bold text-neon-green mb-4">⚙️ ¿Cómo funciona?</h2>
            <ul className="text-text-light space-y-3 leading-relaxed">
              <li>📅 <strong className="text-neon-yellow">Una lección por día</strong> — cada lección se desbloquea automáticamente en su fecha correspondiente.</li>
              <li>📚 <strong className="text-neon-yellow">Teoría + Ejemplo + Reto</strong> — cada lección tiene explicación, código de ejemplo y un desafío práctico para que lo hagas tú mismo.</li>
              <li>✅ <strong className="text-neon-yellow">Marca tu progreso</strong> — cuando termines una lección, haz clic en "Marcar como Completada" y verás avanzar tu barra de progreso.</li>
              <li>🔒 <strong className="text-neon-yellow">Lecciones bloqueadas</strong> — las lecciones futuras aparecen con candado hasta que llegue su día. ¡La espera forma parte del aprendizaje!</li>
            </ul>
          </section>

          {/* Por dónde empezar */}
          <section className="card-base p-6 border-2 border-neon-yellow">
            <h2 className="text-2xl font-bold text-neon-yellow mb-4">🎯 ¿Por dónde empezar?</h2>
            <p className="text-text-light leading-relaxed mb-3">
              Simple: vuelve al calendario y abre el <strong className="text-neon-green">Día 1</strong>. Lee la teoría, estudia el ejemplo de código, completa el reto y marca la lección como completada.
            </p>
            <p className="text-text-light leading-relaxed">
              Repite eso cada día durante 30 días y al final de esta temporada habrás dado tu <strong className="text-neon-cyan">First Commit</strong> al mundo de la programación.
            </p>
          </section>

          {/* Carrusel Aliados New Coders */}
          {CAROUSEL_ITEMS.length > 0 && (
            <section className="card-base p-6 border-2 border-neon-purple">
              <h2 className="text-2xl font-bold text-neon-purple mb-4">🤝 Aliados New Coders</h2>

              <div className="overflow-hidden">
                <div
                  className={`flex ${carouselTransition ? 'transition-transform duration-700 ease-in-out' : ''}`}
                  style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerView)}%)` }}
                >
                  {[...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS].map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-2"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <div className="group relative rounded-lg border border-border-dark overflow-hidden transition-all duration-300 hover:border-neon-purple hover:shadow-lg hover:shadow-neon-purple/30">
                        <div className="aspect-video bg-dark-bg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3 bg-dark-card">
                          <p className="text-sm font-bold text-neon-purple group-hover:text-neon-green transition-colors truncate">
                            {item.title} ↗
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-cyan">✦ Tu viaje empieza con un solo paso — el Día 1 ✦</p>
          <SocialLinks />
        </footer>
      </div>
    );
  }

  if (currentView === 'nosotros') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        {/* Header */}
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(255,102,0,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button
            onClick={() => setCurrentView('calendar')}
            className="text-neon-cyan hover:text-neon-green transition mb-4"
          >
            ← Volver al Calendario
          </button>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCurrentView('perfil')}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              title="Mi Perfil"
              aria-label="Mi Perfil"
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-4xl font-bold text-neon-orange" style={{ fontFamily: 'Orbitron, monospace' }}>
            Nosotros
          </h1>
          <p className="text-neon-yellow mt-1 text-lg">El equipo detrás de New Coders</p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Quiénes somos */}
          <section className="card-base p-6 border-2 border-neon-orange">
            <h2 className="text-2xl font-bold text-neon-orange mb-4">🚀 ¿Quiénes somos?</h2>
            <p className="text-text-light leading-relaxed">
              Somos <strong className="text-neon-green">New Coders</strong>, un equipo apasionado por la tecnología y la educación. Creemos que aprender a programar debe ser accesible, práctico y divertido para todos. Nuestro objetivo es guiar a personas sin experiencia previa en sus primeros pasos en el mundo del desarrollo de software.
            </p>
          </section>

          {/* Nuestra misión */}
          <section className="card-base p-6 border-2 border-neon-green">
            <h2 className="text-2xl font-bold text-neon-green mb-4">🎯 Nuestra Misión</h2>
            <p className="text-text-light leading-relaxed">
              Democratizar el acceso a la educación en programación, ofreciendo un programa estructurado de <strong className="text-neon-yellow">30 días</strong> que transforma a principiantes en personas capaces de escribir código real. Queremos que cada persona que empiece este camino termine con las habilidades y la confianza para seguir creciendo como desarrollador.
            </p>
          </section>

          {/* Qué nos hace diferentes */}
          <section className="card-base p-6 border-2 border-neon-cyan">
            <h2 className="text-2xl font-bold text-neon-cyan mb-4">✦ ¿Qué nos hace diferentes?</h2>
            <ul className="text-text-light space-y-3 leading-relaxed">
              <li>💻 <strong className="text-neon-yellow">100% Práctico</strong> — Cada lección incluye código real que puedes escribir y ejecutar desde el primer día.</li>
              <li>📅 <strong className="text-neon-yellow">Estructura día a día</strong> — Un plan de 30 días diseñado para que avances sin sentirte perdido.</li>
              <li>🤖 <strong className="text-neon-yellow">Aprendizaje con IA</strong> — Integramos herramientas de inteligencia artificial para potenciar tu aprendizaje.</li>
              <li>🤝 <strong className="text-neon-yellow">Comunidad activa</strong> — No estás solo: nuestra comunidad en WhatsApp te acompaña en cada paso.</li>
              <li>🆓 <strong className="text-neon-yellow">Acceso libre</strong> — Creemos que la educación en tecnología no debería tener barreras de entrada.</li>
            </ul>
          </section>

          {/* Nuestros valores */}
          <section className="card-base p-6 border-2 border-neon-yellow">
            <h2 className="text-2xl font-bold text-neon-yellow mb-4">⚡ Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border-dark bg-dark-card">
                <h3 className="text-lg font-bold text-neon-orange mb-2">Constancia</h3>
                <p className="text-text-light text-sm">30 días, un paso a la vez. El progreso se construye con disciplina diaria.</p>
              </div>
              <div className="p-4 rounded-lg border border-border-dark bg-dark-card">
                <h3 className="text-lg font-bold text-neon-cyan mb-2">Comunidad</h3>
                <p className="text-text-light text-sm">Aprender juntos es más poderoso que aprender solo. Nos apoyamos mutuamente.</p>
              </div>
              <div className="p-4 rounded-lg border border-border-dark bg-dark-card">
                <h3 className="text-lg font-bold text-neon-green mb-2">Práctica</h3>
                <p className="text-text-light text-sm">Menos teoría, más código. Se aprende haciendo, no solo leyendo.</p>
              </div>
              <div className="p-4 rounded-lg border border-border-dark bg-dark-card">
                <h3 className="text-lg font-bold text-neon-yellow mb-2">Accesibilidad</h3>
                <p className="text-text-light text-sm">Sin requisitos previos, sin costo. Solo necesitas ganas de aprender.</p>
              </div>
            </div>
          </section>

          {/* Comunidad WhatsApp */}
          <section className="card-base p-6 border-2" style={{ borderColor: '#25D366' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#25D366' }}>💬 Únete a la Comunidad</h2>
            <p className="text-text-light leading-relaxed mb-4">
              Forma parte de nuestra comunidad en WhatsApp donde compartimos dudas, avances y nos apoyamos mutuamente durante los 30 días del programa.
            </p>
            <a
              href="https://chat.whatsapp.com/EBB9GtaKths1ND1CrgAobi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all duration-300"
              style={{
                borderColor: '#25D366',
                background: 'linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(18,140,126,0.08) 100%)',
                boxShadow: 'none',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(37,211,102,0.4)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="36" height="36" fill="#25D366">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.74 5.494 2.035 7.807L0 32l8.418-2.01A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.25a13.21 13.21 0 0 1-6.73-1.84l-.482-.286-4.997 1.194 1.222-4.862-.314-.5A13.22 13.22 0 0 1 2.75 16C2.75 8.682 8.682 2.75 16 2.75S29.25 8.682 29.25 16 23.318 29.25 16 29.25zm7.27-9.77c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.633-.199-.9.2-.266.398-1.031 1.295-1.264 1.562-.233.266-.465.299-.863.1-.398-.2-1.682-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.216-2.759-.233-.398-.025-.613.175-.811.18-.179.398-.465.597-.698.199-.233.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.199-.9-2.169-1.232-2.967-.325-.779-.655-.673-.9-.686l-.765-.013c-.266 0-.697.1-1.063.498-.365.398-1.396 1.364-1.396 3.326 0 1.963 1.43 3.86 1.63 4.126.199.266 2.814 4.296 6.82 6.026.954.412 1.698.657 2.279.842.957.305 1.83.262 2.519.159.768-.115 2.355-.963 2.688-1.893.332-.93.332-1.729.232-1.893-.1-.166-.366-.266-.764-.465z"/>
              </svg>
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#25D366' }}>Comunidad New Coders</h3>
                <p className="text-sm" style={{ color: '#a7f3d0' }}>Únete a nuestro grupo en WhatsApp ↗</p>
              </div>
            </a>
          </section>

          {/* X (Twitter) */}
          <section className="card-base p-6 border-2 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">𝕏 Síguenos en X</h2>
            <p className="text-text-light leading-relaxed mb-4">
              Mantente al día con las últimas novedades, tips y contenido de programación siguiéndonos en X.
            </p>
            <a
              href="https://x.com/NewCodersOrg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 border-white/20 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(150,150,150,0.05) 100%)',
                boxShadow: 'none',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div>
                <h3 className="text-lg font-bold text-white">@NewCodersOrg</h3>
                <p className="text-sm text-gray-400">Síguenos en X ↗</p>
              </div>
            </a>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-orange">✦ Hecho con pasión por el equipo New Coders ✦</p>
          <SocialLinks />
        </footer>
      </div>
    );
  }

  if (currentView === 'lesson' && selectedDay) {
    const lesson = LESSONS[selectedDay - 1];
    const currentDayNum = getCurrentDayNumber();
    const previousAvailable = selectedDay > 1 && getDayStatus(selectedDay - 1) !== 'locked';
    const nextAvailable = selectedDay < 30 && getDayStatus(selectedDay + 1) !== 'locked';

    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        {/* Header */}
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(0,212,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button
            onClick={() => setCurrentView('calendar')}
            className="text-neon-cyan hover:text-neon-green transition mb-4"
          >
            ← Volver al Calendario
          </button>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCurrentView('perfil')}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              title="Mi Perfil"
              aria-label="Mi Perfil"
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-4xl font-bold text-neon-green">
            Día {lesson.day}: {lesson.title}
          </h1>
          <p className="text-neon-yellow mt-2">{lesson.category}</p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Theory */}
          <section className="card-base p-6 border-2 border-neon-cyan">
            <h2 className="text-2xl font-bold text-neon-cyan mb-4">📚 Teoría</h2>
            <p className="text-text-light leading-relaxed">{lesson.theory}</p>
          </section>

          {/* Instructions */}
          <section className="card-base p-6 border-2 border-neon-orange">
            <h2 className="text-2xl font-bold text-neon-orange mb-4">📋 Instrucciones Manuales</h2>
            <p className="text-text-light leading-relaxed">{lesson.instructions}</p>
          </section>

          {/* Prompt */}
          <section className="card-base p-6 border-2 border-neon-purple">
            <h2 className="text-2xl font-bold text-neon-purple mb-4">🤖 Prompt</h2>
            <p className="text-text-light whitespace-pre-wrap">{lesson.prompt}</p>
          </section>

          {/* Code Example */}
          <section className="card-base p-6 border-2 border-neon-green">
            <h2 className="text-2xl font-bold text-neon-green mb-4">💻 Ejemplo</h2>
            <div className="relative bg-dark-bg p-4 rounded border border-neon-green overflow-x-auto">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(lesson.codeExample.code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute top-2 right-2 px-3 py-1 text-xs rounded bg-neon-green/20 text-neon-green border border-neon-green/50 hover:bg-neon-green/30 transition-colors"
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
              <pre className="text-sm">
                <code className="text-neon-green">{lesson.codeExample.code}</code>
              </pre>
            </div>
          </section>

          {/* Challenge */}
          <section className="card-base p-6 border-2 border-neon-yellow">
            <h2 className="text-2xl font-bold text-neon-yellow mb-4">🎯 Reto del Día</h2>
            <p className="text-text-light">{lesson.challenge}</p>
          </section>

          {/* Resources */}
          <section className="card-base p-6">
            <h2 className="text-2xl font-bold text-neon-cyan mb-4">🔗 Recursos</h2>
            <ul className="space-y-2">
              {lesson.resources.map((resource, idx) => (
                <li key={idx}>
                  {/* ✅ SEGURIDAD: rel="noopener noreferrer" previene Tabnabbing attacks */}
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-neon-green underline"
                  >
                    {resource.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Mark Complete Button */}
          <div className="flex gap-4">
            {!completedLessons.includes(lesson.day) && (
              <button
                onClick={() => handleMarkComplete(lesson.day)}
                className="flex-1 font-bold py-3 px-6 rounded transition text-white tracking-wider uppercase"
                style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #bf00ff 100%)', boxShadow: '0 0 20px rgba(0,212,255,0.4)', fontFamily: 'Orbitron, monospace', fontSize: '0.8rem' }}
              >
                ✅ Marcar como Completada
              </button>
            )}
            {completedLessons.includes(lesson.day) && (
              <div className="flex-1 font-bold py-3 px-6 rounded text-center text-white border-2 border-neon-green tracking-wider uppercase" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(191,0,255,0.1) 100%)', fontFamily: 'Orbitron, monospace', fontSize: '0.8rem' }}>
                ✓ Completada
              </div>
            )}
          </div>
        </main>

        {/* Navigation */}
        <footer className="border-t border-border-dark p-6 mt-12" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            {previousAvailable ? (
              <button
                onClick={() => setSelectedDay(selectedDay - 1)}
                className="text-neon-cyan hover:text-neon-green transition"
              >
                ← Día {selectedDay - 1}: {LESSONS[selectedDay - 2].title}
              </button>
            ) : (
              <div />
            )}
            
            <span className="text-neon-yellow">
              {selectedDay} / 30
            </span>

            {nextAvailable ? (
              <button
                onClick={() => setSelectedDay(selectedDay + 1)}
                className="text-neon-cyan hover:text-neon-green transition"
              >
                Día {selectedDay + 1}: {LESSONS[selectedDay].title} →
              </button>
            ) : (
              <div />
            )}
          </div>
          <SocialLinks />
        </footer>
      </div>
    );
  }

  // Profile View
  if (currentView === 'perfil') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        {/* Header */}
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(0,212,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button
            onClick={() => setCurrentView('calendar')}
            className="text-neon-cyan hover:text-neon-green transition mb-4"
          >
            ← Volver al Calendario
          </button>
          <h1 className="text-4xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>
            Mi Perfil
          </h1>
          <p className="text-neon-cyan mt-1 text-lg">Tu información personal</p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Avatar + Name Card */}
          <section className="rounded-lg bg-dark-card p-6 border-2 border-neon-cyan" style={{ boxShadow: '0 0 20px rgba(0,212,255,0.08)' }}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user?.name || 'Usuario'}
                  className="w-24 h-24 rounded-full border-2 border-neon-green"
                  referrerPolicy="no-referrer"
                  style={{ boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full border-2 border-neon-green flex items-center justify-center"
                  style={{ background: 'rgba(0,212,255,0.1)', boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-neon-green">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {user?.name || 'Usuario'}
                </h2>
                <p className="text-neon-cyan text-sm mt-1">Miembro de New Coders</p>
              </div>
            </div>
          </section>

          {/* Profile Form Fields */}
          <section className="rounded-lg bg-dark-card p-6 border-2 border-neon-green" style={{ boxShadow: '0 0 20px rgba(0,255,100,0.06)' }}>
            <h2 className="text-2xl font-bold text-neon-green mb-5" style={{ fontFamily: 'Orbitron, monospace' }}>Datos personales</h2>
            <div className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-neon-yellow text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full bg-dark-bg border border-border-dark rounded-lg px-4 py-3 text-text-light focus:border-neon-cyan focus:outline-none transition-colors"
                  style={{ boxShadow: 'inset 0 0 8px rgba(0,212,255,0.05)' }}
                  placeholder="Tu nombre"
                />
              </div>
              {/* Correo */}
              <div>
                <label className="block text-neon-yellow text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full bg-dark-bg border border-border-dark rounded-lg px-4 py-3 text-text-light focus:border-neon-cyan focus:outline-none transition-colors"
                  style={{ boxShadow: 'inset 0 0 8px rgba(0,212,255,0.05)' }}
                  placeholder="tu@correo.com"
                />
              </div>
            </div>
            <p className="text-xs text-border-dark mt-4">
              Los cambios se guardarán cuando el backend esté disponible.
            </p>
          </section>

          {/* Progress Summary */}
          <section className="rounded-lg bg-dark-card p-6 border-2 border-neon-yellow" style={{ boxShadow: '0 0 20px rgba(255,0,153,0.06)' }}>
            <h2 className="text-2xl font-bold text-neon-yellow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>Tu progreso</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-neon-green text-sm">{completedLessons.length}/30 Lecciones</span>
                  <span className="text-neon-green text-sm">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden border border-neon-green">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #00d4ff 0%, #bf00ff 100%)',
                      boxShadow: '0 0 12px rgba(0,212,255,0.5)',
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Logout */}
          <div className="text-center">
            <button
              onClick={() => { if (window.confirm('¿Deseas cerrar tu sesión?')) logout(); }}
              className="text-sm font-bold py-3 px-8 rounded-lg border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg transition-all duration-300"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Cerrar sesión
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-cyan">✦ Tu perfil en New Coders ✦</p>
          <SocialLinks />
        </footer>
      </div>
    );
  }

  // Calendar View
  return (
    <div className="min-h-screen bg-dark-bg text-text-light font-mono flex flex-col">
      {/* Fondo de estrellas */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {stars.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white star-twinkle"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>
      {/* Header */}
      <header className="border-b border-border-dark p-8 text-center relative" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.13) 0%, rgba(191,0,255,0.06) 50%, transparent 80%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
        {/* Profile button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setCurrentView('perfil')}
            className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
            style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
            title="Mi Perfil"
            aria-label="Mi Perfil"
          >
            {user?.picture ? (
              <img src={user.picture} alt={user?.name || 'Usuario'} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            )}
          </button>
        </div>
        <h1 className="text-5xl font-bold text-neon-green mb-2">
          ✦ Dev Path: 30 Días de Código ✦
        </h1>
        <p className="text-neon-cyan text-lg">Tu viaje hacia el dominio de la programación comienza aquí</p>
        
        {/* Progress Bar */}
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="flex justify-between mb-2">
            <span className="text-neon-yellow">{completedLessons.length}/30 Lecciones Completadas</span>
            <span className="text-neon-yellow">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-dark-card rounded-full h-4 overflow-hidden border border-neon-green">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #00d4ff 0%, #bf00ff 100%)', boxShadow: '0 0 12px rgba(0,212,255,0.5)' }}
            />
          </div>
        </div>
      </header>

      {/* Calendar Grid */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Countdown */}
          <div className="mb-4 rounded-lg border border-neon-cyan p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(191,0,255,0.06) 100%)' }}>
            {countdown.started ? (
              <p className="text-neon-green text-lg font-bold tracking-widest" style={{ fontFamily: 'Orbitron, monospace' }}>
                ✦ ¡EL CURSO HA COMENZADO! ✦
              </p>
            ) : (
              <>
                <p className="text-neon-cyan text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Inicio del programa — 1 Abril 2026
                </p>
                <div className="flex justify-center gap-6">
                  {[
                    { value: countdown.days,    label: 'DÍAS' },
                    { value: countdown.hours,   label: 'HORAS' },
                    { value: countdown.minutes, label: 'MIN' },
                    { value: countdown.seconds, label: 'SEG' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center">
                      <span className="text-3xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace', minWidth: '2.5rem' }}>
                        {String(value).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-neon-yellow mt-1 tracking-widest" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Casilla especial: New Coders Temporada 1 */}
            <button
              onClick={() => setCurrentView('intro')}
              className="col-span-2 md:col-span-5 relative p-6 rounded-lg border-2 border-neon-cyan transition-all duration-300 text-left hover:shadow-lg hover:shadow-neon-cyan/50"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(191,0,255,0.08) 100%)' }}
            >
<div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-neon-cyan uppercase tracking-widest mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Temporada 1
                  </p>
                  <h2 className="text-2xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>
                    ✦ New Coders ✦
                  </h2>
                  <p className="text-neon-yellow text-sm mt-1">First Commit — Introducción al curso</p>
                </div>
              </div>
            </button>

            {/* Casilla especial: Herramientas */}
            <button
              onClick={() => setCurrentView('herramientas')}
              className="col-span-2 md:col-span-5 relative p-6 rounded-lg border-2 border-neon-yellow transition-all duration-300 text-left hover:shadow-lg hover:shadow-neon-yellow/50"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,153,0.06) 0%, rgba(191,0,255,0.06) 100%)' }}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-neon-yellow uppercase tracking-widest mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Recursos
                  </p>
                  <h2 className="text-2xl font-bold text-neon-yellow" style={{ fontFamily: 'Orbitron, monospace' }}>
                    🛠️ Herramientas
                  </h2>
                  <p className="text-text-light text-sm mt-1">Todo lo que necesitas instalar para el curso</p>
                </div>
              </div>
            </button>

            {/* Casilla especial: Nosotros */}
            <button
              onClick={() => setCurrentView('nosotros')}
              className="col-span-2 md:col-span-5 relative p-6 rounded-lg border-2 border-neon-orange transition-all duration-300 text-left hover:shadow-lg hover:shadow-neon-orange/50"
              style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.08) 0%, rgba(191,0,255,0.08) 100%)' }}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-neon-orange uppercase tracking-widest mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Equipo
                  </p>
                  <h2 className="text-2xl font-bold text-neon-orange" style={{ fontFamily: 'Orbitron, monospace' }}>
                    👥 Nosotros
                  </h2>
                  <p className="text-text-light text-sm mt-1">Conoce al equipo detrás de New Coders</p>
                </div>
              </div>
            </button>

            {LESSONS.map((lesson) => {
              const status = getDayStatus(lesson.day);
              const isCurrentDay = lesson.day === getCurrentDayNumber();
              
              return (
                <button
                  key={lesson.day}
                  onClick={() => {
                    // ✅ SEGURIDAD: Validar antes de cambiar vista
                    if (status !== 'locked' && Number.isInteger(lesson.day) && lesson.day >= 1 && lesson.day <= 30) {
                      setSelectedDay(lesson.day);
                      setCurrentView('lesson');
                    }
                  }}
                  disabled={status === 'locked'}
                  className={`relative p-6 rounded-lg transition-all duration-300 ${
                    status === 'locked'
                      ? 'bg-dark-card opacity-50 cursor-not-allowed border border-border-dark'
                      : status === 'completed'
                      ? 'bg-dark-card border-2 border-neon-green hover:shadow-lg hover:shadow-neon-green/50'
                      : isCurrentDay
                      ? 'bg-dark-card border-2 border-neon-green animate-glow-pulse shadow-lg shadow-neon-green/50 hover:shadow-neon-green/70'
                      : 'bg-dark-card border-2 border-neon-cyan hover:border-neon-green hover:shadow-lg hover:shadow-neon-cyan/50'
                  }`}
                  aria-disabled={status === 'locked'}
                >
                  {/* Lock Icon for locked days */}
                  {status === 'locked' && (
                    <div className="text-3xl mb-2">🔒</div>
                  )}

                  {/* Check Icon for completed */}
                  {status === 'completed' && (
                    <div className="text-3xl mb-2">✓</div>
                  )}

                  {/* Day Number */}
                  <div className={`text-3xl font-bold mb-2 ${
                    status === 'locked'
                      ? 'text-border-dark'
                      : isCurrentDay
                      ? 'text-neon-green'
                      : 'text-neon-yellow'
                  }`}>
                    {lesson.day}
                  </div>

                  {/* Title */}
                  <div className={`text-xs font-semibold leading-tight ${
                    status === 'locked'
                      ? 'text-border-dark'
                      : 'text-text-light'
                  }`}>
                    {lesson.title}
                  </div>

                  {/* Category Badge */}
                  <div className={`text-xs mt-3 px-2 py-1 rounded inline-block ${
                    lesson.day <= 5
                      ? 'bg-dark-bg text-neon-yellow'
                      : lesson.day <= 10
                      ? 'bg-dark-bg text-neon-cyan'
                      : lesson.day <= 15
                      ? 'bg-dark-bg text-neon-green'
                      : lesson.day <= 20
                      ? 'bg-dark-bg text-neon-yellow'
                      : lesson.day <= 25
                      ? 'bg-dark-bg text-neon-cyan'
                      : 'bg-dark-bg text-neon-green'
                  }`}>
                    {lesson.category}
                  </div>

                  {/* Aprende con IA Button */}
                  {status !== 'locked' && (
                    <a
                      href={lesson.aiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 block text-center text-xs font-bold py-1 px-2 rounded border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg transition-all duration-200"
                      style={{ fontFamily: 'Orbitron, monospace' }}
                    >
                      Aprende con IA
                    </a>
                  )}

                  {/* Current Day Indicator */}
                  {isCurrentDay && (
                    <div className="absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #bf00ff, #ff0099)', boxShadow: '0 0 12px rgba(191,0,255,0.8)', fontFamily: 'Orbitron, monospace', fontSize: '0.5rem', letterSpacing: '0.05em' }}>
                      HOY
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-dark p-6 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-neon-cyan mb-2">✦ ¡Sigue el camino! Cada día es un paso hacia tu objetivo ✦</p>
          <p className="text-border-dark text-sm">Hoy es {today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <SocialLinks />
        </div>
      </footer>

      {/* Easter Egg */}
      {completedLessons.length === 30 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(191,0,255,0.25) 0%, rgba(0,212,255,0.15) 40%, rgba(0,0,0,0.85) 100%)' }}>
          <div className="text-center animate-pulse p-12 rounded-2xl border-2 border-neon-cyan" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(191,0,255,0.08) 100%)', boxShadow: '0 0 60px rgba(191,0,255,0.5), 0 0 120px rgba(0,212,255,0.3)' }}>
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-neon-green mb-3">¡FELICIDADES!</h2>
            <p className="text-xl text-neon-yellow mb-2">Completaste los 30 días</p>
            <p className="text-lg text-neon-cyan">¡Eres un programador!</p>
          </div>
        </div>
      )}
    </div>
  );
}
