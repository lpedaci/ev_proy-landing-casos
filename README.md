# Evaluación de Proyectos — Hub

**Programa de formación en gestión y desarrollo de proyectos tecnológicos · 7mo Informática 2026**  
Instituto Leonardo Murialdo · Proyecto Tecnológico Interdisciplinario

---

## Descripción del programa

Este hub centraliza los recursos del espacio curricular **Evaluación de Proyectos** para los estudiantes de 7mo año de la Tecnicatura en Informática Personal y Profesional del Instituto Leonardo Murialdo.

El programa forma a los participantes en una metodología completa de desarrollo de proyectos tecnológicos orientada al cliente real: desde el relevamiento inicial y la validación del problema hasta la entrega del producto funcional. Cada ciclo lectivo incluye dos casos de estudio desarrollados en profundidad, que modelan el proceso de diagnóstico, diseño e implementación de soluciones de software y hardware.

El sitio está diseñado para publicarse vía **GitHub Pages** y actúa como punto de acceso público al programa y sus entregables.

---

## Estructura de archivos

```
ev-proy-hub/
│
├── index.html              # Página principal del hub
│
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos globales (tokens, layout, componentes, responsive)
│   ├── js/
│   │   └── script.js       # Animaciones scroll-triggered (IntersectionObserver)
│   ├── hopper.js           # Asistente de FAQ: motor de búsqueda + interfaz
│   └── hopper.css          # Estilos del asistente
│
├── data/
│   ├── faq.json            # Contenido del asistente: preguntas, respuestas y keywords
│   └── senales.json        # Netiqueta y señales de crisis (centros de ayuda)
│
├── test/
│   ├── test-matching.js    # 20 consultas reales y su destino esperado
│   └── test-matching.html  # Las mismas pruebas, para correr en el navegador
│
├── HOPPER.md               # Cómo agregar una pregunta al asistente
└── README.md               # Este archivo
```

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura del documento |
| CSS3 (custom properties) | Sistema de diseño con tokens, layout Grid/Flex, bento sections |
| `prefers-color-scheme` | Modo claro/oscuro automático según el sistema |
| JavaScript vanilla (ES6+) | `IntersectionObserver` para scroll-spy de navegación y animaciones de entrada |
| Accesibilidad | Estados `:focus-visible` y soporte de `prefers-reduced-motion` |
| Google Fonts — DM Sans | Tipografía principal |
| GitHub Pages | Hosting estático gratuito |
| JSON estático | Contenido del asistente de FAQ, sin backend ni API |

Sin dependencias externas, sin frameworks, sin bundlers. El sitio funciona desde cualquier servidor estático o directamente desde el sistema de archivos.

---

## Secciones del hub

- **Hero** — Presentación del programa, accesos directos y vista previa de los casos de estudio
- **Contexto** — Marco institucional y las 6 fases del ciclo de proyecto
- **Casos de estudio** — Roberto Fernández (Caso 01) y Valeria Gómez (Caso 02)
- **Proyectos 2026** — Dashboard en formato bento con los proyectos finalizados del ciclo (todavía sin entregas, estado "Próximamente")
- **Cómo trabajamos** — Los 6 principios que estructuran el proceso de cada proyecto
- **Materiales** — Los 3 módulos del programa, el ejemplo de documentación, los lineamientos, el cronograma y las pautas de entrega

---

## Hopper · asistente de preguntas frecuentes

El sitio incluye **Hopper**, un widget de FAQ conversacional que responde consultas
frecuentes sobre la materia (etapas E01 a E06, estructura de la documentación, siglas,
formato de entrega, los dos casos de estudio). Busca por coincidencia de palabras clave
contra `data/faq.json`: no hay modelo de lenguaje, no hay backend y no inventa respuestas.
Si no encuentra nada, ofrece las tres preguntas más cercanas y deriva a la profesora.

Antes de buscar, pasa la consulta por `data/senales.json`: recuerda las netiquetas ante un insulto
y, ante una señal de crisis o de violencia, responde con los teléfonos de ayuda de Argentina y
remite a un adulto del instituto.

Se inyecta con una sola línea antes de `</body>`:

```html
<script src="assets/hopper.js" defer></script>
```

Para agregar o editar preguntas: **[HOPPER.md](HOPPER.md)**.

---

## Créditos

- **Autor**: Prof. Pedaci, Lourdes — [LinkedIn](https://www.linkedin.com/in/lourdes-pedaci/)
- **Institución**: Instituto Leonardo Murialdo — Tres de Febrero, Buenos Aires
- **Espacio curricular:** Evaluación de Proyectos · 7mo año · Ciclo lectivo 2026

---

*Los casos de estudio son ficticios y fueron desarrollados como modelos de referencia para ilustrar la metodología del programa. Su uso es exclusivamente formativo.*
