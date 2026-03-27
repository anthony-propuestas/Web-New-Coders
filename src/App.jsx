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
    instructions: "1. Abre VS code en tu computadora.\n2. Crea una carpeta nueva llamada 'dia-01'.\n3. Dentro de Cursor, abre esa carpeta (File > Open Folder).\n4. Crea un archivo nuevo llamado 'index.html'.\n5. Escribe (o pega) la estructura HTML del ejemplo de abajo.\n6. Guarda el archivo con Ctrl+S (o Cmd+S en Mac).\n7. Abre el archivo en tu navegador: haz clic derecho sobre 'index.html' > 'Open with Live Preview' o arrástralo al navegador.",
    prompt: "crea un archivo HTML y escribe en texto simple (Hola mundo) solo eso.",
    codeExample: {
      language: "html",
      code: "<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Hola mundo</title>\n</head>\n<body>\n  Hola mundo\n</body>\n</html>"
    },
    challenge: "Abre tu archivo index.html en el navegador y verifica que se vea el texto 'Hola mundo' en la pantalla. Cuando lo logres, toma una captura de pantalla y compártela en el grupo de WhatsApp con el mensaje: '¡Día 1 completado! 🚀'",
    resources: [
      { label: "Aprende con IA", url: "https://notebooklm.google.com/notebook/42ec976d-bda6-4664-92c2-d0c287d816d2" }
    ],
    aiLink: 'https://notebooklm.google.com/notebook/42ec976d-bda6-4664-92c2-d0c287d816d2'
  },
  {
    day: 2,
    title: "Conociendo las herramientas",
    category: "Fundamentos",
    theory: "Todo programador necesita herramientas básicas: un editor de código (VS Code es el más popular y gratuito), un navegador web moderno (Chrome o Firefox) y una terminal o consola. El editor es donde escribes tu código, el navegador donde ves el resultado, y la terminal donde ejecutas comandos. Instalar VS Code es el primer paso real para comenzar.",
    instructions: "1. Abrí tu navegador y andá a code.visualstudio.com.\n2. Descargá VS Code para tu sistema operativo (Windows, Mac o Linux) y seguí el instalador hasta completarlo.\n3. Una vez instalado, abrí VS Code.\n4. Creá una carpeta nueva en tu computadora llamada 'mi-primer-proyecto' (sin espacios).\n5. En VS Code, andá a File > Open Folder y seleccioná la carpeta 'mi-primer-proyecto'.\n6. En el panel izquierdo, hacé clic derecho > New File y nombrá el archivo index.html.\n7. Escribí o pegá el código del ejemplo de abajo dentro de ese archivo.\n8. Guardá el archivo con Ctrl+S (o Cmd+S en Mac).\n9. Abrí index.html en el navegador: arrastrá el archivo al navegador o hacé clic derecho > Open with Live Preview y verificá que se vea el texto '¡Hola desde VS Code!' en la pantalla.",
    prompt: "crea un archivo HTML llamado index.html con un párrafo que muestre el texto '¡Hola desde VS Code!' usando la etiqueta <p>.",
    codeExample: {
      language: "html",
      code: "<!-- Esto es un comentario en HTML -->\n<!-- Tu primer archivo se llamará index.html -->\n<p>¡Hola desde VS Code!</p>"
    },
    challenge: "Descarga e instala VS Code desde code.visualstudio.com. Crea una carpeta llamada 'mi-primer-proyecto', ábrela en VS Code y crea un archivo llamado index.html.",
    resources: [
      { label: "Aprende con IA", url: "hhttps://notebooklm.google.com/notebook/34c78d43-3ba1-4066-8e1b-a827b720b54ettps://github.com/" }
    ],
    aiLink: 'https://notebooklm.google.com/notebook/34c78d43-3ba1-4066-8e1b-a827b720b54e'
  },
  {
    day: 3,
    title: "Tu primera página web",
    category: "HTML",
    theory: "HTML (HyperText Markup Language) es el lenguaje que estructura el contenido de las páginas web. No es un lenguaje de programación, sino de marcado: usas etiquetas para decirle al navegador qué tipo de contenido estás mostrando. Todo documento HTML tiene una estructura base con las etiquetas <!DOCTYPE html>, <html>, <head> y <body>. El contenido visible va dentro de <body>.",
    instructions: "1. Abrí VS code en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-03'.\n3. Dentro de Cursor, abrí esa carpeta (File > Open Folder).\n4. Creá un archivo nuevo llamado index.html.\n5. Copiá y pegá el código del ejemplo que aparece abajo en ese archivo.\n6. Cambiá el texto dentro de <h1> por tu nombre.\n7. Cambiá el texto dentro de <p> por una frase que te describa a vos.\n8. Guardá el archivo con Ctrl+S (o Cmd+S en Mac).\n9. Abrí la carpeta en el explorador de archivos y hacé doble clic sobre index.html.\n10. Verificá que el navegador muestre tu nombre en grande y tu frase debajo.",
    prompt: "Crea un archivo HTML llamado index.html con la estructura base completa (DOCTYPE, html, head con charset UTF-8 y un title, y body), que muestre mi nombre dentro de un <h1> y una frase sobre mí dentro de un <p>.",
    codeExample: {
      language: "html",
      code: "<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Mi primera página</title>\n</head>\n<body>\n  <h1>¡Hola, mundo!</h1>\n  <p>Esta es mi primera página web.</p>\n</body>\n</html>"
    },
    challenge: "Copia la estructura HTML del ejemplo en tu archivo index.html y ábrelo en el navegador haciendo doble clic sobre el archivo. Cambia el texto del <h1> y del <p> por tu nombre y una frase sobre ti.",
    resources: [
      { label: "Aprende con IA", url: "https://notebooklm.google.com/notebook/d7daa769-eacb-4931-bf52-29eb22a5e75c" }
    ],
    aiLink: 'https://notebooklm.google.com/notebook/d7daa769-eacb-4931-bf52-29eb22a5e75c'
  },
  {
    day: 4,
    title: "Encabezados y párrafos",
    category: "HTML",
    theory: "Los encabezados van de <h1> (el más importante) a <h6> (el menos importante). Sirven para organizar el contenido jerárquicamente, como los títulos y subtítulos de un libro. Los párrafos se crean con <p> y representan bloques de texto. Cada etiqueta tiene una apertura (<p>) y un cierre (</p>). También puedes usar <br> para saltos de línea y <hr> para líneas horizontales divisorias.",
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-04'.\n3. Dentro de Cursor, abrí esa carpeta (File > Open Folder).\n4. Creá un archivo nuevo llamado index.html y agregá la estructura base HTML (DOCTYPE, html, head, body).\n5. Dentro del <body>, escribí un <h1> con tu nombre completo.\n6. Debajo, agregá un <h2> con el texto 'Sobre mí'.\n7. Agregá un <p> con una breve presentación tuya (quién sos, dónde vivís, qué hacés).\n8. Agregá un segundo <h2> con el texto 'Mis hobbies'.\n9. Agregá un <p> mencionando tus pasatiempos favoritos, separados por comas.\n10. Guardá el archivo con Ctrl+S y abrilo en el navegador haciendo doble clic.\n11. Verificá que se vean los dos subtítulos diferenciados del título principal y que los párrafos aparezcan como bloques de texto separados.",
    prompt: "Crea un archivo HTML llamado index.html con la estructura base completa que contenga una página de blog personal: un <h1> con un nombre, un <h2> que diga 'Sobre mí' seguido de un párrafo de presentación, y otro <h2> que diga 'Mis hobbies' seguido de un párrafo con una lista de pasatiempos separados por comas.",
    codeExample: {
      language: "html",
      code: "<h1>Título principal</h1>\n<h2>Subtítulo</h2>\n<p>Este es un párrafo con texto.</p>\n<p>Este es otro párrafo separado.</p>\n<hr>\n<h3>Otra sección</h3>\n<p>Más contenido aquí.</p>"
    },
    challenge: "Crea una página tipo 'blog personal' con un <h1> con tu nombre, un <h2> que diga 'Sobre mí', un párrafo de presentación, otro <h2> que diga 'Mis hobbies' y un párrafo listando tus pasatiempos.",
    resources: [
      { label: "Aprende con IA", url: "hhttps://notebooklm.google.com/notebook/ab8a43ba-f4c6-45fa-8251-b285af96c143ttps://github.com/" }
    ],
    aiLink: 'https://notebooklm.google.com/notebook/ab8a43ba-f4c6-45fa-8251-b285af96c143'
  },
  {
    day: 5,
    title: "Enlaces e imágenes",
    category: "HTML",
    theory: "Los enlaces (<a>) conectan páginas entre sí y son la base de la web. Usan el atributo href para indicar hacia dónde llevan. Las imágenes (<img>) muestran archivos visuales usando el atributo src para la ruta de la imagen y alt para un texto alternativo que describe la imagen. La etiqueta <img> es especial porque no tiene cierre (es 'auto-cerrada'). Los enlaces pueden apuntar a otras páginas, archivos, o secciones dentro de la misma página.",
    instructions: "1. Abrí Cursor y abrí la carpeta 'dia-04' donde dejaste tu página personal, o creá una carpeta nueva 'dia-05' con un index.html que tenga la estructura base HTML.\n2. Elegí tu red social favorita (Instagram, X, YouTube, etc.) y copiá su URL completa (por ejemplo: https://www.instagram.com).\n3. Dentro del <body>, agregá una etiqueta <a> con href apuntando a esa URL y el atributo target=\"_blank\" para que abra en pestaña nueva.\n4. Escribí un texto descriptivo entre las etiquetas, por ejemplo: 'Seguime en Instagram'.\n5. Ahora buscá una imagen en internet que te guste, hacé clic derecho sobre ella y seleccioná 'Copiar dirección de imagen' para obtener su URL.\n6. Agregá una etiqueta <img> con src igual a esa URL, un atributo alt que describa la imagen, y un width de 300 para que no sea demasiado grande.\n7. Guardá el archivo con Ctrl+S y abrilo en el navegador.\n8. Verificá que el enlace se pueda cliquear y abra la red social en una pestaña nueva, y que la imagen se muestre correctamente en la página.",
    prompt: "Agrega a un archivo HTML existente (index.html) un enlace <a> con href hacia una red social, el atributo target='_blank' y un texto descriptivo, seguido de una etiqueta <img> con una URL de imagen de internet como src, un atributo alt descriptivo y un width de 300.",
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
    instructions: "1. Abrí Cursor y abrí tu carpeta de la página personal (la del día 4 o 5) o creá una carpeta nueva 'dia-06' con un index.html con la estructura base HTML.\n2. Dentro del <body>, agregá un <h3> con el texto '5 cosas que quiero programar'.\n3. Debajo del <h3>, abrí una etiqueta <ul> y dentro escribí 5 elementos <li>, cada uno con algo que te gustaría crear: una app, un juego, un sitio web, etc.\n4. Cerrá la etiqueta </ul>.\n5. Agregá otro <h3> con el texto 'Mi plan para lograrlo'.\n6. Debajo, abrí una etiqueta <ol> y escribí 3 elementos <li> con los pasos concretos que vas a seguir.\n7. Cerrá la etiqueta </ol>.\n8. Guardá el archivo con Ctrl+S y abrilo en el navegador.\n9. Verificá que la primera lista muestre viñetas (•) y la segunda muestre números (1, 2, 3) de forma automática.",
    prompt: "Agrega a un archivo HTML (index.html) una lista no ordenada <ul> con 5 elementos <li> sobre cosas que me gustaría programar, y una lista ordenada <ol> con 3 elementos <li> describiendo los pasos que seguiré para lograrlo. Incluí un <h3> descriptivo antes de cada lista.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-07' con un archivo index.html con la estructura base HTML.\n2. Dentro del <body>, agregá una etiqueta <form>.\n3. Adentro del <form>, creá un <label> con el texto 'Nombre:' y un <input type=\"text\"> con un placeholder como 'Tu nombre completo'.\n4. Agregá un segundo <label> con el texto 'Email:' y un <input type=\"email\"> con un placeholder como 'tu@email.com'.\n5. Agregá un <label> con el texto 'Asunto:' y luego una etiqueta <select> con 3 <option> adentro: por ejemplo 'Consulta general', 'Soporte técnico' y 'Otro'.\n6. Agregá un <label> con el texto 'Mensaje:' y un <textarea> con el atributo rows=\"4\".\n7. Por último, agregá un <button type=\"submit\"> con el texto 'Enviar mensaje'.\n8. Cerrá la etiqueta </form>.\n9. Guardá con Ctrl+S y abrí el archivo en el navegador.\n10. Verificá que se vean todos los campos, que el select muestre las 3 opciones al hacer clic, y que el botón de enviar esté visible al final del formulario.",
    prompt: "Crea un archivo HTML llamado index.html con la estructura base completa que contenga un formulario de contacto con: un <input type=\"text\"> para el nombre, un <input type=\"email\"> para el email, un <select> con 3 opciones para el asunto, un <textarea rows=\"4\"> para el mensaje, y un <button type=\"submit\">. Cada campo debe tener su <label> descriptivo asociado.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-08' con un archivo index.html con la estructura base HTML y algo de contenido (un <h1>, un <p> y lo que quieras).\n2. Dentro de esa misma carpeta, creá un archivo nuevo llamado styles.css.\n3. En el <head> del index.html, agregá esta línea para conectar el CSS: <link rel='stylesheet' href='styles.css'>.\n4. Abrí el archivo styles.css y escribí una regla para el selector body: cambiá el background-color a un color de tu elección (podés usar nombres como 'lightblue' o códigos hex como #f5f5f5).\n5. Agregá una regla para h1: cambiá el color del texto y el text-align a 'center'.\n6. Agregá una regla para p: cambiá el color del texto y el line-height a 1.6.\n7. Probá al menos 2 propiedades más en cualquier selector: font-family, font-size, margin, padding, letter-spacing, etc.\n8. Guardá ambos archivos con Ctrl+S y abrí el index.html en el navegador.\n9. Verificá que los estilos se apliquen correctamente y que la página se vea visualmente diferente al HTML sin CSS.",
    prompt: "Crea un archivo CSS llamado styles.css con reglas para los selectores body, h1 y p que incluyan al menos 5 propiedades diferentes entre todas: background-color, color, font-family, text-align, line-height, margin, padding, font-size u otras. También mostrá cómo conectarlo al HTML con la etiqueta <link> correcta en el <head>.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-09' con un index.html y un styles.css conectados entre sí (usá el <link> que aprendiste ayer).\n2. En el index.html, escribí algunos elementos de contenido: un <h1>, dos o tres <p>, y algún <div> o sección.\n3. En el styles.css, creá una clase llamada 'destacado': dale un background-color llamativo, padding de 10px y un border-left de 4px con un color sólido.\n4. Creá una segunda clase llamada 'seccion': dale un background-color suave, un padding generoso y un border-radius para esquinas redondeadas.\n5. Creá una tercera clase llamada 'borde-decorativo': dale un border de 2px sólido, un padding y si querés un box-shadow.\n6. En el HTML, asigná cada clase a distintos elementos usando el atributo class=\"nombre-de-clase\".\n7. Asigná también un id único a tu <h1> y dale estilos en el CSS usando el selector #tu-id.\n8. Guardá ambos archivos con Ctrl+S y abrí index.html en el navegador.\n9. Verificá que cada elemento se vea con los estilos de su clase correspondiente y que el h1 con ID tenga un estilo diferente al resto.",
    prompt: "Crea un archivo styles.css con 3 clases CSS distintas: 'destacado' (background-color llamativo, padding y border-left), 'seccion' (background-color suave, padding y border-radius) y 'borde-decorativo' (border sólido y padding). Incluí también un selector por ID para el título principal. Mostrá también el HTML de ejemplo con los atributos class e id aplicados en los elementos correspondientes.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-10' con un index.html y un styles.css conectados entre sí.\n2. En el styles.css, escribí primero el selector universal * { box-sizing: border-box; } para aplicar la buena práctica en todos los elementos.\n3. Creá una clase llamada 'tarjeta' con: un width de 300px, padding de 20px, border de 2px solid con un color suave, margin de 15px y border-radius de 8px.\n4. Agregá también un background-color blanco o claro a la clase 'tarjeta'.\n5. Creá una regla '.tarjeta:hover' que cambie el border-color a un color llamativo y agregue un box-shadow.\n6. En el index.html, creá 3 divs con class=\"tarjeta\", cada uno con un <h3> y un <p> adentro con contenido diferente (por ejemplo: tres proyectos, tres hobbies, o tres datos sobre vos).\n7. Guardá ambos archivos con Ctrl+S y abrí index.html en el navegador.\n8. Verificá que las 3 tarjetas se vean como bloques delimitados con espacio interno, y que al pasar el mouse encima cambien de estilo.",
    prompt: "Crea un archivo HTML con 3 divs con class='tarjeta', cada uno con un <h3> y un <p> de contenido distinto. En el CSS, aplicá box-sizing: border-box al selector universal, y definí la clase 'tarjeta' con width, padding, border, margin y border-radius. Agregá una regla ':hover' que cambie el border-color y añada un box-shadow.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-11' con un index.html y un styles.css conectados entre sí.\n2. En el index.html, creá un <nav> con class='navbar'. Dentro, poné un <div> con class='logo' y un texto como 'MiSitio', y un <div> con class='enlaces' que contenga 3 etiquetas <a> con links de ejemplo.\n3. Debajo del <nav>, creá un <div> con class='contenedor-tarjetas' y adentro poné 3 divs con class='tarjeta', cada uno con un <h3> y un <p>.\n4. En el styles.css, aplicá * { box-sizing: border-box; margin: 0; padding: 0; } para resetear estilos base.\n5. Estilizá la clase 'navbar' con display: flex, justify-content: space-between, align-items: center y un padding de 15px 30px. Agregale un background-color oscuro y color de texto claro.\n6. Estilizá la clase 'enlaces' con display: flex y un gap de 20px. Dale color y estilo a los <a> dentro del nav.\n7. Estilizá la clase 'contenedor-tarjetas' con display: flex, justify-content: center, align-items: flex-start, flex-wrap: wrap y un gap de 20px. Agregale padding.\n8. Estilizá la clase 'tarjeta' igual que el día 10: width, padding, border, border-radius y background-color.\n9. Guardá ambos archivos y abrí index.html en el navegador.\n10. Verificá que el navbar muestre el logo a la izquierda y los 3 enlaces a la derecha, y que las tarjetas aparezcan en fila centrada con espacio uniforme entre ellas.",
    prompt: "Crea un archivo HTML con un <nav class='navbar'> que contenga un logo a la izquierda y 3 enlaces a la derecha, seguido de un <div class='contenedor-tarjetas'> con 3 divs class='tarjeta' (cada uno con <h3> y <p>). En el CSS, usá Flexbox con justify-content: space-between en el navbar y justify-content: center con gap en el contenedor de tarjetas. Incluí flex-wrap: wrap en el contenedor para que se adapte a pantallas pequeñas.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-12' con un index.html y un styles.css conectados entre sí.\n2. En el index.html, creá un <div> con class='galeria'. Dentro, agregá 6 divs con class='item', cada uno con un número o texto corto adentro (por ejemplo: 'Item 1', 'Item 2', etc.).\n3. En el styles.css, aplicá * { box-sizing: border-box; margin: 0; padding: 0; } para resetear estilos base.\n4. Estilizá la clase 'galeria' con display: grid, grid-template-columns: repeat(3, 1fr) y un gap de 15px. Agregale padding de 20px.\n5. Estilizá la clase 'item' con un height de 150px, un background-color diferente para cada uno (podés usar colores distintos con el selector .item:nth-child(n)), border-radius de 8px y centrado del texto con Flexbox (display: flex, justify-content: center, align-items: center).\n6. Al final del CSS, agregá una media query: @media (max-width: 768px) { .galeria { grid-template-columns: 1fr; } } para que en pantallas pequeñas se muestre en una sola columna.\n7. Guardá ambos archivos con Ctrl+S y abrí index.html en el navegador.\n8. Verificá que los 6 items se muestren en 3 columnas. Luego reducí el ancho de la ventana del navegador por debajo de 768px y verificá que pasen a mostrarse en 1 sola columna.",
    prompt: "Crea un archivo HTML con un <div class='galeria'> que contenga 6 divs con class='item', cada uno con un texto corto. En el CSS, estilizá 'galeria' con display: grid y grid-template-columns: repeat(3, 1fr) con gap. Dale a cada 'item' un height fijo, colores de fondo distintos usando nth-child y border-radius. Incluí una media query @media (max-width: 768px) que cambie el grid a 1 sola columna.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-13'. Copiá el index.html y styles.css de tu página personal de días anteriores (o usá los del día 11).\n2. Verificá que el <head> del HTML tenga esta meta etiqueta: <meta name='viewport' content='width=device-width, initial-scale=1.0'>. Si no está, agregala.\n3. En el styles.css, reescribí los estilos base pensando en móvil primero: el .navbar debe tener flex-direction: column para que el logo y los enlaces se apilen verticalmente.\n4. Las .tarjetas deben estar en un contenedor con display: flex, flex-direction: column y width: 100% por defecto, para que se muestren una por una en móvil.\n5. Usá font-size en rem para los títulos: por ejemplo 1.4rem para el <h1> en móvil.\n6. Agregá una media query @media (min-width: 768px) para tablet: dentro, cambiá el .navbar a flex-direction: row y justify-content: space-between. Aumentá el font-size del h1 a 2rem.\n7. Agregá una segunda media query @media (min-width: 1024px) para desktop: dentro, hacé que el contenedor de tarjetas use flex-direction: row y flex-wrap: wrap para mostrar las tarjetas en fila.\n8. Guardá ambos archivos y abrí index.html en el navegador.\n9. Redimensioná la ventana desde el ancho más angosto hasta el más ancho y verificá que el layout cambie en cada breakpoint: navbar apilado en móvil, tarjetas en fila en desktop.",
    prompt: "Tomá un archivo HTML con navbar y tarjetas y hacelo completamente responsive usando la estrategia mobile first. En el CSS base (móvil), el navbar debe usar flex-direction: column y las tarjetas deben ocupar el 100% del ancho. Con @media (min-width: 768px) el navbar debe volver a fila con space-between. Con @media (min-width: 1024px) las tarjetas deben mostrarse en fila con flex-wrap: wrap. Usá rem para los font-size y asegurate de que el HTML tenga la meta etiqueta viewport.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-14' con dos archivos: index.html y styles.css. Conectalos con la etiqueta <link> en el <head> y asegurate de tener la meta etiqueta viewport.\n2. En el index.html, estructurá la página con etiquetas semánticas: <header> para el hero, <main> con una <section id='features'> adentro, y <footer> al final.\n3. En el <header class='hero'>, escribí un <h1> con el nombre de tu proyecto o algo creativo, un <p> con una frase que lo describa, y un <a class='btn'> que enlace a '#features'.\n4. En la sección de features, creá 3 divs con class='feature-card', cada uno con un emoji o ícono, un <h3> y un <p> descriptivo.\n5. Creá el <footer> con un <p> con el símbolo © y el año.\n6. En el styles.css, estilizá el hero con un background-color llamativo (o un gradiente con linear-gradient), color de texto blanco, padding generoso y centrado con Flexbox (flex-direction: column, align-items: center, justify-content: center, min-height: 100vh).\n7. Estilizá el botón .btn con padding, border-radius, background-color de contraste y sin subrayado (text-decoration: none).\n8. Estilizá la sección .features con display: grid, grid-template-columns: repeat(3, 1fr) y gap. Dale padding a la sección.\n9. Estilizá cada .feature-card con padding, border-radius, box-shadow suave y text-align: center.\n10. Agregá una media query @media (max-width: 768px) que cambie el grid de features a 1 columna.\n11. Guardá todo y abrí en el navegador. Verificá que el hero ocupe toda la pantalla, las 3 cards estén en fila en desktop y apiladas en móvil, y el footer esté visible al final.",
    prompt: "Crea una landing page completa con index.html y styles.css. El HTML debe usar etiquetas semánticas: un <header class='hero'> con <h1>, <p> y un <a class='btn'>, una <section id='features'> con 3 divs class='feature-card' (cada uno con emoji, <h3> y <p>), y un <footer>. En el CSS: el hero centrado con Flexbox, min-height: 100vh y fondo con gradiente o color sólido; las features en CSS Grid de 3 columnas con gap; las cards con box-shadow y border-radius; el botón estilizado sin subrayado; y una media query @media (max-width: 768px) que colapse el grid a 1 columna.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-15' con un index.html que tenga la estructura base HTML y algo de contenido visible (un <h1> y un <p>).\n2. Dentro de esa misma carpeta, creá un archivo nuevo llamado script.js.\n3. En el script.js, escribí un console.log() con tu nombre adentro, por ejemplo: console.log('Hola, soy Ana García').\n4. Debajo, escribí un alert() con un mensaje de bienvenida, por ejemplo: alert('¡Bienvenido a mi primera página con JavaScript!').\n5. En el index.html, justo antes de la etiqueta de cierre </body>, agregá esta línea para conectar el script: <script src=\"script.js\"></script>.\n6. Guardá ambos archivos con Ctrl+S y abrí index.html en el navegador.\n7. Verificá que aparezca el alert de bienvenida al cargar la página. Hacé clic en Aceptar para cerrarlo.\n8. Abrí las herramientas de desarrollador del navegador con F12, andá a la pestaña 'Console' y verificá que aparezca tu nombre impreso ahí.",
    prompt: "Crea un archivo JavaScript llamado script.js con un console.log que imprima mi nombre y un alert con un mensaje de bienvenida. Mostrá también cómo conectarlo correctamente al HTML con la etiqueta <script src='script.js'></script> ubicada justo antes del cierre de </body>.",
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
    instructions: "1. Abrí Cursor y creá una carpeta nueva llamada 'dia-16' con un archivo script.js (no necesitás HTML para este ejercicio, podés ejecutarlo directo desde la consola).\n2. Declará una const llamada 'nombre' con tu nombre entre comillas.\n3. Declará una let llamada 'edad' con tu edad como número (sin comillas).\n4. Declará una const llamada 'ciudad' con el nombre de tu ciudad.\n5. Declará una const llamada 'lenguajeFavorito' con el lenguaje que más te gusta hasta ahora.\n6. Declará una const llamada 'meGustaElCafe' con el valor true o false según corresponda.\n7. Usá console.log() con un template literal (comillas invertidas `) para imprimir un párrafo completo que use todas las variables, por ejemplo: `Hola, soy ${nombre}, tengo ${edad} años, vivo en ${ciudad}...`.\n8. Debajo, usá typeof para verificar el tipo de al menos 3 variables e imprimirlo en consola.\n9. Creá un index.html básico en la misma carpeta y conectá el script.js con <script src='script.js'></script> antes de </body>.\n10. Abrí index.html en el navegador, presioná F12 y verificá en la pestaña Console que aparezca el párrafo completo y los tipos de datos correctos.",
    prompt: "Crea un archivo script.js que declare 5 variables con información personal usando const y let: nombre (string), edad (number), ciudad (string), lenguajeFavorito (string) y meGustaElCafe (boolean). Luego imprimí con console.log un template literal que combine todas las variables en un párrafo completo. Agregá también console.log con typeof para verificar el tipo de al menos 3 de las variables.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-17'.\n3. Dentro de Cursor, abrí esa carpeta (File > Open Folder).\n4. Creá un archivo nuevo llamado index.js.\n5. Declará una variable llamada 'nota' y asignale un valor numérico (por ejemplo, 85).\n6. Escribí una cadena if / else if / else que evalúe 'nota' e imprima con console.log la letra correspondiente: 'A' si está entre 90 y 100, 'B' entre 80 y 89, 'C' entre 70 y 79, 'D' entre 60 y 69, o 'F' si es menor a 60.\n7. Guardá el archivo con Ctrl+S.\n8. Abrí la terminal integrada de Cursor (Ctrl+`) y ejecutá el archivo con: node index.js\n9. Verificá que en la consola aparezca la letra correcta según el valor que le diste a 'nota'.\n10. Cambiá el valor de la variable 'nota' por distintos números y volvé a ejecutar para confirmar que cada rango imprime la letra esperada.",
    prompt: "Crea un archivo JavaScript llamado index.js que declare una variable 'nota' con un valor numérico y use if/else if/else para imprimir en consola 'A' si la nota es 90-100, 'B' si es 80-89, 'C' si es 70-79, 'D' si es 60-69, o 'F' si es menor a 60.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-18'.\n3. Dentro de Cursor, abrí esa carpeta (File > Open Folder).\n4. Creá un archivo nuevo llamado index.js.\n5. Elegí un número del 1 al 10 y declaralo en una variable llamada 'numero'.\n6. Escribí un bucle for que itere del 1 al 10 e imprima con console.log cada línea de la tabla de multiplicar de ese número. Por ejemplo: '3 x 1 = 3'.\n7. Debajo, creá un array llamado 'amigos' con 5 nombres de personas.\n8. Escribí un bucle for...of que recorra el array e imprima con console.log '¡Hola, [nombre]!' para cada elemento.\n9. Guardá el archivo con Ctrl+S.\n10. Abrí la terminal integrada de Cursor (Ctrl+`) y ejecutá el archivo con: node index.js\n11. Verificá que en la consola aparezcan las 10 líneas de la tabla y los 5 saludos correctamente.",
    prompt: "Crea un archivo JavaScript llamado index.js que use un bucle for para imprimir la tabla de multiplicar de un número elegido (del 1 al 10) con el formato 'N x i = resultado', y luego use un bucle for...of sobre un array de 5 nombres para imprimir '¡Hola, [nombre]!' por cada uno.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-19'.\n3. Dentro de Cursor, abrí esa carpeta (File > Open Folder).\n4. Creá un archivo nuevo llamado index.js.\n5. Escribí una función llamada 'presentarse' que reciba dos parámetros (nombre y edad) y retorne un string como: 'Hola, me llamo [nombre] y tengo [edad] años.'.\n6. Escribí una función flecha llamada 'calcularArea' que reciba base y altura y retorne el resultado de base × altura.\n7. Escribí una función flecha llamada 'celsiusAFahrenheit' que reciba una temperatura en Celsius y retorne la conversión a Fahrenheit usando la fórmula: °F = °C × 9/5 + 32.\n8. Llamá cada función con valores de prueba e imprimí el resultado con console.log. Por ejemplo: console.log(presentarse('Ana', 25)).\n9. Guardá el archivo con Ctrl+S.\n10. Abrí la terminal integrada de Cursor (Ctrl+`) y ejecutá el archivo con: node index.js\n11. Verificá que en la consola aparezcan los tres resultados correctamente: la presentación, el área calculada y la temperatura convertida.",
    prompt: "Crea un archivo JavaScript llamado index.js con tres funciones: 'presentarse' que reciba nombre y edad y retorne un string de presentación, 'calcularArea' como función flecha que reciba base y altura y retorne base × altura, y 'celsiusAFahrenheit' como función flecha que convierta grados Celsius a Fahrenheit con la fórmula °F = °C × 9/5 + 32. Llamá cada función con valores de prueba e imprimí los resultados con console.log.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-20'.\n3. Dentro de Cursor, abrí esa carpeta (File > Open Folder).\n4. Creá un archivo nuevo llamado index.js.\n5. Declará una constante llamada 'estudiantes' que sea un array con 5 objetos. Cada objeto debe tener tres propiedades: nombre (string), edad (número) y nota (número del 0 al 100).\n6. Usá .filter() sobre el array para obtener solo los estudiantes con nota >= 70 y guardá el resultado en una variable llamada 'aprobados'. Imprimilo con console.log.\n7. Usá .map() sobre 'estudiantes' para crear un nuevo array que contenga únicamente los nombres. Guardalo en 'nombres' e imprimilo con console.log.\n8. Usá .find() sobre 'estudiantes' para buscar un estudiante por su nombre exacto y guardá el resultado en 'encontrado'. Imprimilo con console.log.\n9. Guardá el archivo con Ctrl+S.\n10. Abrí la terminal integrada de Cursor (Ctrl+`) y ejecutá el archivo con: node index.js\n11. Verificá que en la consola aparezcan: la lista de aprobados, el array de nombres y el objeto del estudiante encontrado.",
    prompt: "Crea un archivo JavaScript llamado index.js con un array llamado 'estudiantes' que contenga 5 objetos con las propiedades nombre, edad y nota. Luego usa .filter() para obtener los aprobados (nota >= 70), .map() para extraer solo los nombres en un nuevo array, y .find() para buscar un estudiante por nombre. Imprimí cada resultado con console.log.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-21'.\n3. Dentro de Cursor, abrí esa carpeta (File > Open Folder).\n4. Creá un archivo llamado index.html con la estructura base de HTML (doctype, html, head, body).\n5. Dentro del <body>, agregá únicamente este elemento: <div id='resultado'></div>. No agregues nada más — el resto lo hará JavaScript.\n6. Antes del cierre del </body>, vinculá un archivo JS con: <script src='script.js'></script>.\n7. Creá un archivo nuevo llamado script.js en la misma carpeta.\n8. En script.js, seleccioná el div usando document.getElementById('resultado') y guardalo en una variable.\n9. Creá un elemento <h2> con createElement, asignale un texto descriptivo con textContent y agregalo al div con appendChild.\n10. Creá un elemento <p>, asignale como texto la fecha actual usando new Date().toLocaleDateString() y agregalo al div.\n11. Creá una lista <ul> con createElement. Luego creá 3 elementos <li>, asignale texto a cada uno y agregálos a la lista con appendChild. Finalmente agregá la lista al div.\n12. Guardá ambos archivos con Ctrl+S.\n13. Abrí index.html en el navegador y verificá que aparezcan el título, la fecha de hoy y los 3 ítems de la lista — todo generado por JavaScript.",
    prompt: "Crea dos archivos: index.html con solo un <div id='resultado'> en el body y un <script src='script.js'></script>, y script.js que seleccione ese div y le agregue dinámicamente un <h2> con texto, un <p> con la fecha actual usando new Date().toLocaleDateString(), y una <ul> con 3 elementos <li> creados con createElement y appendChild. No modificar el HTML para agregar el contenido.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-22' y abrila en Cursor (File > Open Folder).\n3. Creá dos archivos: index.html y script.js dentro de esa carpeta.\n4. En index.html, escribí la estructura base: un <input type=\"text\">, un <button> que diga 'Mayúsculas', un segundo <button> que diga 'Limpiar', y un <div id=\"resultado\">.\n5. Vinculá script.js al final del <body> con una etiqueta <script src=\"script.js\">.\n6. En script.js, seleccioná con querySelector el input, los dos botones y el div de resultado.\n7. Agregá un addEventListener de tipo 'input' al input para que, al escribir, el texto aparezca en tiempo real dentro del div.\n8. Agregá un addEventListener de tipo 'click' al botón 'Mayúsculas' para que convierta el texto del div a mayúsculas con .toUpperCase().\n9. Agregá un addEventListener de tipo 'click' al botón 'Limpiar' para que vacíe tanto el input como el div.\n10. Guardá ambos archivos con Ctrl+S y abrí index.html en el navegador. Verificá que al escribir se vea el texto en vivo, que el botón 'Mayúsculas' lo convierta y que 'Limpiar' borre todo.",
    prompt: "Crea un archivo HTML llamado index.html con un input de texto, un botón 'Mayúsculas' y un botón 'Limpiar', y un div con id 'resultado'. Incluí un script.js vinculado que use addEventListener: el evento 'input' en el campo de texto muestra el texto en tiempo real en el div; el botón 'Mayúsculas' convierte ese texto a mayúsculas con toUpperCase(); el botón 'Limpiar' vacía tanto el input como el div.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-23' y abrila en Cursor (File > Open Folder).\n3. Creá dos archivos: index.html y script.js dentro de esa carpeta.\n4. En index.html, escribí la estructura base: un <input type=\"text\" id=\"inputTarea\">, un <button id=\"btnAgregar\"> que diga 'Agregar', una <ul id=\"lista\"> vacía, y un <button id=\"btnEliminar\"> que diga 'Eliminar completadas'.\n5. Vinculá script.js al final del <body> con una etiqueta <script src=\"script.js\">.\n6. En script.js, declará un array vacío llamado 'tareas' y seleccioná con querySelector todos los elementos del HTML.\n7. Creá una función 'agregarTarea' que lea el valor del input, construya un objeto con id (Date.now()), texto y completada:false, lo empuje al array y llame a renderTareas(). Asegurate de limpiar el input al final.\n8. Creá la función 'renderTareas' que limpie el innerHTML de la lista y recorra el array con forEach para crear un <li> por cada tarea. Cada li debe tener un click listener que alterne 'completada' y vuelva a llamar a renderTareas(). Si la tarea está completada, aplicale la clase 'done' con text-decoration:line-through en el CSS.\n9. Creá la función 'eliminarCompletadas' que filtre el array dejando solo las tareas con completada:false y llame a renderTareas().\n10. Asigná los eventos: click en btnAgregar llama a agregarTarea(), click en btnEliminar llama a eliminarCompletadas(). Bonus: usá localStorage.setItem y getItem con JSON.stringify/parse para persistir el array.\n11. Guardá los archivos con Ctrl+S y abrí index.html en el navegador. Verificá que podés agregar tareas, marcarlas como completadas (tachadas) y eliminarlas con el botón.",
    prompt: "Crea un archivo index.html con un input de texto, un botón 'Agregar', una lista <ul> y un botón 'Eliminar completadas'. Incluí un script.js vinculado que maneje un array de tareas con objetos {id, texto, completada}; al agregar se crea un <li> en la lista, al hacer clic en un <li> se alterna su estado completada y se muestra tachado con la clase 'done', y el botón de eliminar filtra el array para quitar las completadas y vuelve a renderizar la lista. Bonus: guardá y cargá el array con localStorage usando JSON.stringify y JSON.parse.",
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
    instructions: "1. Abrí el navegador y entrá a python.org/downloads. Descargá la última versión estable para tu sistema operativo e instalala (en Windows, marcá la opción 'Add Python to PATH' antes de instalar).\n2. Una vez instalado, abrí la terminal (cmd en Windows, Terminal en Mac/Linux) y escribí 'python --version' para verificar que se instaló correctamente. Deberías ver algo como 'Python 3.x.x'.\n3. Abrí Cursor en tu computadora.\n4. Creá una carpeta nueva llamada 'dia-24' y abrila en Cursor (File > Open Folder).\n5. Creá un archivo nuevo llamado hola.py dentro de esa carpeta.\n6. Declará variables con tu información personal: nombre (str), edad (int), altura (float) y una variable booleana como es_programador (bool).\n7. Usá print() con f-strings para imprimir cada variable, por ejemplo: print(f'Hola, soy {nombre} y tengo {edad} años').\n8. Agregá al final print(type(nombre)) y print(type(edad)) para ver los tipos de cada variable en la terminal.\n9. Guardá el archivo con Ctrl+S.\n10. En la terminal, navegá hasta la carpeta dia-24 con el comando 'cd ruta/a/dia-24' y ejecutá el script con 'python hola.py'. Verificá que se imprima toda tu información personal y los tipos de datos correctamente.",
    prompt: "Crea un archivo Python llamado hola.py que declare al menos cuatro variables con información personal: una de tipo str (nombre), una int (edad), una float (altura) y una bool (es_programador). Imprimí cada variable usando f-strings con print(), y al final imprimí el tipo de cada una con print(type(variable)). El archivo debe ejecutarse sin errores con 'python hola.py' desde la terminal.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-25' y abrila en Cursor (File > Open Folder).\n3. Creá un archivo llamado main.py dentro de esa carpeta.\n4. En la primera línea, usá input() para pedirle al usuario que ingrese un número y guardalo en una variable, por ejemplo: entrada = input('Ingresá un número: ').\n5. Convertí el valor ingresado a entero con int(): numero = int(entrada).\n6. Usá un condicional if/else para determinar si el número es par o impar. Un número es par si numero % 2 == 0. Imprimí el resultado con print().\n7. Debajo del condicional, usá un bucle for con range(1, 11) para recorrer los números del 1 al 10 e imprimí cada línea de la tabla de multiplicar con print(f'{numero} x {i} = {numero * i}').\n8. Guardá el archivo con Ctrl+S.\n9. Abrí una terminal en Cursor (Terminal > New Terminal) y ejecutá el programa con: python main.py\n10. Verificá que el programa te pide un número, te dice si es par o impar, y luego imprime la tabla de multiplicar completa del 1 al 10.",
    prompt: "Crea un archivo Python llamado main.py que: primero pida al usuario un número con input() y lo convierta a entero con int(); luego use un condicional if/else para imprimir si el número es par o impar usando el operador módulo %; finalmente use un bucle for con range(1, 11) para imprimir la tabla de multiplicar completa de ese número del 1 al 10 con f-strings.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-26' y abrila en Cursor (File > Open Folder).\n3. Creá un archivo llamado main.py dentro de esa carpeta.\n4. Declará una lista vacía llamada 'estudiantes' al inicio del archivo. Cada estudiante será un diccionario con las claves 'nombre', 'edad' y 'nota'.\n5. Escribí una función 'agregar_estudiante(nombre, edad, nota)' que cree un diccionario con esos valores y lo agregue a la lista con .append().\n6. Escribí una función 'buscar_por_nombre(nombre)' que recorra la lista con un for y retorne el diccionario del estudiante cuyo 'nombre' coincida. Si no existe, retorná None.\n7. Escribí una función 'calcular_promedio()' que use sum() y len() sobre una list comprehension que extraiga todas las notas, y retorne el promedio.\n8. Escribí una función 'filtrar_aprobados()' que use una list comprehension para retornar solo los estudiantes con nota >= 70.\n9. Al final del archivo, llamá a agregar_estudiante() al menos 4 veces con datos distintos. Luego imprimí: el resultado de buscar un estudiante por nombre, el promedio general y la lista de aprobados, todo con print() y f-strings.\n10. Guardá el archivo con Ctrl+S, abrí la terminal en Cursor y ejecutá python main.py. Verificá que se impriman correctamente el estudiante buscado, el promedio y los aprobados.",
    prompt: "Crea un archivo Python llamado main.py que declare una lista vacía 'estudiantes' y defina cuatro funciones: 'agregar_estudiante(nombre, edad, nota)' que agregue un diccionario a la lista con .append(); 'buscar_por_nombre(nombre)' que recorra la lista y retorne el diccionario del estudiante que coincida o None si no existe; 'calcular_promedio()' que use una list comprehension para extraer las notas y retorne el promedio con sum() y len(); y 'filtrar_aprobados()' que retorne con list comprehension solo los estudiantes con nota >= 70. Al final, agregá al menos 4 estudiantes de ejemplo, llamá a cada función e imprimí los resultados con print() y f-strings.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-27' y abrila en Cursor (File > Open Folder).\n3. Abrí la terminal en Cursor (Terminal > New Terminal) e instalá Flask ejecutando: pip install flask\n4. Creá un archivo llamado app.py dentro de la carpeta.\n5. Al inicio del archivo, importá Flask, jsonify y también datetime: from flask import Flask, jsonify y from datetime import datetime.\n6. Creá la instancia de la app con: app = Flask(__name__).\n7. Definí la primera ruta '/' con el decorador @app.route('/') y una función que retorne un string HTML de bienvenida, por ejemplo: return '<h1>¡Bienvenido a mi servidor!</h1>'.\n8. Definí la segunda ruta '/api/fecha' que retorne jsonify({'fecha': datetime.now().strftime('%Y-%m-%d'), 'hora': datetime.now().strftime('%H:%M:%S')}).\n9. Definí la tercera ruta '/api/saludo/<nombre>' que reciba el parámetro nombre en la función y retorne jsonify({'mensaje': f'¡Hola, {nombre}!'}).\n10. Al final del archivo agregá el bloque if __name__ == '__main__': app.run(debug=True).\n11. Guardá el archivo con Ctrl+S y ejecutá el servidor desde la terminal con: python app.py\n12. Abrí el navegador y probá las tres rutas: http://localhost:5000/, http://localhost:5000/api/fecha y http://localhost:5000/api/saludo/TuNombre. Verificá que cada una responde correctamente.",
    prompt: "Crea un archivo Python llamado app.py que use Flask para levantar un servidor con tres rutas: '/' que retorne un HTML de bienvenida; '/api/fecha' que use el módulo datetime para retornar con jsonify un diccionario con la fecha y hora actuales formateadas; y '/api/saludo/<nombre>' que reciba un parámetro de URL y retorne con jsonify un saludo personalizado. Incluí los imports necesarios (Flask, jsonify, datetime) y el bloque if __name__ == '__main__': app.run(debug=True) al final.",
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
    instructions: "1. Abrí Cursor en tu computadora.\n2. Creá una carpeta nueva llamada 'dia-28' con dos subcarpetas adentro: 'backend' y 'frontend'.\n3. Abrí la carpeta 'dia-28' en Cursor (File > Open Folder).\n4. Dentro de 'backend', creá un archivo app.py. Importá Flask, jsonify y flask_cors: from flask import Flask, jsonify y from flask_cors import CORS.\n5. Abrí la terminal en Cursor y ejecutá: pip install flask flask-cors. CORS es necesario para que el navegador permita que el frontend (otro origen) consulte tu servidor.\n6. En app.py, creá la instancia de Flask, aplicale CORS con CORS(app), y definí una lista de tareas hardcodeada: una lista de diccionarios con los campos 'id' y 'texto'.\n7. Creá la ruta '/api/tareas' con @app.route('/api/tareas') y una función que retorne jsonify(tareas).\n8. Agregá el bloque if __name__ == '__main__': app.run(debug=True) al final. Guardá y levantá el servidor con: python backend/app.py\n9. Dentro de 'frontend', creá un archivo index.html con estructura base: una etiqueta <h1>, una <ul id=\"lista\"> vacía, y una etiqueta <script src=\"script.js\"> al final del body.\n10. Creá script.js en la misma carpeta 'frontend'. Declará const API_URL = 'http://localhost:5000'. Escribí una función async 'cargarTareas' que use fetch() a la ruta /api/tareas, convierta la respuesta con .json() y por cada tarea cree un <li> y lo agregue a la lista del DOM. Rodeá todo con try/catch.\n11. Llamá a cargarTareas() al final del script.\n12. Abrí frontend/index.html en el navegador (con el servidor Flask corriendo en paralelo en la terminal). Verificá que las tareas del backend aparecen listadas en la página.",
    prompt: "Crea dos archivos: 'backend/app.py' con Flask que instale flask-cors, aplique CORS a la app, defina una lista hardcodeada de al menos 3 tareas como diccionarios con 'id' y 'texto', y exponga la ruta GET '/api/tareas' que retorne esa lista con jsonify; y 'frontend/index.html' con un <h1>, una <ul id='lista'> y un script.js vinculado que declare const API_URL = 'http://localhost:5000', defina una función async que use fetch() para obtener las tareas de la API, recorra el array con forEach para crear un <li> por tarea y agregarlo al DOM, maneje errores con try/catch, y se llame a sí misma al cargar la página.",
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
    instructions: "1. Si no tenés Git instalado, descargalo desde https://git-scm.com e instalalo. Para verificar que quedó bien, abrí una terminal y ejecutá: git --version\n2. Configurá tu identidad de Git (solo se hace una vez): ejecutá git config --global user.name \"Tu Nombre\" y git config --global user.email \"tu@email.com\"\n3. Si no tenés cuenta en GitHub, creá una en https://github.com. Es gratis.\n4. En GitHub, hacé clic en el botón '+' > 'New repository'. Ponele un nombre (ej: 'mi-landing-page' o 'todo-list'), dejalo en público y NO inicialices con README. Copiá la URL del repo que te muestra.\n5. Abrí la terminal en Cursor y navegá hasta la carpeta del proyecto que querés subir (el día 14 o el día 23): cd ruta/a/tu/proyecto\n6. Inicializá el repositorio local con: git init\n7. Hacé tu primer commit: ejecutá git add . y luego git commit -m \"primer commit: estructura base del proyecto\"\n8. Conectá tu repo local con GitHub: git remote add origin https://github.com/tu-usuario/tu-repo.git (usá la URL que copiaste en el paso 4).\n9. Subí el código a GitHub con: git push -u origin main (si te pide credenciales, ingresá tu usuario y un token personal de GitHub — lo generás en Settings > Developer settings > Personal access tokens).\n10. Hacé al menos 2 cambios más en tu proyecto (por ejemplo, mejorá el CSS o agregá una tarea de ejemplo). Después de cada cambio ejecutá git add . y git commit -m \"descripción del cambio\" para practicar el flujo.\n11. Subí los nuevos commits con: git push\n12. Abrí tu repositorio en https://github.com y verificá que los 3 commits aparecen en el historial y los archivos están visibles. Copiá la URL y compartila con la comunidad.",
    prompt: "Soy un estudiante de programación. Explicame paso a paso cómo inicializar un repositorio Git en una carpeta existente, hacer 3 commits con mensajes descriptivos y subir el código a un repositorio público de GitHub recién creado. Incluí los comandos exactos de terminal para cada paso, desde git init hasta git push, y mencioná cómo conectar el repo local con el remoto usando git remote add origin.",
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
    instructions: "1. Decidí qué proyecto vas a publicar. Si es solo HTML/CSS/JS (como la landing del día 14 o el To-Do del día 23), usá Netlify o GitHub Pages. Si tiene backend Flask (como el proyecto fullstack del día 28), usá Render.\n2. OPCIÓN A — Netlify (la más fácil para frontend): entrá a https://netlify.com, creá una cuenta gratis, y en el dashboard arrastrá directamente la carpeta de tu proyecto. En segundos te genera una URL pública tipo tu-proyecto.netlify.app.\n3. OPCIÓN B — GitHub Pages (frontend desde GitHub): en tu repositorio en GitHub, andá a Settings > Pages, seleccioná la rama 'main' como fuente y guardá. Tu sitio va a quedar publicado en tu-usuario.github.io/nombre-del-repo.\n4. OPCIÓN C — Render (para proyectos con Flask): entrá a https://render.com y creá una cuenta gratis. Hacé clic en 'New > Web Service' y conectá tu repositorio de GitHub. En 'Build Command' escribí pip install -r requirements.txt y en 'Start Command' escribí python app.py. Render hace el deploy automáticamente.\n5. Si usás Render con Flask, asegurate de tener un archivo requirements.txt en tu repo. Crealo ejecutando en la terminal: pip freeze > requirements.txt\n6. Además, Flask en producción no debe usar debug=True. Modificá la última línea de app.py a: app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000))). Importá os al inicio del archivo.\n7. Una vez publicado, esperá 1 a 3 minutos a que la plataforma termine el deploy. Luego abrí la URL pública que te asignaron y verificá que tu proyecto carga correctamente desde el navegador.\n8. Copiá la URL pública de tu proyecto y compartila con la comunidad de New Coders en el grupo de WhatsApp. ¡Eso es todo — tu código está en internet y cualquier persona en el mundo puede verlo!",
    prompt: "Tengo un proyecto web listo para publicar. Si es solo frontend (HTML, CSS, JavaScript), explicame cómo desplegarlo en Netlify arrastrando la carpeta, y también cómo hacerlo con GitHub Pages desde el repositorio. Si tiene backend con Flask, explicame cómo desplegarlo en Render conectando el repositorio de GitHub, qué debe tener el archivo requirements.txt, y cómo configurar el comando de inicio del servidor para producción. Dame los pasos exactos para cada opción.",
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

// Metadatos de logros/badges
const ACHIEVEMENT_META = {
  primer_dia:  { icon: '🚀', label: 'Primer Paso',           desc: 'Completaste tu primer día' },
  semana_html: { icon: '🌐', label: 'Maestro HTML',           desc: 'Completaste los 7 días de HTML' },
  semana_css:  { icon: '🎨', label: 'Maestro CSS',            desc: 'Completaste los 14 días (CSS)' },
  semana_js:   { icon: '⚡', label: 'Maestro JavaScript',     desc: 'Completaste los 21 días (JS)' },
  racha_7:     { icon: '🔥', label: 'Racha 7 días',           desc: '7 días consecutivos de práctica' },
  completado:  { icon: '🏆', label: 'Dev Path Completado',    desc: '¡Los 30 días completados!' },
};

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
  const [completedLessons, setCompletedLessons] = useState([]);
  const [profileName, setProfileName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [progressStats, setProgressStats] = useState({ current_streak: 0, longest_streak: 0 });
  const [achievements, setAchievements] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminPagination, setAdminPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [loadingAdminStats, setLoadingAdminStats] = useState(false);
  const [adminSection, setAdminSection] = useState('users');

  // Cargar progreso desde la API
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch('/api/progress', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCompletedLessons(data.completed || []);
          setProgressStats({ current_streak: data.current_streak, longest_streak: data.longest_streak });
        }
      } catch {
        // Fallback a localStorage si la API no está disponible
        try {
          const saved = localStorage.getItem('completedLessons');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setCompletedLessons(parsed.filter(day => Number.isInteger(day) && day >= 1 && day <= 30));
            }
          }
        } catch { /* ignorar */ }
      }
    }
    loadProgress();
  }, []);

  // Cargar logros del usuario
  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await fetch('/api/users/achievements', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setAchievements(data.achievements || []);
        }
      } catch { /* ignorar */ }
    }
    loadAchievements();
  }, []);

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro? Esta acción eliminará tu cuenta permanentemente. Esta operación no puede deshacerse.')) return;
    if (!window.confirm('Confirmar de nuevo: ¿Deseas eliminar definitivamente tu cuenta y todos tus datos?')) return;
    setDeletingAccount(true);
    try {
      const res = await fetch('/api/users/me', { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        logout();
      } else {
        alert('Error al eliminar la cuenta. Por favor intenta de nuevo.');
      }
    } catch {
      alert('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setDeletingAccount(false);
    }
  };

  const loadAdminUsers = async (page = 1) => {
    setLoadingAdmin(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=20`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users || []);
        setAdminPagination(data.pagination || { page: 1, total: 0, pages: 1 });
      }
    } catch { /* ignorar */ } finally {
      setLoadingAdmin(false);
    }
  };

  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId, is_active: !currentActive }),
      });
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentActive } : u));
    } catch { /* ignorar */ }
  };

  const loadAdminStats = async () => {
    setAdminSection('stats');
    setLoadingAdminStats(true);
    try {
      const res = await fetch('/api/admin/stats', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch { /* ignorar */ } finally {
      setLoadingAdminStats(false);
    }
  };

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

  const handleMarkComplete = async (dayNumber) => {
    if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
      console.warn('Intento de marcar día inválido:', dayNumber);
      return;
    }

    if (!completedLessons.includes(dayNumber)) {
      const newCompleted = [...completedLessons, dayNumber];
      setCompletedLessons(newCompleted);

      try {
        const res = await fetch(`/api/progress/${dayNumber}`, {
          method: 'POST',
          credentials: 'include',
        });
        if (res.ok) {
          const resData = await res.json();

          // Actualizar achievements si hay nuevos logros
          if (resData.new_achievements && resData.new_achievements.length > 0) {
            const achRes = await fetch('/api/users/achievements', { credentials: 'include' });
            if (achRes.ok) {
              const achData = await achRes.json();
              setAchievements(achData.achievements || []);
            }
          }

          // Recargar stats para actualizar rachas
          const statsRes = await fetch('/api/progress', { credentials: 'include' });
          if (statsRes.ok) {
            const data = await statsRes.json();
            setProgressStats({ current_streak: data.current_streak, longest_streak: data.longest_streak });
          }
        }
      } catch {
        // Fallback: guardar en localStorage
        try {
          localStorage.setItem('completedLessons', JSON.stringify(newCompleted));
        } catch { /* ignorar */ }
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) return;
    setSavingProfile(true);
    try {
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ display_name: profileName.trim() }),
      });
    } catch {
      // Ignorar errores silenciosamente
    } finally {
      setSavingProfile(false);
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

  // Admin View
  if (currentView === 'admin' && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        <header className="border-b border-border-dark p-6" style={{ background: 'linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button onClick={() => setCurrentView('calendar')} className="text-neon-cyan hover:text-neon-green transition mb-4">
            ← Volver al Calendario
          </button>
          <h1 className="text-4xl font-bold text-neon-yellow" style={{ fontFamily: 'Orbitron, monospace' }}>Panel Admin</h1>
          <p className="text-neon-cyan mt-1">Gestión de usuarios</p>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setAdminSection('users'); loadAdminUsers(1); }}
              className={`px-5 py-2 rounded-lg border-2 transition-all text-sm font-bold ${adminSection === 'users' ? 'bg-neon-cyan text-dark-bg border-neon-cyan' : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {loadingAdmin ? 'Cargando...' : 'Cargar usuarios'}
            </button>
            <button
              onClick={loadAdminStats}
              className={`px-5 py-2 rounded-lg border-2 transition-all text-sm font-bold ${adminSection === 'stats' ? 'bg-neon-green text-dark-bg border-neon-green' : 'border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {loadingAdminStats ? 'Cargando...' : 'Stats'}
            </button>
          </div>

          {/* Sección Usuarios */}
          {adminSection === 'users' && (
            <>
              {adminUsers.length > 0 && (
                <div className="rounded-lg border border-border-dark overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-dark" style={{ background: 'rgba(0,212,255,0.06)' }}>
                        <th className="text-left p-3 text-neon-cyan">Usuario</th>
                        <th className="text-left p-3 text-neon-cyan hidden md:table-cell">Email</th>
                        <th className="text-center p-3 text-neon-cyan">Días</th>
                        <th className="text-center p-3 text-neon-cyan">Logins</th>
                        <th className="text-center p-3 text-neon-cyan">Estado</th>
                        <th className="text-center p-3 text-neon-cyan">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="border-b border-border-dark hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <div className="text-text-light font-semibold">{u.name}</div>
                            <div className="text-border-dark text-xs">{u.role}</div>
                          </td>
                          <td className="p-3 text-text-light/60 hidden md:table-cell text-xs">{u.email}</td>
                          <td className="p-3 text-center">
                            <span className="text-neon-green font-bold">{u.lessons_completed}</span>
                            <span className="text-border-dark">/30</span>
                          </td>
                          <td className="p-3 text-center text-neon-cyan">{u.login_count}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.is_active ? 'bg-neon-green/20 text-neon-green' : 'bg-red-500/20 text-red-400'}`}>
                              {u.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleUserActive(u.id, u.is_active)}
                              className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                                u.is_active
                                  ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-dark-bg'
                                  : 'border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg'
                              }`}
                            >
                              {u.is_active ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {adminPagination.pages > 1 && (
                    <div className="flex justify-center gap-2 p-4">
                      {Array.from({ length: adminPagination.pages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => loadAdminUsers(p)}
                          className={`w-8 h-8 rounded text-xs font-bold border transition-all ${
                            p === adminPagination.page
                              ? 'border-neon-cyan bg-neon-cyan text-dark-bg'
                              : 'border-border-dark text-text-light hover:border-neon-cyan'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {adminUsers.length === 0 && !loadingAdmin && (
                <div className="text-center py-16 text-text-light/40">
                  <p className="text-lg mb-4">Presiona "Cargar usuarios" para ver la lista</p>
                </div>
              )}
            </>
          )}

          {/* Sección Stats */}
          {adminSection === 'stats' && (
            <>
              {loadingAdminStats && (
                <div className="text-center py-16 text-neon-green animate-pulse">Cargando stats...</div>
              )}
              {!loadingAdminStats && adminStats && (
                <div className="space-y-8">
                  {/* Tarjetas de resumen */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Usuarios activos', value: adminStats.total_users, color: 'neon-cyan' },
                      { label: 'Activos 7 días', value: adminStats.active_last_7_days, color: 'neon-green' },
                      { label: 'Activos 30 días', value: adminStats.active_last_30_days, color: 'neon-yellow' },
                      { label: 'Progreso promedio', value: `${adminStats.avg_progress_percent}%`, color: 'neon-pink' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`rounded-lg border border-${color}/40 p-5 text-center`} style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <div className={`text-3xl font-bold text-${color}`} style={{ fontFamily: 'Orbitron, monospace' }}>{value}</div>
                        <div className="text-text-light/60 text-xs mt-1">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Inscripciones por temporada */}
                  {Object.keys(adminStats.enrollments_by_season).length > 0 && (
                    <div className="rounded-lg border border-border-dark overflow-hidden">
                      <div className="p-4 border-b border-border-dark" style={{ background: 'rgba(0,212,255,0.06)' }}>
                        <h3 className="text-neon-cyan font-bold text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>Inscripciones por Temporada</h3>
                      </div>
                      <div className="flex flex-wrap gap-3 p-4">
                        {Object.entries(adminStats.enrollments_by_season).map(([season, count]) => (
                          <div key={season} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-yellow/30" style={{ background: 'rgba(255,213,0,0.05)' }}>
                            <span className="text-neon-yellow font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>{count}</span>
                            <span className="text-text-light/60 text-xs">Temporada {season}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasa de completado por lección */}
                  {adminStats.completion_rate_by_lesson.length > 0 && (
                    <div className="rounded-lg border border-border-dark overflow-hidden">
                      <div className="p-4 border-b border-border-dark" style={{ background: 'rgba(0,212,255,0.06)' }}>
                        <h3 className="text-neon-cyan font-bold text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>Completados por Lección</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        {adminStats.completion_rate_by_lesson.map(({ day, completions, rate }) => (
                          <div key={day} className="flex items-center gap-3">
                            <span className="text-text-light/50 text-xs w-14 shrink-0">Día {day}</span>
                            <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-3 rounded-full transition-all"
                                style={{ width: `${Math.min(rate, 100)}%`, background: rate >= 50 ? 'var(--neon-green, #00ff87)' : rate >= 25 ? 'var(--neon-yellow, #ffd500)' : '#f97316' }}
                              />
                            </div>
                            <span className="text-neon-green text-xs w-16 text-right shrink-0">{completions} ({rate}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!loadingAdminStats && !adminStats && (
                <div className="text-center py-16 text-text-light/40">
                  <p className="text-lg">Error al cargar las estadísticas</p>
                </div>
              )}
            </>
          )}
        </main>
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
                  onChange={(e) => setProfileName(e.target.value)}
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
                  readOnly
                  className="w-full bg-dark-bg border border-border-dark rounded-lg px-4 py-3 text-text-light/50 cursor-not-allowed"
                  style={{ boxShadow: 'inset 0 0 8px rgba(0,212,255,0.05)' }}
                />
                <p className="text-xs text-border-dark mt-1">El correo está vinculado a tu cuenta de Google.</p>
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="mt-5 px-6 py-2 rounded-lg border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg transition-all duration-300 text-sm font-bold disabled:opacity-50"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {savingProfile ? 'Guardando...' : 'Guardar cambios'}
            </button>
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
            {/* Rachas */}
            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="bg-dark-bg rounded-lg p-4 border border-border-dark text-center">
                <p className="text-neon-cyan text-2xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>{progressStats.current_streak}</p>
                <p className="text-text-light/60 text-xs mt-1">Racha actual</p>
              </div>
              <div className="bg-dark-bg rounded-lg p-4 border border-border-dark text-center">
                <p className="text-neon-purple text-2xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>{progressStats.longest_streak}</p>
                <p className="text-text-light/60 text-xs mt-1">Mejor racha</p>
              </div>
            </div>
          </section>

          {/* Logros / Badges */}
          {achievements.length > 0 && (
            <section className="rounded-lg bg-dark-card p-6 border-2 border-neon-purple" style={{ boxShadow: '0 0 20px rgba(191,0,255,0.06)' }}>
              <h2 className="text-2xl font-bold text-neon-purple mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>Logros</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {achievements.map((a) => {
                  const meta = ACHIEVEMENT_META[a.type] || { icon: '⭐', label: a.type, desc: '' };
                  return (
                    <div key={a.type} className="bg-dark-bg rounded-lg p-3 border border-neon-purple/40 text-center" title={meta.desc}>
                      <div className="text-3xl mb-1">{meta.icon}</div>
                      <div className="text-neon-yellow text-xs font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>{meta.label}</div>
                      <div className="text-border-dark text-xs mt-1">{new Date(a.earned_at).toLocaleDateString('es-ES')}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Certificado (solo si completó 30 días) */}
          {completedLessons.length >= 30 && (
            <section className="rounded-lg bg-dark-card p-6 border-2 border-neon-green text-center" style={{ boxShadow: '0 0 30px rgba(0,255,100,0.15)' }}>
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-2xl font-bold text-neon-green mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>¡Curso Completado!</h2>
              <p className="text-text-light/70 mb-4 text-sm">Has completado los 30 días del Dev Path. ¡Felicidades!</p>
              <button
                onClick={() => setShowCertificate(true)}
                className="px-6 py-3 rounded-lg border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg transition-all duration-300 font-bold"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                Ver Certificado
              </button>
            </section>
          )}

          {/* Admin Panel Link */}
          {user?.role === 'admin' && (
            <section className="rounded-lg bg-dark-card p-4 border border-neon-yellow/40 flex items-center justify-between">
              <div>
                <p className="text-neon-yellow text-sm font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>Panel de Administración</p>
                <p className="text-text-light/50 text-xs mt-1">Gestiona usuarios y estadísticas</p>
              </div>
              <button
                onClick={() => { loadAdminUsers(1); setCurrentView('admin'); }}
                className="px-4 py-2 rounded-lg border border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg transition-all text-xs font-bold"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                Abrir →
              </button>
            </section>
          )}

          {/* Exportar datos */}
          <section className="rounded-lg bg-dark-card p-4 border border-border-dark">
            <h3 className="text-text-light text-sm font-bold mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>Mis Datos (GDPR)</h3>
            <p className="text-text-light/50 text-xs mb-3">Descarga una copia de todos tus datos almacenados en New Coders.</p>
            <a
              href="/api/users/export"
              download
              className="inline-block px-4 py-2 rounded-lg border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg transition-all text-xs font-bold"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Descargar mis datos
            </a>
          </section>

          {/* Logout */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => { if (window.confirm('¿Deseas cerrar tu sesión?')) logout(); }}
              className="text-sm font-bold py-3 px-8 rounded-lg border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg transition-all duration-300"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Cerrar sesión
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="text-sm font-bold py-3 px-8 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-dark-bg transition-all duration-300 disabled:opacity-50"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {deletingAccount ? 'Eliminando...' : 'Eliminar cuenta'}
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-cyan">✦ Tu perfil en New Coders ✦</p>
          <SocialLinks />
        </footer>

        {/* Modal Certificado */}
        {showCertificate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,4,15,0.95)' }}
            onClick={() => setShowCertificate(false)}
          >
            <div
              className="max-w-2xl w-full rounded-2xl p-8 border-2 border-neon-cyan"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(191,0,255,0.06) 100%)',
                boxShadow: '0 0 60px rgba(0,212,255,0.3), 0 0 120px rgba(191,0,255,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <div className="text-neon-cyan text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  New Coders — Certificado de Completación
                </div>
                <h2 className="text-3xl font-bold text-neon-green mt-4 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {user?.name}
                </h2>
                <p className="text-text-light/70 text-base mb-1">ha completado satisfactoriamente el programa</p>
                <p className="text-neon-yellow text-xl font-bold mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Dev Path — 30 Días
                </p>
                <div className="border-t border-border-dark pt-4 mt-4">
                  <p className="text-text-light/50 text-xs">HTML · CSS · JavaScript · Python · Git</p>
                  <p className="text-border-dark text-xs mt-2">
                    Emitido el {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="px-5 py-2 rounded-lg border border-border-dark text-text-light/60 hover:border-neon-cyan hover:text-neon-cyan transition-all text-sm"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-lg border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg transition-all text-sm font-bold"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

          {/* Luma Event CTA */}
          <div className="mb-6 rounded-lg border border-neon-yellow p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,0,153,0.06) 0%, rgba(191,0,255,0.08) 100%)' }}>
            <p className="text-neon-yellow text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
              ✦ Evento de Lanzamiento ✦
            </p>
            <p className="text-text-light text-sm mb-4 leading-relaxed">
              ¿Listo para el reto? Únete a nuestra <span className="text-neon-cyan font-bold">sesión en vivo de lanzamiento</span> donde arrancaremos juntos los 30 días de código.
              Conoce a tu comunidad, resuelve dudas y empieza con energía.
            </p>
            <a
              href="https://luma.com/event/evt-HhlGLe6rFYuRLmS"
              className="luma-checkout--button inline-block font-bold uppercase tracking-wider text-sm px-8 py-3 rounded-lg transition-all duration-300 hover:opacity-90"
              data-luma-action="checkout"
              data-luma-event-id="evt-HhlGLe6rFYuRLmS"
              style={{
                fontFamily: 'Orbitron, monospace',
                background: 'linear-gradient(135deg, #00d4ff 0%, #bf00ff 100%)',
                color: '#04040f',
                boxShadow: '0 0 20px rgba(0,212,255,0.4)',
              }}
            >
              Inscribirse al Evento →
            </a>
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
