/**
 * Proyectos finalizados 2026 · tarjetas, filtros y carrusel
 * Lee window.PROYECTOS (assets/js/proyectos-data.js) y arma el carrusel de #proyectos.
 * Regla de botones: secundario a la izquierda, primario a la derecha.
 */
(function () {
  const grid    = document.getElementById('proyGrid');
  const filtros = document.querySelectorAll('.proy-chip');
  const conteo  = document.getElementById('proyCount');
  const prev    = document.getElementById('proyPrev');
  const next    = document.getElementById('proyNext');
  const barra   = document.getElementById('proyBar');
  if (!grid || !Array.isArray(window.PROYECTOS)) return;

  const CURSOS = { A: '7mo INFO A', B: '7mo INFO B' };
  const EXT = 'target="_blank" rel="noopener noreferrer"';

  const esc = s => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function tarjeta(p, i, total) {
    const nombre  = esc(p.nombre);
    const landing = esc(p.landing);
    const label   = esc(p.landingLabel || 'Ver landing');

    const alias = p.alias ? ` <span class="pc-alias">${esc(p.alias)}</span>` : '';
    const tags  = p.tipo.map(t => `<li>${esc(t)}</li>`).join('');

    const linktree = p.linktree
      ? `<a href="${esc(p.linktree)}" ${EXT} class="btn-sm-out" aria-label="Linktree de ${nombre} (se abre en una pestaña nueva)">Linktree</a>`
      : '';

    /* Varios manuales ("Manual admin", "Manual alumno"…) se agrupan en "Manuales por rol" */
    const todos = p.links || [];
    const manuales = todos.filter(l => /^Manual\s+\S/.test(l.label));
    const agrupar = manuales.length > 1;
    const link = (l, texto) =>
      `<a href="${esc(l.url)}" ${EXT} aria-label="${esc(l.label)} de ${nombre} (se abre en una pestaña nueva)">${esc(texto)}</a>`;
    const items = [];
    todos.forEach(l => {
      if (agrupar && manuales.includes(l)) {
        if (l !== manuales[0]) return;
        const roles = manuales.map(m => {
          const rol = m.label.replace(/^Manual\s+/, '');
          return link(m, rol.charAt(0).toUpperCase() + rol.slice(1));
        }).join('');
        items.push(`<li class="pc-group"><span class="pc-group-k">Manuales por rol:</span>${roles}</li>`);
      } else {
        items.push(`<li>${link(l, l.label)}</li>`);
      }
    });
    const links = items.length
      ? `<ul class="pc-links" aria-label="Más enlaces de ${nombre}">${items.join('')}</ul>`
      : '';

    return `
      <article class="proy-card" data-curso="${p.curso}" aria-labelledby="pc-${p.slug}"
               aria-roledescription="diapositiva">
        <a href="${landing}" ${EXT} class="pc-shot" tabindex="-1" aria-hidden="true">
          <img src="assets/proyectos/${p.slug}.webp" width="1440" height="900" loading="lazy" decoding="async" alt="">
          <span class="pc-ph"><span class="pc-ph-av">${esc(p.iniciales)}</span></span>
        </a>
        <div class="pc-body">
          <span class="pc-curso ${p.curso.toLowerCase()}">${CURSOS[p.curso]}</span>
          <h3 class="pc-title" id="pc-${p.slug}">${nombre}${alias}</h3>
          <div class="pc-rubro">${esc(p.rubro)}</div>
          <p class="pc-desc">${esc(p.descripcion)}</p>
          <ul class="pc-tags" aria-label="Tipo de proyecto">${tags}</ul>
          ${(p.integrantes || []).length ? `<p class="pc-team"><span class="pc-team-k">Integrantes:</span> ${p.integrantes.map(esc).join(', ')}</p>` : ''}
          <div class="pc-actions">
            ${linktree}
            <a href="${landing}" ${EXT} class="btn-sm-accent" aria-label="${label} de ${nombre} (se abre en una pestaña nueva)">${label} →</a>
          </div>
          ${links}
        </div>
      </article>`;
  }

  grid.innerHTML = window.PROYECTOS.map(tarjeta).join('');

  /* Captura faltante → placeholder con iniciales */
  grid.querySelectorAll('.pc-shot img').forEach(img => {
    const fallo = () => img.closest('.pc-shot').classList.add('no-img');
    if (img.complete && img.naturalWidth === 0) fallo();
    else img.addEventListener('error', fallo, { once: true });
  });

  /* ── Carrusel ── */
  const visibles = () => [...grid.querySelectorAll('.proy-card:not([hidden])')];

  function estado() {
    const max = grid.scrollWidth - grid.clientWidth;
    const x = Math.abs(grid.scrollLeft);
    if (prev) prev.disabled = x <= 4;
    if (next) next.disabled = x >= max - 4;
    if (barra) {
      const vis = grid.clientWidth / grid.scrollWidth;
      barra.style.width = (vis * 100) + '%';
      barra.style.transform = `translateX(${max > 0 ? (x / max) * ((1 - vis) / vis) * 100 : 0}%)`;
    }
  }

  function mover(dir) {
    const card = visibles()[0];
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const paso = card ? card.offsetWidth + gap : grid.clientWidth;
    const porVista = Math.max(1, Math.floor((grid.clientWidth + gap) / paso));
    grid.scrollBy({ left: dir * paso * porVista, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  prev?.addEventListener('click', () => mover(-1));
  next?.addEventListener('click', () => mover(1));
  grid.addEventListener('scroll', () => requestAnimationFrame(estado), { passive: true });
  window.addEventListener('resize', estado);

  /* Teclado: flechas cuando el foco está dentro del carrusel */
  grid.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); mover(-1); }
  });

  /* Al recibir foco una tarjeta fuera de vista, el navegador la desplaza sola (scroll-snap) */

  /* ── Filtros por curso ── */
  function filtrar(curso) {
    let n = 0;
    grid.querySelectorAll('.proy-card').forEach(card => {
      const ver = curso === 'todos' || card.dataset.curso === curso;
      card.hidden = !ver;
      if (ver) n++;
    });
    filtros.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === curso)));
    if (conteo) conteo.textContent = `Mostrando ${n} ${n === 1 ? 'proyecto' : 'proyectos'}`;
    grid.scrollTo({ left: 0 });
    estado();
  }

  filtros.forEach(b => b.addEventListener('click', () => filtrar(b.dataset.filtro)));
  filtrar('todos');
})();
