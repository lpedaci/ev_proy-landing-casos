# Hopper · asistente de preguntas frecuentes

Widget de FAQ conversacional del sitio de **Evaluación de Proyectos**.
Sin backend, sin API keys, sin modelo de lenguaje: busca por coincidencia de
palabras clave contra un archivo JSON y devuelve una respuesta escrita de antemano.
Si ninguna entrada llega al umbral, no inventa: ofrece las tres más cercanas y deriva.

Se llama así por **Grace Hopper**, que insistió en que un programa tiene que poder ser
leído por alguien que no lo escribió.

---

## Archivos

```
assets/hopper.js          Motor de búsqueda, detector de señales e interfaz
assets/hopper.css         Estilos (hereda los tokens de la página anfitriona)
data/faq.json             El contenido: las preguntas y las respuestas
data/senales.json         Netiqueta y señales de crisis (centros de ayuda)
test/test-matching.js     Las consultas de prueba y su destino esperado
test/test-matching.html   Las mismas pruebas, para correr en el navegador
```

## Cómo se inyecta

Una línea antes de `</body>`, en cualquier página del sitio:

```html
<script src="assets/hopper.js" defer></script>
```

El script se ubica solo: carga `assets/hopper.css` y `data/faq.json` tomando como
referencia su propia ruta. Si una página está en un subdirectorio, se puede forzar:

```html
<script src="../assets/hopper.js" data-faq="../data/faq.json"
        data-senales="../data/senales.json" defer></script>
```

> Abierto con doble clic (`file://`) el navegador bloquea la lectura del JSON y el
> widget avisa que no pudo cargar. Sobre GitHub Pages o un servidor local funciona.

---

## Agregar una pregunta nueva

Todo el contenido está en **`data/faq.json`**. Es una lista de objetos; para sumar
una pregunta se agrega un objeto más. No hay que tocar `hopper.js`.

```json
{
  "id": "gantt-notion",
  "pregunta": "¿Dónde va el GANTT del proyecto?",
  "respuesta": "<p>En <strong>Oferta de Gestión</strong>...</p><ul><li>...</li></ul>",
  "keywords": ["gantt", "cronograma", "planificacion", "gant", "diagrama de gantt"],
  "publico": "estudiante",
  "link": "#materiales",
  "destacada": false,
  "fuente": "Módulo de Documentación, 5.1 GANTT."
}
```

| Campo | Qué poner |
|---|---|
| `id` | Identificador único, en minúsculas y con guiones. Se usa en las pruebas. |
| `pregunta` | Cómo la formularía un estudiante. Es el texto que se ve en los chips y en las sugerencias del fallback. |
| `respuesta` | HTML corto: `p`, `ul`, `li`, `strong`. Nada de `script`, `style` ni `iframe`. |
| `keywords` | Cómo la escribe realmente alguien apurado (ver abajo). |
| `publico` | `estudiante`, `visitante` o `ambos`. Filtra qué ve cada uno. |
| `link` | Ancla del sitio (`#materiales`) o URL completa. Vacío si no corresponde. |
| `destacada` | `true` para que aparezca como chip. Se muestran los primeros 5 de cada público. |
| `fuente` | De dónde salió la respuesta. No se muestra: sirve para poder revisarla el año que viene. |

### Las keywords son lo único que decide si la pregunta se encuentra

Regla práctica: escribí cinco maneras distintas de preguntar lo mismo, incluyendo
las que te hacen en el aula. Conviene cubrir cuatro familias:

1. **El término técnico**: `gantt`, `product backlog`, `rnf`.
2. **El término coloquial**: `cronograma`, `lista de tareas`, `no funcional`.
3. **La pregunta entera**, tal como la tipean: `donde va el gantt`, `que es el rnf`.
   Las frases valen más que las palabras sueltas, así que son las que mejor apuntan.
4. **Los errores de tipeo frecuentes**: `gant`, `documantacion`, `requerimento`.

Las keywords se normalizan solas (minúsculas, sin acentos, sin puntuación), así que
se pueden escribir con acentos y sin preocuparse. `e1`, `E 01` y `e01` se unifican.

Lo que **no** conviene poner: palabras genéricas como `proyecto`, `materia` o
`documentacion` sueltas. Cuanto más entradas comparten una keyword, menos distingue,
y lo único que logra es que consultas ajenas caigan en tu pregunta.

### Después de agregarla, correr las pruebas

```bash
node test/test-matching.js
```

O abrir `test/test-matching.html` desde el sitio servido. Las veinte consultas tienen
que seguir cayendo donde caían. Si alguna se movió, casi siempre es por una keyword
demasiado genérica en la entrada nueva.

Si la pregunta nueva es importante, sumale su propio caso a la lista `CASOS` de
`test/test-matching.js`, escrito como lo escribiría un alumno, no como lo escribirías vos.

---

## Netiqueta y señales de crisis

Antes de buscar en el FAQ, Hopper pasa la consulta por **`data/senales.json`**. Ese archivo
es una lista de señales que se evalúan **en orden**: gana la primera que coincide.

```json
{
  "id": "crisis",
  "corta": true,
  "respuesta": "<p>...</p><ul><li><strong>Línea 135</strong>...</li></ul>",
  "terminos": ["me quiero matar", "suicidarme", "cortarme"]
}
```

| Campo | Qué hace |
|---|---|
| `id` | Nombre de la señal. Se usa en las pruebas. |
| `corta` | `true`: la respuesta de la señal reemplaza a la del FAQ. `false`: se muestra el aviso y **además** se responde la pregunta. |
| `terminos` | Lo que dispara la señal. |
| `respuesta` | HTML, igual que en el FAQ. |

Las tres señales cargadas, en orden de prioridad:

1. **`crisis`** (`corta: true`) · suicidio y autolesión. Responde con Línea 135 / (011) 5275-1135
   del Centro de Asistencia al Suicida, Línea 102 y 107 / 911, y remite a un adulto del instituto.
2. **`violencia`** (`corta: true`) · alguien que lastima al estudiante o a quien el estudiante
   podría lastimar. Responde con Líneas 137, 144, 102 y 911.
3. **`netiqueta`** (`corta: false`) · insultos. Avisa y después contesta igual la pregunta.

### Cómo se comparan los términos

- Los de **varias palabras** se buscan como fragmento de la consulta: `"me quiero matar"`
  coincide dentro de `"creo que me quiero matar"`.
- Los de **una sola palabra** se comparan como palabra entera, nunca como fragmento.
  Es deliberado: `"puta"` está adentro de `"computadora"`, y `"matar"` aparece en
  `"matar el proceso del servidor"`, que es vocabulario normal de la materia.

Por eso, si agregás un término de una palabra, pensá si esa palabra puede aparecer sola en una
consulta técnica legítima. Si puede, escribilo como frase (`"me quiero matar"` en vez de `"matar"`).

### Un falso positivo es el error caro

En `test/test-matching.js`, la lista `CASOS_SENALES` tiene dos mitades: las consultas que **sí**
tienen que disparar y las que **no**. La segunda mitad es la que importa cuidar, porque un aviso
de netiqueta o de crisis apareciendo en medio de una consulta sobre el ESP32 hace que los chicos
dejen de tomar en serio el aviso cuando de verdad haga falta. Si sumás términos, sumá también
casos negativos.

### Si querés una tercera categoría

Por ejemplo, discriminación, con una respuesta más firme que la de netiqueta: agregá otro objeto
a `data/senales.json` **antes** que `netiqueta` (el orden es la prioridad), con `corta` según si
querés que además conteste la pregunta o no. El código no hay que tocarlo.

### Si el archivo no carga

El asistente sigue respondiendo preguntas, pero **la detección queda desactivada** y avisa en la
consola del navegador. Vale la pena verificar que `data/senales.json` esté publicado.

---

## Ajustar el matching

Las constantes de calibración están todas juntas arriba de `assets/hopper.js`:

| Constante | Para qué |
|---|---|
| `UMBRAL_MINIMO` | Puntaje mínimo (0 a 1) para responder en vez de ir al fallback. |
| `SATURACION` | Cuánta evidencia hace falta para llegar a un puntaje alto. |
| `FACTORES` | Cuánto vale cada tipo de coincidencia (frase, palabra, prefijo, tipeo). |
| `LARGO_MIN_TIPEO` | Desde qué longitud se arriesga a corregir un error de tipeo. |
| `CHIPS_VISIBLES` | Cuántos chips se muestran (la barra deja ver 3 y el resto se scrollea). |
| `SUGERENCIAS_FALLBACK` | Cuántas preguntas ofrece cuando no entiende. |
| `DEMORA_RESPUESTA_MS` | Cuánto duran los tres puntitos antes de cada respuesta. |
| `PRESENTACION_MS` | Cuánto queda la burbuja mostrando el nombre antes de contraerse al logo. |

**Calibración actual** (28 entradas): con `UMBRAL_MINIMO = 0.40`, la consulta correcta
más floja puntúa `0.526` y la consulta de ruido más alta llega a `0.091`. La banda
segura es todo lo que esté entre esos dos números; el valor está puesto en el medio.
Al agregar muchas entradas conviene volver a medirla, porque entradas parecidas se
quitan puntaje entre sí.

Subir el umbral: más fallbacks, menos respuestas equivocadas.
Bajarlo: al revés. Ante la duda, para una materia conviene el fallback: mandar a
preguntar en clase nunca está mal, responder cualquier cosa sí.

---

## Lo que Hopper no hace, a propósito

- **No da notas, fechas ni resuelve trámites.** Hay una entrada (`notas-fechas-tramites`)
  que existe justamente para derivar eso a la profesora.
- **No compone respuestas mezclando entradas.** O gana una sola por encima del umbral,
  o es fallback. Media respuesta de una entrada más media de otra es cómo se fabrica
  una respuesta falsa que suena bien.
- **No recuerda nada entre visitas.** Sin `localStorage` ni cookies.
- **No reemplaza a la profe**, y lo dice en el pie del panel.
- **No intenta contener a nadie.** Ante una señal de crisis da los teléfonos y remite a un adulto
  del instituto. Un programa que responde por coincidencia de palabras no puede hacer más que eso,
  y hacer de más sería peor.

---

## La burbuja y el logo

La marca de Hopper es un **globo de diálogo con un destello** (un asistente que responde). Es un SVG en línea dentro de `hopper.js`
(constante `LOGO`), sin archivo de imagen: hereda el color del contenedor y se ve nítido a 20px
igual que a 200. En este sitio el círculo del logo va en lila claro con el trazo en violeta profundo (`style.css`). Si se cambia, conviene probarlo a 20px antes que en grande:
a ese tamaño los rellenos con opacidad y los trazos finos se empastan.

Al cargar la página la burbuja aparece como píldora, con el logo y el nombre, para que se
entienda qué es. Pasados los segundos de `PRESENTACION_MS` se contrae al logo solo y ahí queda,
ocupando menos pantalla. Vuelve a mostrar el nombre al pasar el mouse o al recibir foco por
teclado, y se contrae apenas alguien abre el panel: a esa altura ya se presentó.

Con `prefers-reduced-motion` no hay presentación: arranca contraída.

---

## La barra de chips

Los chips son el menú permanente del panel: se arman con las entradas `destacada` del público
elegido y son la forma en que un estudiante descubre qué se puede preguntar.

Dos cosas del CSS que **no** hay que tocar sin entender por qué están:

- `.hopper-chips { flex: 0 0 auto; }` · sin eso, la barra es la que absorbe todo el achique del
  panel (el hilo tiene `flex-basis: 0` y no participa del reparto). Con preguntas largas quedaba
  aplastada a media fila y parecía que no había chips.
- El `max-height` se calcula con `--h-fila-chip` para cortar en el hueco entre la fila 3 y la 4.
  Un chip partido al medio se lee como un error, no como "hay más abajo".

Los chips van a una sola línea con `text-overflow: ellipsis`, y el texto completo queda en el
`title`. Si una pregunta se corta mucho en el chip, conviene acortar el campo `pregunta` de esa
entrada en `faq.json`: es el mismo texto que se ve en las sugerencias del fallback.

---

## Accesibilidad

Panel con `role="dialog"`, hilo con `aria-live="polite"`, foco atrapado dentro del
panel mientras está abierto, `Esc` para cerrar y foco devuelto a la burbuja al salir.
Respeta `prefers-reduced-motion` y hereda el modo oscuro del sitio.

---

*Prof. Pedaci, Lourdes · Instituto Leonardo Murialdo · 7mo Informática 2026*
