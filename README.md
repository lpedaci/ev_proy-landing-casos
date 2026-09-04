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
│   └── js/
│       └── script.js       # Animaciones scroll-triggered (IntersectionObserver)
│
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

## Créditos

- **Autor**: Prof. Pedaci, Lourdes — [LinkedIn](https://www.linkedin.com/in/lourdes-pedaci/)
- **Institución**: Instituto Leonardo Murialdo — Tres de Febrero, Buenos Aires
- **Espacio curricular:** Evaluación de Proyectos · 7mo año · Ciclo lectivo 2026

---

*Los casos de estudio son ficticios y fueron desarrollados como modelos de referencia para ilustrar la metodología del programa. Su uso es exclusivamente formativo.*
