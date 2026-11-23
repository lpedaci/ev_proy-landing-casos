/**
 * Capturas de las landings de los proyectos finalizados 2026.
 *
 * Uso (desde la raíz del repo):
 *   npm i                         (una sola vez)
 *   npx playwright install chromium
 *   node scripts/capturas.mjs              → captura todos los proyectos
 *   node scripts/capturas.mjs smartrack    → captura solo los slugs indicados
 *
 * Lee las URLs de assets/js/proyectos-data.js (campo `captura` si existe, si no `landing`) y guarda
 * assets/proyectos/<slug>.webp (1440×900, primera pantalla, calidad 80).
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'proyectos');
const TIMEOUT = 30_000;
const RETRY_DELAY = 20_000;

/* Datos: misma fuente que usa la web */
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/js/proyectos-data.js'), 'utf8'), ctx);
const soloSlugs = process.argv.slice(2);
const proyectos = ctx.window.PROYECTOS.filter(p => !soloSlugs.length || soloSlugs.includes(p.slug));

/* CSS para ocultar banners de cookies, modales y widgets flotantes comunes */
const HIDE_CSS = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [class*="gdpr" i], [aria-modal="true"], .modal-backdrop,
  iframe[src*="intercom"], iframe[src*="crisp"], #hubspot-messages-iframe-container
  { display: none !important; }
  *, *::before, *::after { animation-play-state: paused !important; caret-color: transparent !important; }
`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function capturar(browser, p) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, colorScheme: p.capturaTema || 'light' });
  try {
    await page.goto(p.captura || p.landing, { waitUntil: 'networkidle', timeout: TIMEOUT });
    await page.waitForTimeout(1500);

    /* Intentar cerrar banners con botones típicos antes de ocultarlos */
    for (const txt of ['Aceptar', 'Accept', 'Entendido', 'Cerrar', 'OK']) {
      const btn = page.getByRole('button', { name: txt, exact: true });
      if (await btn.count().catch(() => 0)) await btn.first().click({ timeout: 1000 }).catch(() => {});
    }
    await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const png = await page.screenshot({ fullPage: false });
    const file = path.join(OUT, `${p.slug}.webp`);
    await sharp(png).webp({ quality: 80 }).toFile(file);
    return { ok: true, kb: Math.round(fs.statSync(file).size / 1024) };
  } finally {
    await page.close();
  }
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const resultados = [];

for (const p of proyectos) {
  let res;
  try {
    res = await capturar(browser, p);
  } catch (e1) {
    console.log(`  ${p.slug}: falló (${e1.message.split('\n')[0]}), reintento en 20 s…`);
    await sleep(RETRY_DELAY);
    try { res = await capturar(browser, p); }
    catch (e2) { res = { ok: false, error: e2.message.split('\n')[0] }; }
  }
  resultados.push({ slug: p.slug, url: p.captura || p.landing, ...res });
  console.log(res.ok ? `✓ ${p.slug} (${res.kb} KB)` : `✗ ${p.slug}: ${res.error}`);
}

await browser.close();

const fallidos = resultados.filter(r => !r.ok);
console.log(`\n${resultados.length - fallidos.length}/${resultados.length} capturas OK.`);
if (fallidos.length) {
  console.log('Sin captura (la tarjeta muestra las iniciales):', fallidos.map(f => f.slug).join(', '));
  process.exitCode = 1;
}
