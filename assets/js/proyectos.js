/**
 * Proyectos finalizados 2026 · tarjetas y filtros
 * Lee window.PROYECTOS (assets/js/proyectos-data.js) y arma la grilla de #proyectos.
 */
(function () {
  const grid    = document.getElementById('proyGrid');
  const filtros = document.querySelectorAll('.proy-chip');
  const conteo  = document.getElementById('proyCount');
  if (!grid || !Array.isArray(window.PROYECTOS)) return;

  const CURSOS = { A: '7mo INFO A', B: '7mo INFO B' };
  const EXT = 'target="_blank" rel="noopener noreferrer"';

  const esc = s => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function tarjeta(p) {
    const nombre  = esc(p.nombre);
    const landing = esc(p.landing);
    const label   = esc(p.landingLabel || 'Ver landing');

    const alias = p.alias ? ` <span class="pc-alias">${esc(p.alias)}</span>` : '';
    const tags  = p.tipo.map(t => `<li>${esc(t)}</li>`).join('');

    const linktree = p.linktree
      ? `<a href="${esc(p.linktree)}" ${EXT} class="btn-sm-out" aria-label="Linktree de ${nombre} (se abre en una pestaña nueva)">Linktree</a>`
      : '';

    const links = (p.links || []).length
      ? `<ul class="pc-links" aria-label="Más enlaces de ${nombre}">${p.links.map(l =>
          `<li><a href="${esc(l.url)}" ${EXT} aria-label="${esc(l.label)} de ${nombre} (se abre en una pestaña nueva)">${esc(l.label)}</a></li>`
        ).join('')}</ul>`
      : '';

    return `
      <article class="proy-card" data-curso="${p.curso}" aria-labelledby="pc-${p.slug}">
        <a href="${landing}" ${EXT} class="pc-shot" tabindex="-1">
          <img src="assets/proyectos/${p.slug}.webp" width="1440" height="900" loading="lazy" decoding="async"
               alt="Captura de la landing de ${nombre}">
          <span class="pc-ph" aria-hidden="true"><span class="pc-ph-av">${esc(p.iniciales)}</span></span>
        </a>
        <div class="pc-body">
          <span class="pc-curso ${p.curso.toLowerCase()}">${CURSOS[p.curso]}</span>
          <h3 class="pc-title" id="pc-${p.slug}">${nombre}${alias}</h3>
          <div class="pc-rubro">${esc(p.rubro)}</div>
          <p class="pc-desc">${esc(p.descripcion)}</p>
          <ul class="pc-tags" aria-label="Tipo de proyecto">${tags}</ul>
          <p class="pc-team"><span class="pc-team-k">Integrantes:</span> ${p.integrantes.map(esc).join(', ')}</p>
          <div class="pc-actions">
            <a href="${landing}" ${EXT} class="btn-sm-accent" aria-label="${label} de ${nombre} (se abre en una pestaña nueva)">${label} →</a>
            ${linktree}
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

  /* Filtros por curso */
  function filtrar(curso) {
    let visibles = 0;
    grid.querySelectorAll('.proy-card').forEach(card => {
      const ver = curso === 'todos' || card.dataset.curso === curso;
      card.hidden = !ver;
      if (ver) visibles++;
    });
    filtros.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === curso)));
    if (conteo) conteo.textContent = `Mostrando ${visibles} ${visibles === 1 ? 'proyecto' : 'proyectos'}`;
  }

  filtros.forEach(b => b.addEventListener('click', () => filtrar(b.dataset.filtro)));
  filtrar('todos');
})();
