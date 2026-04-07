# Evaluación de Proyectos — Hub

**Portal educativo de la asignatura Evaluación de Proyectos · 7mo Informática 2026**  
Instituto Leonardo Murialdo · Proyecto Tecnológico Interdisciplinario

---

## Descripción del proyecto

Este portal centraliza los recursos de la asignatura **Evaluación de Proyectos** para los alumnos de 7mo año de la Tecnicatura en Informática Personal y Profesional del Instituto Leonardo Murialdo.

La página presenta la metodología de trabajo, los dos casos de uso reales desarrollados durante el año, y los materiales de estudio correspondientes a cada módulo.

El sitio está diseñado para publicarse vía **GitHub Pages** y ser el punto de entrada público del espacio curricular.

---

## Estructura de archivos

```
ev-proy-hub/
│
├── index.html              # Página principal del portal
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

## Tecnologías usadas

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura del documento |
| CSS3 (custom properties) | Sistema de diseño con tokens, layout Grid/Flex |
| JavaScript vanilla (ES6+) | Animaciones con `IntersectionObserver` |
| Google Fonts — DM Sans | Tipografía principal |
| GitHub Pages | Hosting estático gratuito |

Sin dependencias externas, sin frameworks, sin bundlers. El sitio funciona desde cualquier servidor estático o directamente desde el sistema de archivos.

---

## Secciones del portal

- **Hero** — Presentación de la asignatura y accesos directos
- **Contexto** — Descripción institucional y las 6 fases del proyecto
- **Casos de uso** — Roberto Fernández (Caso 01) y Valeria Gómez (Caso 02)
- **Materiales** — Acceso a los 3 módulos teóricos y los lineamientos institucionales
- **Metodología** — Los 6 principios de trabajo de la asignatura

---

## Notas orientativas

### Para publicar en GitHub Pages

1. Subí los archivos a un repositorio público en GitHub (respetando la estructura de carpetas).
2. En **Settings → Pages**, seleccioná la rama `main` y la carpeta raíz `/`.
3. El sitio quedará disponible en `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

### Para agregar un nuevo caso de uso

1. Creá la card correspondiente en la sección `#casos` de `index.html`.
2. Actualizá los links del footer.
3. No es necesario modificar `style.css` ni `script.js` — las clases existentes cubren la nueva card automáticamente.

### Personalización de colores

Todos los colores del sitio se definen como custom properties CSS en el bloque `:root` de `style.css`. Modificar esas variables actualiza toda la interfaz de forma consistente:

```css
:root {
  --accent:  #1a3a5c;  /* Azul institucional (Caso Roberto) */
  --accent2: #2d6a4f;  /* Verde (Caso Valeria / SensorOffice) */
  --warm:    #c45e1a;  /* Naranja (énfasis, Módulo 03) */
}
```

---

## Créditos

- **Autor**: Prof. Pedaci, Lourdes — [LinkedIn](https://www.linkedin.com/in/lourdes-pedaci/)
- **Institución**: Instituto Leonardo Murialdo — Tres de Febrero, Buenos Aires  
- **Asignatura:** Evaluación de Proyectos · 7mo año · Ciclo lectivo 2026

---

*Material de uso instruccional. Los casos de uso son ficticios y fueron construidos como ejemplos pedagógicos para modelar la metodología de la asignatura.*
