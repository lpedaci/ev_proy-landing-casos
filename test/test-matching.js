/* ═══════════════════════════════════════════════════════════════
   Hopper · pruebas

   Dos suites:

   1. MATCHING · veinte consultas escritas como las escribe un
      estudiante (sin acentos, abreviadas, con errores de tipeo).
      Cada una tiene que caer en una entrada concreta de faq.json
      o en el fallback.

   2. SEÑALES · qué dispara el aviso de netiqueta y qué dispara la
      respuesta con centros de ayuda. Importan tanto los casos que
      SÍ tienen que saltar como los que NO: "matar el proceso" y
      "computadora" no pueden confundirse con una señal.

   Se corre de dos maneras:
     - navegador · abrir test/test-matching.html (servido, no file://)
     - terminal  · node test/test-matching.js
   ═══════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var FALLBACK = '__fallback__';
  var SIN_SENAL = '(ninguna)';

  var CASOS = [
    { consulta: 'q es el rnf',                                        publico: 'estudiante', espera: 'siglas' },
    { consulta: 'cuantas secciones son',                              publico: 'estudiante', espera: 'indice-base' },
    { consulta: 'para cuando hay q entregar',                         publico: 'estudiante', espera: 'notas-fechas-tramites' },
    { consulta: 'en q formato hay q entregar',                        publico: 'estudiante', espera: 'formato-entrega' },
    { consulta: 'que es e01',                                         publico: 'estudiante', espera: 'etapa-e01' },
    { consulta: 'etapa 4 q se hace',                                  publico: 'estudiante', espera: 'etapa-e04' },
    { consulta: 'diferencia entre requisito funcional y no funcional', publico: 'estudiante', espera: 'rf-vs-rnf' },
    { consulta: 'donde veo un ejemplo de documentacion',              publico: 'estudiante', espera: 'ejemplo-sensoroffice' },
    { consulta: 'que significa lim',                                  publico: 'estudiante', espera: 'siglas' },
    { consulta: 'product backlog',                                    publico: 'estudiante', espera: 'product-backlog' },
    { consulta: 'que son los lineamientos futuros',                   publico: 'estudiante', espera: 'lineamientos-futuros' },
    { consulta: 'si el proyecto cambia a mitad de camino q hago',     publico: 'estudiante', espera: 'proyecto-cambia' },
    { consulta: 'que se evalua de la documantacion',                  publico: 'estudiante', espera: 'evaluacion-documentacion' },
    { consulta: 'cuando se usa el estandar extendido',                publico: 'estudiante', espera: 'estandar-extendido' },
    { consulta: 'quien da la materia',                                publico: 'visitante',  espera: 'quien-dicta' },
    { consulta: 'de que trata el caso de valeria',                    publico: 'visitante',  espera: 'caso-valeria' },
    { consulta: 'por que hay dos casos',                              publico: 'visitante',  espera: 'por-que-dos-casos' },
    { consulta: 'por q te llamas hopper',                             publico: 'visitante',  espera: 'quien-es-hopper' },
    { consulta: 'me podes hacer el tp',                               publico: 'estudiante', espera: FALLBACK },
    { consulta: 'cuanto sale un kilo de asado',                       publico: 'visitante',  espera: FALLBACK }
  ];

  var CASOS_SENALES = [
    /* Tienen que saltar. */
    { consulta: 'me quiero matar',                        espera: 'crisis' },
    { consulta: 'no quiero seguir viviendo',              espera: 'crisis' },
    { consulta: 'pienso en cortarme',                     espera: 'crisis' },
    { consulta: 'me pegan en casa',                       espera: 'violencia' },
    { consulta: 'me hacen bullying en el curso',          espera: 'violencia' },
    { consulta: 'este boludo de rnf no lo entiendo',      espera: 'netiqueta' },
    { consulta: 'la concha de tu madre',                  espera: 'netiqueta' },
    { consulta: 'que mierda es el isw',                   espera: 'netiqueta' },

    /* No pueden saltar: son vocabulario técnico normal de la materia.
       Un falso positivo acá es peor que no detectar el insulto. */
    { consulta: 'que es el rnf',                          espera: SIN_SENAL },
    { consulta: 'como mato el proceso del servidor',      espera: SIN_SENAL },
    { consulta: 'tengo que matar el localhost',           espera: SIN_SENAL },
    { consulta: 'necesito una computadora para el proyecto', espera: SIN_SENAL },
    { consulta: 'el sensor mide la concentracion de co2', espera: SIN_SENAL },
    { consulta: 'el cliente me putea si no funciona',     espera: SIN_SENAL },
    { consulta: 'hay que documentar el hurto de stock',   espera: SIN_SENAL }
  ];

  /* Corre los casos de matching contra un motor ya armado y devuelve
     el detalle de cada uno, con puntaje y margen respecto del umbral. */
  function correr(Hopper, entradas) {
    var motor = Hopper.crearMotor(entradas);
    var umbral = Hopper.UMBRAL_MINIMO;

    var resultados = CASOS.map(function (caso) {
      var res = motor.buscar(caso.consulta, caso.publico);
      var obtenido = res.entrada ? res.entrada.id : FALLBACK;
      var primero = res.ranking[0] || { puntaje: 0 };
      var segundo = res.ranking[1] || { puntaje: 0 };
      return {
        consulta: caso.consulta,
        publico: caso.publico,
        espera: caso.espera,
        obtenido: obtenido,
        ok: obtenido === caso.espera,
        puntaje: primero.puntaje,
        /* Distancia al umbral: si es chica, el caso está al filo. */
        margen: primero.puntaje - umbral,
        /* Distancia al segundo: si es chica, hay dos entradas peleando. */
        ventaja: primero.puntaje - segundo.puntaje
      };
    });

    var fallos = resultados.filter(function (r) { return !r.ok; });
    return {
      umbral: umbral,
      total: resultados.length,
      aprobados: resultados.length - fallos.length,
      fallos: fallos,
      resultados: resultados
    };
  }

  /* Corre los casos de señales. No hay puntaje: acierta o no. */
  function correrSenales(Hopper, senales) {
    var detectar = Hopper.crearDetector(senales);

    var resultados = CASOS_SENALES.map(function (caso) {
      var senal = detectar(caso.consulta);
      var obtenido = senal ? senal.id : SIN_SENAL;
      return {
        consulta: caso.consulta,
        espera: caso.espera,
        obtenido: obtenido,
        ok: obtenido === caso.espera,
        /* Un falso positivo (saltó donde no debía) es el error caro. */
        falsoPositivo: caso.espera === SIN_SENAL && obtenido !== SIN_SENAL
      };
    });

    var fallos = resultados.filter(function (r) { return !r.ok; });
    return {
      total: resultados.length,
      aprobados: resultados.length - fallos.length,
      fallos: fallos,
      resultados: resultados
    };
  }

  var api = {
    CASOS: CASOS,
    CASOS_SENALES: CASOS_SENALES,
    FALLBACK: FALLBACK,
    SIN_SENAL: SIN_SENAL,
    correr: correr,
    correrSenales: correrSenales
  };
  global.HopperTest = api;
  if (typeof module === 'object' && module.exports) module.exports = api;

  /* ── Ejecución directa desde la terminal ── */
  if (typeof require === 'function' && typeof module === 'object' && require.main === module) {
    var fs = require('fs');
    var path = require('path');
    var raiz = path.join(__dirname, '..');
    var Hopper = require(path.join(raiz, 'assets', 'hopper.js'));
    var leer = function (rel) {
      return JSON.parse(fs.readFileSync(path.join(raiz, rel), 'utf8'));
    };

    var pad = function (t, n) { t = String(t); return t + ' '.repeat(Math.max(0, n - t.length)); };

    var informe = correr(Hopper, leer('data/faq.json'));
    console.log('\nMATCHING · umbral ' + informe.umbral.toFixed(2) + '\n');
    console.log(pad('', 5) + pad('consulta', 50) + pad('esperado', 26) + pad('obtenido', 26) + pad('punt.', 7) + 'vent.');
    informe.resultados.forEach(function (r) {
      console.log(
        pad(r.ok ? 'ok   ' : 'FAIL ', 5) +
        pad(r.consulta, 50) + pad(r.espera, 26) + pad(r.obtenido, 26) +
        pad(r.puntaje.toFixed(3), 7) + r.ventaja.toFixed(3)
      );
    });
    console.log('\n' + informe.aprobados + '/' + informe.total + ' correctas.');

    var senales = correrSenales(Hopper, leer('data/senales.json'));
    console.log('\nSEÑALES · netiqueta y centros de ayuda\n');
    console.log(pad('', 5) + pad('consulta', 50) + pad('esperado', 14) + 'obtenido');
    senales.resultados.forEach(function (r) {
      console.log(
        pad(r.ok ? 'ok   ' : (r.falsoPositivo ? 'FALSO' : 'FAIL '), 5) +
        pad(r.consulta, 50) + pad(r.espera, 14) + r.obtenido
      );
    });
    console.log('\n' + senales.aprobados + '/' + senales.total + ' correctas.');

    var totalFallos = informe.fallos.length + senales.fallos.length;
    if (totalFallos) {
      console.log('\n' + totalFallos + ' caso(s) fallando.');
    }
    process.exit(totalFallos ? 1 : 0);
  }

})(typeof window !== 'undefined' ? window : globalThis);
