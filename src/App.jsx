import React, { useState, useEffect } from 'react';

const LESSONS = [
  {
    day: 1,
    title: "¿Qué es programar?",
    category: "Fundamentos",
    theory: "Programar es dar instrucciones precisas a una computadora para que realice tareas específicas. Es como escribir recetas: necesitas pasos claros en orden correcto. Los programas están en todas partes: apps en tu teléfono, sitios web, videojuegos, y hasta los sistemas que controlan coches autónomos.",
    codeExample: {
      language: "javascript",
      code: "console.log('¡Hola, mundo!');"
    },
    challenge: "Abre la consola de tu navegador (presiona F12, ve a 'Console') y escribe tu primer console.log con tu nombre. Por ejemplo: console.log('Mi nombre es Juan');",
    resources: [
      { label: "MDN: ¿Qué es JavaScript?", url: "https://developer.mozilla.org/es/docs/Learn/JavaScript/First_steps/What_is_JavaScript" }
    ]
  },
  {
    day: 2,
    title: "Variables: contenedores de datos",
    category: "Fundamentos",
    theory: "Las variables son contenedores donde almacenamos información. Piensa en ellas como cajas con etiquetas. Cada caja (variable) tiene un nombre único y puede guardar un valor. En JavaScript usamos 'let' o 'const' para crear variables. 'const' es para valores que no cambiarán, y 'let' para valores que sí cambiarán.",
    codeExample: {
      language: "javascript",
      code: "const nombre = 'Ana';\nlet edad = 25;\nlet altura = 1.65;\n\nconsole.log(nombre);\nconsole.log(edad);"
    },
    challenge: "Crea tres variables: tu nombre, tu edad y tu color favorito. Usa console.log para mostrar cada una en la consola.",
    resources: [
      { label: "MDN: Variables", url: "https://developer.mozilla.org/es/docs/Learn/JavaScript/First_steps/Variables" }
    ]
  },
  {
    day: 3,
    title: "Tipos de datos: números, textos y booleanos",
    category: "Fundamentos",
    theory: "JavaScript tiene diferentes tipos de datos: Números (5, 3.14), Textos o Strings ('Hola', 'Juan'), Booleanos (verdadero/falso). El tipo de dato determina qué operaciones puedes hacer. Los números se pueden sumar, los textos se pueden combinar, y los booleanos representan condiciones de verdadero o falso.",
    codeExample: {
      language: "javascript",
      code: "const numero = 42;\nconst texto = 'JavaScript';\nconst esVerdadero = true;\nconst esFalso = false;\n\nconsole.log(typeof numero);    // 'number'\nconsole.log(typeof texto);     // 'string'\nconsole.log(typeof esVerdadero); // 'boolean'"
    },
    challenge: "Crea variables con al menos un número, un texto y un booleano. Usa console.log con 'typeof' para verificar que son del tipo correcto.",
    resources: [
      { label: "MDN: Tipos de datos", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures" }
    ]
  },
  {
    day: 4,
    title: "Operadores: suma, resta y más",
    category: "Fundamentos",
    theory: "Los operadores permiten hacer cálculos y comparaciones. Tenemos operadores aritméticos (+, -, *, /), operadores de comparación (>, <, ===), y operadores lógicos (&&, ||). Por ejemplo, puedes sumar dos números, comparar si uno es mayor que otro, o combinar múltiples condiciones.",
    codeExample: {
      language: "javascript",
      code: "const a = 10;\nconst b = 3;\n\nconsole.log(a + b);    // 13\nconsole.log(a - b);    // 7\nconsole.log(a * b);    // 30\nconsole.log(a / b);    // 3.33...\nconsole.log(a > b);    // true\nconsole.log(a === b);  // false"
    },
    challenge: "Crea dos variables numéricas y usa al menos 4 operadores diferentes con ellas. Muestra los resultados en la consola.",
    resources: [
      { label: "MDN: Operadores", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Expressions_and_Operators" }
    ]
  },
  {
    day: 5,
    title: "Strings: trabajar con texto",
    category: "Fundamentos",
    theory: "Los strings (cadenas de texto) son secuencias de caracteres. Puedes combinarlos con el operador +, obtener su longitud con .length, o extraer partes usando métodos. Los strings son muy útiles para mostrar mensajes, nombres, direcciones y cualquier texto en tu aplicación.",
    codeExample: {
      language: "javascript",
      code: "const saludo = 'Hola';\nconst nombre = 'María';\n\nconst mensaje = saludo + ' ' + nombre;\nconsole.log(mensaje);        // 'Hola María'\nconsole.log(nombre.length);  // 5\nconsole.log(nombre.toUpperCase()); // 'MARÍA'\nconsole.log(nombre.toLowerCase()); // 'maría'"
    },
    challenge: "Crea al menos 2 strings y combínalos de diferentes maneras. Prueba métodos como .length, .toUpperCase(), .toLowerCase().",
    resources: [
      { label: "MDN: Strings", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String" }
    ]
  },
  {
    day: 6,
    title: "Condicionales: if y else",
    category: "Control de Flujo",
    theory: "Los condicionales (if/else) permiten que tu código tome decisiones. Si una condición es verdadera, ejecuta un bloque de código; si es falsa, ejecuta otro. Es como escrito cómo decir 'Si llueve, lleva paraguas, si no, lleva sombrilla'.",
    codeExample: {
      language: "javascript",
      code: "const edad = 18;\n\nif (edad >= 18) {\n  console.log('Eres mayor de edad');\n} else {\n  console.log('Eres menor de edad');\n}\n\n// También puedes usar else if\nif (edad < 13) {\n  console.log('Eres un niño');\n} else if (edad < 18) {\n  console.log('Eres un adolescente');\n} else {\n  console.log('Eres un adulto');\n}"
    },
    challenge: "Crea una variable con tu edad y usa if/else para mostrar un mensaje diferente si eres menor, igual o mayor a 18 años.",
    resources: [
      { label: "MDN: Condicionales", url: "https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/conditionals" }
    ]
  },
  {
    day: 7,
    title: "Operadores lógicos: AND, OR, NOT",
    category: "Control de Flujo",
    theory: "Los operadores lógicos (&& AND, || OR, ! NOT) permiten combinar múltiples condiciones. && significa 'Y' (ambas deben ser verdaderas), || significa 'O' (al menos una debe ser verdadera), y ! significa 'NO' (invierte el resultado).",
    codeExample: {
      language: "javascript",
      code: "const edad = 25;\nconst tieneCarnet = true;\n\n// AND: ambas condiciones deben ser verdaderas\nif (edad >= 18 && tieneCarnet) {\n  console.log('Puedes conducir');\n}\n\n// OR: al menos una debe ser verdadera\nif (edad < 13 || !tieneCarnet) {\n  console.log('No puedes conducir');\n}\n\n// NOT: invierte el resultado\nif (!tieneCarnet) {\n  console.log('No tienes carnet');\n}"
    },
    challenge: "Crea variables para simular si puedes entrar a un cine (edad >= 13 y tener dinero). Usa && y || para probar diferentes combinaciones.",
    resources: [
      { label: "MDN: Operadores Lógicos", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Expressions_and_Operators#operadores_lógicos" }
    ]
  },
  {
    day: 8,
    title: "Bucle for: repetir código",
    category: "Control de Flujo",
    theory: "A veces necesitas repetir un código varias veces. El bucle 'for' es perfecto para esto. Especificas cuántas veces repetir y qué código ejecutar en cada iteración. Por ejemplo, para imprimir números del 1 al 10 o para procesar elementos de una lista.",
    codeExample: {
      language: "javascript",
      code: "// Imprime números del 1 al 5\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\n// Imprime 'Hola' 3 veces\nfor (let i = 0; i < 3; i++) {\n  console.log('Hola ' + i);\n}\n\n// Puedes decrementar también\nfor (let i = 5; i >= 1; i--) {\n  console.log(i);\n}"
    },
    challenge: "Usa un bucle for para imprimir los números del 10 al 1 (hacia atrás). Luego crea otro que imprima solo los números pares entre 2 y 20.",
    resources: [
      { label: "MDN: Bucle for", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for" }
    ]
  },
  {
    day: 9,
    title: "Bucle while: repetir hasta una condición",
    category: "Control de Flujo",
    theory: "El bucle 'while' repite código mientras una condición sea verdadera. A diferencia de 'for', no necesitas saber de antemano cuántas veces se repetirá. Es útil cuando la repetición depende de una condición dinámica.",
    codeExample: {
      language: "javascript",
      code: "// Imprime mientras la variable sea menor a 5\nlet contador = 0;\nwhile (contador < 5) {\n  console.log(contador);\n  contador++; // Importante: incrementar, si no es bucle infinito\n}\n\n// Simular adivinanza\nlet numero = 7;\nlet adivinanza = 0;\nwhile (adivinanza !== numero) {\n  adivinanza = parseInt(prompt('Adivina el número (1-10):'));\n  if (adivinanza < numero) console.log('Más alto');\n  if (adivinanza > numero) console.log('Más bajo');\n}\nconsole.log('¡Adivinaste!');"
    },
    challenge: "Crea un bucle while que cuente desde 100 hasta 90. Luego crea otro que siga multiplicando 2 hasta que el resultado sea mayor a 1000.",
    resources: [
      { label: "MDN: Bucle while", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/while" }
    ]
  },
  {
    day: 10,
    title: "Switch: múltiples opciones",
    category: "Control de Flujo",
    theory: "El switch es como un if/else, pero cuando tienes muchas opciones. Es más limpio que escribir varios if/else encadenados. Evalúas una expresión y ejecutas diferentes códigos según su valor.",
    codeExample: {
      language: "javascript",
      code: "const dia = 3;\n\nswitch (dia) {\n  case 1:\n    console.log('Lunes');\n    break;\n  case 2:\n    console.log('Martes');\n    break;\n  case 3:\n    console.log('Miércoles');\n    break;\n  default:\n    console.log('Día inválido');\n}\n\n// Con strings\nconst color = 'rojo';\nswitch (color) {\n  case 'rojo':\n    console.log('Color cálido');\n    break;\n  case 'azul':\n    console.log('Color frío');\n    break;\n  default:\n    console.log('Color desconocido');\n}"
    },
    challenge: "Crea un switch que evalúe un número del 1 al 7 y muestre el día de la semana correspondiente.",
    resources: [
      { label: "MDN: Switch", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/switch" }
    ]
  },
  {
    day: 11,
    title: "Funciones: código reutilizable",
    category: "Funciones y Estructuras",
    theory: "Las funciones son bloques de código reutilizable. Las defines una vez y las llamas cuando las necesitas. Pueden recibir entradas (parámetros) y devolver resultados (return). Son fundamentales para organizar código.",
    codeExample: {
      language: "javascript",
      code: "// Función simple\nfunction saludar() {\n  console.log('¡Hola!');\n}\nsaludar(); // Llamar la función\n\n// Función con parámetros\nfunction sumar(a, b) {\n  return a + b;\n}\nconst resultado = sumar(5, 3);\nconsole.log(resultado); // 8\n\n// Función con parámetro y retorno\nfunction esPar(numero) {\n  return numero % 2 === 0;\n}\nconsole.log(esPar(4)); // true\nconsole.log(esPar(5)); // false"
    },
    challenge: "Crea una función que reciba dos números y devuelva su suma. Crea otra que reciba un nombre y devuelva un saludo personalizado.",
    resources: [
      { label: "MDN: Funciones", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions" }
    ]
  },
  {
    day: 12,
    title: "Arrays: listas de datos",
    category: "Funciones y Estructuras",
    theory: "Los arrays (o arreglos) son listas de elementos. Puedes guardar múltiples valores en una sola variable. Cada elemento tiene un índice (posición) empezando en 0. Los arrays son muy útiles para almacenar colecciones de datos.",
    codeExample: {
      language: "javascript",
      code: "// Crear un array\nconst numeros = [1, 2, 3, 4, 5];\nconst frutas = ['manzana', 'plátano', 'naranja'];\nconst mixto = [1, 'texto', true, 3.14];\n\n// Acceder a elementos (índice empieza en 0)\nconsole.log(frutas[0]);    // 'manzana'\nconsole.log(frutas[1]);    // 'plátano'\nconsole.log(frutas.length); // 3\n\n// Modificar elementos\nfrutas[0] = 'piña';\n\n// Agregar elementos\nfrutas.push('melón');\nconsole.log(frutas); // ['piña', 'plátano', 'naranja', 'melón']"
    },
    challenge: "Crea un array con 5 nombres. Accede al segundo elemento, agrega un nombre nuevo, y muestra la longitud del array.",
    resources: [
      { label: "MDN: Arrays", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array" }
    ]
  },
  {
    day: 13,
    title: "Métodos de Array: map, filter, forEach",
    category: "Funciones y Estructuras",
    theory: "Los arrays tienen métodos útiles para realmente trabajar con datos. forEach repite alguna cosa para cada elemento, map transforma cada elemento, y filter obtiene solo los elementos que cumplen una condición. Son herramientas poderosas.",
    codeExample: {
      language: "javascript",
      code: "const numeros = [1, 2, 3, 4, 5];\n\n// forEach: hacer algo con cada elemento\nnumeros.forEach(function(num) {\n  console.log(num * 2);\n});\n\n// map: transformar cada elemento\nconst dobrados = numeros.map(function(num) {\n  return num * 2;\n});\nconsole.log(dobrados); // [2, 4, 6, 8, 10]\n\n// filter: obtener solo elementos que cumplen condición\nconst pares = numeros.filter(function(num) {\n  return num % 2 === 0;\n});\nconsole.log(pares); // [2, 4]"
    },
    challenge: "Crea un array de números. Usa forEach para sumarlos todos. Usa map para obtener el cuadrado de cada número. Usa filter para obtener solo los mayores a 3.",
    resources: [
      { label: "MDN: Array methods", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array#métodos" }
    ]
  },
  {
    day: 14,
    title: "Objetos: datos estructurados",
    category: "Funciones y Estructuras",
    theory: "Los objetos agrupan datos relacionados con nombres. Mientras que un array es una lista (índice numérico), un objeto usa propiedades nombradas. Por ejemplo, puedes tener un objeto 'persona' con propiedades 'nombre', 'edad', 'ciudad'.",
    codeExample: {
      language: "javascript",
      code: "// Crear un objeto\nconst persona = {\n  nombre: 'Juan',\n  edad: 25,\n  ciudad: 'Madrid',\n  activo: true\n};\n\n// Acceder a propiedades\nconsole.log(persona.nombre);  // 'Juan'\nconsole.log(persona['edad']); // 25\n\n// Modificar propiedades\npersona.edad = 26;\n\n// Agregar nuevas propiedades\npersona.trabajo = 'Programador';\n\n// Eliminar propiedades\ndelete persona.activo;"
    },
    challenge: "Crea un objeto con información de un libro (título, autor, páginas, año). Modifica la edad, agrega una nueva propiedad, y muestra toda la información.",
    resources: [
      { label: "MDN: Objetos", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_Objects" }
    ]
  },
  {
    day: 15,
    title: "Métodos: funciones dentro de objetos",
    category: "Funciones y Estructuras",
    theory: "Los objetos pueden tener no solo propiedades, sino también métodos (funciones). Un método es una función que pertenece a un objeto. Por ejemplo, un objeto 'calculadora' podría tener métodos sumar, restar, multiplicar.",
    codeExample: {
      language: "javascript",
      code: "const calculadora = {\n  valor: 0,\n  sumar: function(n) {\n    this.valor += n;\n    return this.valor;\n  },\n  restar: function(n) {\n    this.valor -= n;\n    return this.valor;\n  },\n  obtenerValor: function() {\n    return this.valor;\n  }\n};\n\ncalculadora.sumar(5);\nconsole.log(calculadora.obtenerValor()); // 5\ncalculadora.sumar(3);\nconsole.log(calculadora.obtenerValor()); // 8\ncalculadora.restar(2);\nconsole.log(calculadora.obtenerValor()); // 6"
    },
    challenge: "Crea un objeto 'estudiante' con propiedades nombre, notas (array) y un método que calcule el promedio de notas.",
    resources: [
      { label: "MDN: Métodos de objeto", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_Objects#definir_métodos" }
    ]
  },
  {
    day: 16,
    title: "DOM: conectar JavaScript con HTML",
    category: "DOM y Web",
    theory: "El DOM (Document Object Model) es una representación de tu página HTML en JavaScript. Te permite seleccionar elementos HTML y modificarlos con JavaScript. Por ejemplo, cambiar el texto, el color, o la visibilidad sin recargar la página.",
    codeExample: {
      language: "javascript",
      code: "// Seleccionar elementos\nconst titulo = document.getElementById('miTitulo');\nconst parrafos = document.querySelectorAll('.texto');\nconst boton = document.querySelector('button');\n\n// Modificar contenido\ntitulo.textContent = 'Nuevo título';\ntitulo.innerHTML = '<strong>Título en negrita</strong>';\n\n// Modificar estilos\ntitulo.style.color = 'red';\ntitulo.style.fontSize = '24px';\n\n// Agregar/remover clases\ntitulo.classList.add('destacado');\ntitulo.classList.remove('viejo');\ntitulo.classList.toggle('activo');"
    },
    challenge: "En la consola, selecciona elementos de esta página usando getElementById, querySelector y querySelectorAll. Modifica su contenido y estilos.",
    resources: [
      { label: "MDN: DOM", url: "https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model" }
    ]
  },
  {
    day: 17,
    title: "Eventos: responder a clics y acciones",
    category: "DOM y Web",
    theory: "Los eventos son acciones que suceden en la página: hacer clic, escribir, mover el ratón, enviar un formulario. Puedes escuchar estos eventos y ejecutar código en respuesta. Esto es lo que hace las páginas interactivas.",
    codeExample: {
      language: "javascript",
      code: "// Escuchar un clic\nconst boton = document.getElementById('miBoton');\nboton.addEventListener('click', function() {\n  console.log('¡Botón clickeado!');\n});\n\n// Otros eventos comunes\nconst input = document.getElementById('miInput');\ninput.addEventListener('input', function(evento) {\n  console.log('Escribiste:', evento.target.value);\n});\n\ndocument.addEventListener('keydown', function(evento) {\n  console.log('Presionaste:', evento.key);\n});\n\nconst formulario = document.getElementById('miFormulario');\nformulario.addEventListener('submit', function(evento) {\n  evento.preventDefault(); // Prevenir recarga\n  console.log('Formulario enviado');\n});"
    },
    challenge: "Crea un botón en HTML y un event listener que cambie el color del fondo cuando hagas clic. Prueba con diferentes eventos (mouseover, mouseout, etc).",
    resources: [
      { label: "MDN: Eventos", url: "https://developer.mozilla.org/es/docs/Web/API/Event" }
    ]
  },
  {
    day: 18,
    title: "Crear y modificar elementos HTML",
    category: "DOM y Web",
    theory: "No solo puedes modificar elementos existentes, sino que puedes crear elementos completamente nuevos dinámicamente con JavaScript. Esto es poderoso: puedes agregar listas, tarjetas, imágenes, sin tener que escribirlos en HTML.",
    codeExample: {
      language: "javascript",
      code: "// Crear elementos\nconst nuevoDiv = document.createElement('div');\nnuevoDiv.textContent = 'Soy nuevo';\nnuevoDiv.className = 'contenedor';\nnuevoDiv.id = 'nuevoElemento';\n\n// Insertar en la página\ndocument.body.appendChild(nuevoDiv);\n\n// Crear lista dinámicamente\nconst lista = document.createElement('ul');\nconst items = ['Item 1', 'Item 2', 'Item 3'];\n\nitems.forEach(function(item) {\n  const li = document.createElement('li');\n  li.textContent = item;\n  lista.appendChild(li);\n});\n\ndocument.body.appendChild(lista);\n\n// Remover elementos\nconst elemento = document.getElementById('viejo');\nelemento.remove();"
    },
    challenge: "Crea una lista de 5 tareas dinámicamente usando JavaScript. Agrégalas a un elemento <ul> en la página.",
    resources: [
      { label: "MDN: Manipular DOM", url: "https://developer.mozilla.org/es/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents" }
    ]
  },
  {
    day: 19,
    title: "Formularios y validación",
    category: "DOM y Web",
    theory: "Los formularios permiten que los usuarios envíen datos. Puedes capturar esos datos con JavaScript y validarlos (verificar que no estén vacíos, que tengan el formato correcto, etc). Esto es importante para tener datos limpios y correctos.",
    codeExample: {
      language: "javascript",
      code: "const formulario = document.getElementById('form');\n\nformulario.addEventListener('submit', function(evento) {\n  evento.preventDefault();\n  \n  const nombre = document.getElementById('nombre').value;\n  const email = document.getElementById('email').value;\n  \n  // Validación\n  if (nombre === '') {\n    alert('Por favor ingresa tu nombre');\n    return;\n  }\n  \n  if (email === '') {\n    alert('Por favor ingresa tu email');\n    return;\n  }\n  \n  if (!email.includes('@')) {\n    alert('Email inválido');\n    return;\n  }\n  \n  console.log('Datos válidos:', {nombre, email});\n  // Aquí enviarías los datos al servidor\n});"
    },
    challenge: "Crea un formulario sencillo (nombre, email, edad) y valida que:  - No estén vacíos - Email contenga @  - Edad sea un número entre 1 y 120",
    resources: [
      { label: "MDN: Formularios", url: "https://developer.mozilla.org/es/docs/Learn/Forms" }
    ]
  },
  {
    day: 20,
    title: "Proyecto: Tu primer mini sitio interactivo",
    category: "DOM y Web",
    theory: "Es momento de aplicar todo lo aprendido. Harás un mini proyecto que combine HTML, CSS, JavaScript, eventos, manipulación del DOM y validación. Puede ser una calculadora, un marcador, un juego simple, una lista de tareas.",
    codeExample: {
      language: "javascript",
      code: "// Ejemplo: Contador simple\nconst botonSumar = document.getElementById('sumar');\nconst botonRestar = document.getElementById('restar');\nconst contador = document.getElementById('contador');\n\nlet valor = 0;\n\nbotonSumar.addEventListener('click', function() {\n  valor++;\n  contador.textContent = valor;\n});\n\nbotonRestar.addEventListener('click', function() {\n  valor--;\n  contador.textContent = valor;\n});"
    },
    challenge: "Elige un proyecto: Calculadora (+, -, *, /), Juego de Adivinanza (user adivina número random), o Lista de Tareas (agregar, marcar, eliminar).",
    resources: [
      { label: "Proyectos para empezar", url: "https://github.com/topics/beginner-projects" }
    ]
  },
  {
    day: 21,
    title: "Debugging: encontrar y arreglar errores",
    category: "Pensamiento Programador",
    theory: "El debugging es el proceso de encontrar y arreglar errores (bugs) en tu código. Los programadores pasan más tiempo debuggiendo que escribiendo código nuevo. Lo importante es ser metódico: lee el error, usa console.log para verificar valores, y prueba en pasos pequeños.",
    codeExample: {
      language: "javascript",
      code: "// Técnicas de debugging\n\n// 1. console.log para verificar valores\nconst numero = 10;\nconsole.log('El valor es:', numero);\n\n// 2. console.table para arrays/objetos\nconst personas = [\n  {nombre: 'Juan', edad: 25},\n  {nombre: 'María', edad: 30}\n];\nconsole.table(personas);\n\n// 3. console.error para errores deliberados\nconsole.error('Esto es un error');\n\n// 4. console.time para medir tiempo\nconsole.time('mi-timer');\nfor (let i = 0; i < 100; i++) {}\nconsole.timeEnd('mi-timer');\n\n// 5. Usar el debugger del navegador (F12 → Sources)\n// Puedes poner breakpoints y pausar la ejecución"
    },
    challenge: "Crea un código con un error propositalmente. Usa console.log y la consola del navegador (F12) para encontrarlo y corregirlo.",
    resources: [
      { label: "MDN: Debugging", url: "https://developer.mozilla.org/es/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools" }
    ]
  },
  {
    day: 22,
    title: "Leer y entender mensajes de error",
    category: "Pensamiento Programador",
    theory: "Los errores parecen aterradores al principio, pero son muy útiles. Dicen exactamente qué salió mal y dónde. Un 'Uncaught SyntaxError' significa error de sintaxis. Un 'TypeError' significa tipo de dato inválido. Aprender a leer errores es una habilidad esencial.",
    codeExample: {
      language: "javascript",
      code: "// SyntaxError: Falta punto y coma o paréntesis\nconst x = 5 // Error: falta ;\n\n// ReferenceError: Variable no definida\nconsole.log(variableQueNExiste);\n\n// TypeError: Intentar hacer algo inválido con un tipo\nconst numero = 5;\nnumero.toUpperCase(); // Error: números no tienen toUpperCase()\n\n// RangeError: Valor fuera de rango\nconst arr = new Array(-1); // Error: tamaño negativo\n\n// Buena práctica: usar try/catch\ntry {\n  // código que puede fallar\n  riskyFunction();\n} catch (error) {\n  console.log('Error capturado:', error.message);\n}"
    },
    challenge: "Crea (propositalmente) diferentes tipos de errores y aprende qué significa cada uno. Luego corrígelos.",
    resources: [
      { label: "MDN: Errores", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Errors" }
    ]
  },
  {
    day: 23,
    title: "Algoritmos: pensar antes de código",
    category: "Pensamiento Programador",
    theory: "Un algoritmo es un conjunto de pasos para resolver un problema. Antes de escribir código, piensa en los pasos que necesitas. Escribe pseudocódigo (código en lenguaje casi natural) primero. Esto evita errores y hace tu código más claro.",
    codeExample: {
      language: "javascript",
      code: "// Problema: Buscar el número mayor en un array\n// PSEUDOCÓDIGO:\n// 1. Suponer que el primer elemento es el mayor\n// 2. Recorrer el resto\n// 3. Si encuentras uno mayor, actualizar\n// 4. Retornar el mayor\n\n// CÓDIGO JAVASCRIPT:\nfunction encontrarMayor(numeros) {\n  let mayor = numeros[0];\n  \n  for (let i = 1; i < numeros.length; i++) {\n    if (numeros[i] > mayor) {\n      mayor = numeros[i];\n    }\n  }\n  \n  return mayor;\n}\n\nconsole.log(encontrarMayor([3, 7, 2, 9, 1])); // 9"
    },
    challenge: "Escribe pseudocódigo para: 'Invertir un string' (Ejemplo: 'Hola' → 'aloH'). Luego código JavaScript que lo haga.",
    resources: [
      { label: "Algoritmos básicos", url: "https://www.freecodecamp.org/news/algorithms-explained/" }
    ]
  },
  {
    day: 24,
    title: "Buenas prácticas de código",
    category: "Pensamiento Programador",
    theory: "Código limpio es código que otros (y tú en el futuro) pueden entender fácilmente. Usa nombres descriptivos, comenta complicheidád, sigue convenciones, y evita repetición. Es como escribir un libro: necesita ser legible y bien organizado.",
    codeExample: {
      language: "javascript",
      code: "// ❌ MAL: nombres poco claros\nconst x = [1, 2, 3, 4, 5];\nconst f = (arr) => {\n  let s = 0;\n  for (let i = 0; i < arr.length; i++) {\n    s += arr[i];\n  }\n  return s;\n};\n\n// ✅ BIEN: nombres descriptivos\nconst numeros = [1, 2, 3, 4, 5];\nconst sumarNumeros = (array) => {\n  let suma = 0;\n  for (let numero of array) {\n    suma += numero;\n  }\n  return suma;\n};\n\n// ✅ Incluso mejor: usar método existente\nconst sumaTotal = numeros.reduce((acc, num) => acc + num, 0);\n\n// Comentarios útiles:\nconst MAX_INTENTOS = 3; // Usuario tiene 3 intentos\nif (intentos >= MAX_INTENTOS) {\n  blockearUsuario();\n}"
    },
    challenge: "Toma un código que escribiste anteriormente que sea \"feo\" y refactorízalo: mejora nombres, agrega comentarios, simplifica lógica.",
    resources: [
      { label: "Clean Code", url: "https://www.freecodecamp.org/news/how-to-write-clean-code/" }
    ]
  },
  {
    day: 25,
    title: "Scope y variables locales/globales",
    category: "Pensamiento Programador",
    theory: "El scope define dónde una variable es accesible. Variables globales funcionan en todo el código. Variables locales solo funcionan dentro de su función/bloque. Es buena práctica usar variables locales para evitar conflictos.",
    codeExample: {
      language: "javascript",
      code: "// Global: accesible desde cualquier lugar\nconst global = 'soy global';\n\nfunction miFuncion() {\n  // Local: solo existe dentro de miFuncion\n  const local = 'soy local';\n  console.log(global); // Works ✓\n  console.log(local);  // Works ✓\n}\n\nconsole.log(global); // Works ✓\nconsole.log(local);  // Error: local is not defined\n\n// Bloque local (if, for, etc)\nif (true) {\n  const bloqueLocal = 'solo en este bloque';\n  console.log(bloqueLocal); // Works ✓\n}\nconsole.log(bloqueLocal); // Error\n\n// Evitar variables globales innecesarias\n// ❌ MAL\nvar contador = 0; // global\nfunction incrementar() {\n  contador++; // modifica global\n}\n\n// ✅ BIEN\nconst calcular = () => {\n  let contador = 0; // local\n  return contador++;\n};"
    },
    challenge: "Crea una función con variables locales y una global. Modifica la global dentro de la función. Observa qué sucede en cada scope.",
    resources: [
      { label: "MDN: Scope", url: "https://developer.mozilla.org/es/docs/Glossary/Scope" }
    ]
  },
  {
    day: 26,
    title: "Introducción a Git: control de versiones",
    category: "Nivel Avanzado",
    theory: "Git es una herramienta que guarda el historial de cambios en tu código. Puedes volver a versiones anteriores, trabajar en equipo, y colaborar sin conflictos. Es como un 'deshacer' ilimitado y profesional.",
    codeExample: {
      language: "bash",
      code: "# Inicializar Git en tu proyecto\ngit init\n\n# Ver cambios\ngit status\n\n# Guardar (preparar) cambios\ngit add archivo.js\ngit add .  # Todos los cambios\n\n# Guardar con mensaje\ngit commit -m 'Agregar función de login'\n\n# Ver historial\ngit log\n\n# Ver cambios en un archivo\ngit diff archivo.js\n\n# Deshacer cambios (antes de commit)\ngit checkout archivo.js\n\n# Crear rama para nueva feature\ngit branch nueva-feature\ngit checkout nueva-feature\n\n# Unir cambios de rama\ngit checkout main\ngit merge nueva-feature"
    },
    challenge: "Inicializa un repositorio Git en tu proyecto. Haz at least 3 commits con diferentes cambios. Usa git log para ver el historial.",
    resources: [
      { label: "Git Documentation", url: "https://git-scm.com/book/es/v2" }
    ]
  },
  {
    day: 27,
    title: "Terminal: línea de comandos",
    category: "Nivel Avanzado",
    theory: "La terminal es una interfaz de texto para controlar tu computadora. Los programadores la usan constantemente para navegar directorios, ejecutar programas, instalar dependencias. No es difícil: son solo comandos de texto.",
    codeExample: {
      language: "bash",
      code: "# Navegación\npwd                 # Ver dónde estás\nls                  # Ver archivos (Linux/Mac)\ndir                 # Ver archivos (Windows)\ncd Desktop          # Entrar a carpeta\ncd ..               # Subir una carpeta\ncd ~                # Ir a home\n\n# Crear/eliminar\nmkdir mi-proyecto   # Crear carpeta\ntouch archivo.txt   # Crear archivo\nrm archivo.txt      # Eliminar archivo\nrm -r carpeta       # Eliminar carpeta\n\n# Leer/editar\ncat archivo.txt     # Ver contenido\necho 'Hola' > archivo.txt  # Escribir\n\n# Ejecutar programas\nnode mi-script.js   # Ejecutar JavaScript\npython mi-script.py # Ejecutar Python\nnpm install         # Instalar dependencias\n\n# Información útil\nman comando         # Manual del comando\ncommando --help     # Ayuda del comando"
    },
    challenge: "Abre la terminal en tu proyecto. Usa cd, ls/dir, mkdir para navegar y crear carpetas. Prueba git status y npm install.",
    resources: [
      { label: "Terminal for beginners", url: "https://www.freecodecamp.org/news/command-line-for-beginners/" }
    ]
  },
  {
    day: 28,
    title: "APIs y Fetch: obtener datos de internet",
    category: "Nivel Avanzado",
    theory: "Las APIs son como 'menús' de otros servidores. Haces una solicitud (request) y el servidor responde con datos. Con 'fetch' en JavaScript, puedes obtener datos de un servidor y usarlos en tu página. Esto abre posibilidades infinitas.",
    codeExample: {
      language: "javascript",
      code: "// Obtener datos de una API\nfetch('https://api.github.com/users/octocat')\n  .then(respuesta => respuesta.json())\n  .then(datos => {\n    console.log('Usuario:', datos.name);\n    console.log('Seguidores:', datos.followers);\n  })\n  .catch(error => {\n    console.log('Error:', error);\n  });\n\n// Versión moderna con async/await\nasync function obtenerUsuario() {\n  try {\n    const respuesta = await fetch('https://api.github.com/users/octocat');\n    const datos = await respuesta.json();\n    console.log('Usuario:', datos.name);\n  } catch (error) {\n    console.log('Error:', error);\n  }\n}\n\nobtenerUsuario();\n\n// Enviar datos\nfetch('https://tu-servidor.com/api/usuarios', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    nombre: 'Juan',\n    email: 'juan@email.com'\n  })\n})\n.then(resp => resp.json())\n.then(datos => console.log('Creado:', datos));"
    },
    challenge: "Usa fetch para obtener datos de una API pública (ej: api.github.com, jsonplaceholder.typicode.com). Muestra los datos en la consola y luego en tu página HTML.",
    resources: [
      { label: "MDN: Fetch API", url: "https://developer.mozilla.org/es/docs/Web/API/Fetch_API" }
    ]
  },
  {
    day: 29,
    title: "JSON: formato de datos",
    category: "Nivel Avanzado",
    theory: "JSON (JavaScript Object Notation) es un formato para guardar y transferir datos. Parece casi como un objeto JavaScript, pero es texto. Es el estándar de internet. Necesitas entender JSON para trabajar con APIs y bases de datos.",
    codeExample: {
      language: "javascript",
      code: "// JSON es texto que parece un objeto\nconst jsonText = '{\"nombre\": \"Juan\", \"edad\": 25, \"activo\": true}';\n\n// Convertir JSON a objeto JavaScript\nconst objeto = JSON.parse(jsonText);\nconsole.log(objeto.nombre); // 'Juan'\n\n// Convertir objeto JavaScript a JSON\nconst miObjeto = {\n  nombre: 'María',\n  edad: 30,\n  skills: ['JavaScript', 'React', 'CSS']\n};\n\nconst json = JSON.stringify(miObjeto);\nconsole.log(json); // '{\"nombre\":\"María\",\"edad\":30,...}'\n\n// JSON con arrays\nconst usuariosJSON = `[\n  {\"id\": 1, \"nombre\": \"Juan\"},\n  {\"id\": 2, \"nombre\": \"María\"},\n  {\"id\": 3, \"nombre\": \"Pedro\"}\n]`;\n\nconst usuarios = JSON.parse(usuariosJSON);\nconsole.log(usuarios[0].nombre); // 'Juan'"
    },
    challenge: "Crea un objeto JavaScript, Conviértelo a JSON con JSON.stringify, luego vuelve a convertirlo a objeto con JSON.parse. Verifica que sean iguales.",
    resources: [
      { label: "MDN: JSON", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON" }
    ]
  },
  {
    day: 30,
    title: "Proyecto Final: aplicación integrada",
    category: "Nivel Avanzado",
    theory: "Has aprendido mucho. Ahora es momento de un proyecto final que integre todo: HTML, CSS, JavaScript, eventos, DOM, arrays/objetos, funciones, APIs (opcional), localStorage, y buenas prácticas. Elige un proyecto ambicioso pero realista.",
    codeExample: {
      language: "javascript",
      code: "// Ejemplo de proyecto: Gestor de tareas con API\n\nclass TaskManager {\n  constructor() {\n    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];\n    this.render();\n  }\n  \n  addTask(text) {\n    const task = {\n      id: Date.now(),\n      text,\n      done: false,\n      createdAt: new Date()\n    };\n    this.tasks.push(task);\n    this.save();\n    this.render();\n  }\n  \n  deleteTask(id) {\n    this.tasks = this.tasks.filter(t => t.id !== id);\n    this.save();\n    this.render();\n  }\n  \n  toggleTask(id) {\n    const task = this.tasks.find(t => t.id === id);\n    if (task) task.done = !task.done;\n    this.save();\n    this.render();\n  }\n  \n  save() {\n    localStorage.setItem('tasks', JSON.stringify(this.tasks));\n  }\n  \n  render() {\n    // Generar HTML y actualizar DOM\n    const list = document.getElementById('taskList');\n    list.innerHTML = this.tasks.map(task => `\n      <li class=\"${task.done ? 'done' : ''}\">\n        <span>${task.text}</span>\n        <button onclick=\"taskManager.toggleTask(${task.id})\">✓</button>\n        <button onclick=\"taskManager.deleteTask(${task.id})\">✕</button>\n      </li>\n    `).join('');\n  }\n}\n\nconst taskManager = new TaskManager();"
    },
    challenge: "¡Felicidades! Crea un proyecto final de tu elección: Ganadería de películas favoritas, Calculadora avanzada, Chatbot simple, Juego interactivo, Portafolio personal, o lo que se te ocurra. Usa al menos: variables, funciones, arrays/objetos, eventos, DOM, localStorage.",
    resources: [
      { label: "Ideas de proyectos", url: "https://github.com/topics/javascript-learning" }
    ]
  }
];

const START_DATE = new Date('2026-03-17');

export default function App() {
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

  if (currentView === 'lesson' && selectedDay) {
    const lesson = LESSONS[selectedDay - 1];
    const currentDayNum = getCurrentDayNumber();
    const previousAvailable = selectedDay > 1 && getDayStatus(selectedDay - 1) !== 'locked';
    const nextAvailable = selectedDay < 30 && getDayStatus(selectedDay + 1) !== 'locked';

    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        {/* Header */}
        <header className="border-b border-border-dark p-6" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(0,212,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button
            onClick={() => setCurrentView('calendar')}
            className="text-neon-cyan hover:text-neon-green transition mb-4"
          >
            ← Volver al Calendario
          </button>
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

          {/* Code Example */}
          <section className="card-base p-6 border-2 border-neon-green">
            <h2 className="text-2xl font-bold text-neon-green mb-4">💻 Ejemplo</h2>
            <div className="bg-dark-bg p-4 rounded border border-neon-green overflow-x-auto">
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
        </footer>
      </div>
    );
  }

  // Calendar View
  return (
    <div className="min-h-screen bg-dark-bg text-text-light font-mono flex flex-col">
      {/* Header */}
      <header className="border-b border-border-dark p-8 text-center" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.13) 0%, rgba(191,0,255,0.06) 50%, transparent 80%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
