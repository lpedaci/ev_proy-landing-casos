/**
 * Evaluación de Proyectos — Hub
 * Instituto Leonardo Murialdo · 7mo Informática 2026
 * script.js · menú móvil, nav activo, marquee, revelados
 */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════════
     MENÚ MÓVIL (accesible: Escape, foco, aria)
     ══════════════════════════════════════════ */
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open) {
    mobileMenu.hidden = !open;
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mobileMenu.querySelector('a')?.focus();
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => setMenu(mobileMenu.hidden));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !mobileMenu.hidden) { setMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  /* ══════════════════════════════════════════
     NAV ACTIVO SEGÚN SECCIÓN
     ══════════════════════════════════════════ */
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-link');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => {
        const on = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('act', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => navObserver.observe(s));

  /* ══════════════════════════════════════════
     MARQUEE CON LOS PROYECTOS 2026
     ══════════════════════════════════════════ */
  /* Dos filas (una por curso, en sentidos opuestos). Lo visual es
     aria-hidden; para lectores de pantalla va una lista única oculta. */
  const marquee = document.getElementById('marquee');
  if (marquee && Array.isArray(window.PROYECTOS)) {
    const sr = document.createElement('ul');
    sr.className = 'sr-only';
    sr.setAttribute('aria-label', 'Proyectos finalizados 2026');
    window.PROYECTOS.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.nombre} (7mo INFO ${p.curso})`;
      sr.appendChild(li);
    });
    marquee.appendChild(sr);

    ['A', 'B'].forEach((curso, fila) => {
      const delCurso = window.PROYECTOS.filter(p => p.curso === curso);
      if (!delCurso.length) return;
      // repetir hasta tener suficientes ítems para cubrir pantallas anchas
      let items = [];
      while (items.length < 10) items = items.concat(delCurso);

      const row = document.createElement('div');
      row.className = 'marquee' + (fila ? ' is-reverse' : '');
      row.setAttribute('aria-hidden', 'true');
      const track = document.createElement('div');
      track.className = 'marquee-track';
      const list = document.createElement('ul');
      list.className = 'marquee-list';
      items.forEach(p => {
        const li = document.createElement('li');
        li.className = 'mq-item mq-' + curso.toLowerCase();
        const tag = document.createElement('span');
        tag.className = 'mq-tag';
        tag.textContent = 'INFO ' + curso;
        li.append(document.createTextNode(p.nombre), tag);
        list.appendChild(li);
      });
      track.append(list, list.cloneNode(true));
      row.appendChild(track);
      marquee.appendChild(row);
    });

    /* Pausar la animación cuando el marquee no está en pantalla (ahorra CPU/GPU) */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => marquee.classList.toggle('is-off', !e.isIntersecting))
        .observe(marquee);
    }
  }

  /* ══════════════════════════════════════════
     STATEMENT: se ilumina palabra a palabra al scrollear
     ══════════════════════════════════════════ */
  const statement = document.querySelector('[data-reveal]');
  if (statement && !reduceMotion) {
    const words = statement.textContent.trim().split(/\s+/);
    statement.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      statement.appendChild(s);
      if (i < words.length - 1) statement.appendChild(document.createTextNode(' '));
    });
    statement.classList.add('is-armed');
    const spans = statement.querySelectorAll('.w');
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = statement.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 cuando el bloque entra por abajo, 1 cuando su base pasa el 45% de la pantalla
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .4)));
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ══════════════════════════════════════════
     REVELADO DE TARJETAS AL ENTRAR EN PANTALLA
     ══════════════════════════════════════════ */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); fadeObserver.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.sec-head, .card, .caso-card, .carousel, .roadmap, .nota-met, .final-title').forEach((el, i) => {
      el.classList.add('reveal');
      // escalonado suave dentro de cada grilla
      const idx = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = Math.min(idx, 5) * 60 + 'ms';
      fadeObserver.observe(el);
    });
  }
})();
