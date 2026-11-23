# Evaluación de Proyectos — Hub

**Espacio curricular de 7mo año · Tecnicatura en Informática Personal y Profesional · Ciclo 2026**

Instituto Leonardo Murialdo · Proyecto Tecnológico Interdisciplinario

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=githubpages&logoColor=white)

Sitio público de la asignatura **Evaluación de Proyectos**. Reúne en una sola página el método de trabajo, dos casos de estudio modelo, los proyectos finalizados del ciclo y los materiales de cursada, con un asistente de preguntas frecuentes (Hopper).
Se publica con **GitHub Pages** y no requiere backend.

---

## 1. Para quién es y qué tiene que resolver

| Público | Qué necesita | Dónde lo encuentra |
|---|---|---|
| **Estudiantes de 7mo** | Entender el método, ver un ejemplo resuelto y llegar rápido a los materiales y pautas | Fases del proyecto · Casos de estudio · Materiales · Hopper |
| **Equipos que arrancan su proyecto** | Referentes concretos de lo que se espera al final del ciclo | Proyectos finalizados 2026 |
| **Familias, clientes e instituciones** | Ver qué se hace en la materia y con qué nivel | Hero · Contexto · Proyectos |
| **Docentes** | Un punto único para compartir con el curso | Toda la página, con enlaces profundos por sección (`#casos`, `#materiales`…) |

---

## 2. Diseño instruccional: por qué la página tiene este orden

La página es un **recorrido de aprendizaje**, no un listado de recursos. Cada sección prepara la siguiente:

1. **Hero — el propósito.** "Del problema real al proyecto tecnológico". Antes de cualquier contenido, el estudiante sabe hacia dónde va.
2. **Contexto — el marco y el método.** Qué es la asignatura, cómo se articula con el proyecto interdisciplinario y las **6 fases (E01–E06)** presentadas como cronograma: cada fase deja un entregable que valida la siguiente.
3. **Casos de estudio — ejemplos resueltos** (*worked examples*). Roberto y Valeria muestran el método completo aplicado a un problema real: datos del cliente, síntomas, causa raíz y solución. Ver la tarea resuelta antes de hacerla baja la carga cognitiva.
4. **Principio fundamental — la idea fuerza.** "Definición incorrecta → solución incorrecta" se destaca aparte para que sea lo que se recuerde.
5. **Proyectos finalizados — modelos de pares.** Catorce equipos del mismo año ya hicieron el recorrido: funcionan como evidencia de que es alcanzable y como vara de calidad.
6. **Cómo trabajamos — los criterios.** Seis principios que después se evalúan (usuario real, entrevista, viabilidad, OKRs, HCI, entrega completa).
7. **Materiales — las herramientas.** Módulos, lineamientos, cronograma GANTT, pautas de entrega y el ejemplo de documentación, al final, cuando ya se entiende para qué sirve cada uno.
8. **Cierre.** "Todo empieza por un usuario con una problemática real": vuelve al inicio del ciclo.

**Hopper** acompaña todo el recorrido como **apoyo just-in-time**: responde dudas puntuales (siglas, etapas, formato de entrega) sin que el estudiante tenga que salir de la página, y deriva a la docente lo que no le corresponde.

---

## 3. Sistema de diseño (UX/UI)

### Dirección visual
Estética **dark product**: fondo casi negro, tipografía grande y compacta, tarjetas tipo *bento*, brillos sutiles y un acento violeta. Busca que la asignatura se vea como un producto tecnológico actual, coherente con lo que los equipos construyen.

### Tipografía
- **Geist** para todo el texto; **Geist Mono** para rótulos técnicos (E01, "7mo INFO A", "Módulo 01").
- Títulos grandes con interletrado negativo y **sin punto final**.
- Cuerpo mínimo de 14px; textos largos con `text-wrap: pretty` y títulos con `balance`.

### Color con significado
Cada color identifica **una sola cosa** en todo el sitio. Todos están definidos como tokens en `:root` (`assets/css/style.css`).

| Token | Color | Significa |
|---|---|---|
| `--navy-fill` / `--accent` | Violeta | Marca, Hopper, acciones principales |
| `--curso-a` | Azul | 7mo INFO A |
| `--curso-b` | Bordó | 7mo INFO B |
| `--caso-r` | Lima | Caso 01 · Roberto |
| `--caso-v` | Cian | Caso 02 · Valeria |
| `--idea` | Ámbar | Principio fundamental de la asignatura |
| Verde / naranja | — | Tarjetas de Materiales (entrega y lineamientos / planificación y ejemplo) |

### Componentes principales
- **Ventana del hero**: vista previa que resume el sitio (fase actual, casos activos, proyectos publicados, avance del ciclo).
- **Franja de proyectos**: dos filas animadas, una por curso.
- **Cronograma de fases**: GANTT con una barra por fase y E06 como hito final.
- **Tarjetas de casos**: alineadas fila por fila (*subgrid*) para comparar los datos de ambos clientes a la misma altura.
- **Carrusel de proyectos**: progreso y flechas arriba de las tarjetas; filtros por curso; todas las tarjetas con sus filas (título, texto, botón "Ver landing", enlaces) a la misma altura.
- **Botones**: el **primario va a la derecha** y el secundario a la izquierda; al apilarse en mobile, el primario queda arriba.

### Responsive
| Ancho | Comportamiento |
|---|---|
| > 1024px | Navegación completa, carrusel de 3 tarjetas |
| ≤ 1024px | Menú hamburguesa, carrusel de 2 tarjetas, enlaces de Materiales como botón a ancho completo |
| ≤ 860px | Contenidos en una columna |
| ≤ 600px | Carrusel de una tarjeta y media (indica que se desliza), botones apilados a ancho completo |

---

## 4. Accesibilidad

- Contraste **WCAG AA** en todos los textos (los valores están anotados junto a cada token).
- Enlace **"Saltar al contenido"**, landmarks (`header`, `main`, `footer`, `nav`) y jerarquía de títulos ordenada.
- Foco visible en todos los elementos interactivos; el menú móvil se cierra con **Escape** y devuelve el foco.
- Carrusel con `aria-roledescription`, botones con nombre accesible, control por **flechas del teclado** y contador de resultados con `aria-live`.
- Áreas táctiles de **44px** mínimo.
- Íconos SVG decorativos ocultos a lectores de pantalla; enlaces externos anuncian que abren pestaña nueva.
- Con **`prefers-reduced-motion`** se desactivan animaciones, el marquee y los revelados.
- Rendimiento: la animación de la franja se pausa cuando no está en pantalla y las capturas se cargan en diferido (`loading="lazy"`).

---

## 5. Cómo mantener el contenido

### Agregar o editar un proyecto
Todo sale de **`assets/js/proyectos-data.js`**; no hace falta tocar el HTML.

```js
{
  slug: 'mi-proyecto',              // nombre del archivo de captura
  nombre: 'Mi Proyecto',
  alias: 'Subtítulo opcional',
  iniciales: 'MP',                  // se muestran si falta la captura
  curso: 'A',                       // 'A' o 'B'
  rubro: 'Cliente · Rubro',
  descripcion: 'Qué problema resuelve, en una o dos líneas.',
  tipo: ['Software', 'Web'],
  integrantes: ['Apellido', 'Apellido'],
  landing: 'https://…',             // botón "Ver landing"
  capturaTema: 'dark',              // opcional: capturar la versión oscura
  links: [
    { label: 'Documentación', url: 'https://…' },
    { label: 'Manual', url: 'https://…' }
  ]
}
```

**Criterios editoriales**
- El **orden del array es el orden del carrusel**: se alternan INFO A e INFO B.
- **No se publican** accesos a Demo, repositorios de GitHub ni archivos alojados en github.com: se cuidan los sistemas y el código de los equipos. Solo landing, documentación, manuales, FAQ y presentaciones.
- Si un proyecto tiene varios manuales ("Manual admin", "Manual alumno"), se agrupan solos como **"Manuales por rol"**.
- Al cambiar la cantidad de proyectos, actualizar los totales del `index.html` (hero, franja, estadística y texto de la sección).

### Capturas de las landings
```powershell
npm i
npx playwright install chromium
node scripts/capturas.mjs mi-proyecto
```
Genera `assets/proyectos/<slug>.webp` (1440×900). Sin argumentos, captura todos.

### Hopper
Las preguntas y respuestas están en `data/faq.json`. Ver **[HOPPER.md](HOPPER.md)**.

---

## 6. Estructura de archivos

```
├── index.html                  Página única del hub
├── assets/
│   ├── css/style.css           Tokens, componentes y responsive
│   ├── js/
│   │   ├── proyectos-data.js   Datos de los proyectos (fuente única)
│   │   ├── proyectos.js        Tarjetas, filtros y carrusel
│   │   └── script.js           Menú, nav activo, franja de proyectos, revelados
│   ├── proyectos/*.webp        Capturas de las landings
│   ├── hopper.js / hopper.css  Asistente de FAQ
├── data/
│   ├── faq.json                Contenido de Hopper
│   └── senales.json            Netiqueta y señales de crisis
├── scripts/capturas.mjs        Generador de capturas (Playwright)
├── test/                       Pruebas del buscador de Hopper
├── HOPPER.md                   Guía para editar el asistente
└── README.md
```

## 7. Tecnologías y herramientas

**En el sitio publicado**

| | Tecnología | Uso |
|---|---|---|
| ![HTML5](https://img.shields.io/badge/-E34F26?style=flat-square&logo=html5&logoColor=white) | **HTML5** | Estructura semántica, landmarks y ARIA |
| ![CSS3](https://img.shields.io/badge/-1572B6?style=flat-square&logo=css&logoColor=white) | **CSS3** | Tokens (custom properties), Grid, subgrid y responsive |
| ![JavaScript](https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | **JavaScript** (vanilla) | Carrusel, filtros, menú, franja de proyectos y Hopper |
| ![JSON](https://img.shields.io/badge/-000000?style=flat-square&logo=json&logoColor=white) | **JSON** | Contenido de Hopper (FAQ y señales) |
| ![Google Fonts](https://img.shields.io/badge/-4285F4?style=flat-square&logo=googlefonts&logoColor=white) | **Google Fonts** | Tipografías Geist y Geist Mono |
| ![GitHub Pages](https://img.shields.io/badge/-222222?style=flat-square&logo=githubpages&logoColor=white) | **GitHub Pages** | Hosting estático |

**Solo para mantenimiento** (no se cargan en el sitio)

| | Herramienta | Uso |
|---|---|---|
| ![Node.js](https://img.shields.io/badge/-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white) | **Node.js** | Ejecuta el script de capturas |
| ![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square) | **Playwright** | Abre cada landing y toma la captura |
| ![Sharp](https://img.shields.io/badge/-99CC00?style=flat-square&logo=sharp&logoColor=white) | **Sharp** | Convierte las capturas a WebP |
| ![Git](https://img.shields.io/badge/-F05032?style=flat-square&logo=git&logoColor=white) | **Git / GitHub** | Versionado y publicación |

Sin frameworks ni bundlers.

---

## 8. Checklist de QA antes de publicar

- [ ] Se ve bien en **desktop (1440px), tablet (768px) y mobile (375px)**, sin scroll horizontal.
- [ ] Consola del navegador sin errores.
- [ ] Todas las tarjetas del carrusel tienen el botón "Ver landing" a la misma altura.
- [ ] Ningún proyecto enlaza a Demo ni a GitHub.
- [ ] Los totales de proyectos coinciden en todo el sitio.
- [ ] Navegación completa con teclado (Tab, Escape, flechas en el carrusel).
- [ ] Títulos sin punto final; botón primario a la derecha.

---

## Créditos

- **Autoría**: Prof. Pedaci, Lourdes — [LinkedIn](https://www.linkedin.com/in/lourdes-pedaci/)
- **Institución**: Instituto Leonardo Murialdo — Tres de Febrero, Buenos Aires
- **Espacio curricular**: Evaluación de Proyectos · 7mo año · Ciclo lectivo 2026

*Los casos de estudio de Roberto y Valeria son ficticios y se desarrollaron como modelos de referencia para ilustrar la metodología. Los proyectos finalizados pertenecen a sus equipos.*
