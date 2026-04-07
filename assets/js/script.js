/* ============================================================
   Evaluación de Proyectos — Hub · script.js
   Instituto Leonardo Murialdo · 7mo Informática 2026
   Autora: Prof. Pedaci, Lourdes
   ============================================================ */

/**
 * Scroll-triggered fade-up para tarjetas de contenido.
 * Usa IntersectionObserver para animar los elementos cuando
 * entran al viewport, evitando repintados innecesarios.
 */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'none';
        entry.target.style.transition = 'opacity .6s ease, transform .6s ease';
      }
    });
  },
  { threshold: 0.1 }
);

// Aplicar estado inicial y registrar observación en cada tarjeta
document.querySelectorAll('.caso-card, .mat-card, .metod-card, .cb-stat').forEach((el) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  observer.observe(el);
});
