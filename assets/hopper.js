/* ═══════════════════════════════════════════════════════════════
   Hopper · asistente de FAQ de Evaluación de Proyectos
   Instituto Leonardo Murialdo · 7mo Informática 2026

   Widget autocontenido. Se inyecta con una sola línea:
     <script src="assets/hopper.js" defer></script>

   Sin dependencias, sin build, sin localStorage, sin LLM.
   El contenido vive en data/faq.json; acá vive solamente el
   mecanismo de búsqueda y la interfaz.

   El archivo corre en dos contextos:
   - en el navegador, donde monta la burbuja y el panel;
   - en Node, donde solo exporta el motor de búsqueda para que
     test/test-matching.js pueda calibrar el umbral.
   ═══════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ── CONSTANTES DE CALIBRACIÓN ────────────────────────────────
     Lo único que hay que tocar para ajustar qué tan exigente es
     el matching. Después de cambiar cualquiera de estas, correr
     test/test-matching.html (o `node test/test-matching.js`). */

  /* Puntaje mínimo (0 a 1) para dar una respuesta en vez del
     fallback. Más alto = más fallbacks, menos respuestas erradas. */
  var UMBRAL_MINIMO = 0.40;

  /* Achata el puntaje crudo al rango 0-1: puntaje = c / (c + SATURACION).
     Subirlo hace que haga falta más evidencia para el mismo puntaje. */
  var SATURACION = 20;

  /* Cuánto pesa cada tipo de coincidencia (1 = coincidencia plena). */
  var FACTORES = {
    fraseExacta: 1.00,  // la keyword de varias palabras está tal cual en la consulta
    fraseLaxa:   0.65,  // están todas sus palabras, pero separadas
    tokenExacto: 1.00,  // una palabra de la consulta es la keyword
    prefijo:     0.80,  // "seccion" contra "secciones"
    tipeo:       0.40   // una letra de diferencia ("documantacion")
  };

  /* Piso de longitud para arriesgar una corrección de tipeo.
     Por debajo de 7 el riesgo supera al beneficio: "cuanto" y
     "cuando" difieren en una sola letra y no significan lo mismo. */
  var LARGO_MIN_TIPEO = 7;

  /* Cuántas sugerencias muestra el fallback y cuántos chips el panel. */
  var SUGERENCIAS_FALLBACK = 3;
  var CHIPS_VISIBLES = 5;

  /* Pausa antes de cada respuesta, con los tres puntitos. No es para
     fingir que piensa: da tiempo a leer lo que uno mismo escribió y
     evita que el hilo pegue un salto de golpe. Por debajo de unos
     600 ms la animación pasa desapercibida y la respuesta aparece
     de golpe. */
  var DEMORA_RESPUESTA_MS = 700;

  /* Cuánto queda la burbuja mostrando "Hopper" al cargar la página
     antes de contraerse al logo solo. */
  var PRESENTACION_MS = 3200;

  /* ── TEXTOS FIJOS ─────────────────────────────────────────────
     Se escriben una sola vez acá y no se reformulan en el código. */

  var TEXTOS = {
    nombre: 'Hopper',
    rol: 'Asistente de Evaluación de Proyectos',
    abrir: 'Abrir el asistente Hopper',
    cerrar: 'Cerrar el asistente',
    saludo: 'Hola, soy Hopper, la asistente de Evaluación de Proyectos. Me llamo así por Grace Hopper, que insistió en que un programa tiene que poder ser leído por alguien que no lo escribió (más o menos de eso se trata documentar bien). ¿En qué te ayudo?',
    publicoEstudiante: 'Soy estudiante de la materia',
    publicoVisitante: 'Quiero conocer la materia',
    cambiarPublico: 'Cambiar público',
    cambiarPublicoAyuda: 'Cambiar de público sin recargar la página',
    publicoCambiado: '¿Desde dónde preferís que te responda?',
    listoEstudiante: 'Perfecto. Preguntame sobre las etapas, la documentación o la entrega. Podés escribir o tocar una de estas:',
    listoVisitante: 'Genial. Te cuento de qué trata la materia y los dos casos de estudio. Podés escribir o tocar una de estas:',
    fallback: 'Eso no lo tengo cargado. Puede que te sirva alguna de estas:',
    fallbackCierre: 'Si no, consultalo en clase o escribile directo a la profe.',
    vacio: 'Escribí tu pregunta y te busco la respuesta.',
    placeholder: 'Escribí tu pregunta',
    placeholderBloqueado: 'Elegí una opción para empezar',
    enviar: 'Enviar la pregunta',
    hilo: 'Conversación con Hopper',
    verEnElSitio: 'Ver en el sitio',
    pie: 'Hopper es un asistente automática de la cursada. Al usar Hopper aceptás las netiquetas y el código de ética.',
    errorCarga: 'No pude cargar las preguntas (data/faq.json). Si abriste el sitio con doble clic sobre el archivo, el navegador bloquea la lectura: probá con un servidor local o con la versión publicada.'
  };

  /* Marca de Hopper: globo de diálogo con un destello (asistente que
     responde). Es el logo con el que se la identifica en el sitio: va
     en la burbuja y en la cabecera del panel. SVG en linea, sin archivo
     de imagen, hereda el color del contenedor y se lee nitido a 20px. */
  var LOGO = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true" focusable="false">' +
    '<path d="M7 7.5h18a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5H14l-5.5 4.5V22.5H7' +
    'A2.5 2.5 0 0 1 4.5 20V10A2.5 2.5 0 0 1 7 7.5z"/>' +
    '<path d="M16 10.6c.4 2.1 1.6 3.3 3.7 3.7-2.1.4-3.3 1.6-3.7 3.7-.4-2.1-1.6-3.3-3.7-3.7' +
    ' 2.1-.4 3.3-1.6 3.7-3.7z" fill="currentColor" stroke-width="1.2"/>' +
    '</svg>';

  /* Palabras que no aportan a la búsqueda. Se descartan de la
     consulta antes de puntuar; las frases sí las conservan, porque
     "por que hay dos casos" se reconoce entera. */
  var VACIAS = ['que', 'q', 'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'lo', 'le', 'les', 'de', 'del', 'al', 'a', 'en', 'y', 'e', 'o', 'u',
    'es', 'son', 'ser', 'sea', 'esta', 'este', 'esto', 'esa', 'ese', 'eso',
    'se', 'su', 'sus', 'mi', 'mis', 'me', 'te', 'nos', 'por', 'para', 'con',
    'sin', 'hay', 'ha', 'he', 'hola', 'buenas', 'buenos', 'dias', 'tardes',
    'gracias', 'porfa', 'favor', 'pero', 'mas', 'muy', 'tambien', 'tengo',
    'tiene', 'va', 'van', 'ir', 'ya', 'del', 'sobre', 'ah', 'eh', 'che'];

  /* ═══════════════════════════════════════════════════════════════
     MOTOR DE BÚSQUEDA
     Sin modelo de lenguaje: normalización, coincidencia de
     keywords y peso por longitud del término.
     ═══════════════════════════════════════════════════════════════ */

  /* Minúsculas, sin acentos, sin puntuación, espacios colapsados.
     Además unifica las variantes de etapa: e1 / E 01 / e01 -> e01. */
  function normalizar(texto) {
    return String(texto == null ? '' : texto)
      .toLowerCase()
      .replace(/\be\s*0?([1-6])\b/g, 'e0$1')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenizar(texto) {
    var t = normalizar(texto);
    return t ? t.split(' ') : [];
  }

  function tokensDeContenido(texto) {
    var vacias = VACIAS;
    return tokenizar(texto).filter(function (t) {
      return vacias.indexOf(t) === -1;
    });
  }

  /* Distancia de edición acotada a 1: solo nos interesa saber si
     hay como mucho un error de tipeo, no cuántos hay. */
  function difiereEnUna(a, b) {
    if (a === b) return false;
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    var i = 0, j = 0, fallas = 0;
    while (i < la && j < lb) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++fallas > 1) return false;
      if (la > lb) i++;
      else if (lb > la) j++;
      else { i++; j++; }
    }
    return fallas + (la - i) + (lb - j) <= 1;
  }

  /* Prepara las entradas una sola vez: normaliza keywords, calcula
     el peso de cada término (longitud x rareza) y deja todo listo
     para puntuar sin recalcular nada por consulta. */
  function crearMotor(entradas) {
    var lista = Array.isArray(entradas) ? entradas : [];
    var total = lista.length || 1;
    var apariciones = Object.create(null);

    var indice = lista.map(function (entrada) {
      var vistas = Object.create(null);
      var claves = (entrada.keywords || []).map(normalizar).filter(function (kw) {
        if (!kw || vistas[kw]) return false;
        vistas[kw] = true;
        return true;
      });
      claves.forEach(function (kw) {
        apariciones[kw] = (apariciones[kw] || 0) + 1;
      });
      return {
        entrada: entrada,
        claves: claves,
        pregunta: tokensDeContenido(entrada.pregunta)
      };
    });

    /* Peso del término: la longitud manda (un término largo es más
       específico), corregida por en cuántas entradas aparece. Una
       keyword compartida por media FAQ casi no distingue nada. */
    indice.forEach(function (item) {
      item.pesos = item.claves.map(function (kw) {
        var largo = Math.min(3 + kw.replace(/\s/g, '').length, 18);
        var rareza = Math.log(1 + total / apariciones[kw]);
        return largo * rareza;
      });
    });

    function puntuarEntrada(item, consultaNorm, contenido) {
      var crudo = 0;
      for (var i = 0; i < item.claves.length; i++) {
        var kw = item.claves[i];
        var factor = 0;
        if (kw.indexOf(' ') !== -1) {
          if (consultaNorm.indexOf(kw) !== -1) {
            factor = FACTORES.fraseExacta;
          } else {
            var partes = kw.split(' ');
            var todas = partes.every(function (p) {
              return contenido.indexOf(p) !== -1;
            });
            if (todas) factor = FACTORES.fraseLaxa;
          }
        } else {
          for (var j = 0; j < contenido.length; j++) {
            var tk = contenido[j];
            if (tk === kw) { factor = FACTORES.tokenExacto; break; }
            var largoComun = Math.min(tk.length, kw.length);
            if (largoComun >= 4 && (tk.indexOf(kw) === 0 || kw.indexOf(tk) === 0)) {
              factor = Math.max(factor, FACTORES.prefijo);
            } else if (largoComun >= LARGO_MIN_TIPEO && tk[0] === kw[0] && difiereEnUna(tk, kw)) {
              factor = Math.max(factor, FACTORES.tipeo);
            }
          }
        }
        if (factor > 0) crudo += factor * item.pesos[i];
      }

      /* Empate a favor de la entrada cuya pregunta usa las mismas
         palabras que la consulta. */
      for (var k = 0; k < contenido.length; k++) {
        if (item.pregunta.indexOf(contenido[k]) !== -1) crudo += 2;
      }

      return crudo;
    }

    /* Devuelve el ranking completo (para el fallback) y la entrada
       ganadora solo si supera el umbral. Nunca compone una respuesta
       a partir de varias entradas: o gana una, o es fallback. */
    function buscar(consulta, publico) {
      var consultaNorm = normalizar(consulta);
      var contenido = tokensDeContenido(consulta);
      var candidatos = indice.filter(function (item) {
        return !publico || item.entrada.publico === publico || item.entrada.publico === 'ambos';
      });

      var ranking = candidatos.map(function (item) {
        var crudo = contenido.length ? puntuarEntrada(item, consultaNorm, contenido) : 0;
        return {
          entrada: item.entrada,
          crudo: crudo,
          puntaje: crudo > 0 ? crudo / (crudo + SATURACION) : 0
        };
      }).sort(function (a, b) { return b.puntaje - a.puntaje; });

      var mejor = ranking[0];
      return {
        entrada: mejor && mejor.puntaje >= UMBRAL_MINIMO ? mejor.entrada : null,
        puntaje: mejor ? mejor.puntaje : 0,
        ranking: ranking
      };
    }

    function porPublico(publico) {
      return lista.filter(function (e) {
        return e.publico === publico || e.publico === 'ambos';
      });
    }

    return {
      buscar: buscar,
      porPublico: porPublico,
      entradas: lista,
      umbral: UMBRAL_MINIMO
    };
  }

  /* ═══════════════════════════════════════════════════════════════
     DETECTOR DE SEÑALES
     Corre antes que la búsqueda y no puntúa: acierta o no acierta.
     Una señal de crisis no puede depender de un umbral.

     Los términos de varias palabras se buscan como subcadena de la
     consulta normalizada; los de una sola palabra, como token exacto.
     Nunca como subcadena suelta: "puta" está dentro de "computadora".
     ═══════════════════════════════════════════════════════════════ */

  function crearDetector(senales) {
    var lista = (Array.isArray(senales) ? senales : []).map(function (senal) {
      var terminos = (senal.terminos || []).map(normalizar).filter(Boolean);
      return {
        id: senal.id,
        /* corta: la señal reemplaza la respuesta en vez de antecederla. */
        corta: senal.corta !== false,
        respuesta: senal.respuesta || '',
        frases: terminos.filter(function (t) { return t.indexOf(' ') !== -1; }),
        palabras: terminos.filter(function (t) { return t.indexOf(' ') === -1; })
      };
    });

    /* Devuelve la primera señal que coincide: el orden del archivo es
       el orden de prioridad (crisis antes que netiqueta). */
    return function detectar(consulta) {
      var norm = normalizar(consulta);
      if (!norm) return null;
      var tokens = norm.split(' ');
      for (var i = 0; i < lista.length; i++) {
        var s = lista[i];
        var coincide =
          s.frases.some(function (f) { return norm.indexOf(f) !== -1; }) ||
          s.palabras.some(function (p) { return tokens.indexOf(p) !== -1; });
        if (coincide) return s;
      }
      return null;
    };
  }

  var api = {
    normalizar: normalizar,
    tokenizar: tokenizar,
    tokensDeContenido: tokensDeContenido,
    crearMotor: crearMotor,
    crearDetector: crearDetector,
    UMBRAL_MINIMO: UMBRAL_MINIMO,
    TEXTOS: TEXTOS
  };

  /* En Node solamente interesa el motor: no hay interfaz que montar. */
  if (typeof document === 'undefined') {
    global.Hopper = api;
    if (typeof module === 'object' && module.exports) module.exports = api;
    return;
  }

  /* ═══════════════════════════════════════════════════════════════
     INTERFAZ
     ═══════════════════════════════════════════════════════════════ */

  var guion = document.currentScript;
  var origen = guion && guion.src ? guion.src : window.location.href;

  function rutaRelativa(relativa) {
    try { return new URL(relativa, origen).href; }
    catch (e) { return relativa; }
  }

  var CONFIG = {
    css: (guion && guion.getAttribute('data-css')) || rutaRelativa('hopper.css'),
    faq: (guion && guion.getAttribute('data-faq')) || rutaRelativa('../data/faq.json'),
    senales: (guion && guion.getAttribute('data-senales')) || rutaRelativa('../data/senales.json'),
    auto: !(guion && guion.getAttribute('data-auto') === 'no')
  };

  function crear(etiqueta, clase, texto) {
    var nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto != null) nodo.textContent = texto;
    return nodo;
  }

  function iniciar(opciones) {
    var conf = Object.assign({}, CONFIG, opciones || {});
    if (document.querySelector('.hopper-raiz')) return null;

    if (conf.css && !document.querySelector('link[data-hopper-css]')) {
      var hoja = document.createElement('link');
      hoja.rel = 'stylesheet';
      hoja.href = conf.css;
      hoja.setAttribute('data-hopper-css', '');
      document.head.appendChild(hoja);
    }

    var estado = {
      motor: null,
      detectar: null,
      publico: null,
      abierto: false,
      previo: null,
      presentacion: null
    };

    /* ── Armado del DOM ── */
    var raiz = crear('div', 'hopper-raiz');

    var burbuja = crear('button', 'hopper-burbuja');
    burbuja.type = 'button';
    burbuja.setAttribute('aria-haspopup', 'dialog');
    burbuja.setAttribute('aria-expanded', 'false');
    burbuja.setAttribute('aria-label', TEXTOS.abrir);
    var marcaBurbuja = crear('span', 'hopper-marca');
    marcaBurbuja.innerHTML = LOGO;
    burbuja.appendChild(marcaBurbuja);
    burbuja.appendChild(crear('span', 'hopper-burbuja-texto', TEXTOS.nombre));

    var panel = crear('div', 'hopper-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'hopper-titulo');
    panel.hidden = true;

    var cabecera = crear('header', 'hopper-cabecera');
    var identidad = crear('div', 'hopper-identidad');
    var marcaPanel = crear('span', 'hopper-marca');
    marcaPanel.innerHTML = LOGO;
    identidad.appendChild(marcaPanel);
    var nombres = crear('div');
    var titulo = crear('p', 'hopper-titulo', TEXTOS.nombre);
    titulo.id = 'hopper-titulo';
    nombres.appendChild(titulo);
    nombres.appendChild(crear('p', 'hopper-rol', TEXTOS.rol));
    identidad.appendChild(nombres);
    cabecera.appendChild(identidad);

    var acciones = crear('div', 'hopper-acciones');
    var btnPublico = crear('button', 'hopper-accion', TEXTOS.cambiarPublico);
    btnPublico.type = 'button';
    btnPublico.title = TEXTOS.cambiarPublicoAyuda;
    var btnCerrar = crear('button', 'hopper-accion hopper-cerrar', '✕');
    btnCerrar.type = 'button';
    btnCerrar.setAttribute('aria-label', TEXTOS.cerrar);
    acciones.appendChild(btnPublico);
    acciones.appendChild(btnCerrar);
    cabecera.appendChild(acciones);

    var hilo = crear('div', 'hopper-hilo');
    hilo.setAttribute('role', 'log');
    hilo.setAttribute('aria-live', 'polite');
    hilo.setAttribute('aria-label', TEXTOS.hilo);
    hilo.tabIndex = 0;

    var chips = crear('div', 'hopper-chips');
    chips.setAttribute('aria-label', 'Preguntas frecuentes');

    var formulario = crear('form', 'hopper-formulario');
    var campo = crear('input', 'hopper-campo');
    campo.type = 'text';
    campo.autocomplete = 'off';
    campo.placeholder = TEXTOS.placeholderBloqueado;
    campo.setAttribute('aria-label', TEXTOS.placeholder);
    campo.disabled = true;
    var btnEnviar = crear('button', 'hopper-enviar', '→');
    btnEnviar.type = 'submit';
    btnEnviar.setAttribute('aria-label', TEXTOS.enviar);
    btnEnviar.disabled = true;
    formulario.appendChild(campo);
    formulario.appendChild(btnEnviar);

    var pie = crear('p', 'hopper-pie', TEXTOS.pie);

    panel.appendChild(cabecera);
    panel.appendChild(hilo);
    panel.appendChild(chips);
    panel.appendChild(formulario);
    panel.appendChild(pie);
    raiz.appendChild(panel);
    raiz.appendChild(burbuja);
    document.body.appendChild(raiz);

    /* ── Mensajes ── */

    /* Salto seco al final, dos veces: la primera vale siempre (aunque
       la pestaña esté en segundo plano, donde requestAnimationFrame no
       corre) y la segunda recupera el caso en que el alto del globo
       cambia después de pintar (fuentes, imágenes).
       Nada de scroll suave: se cancela solo al enfocar el campo de
       texto y el hilo queda a mitad de camino. */
    function alFinal() {
      hilo.scrollTop = hilo.scrollHeight;
      requestAnimationFrame(function () { hilo.scrollTop = hilo.scrollHeight; });
    }

    function mensajeUsuario(texto) {
      var fila = crear('div', 'hopper-msj hopper-msj-usuario');
      fila.appendChild(crear('div', 'hopper-globo', texto));
      hilo.appendChild(fila);
      alFinal();
    }

    /* El HTML de las respuestas viene de data/faq.json, que es
       contenido propio del sitio; el texto del usuario nunca se
       inserta como HTML. */
    function mensajeHopper(html, extra, clase) {
      var fila = crear('div', 'hopper-msj hopper-msj-hopper');
      var globo = crear('div', 'hopper-globo' + (clase ? ' ' + clase : ''));
      globo.innerHTML = html;
      if (extra) globo.appendChild(extra);
      fila.appendChild(globo);
      hilo.appendChild(fila);
      alFinal();
      return globo;
    }

    /* Muestra los tres puntitos, espera y recien ahi responde. El
       indicador va con aria-hidden: lo que tiene que anunciar el
       lector de pantalla es la respuesta, no la espera. */
    function pensando(responder) {
      var fila = crear('div', 'hopper-msj hopper-msj-hopper');
      fila.setAttribute('aria-hidden', 'true');
      var globo = crear('div', 'hopper-globo hopper-puntos');
      globo.appendChild(crear('span'));
      globo.appendChild(crear('span'));
      globo.appendChild(crear('span'));
      fila.appendChild(globo);
      hilo.appendChild(fila);
      alFinal();
      setTimeout(function () {
        if (fila.parentNode) fila.parentNode.removeChild(fila);
        responder();
      }, DEMORA_RESPUESTA_MS);
    }

    function botonera(items, clase) {
      var caja = crear('div', 'hopper-opciones' + (clase ? ' ' + clase : ''));
      items.forEach(function (item) {
        var boton = crear('button', 'hopper-opcion', item.texto);
        boton.type = 'button';
        boton.addEventListener('click', function () {
          caja.querySelectorAll('.hopper-opcion').forEach(function (b) { b.disabled = true; });
          item.accion();
        });
        caja.appendChild(boton);
      });
      return caja;
    }

    function escapar(texto) {
      var d = document.createElement('div');
      d.textContent = texto;
      return d.innerHTML;
    }

    /* ── Turnos ── */

    function preguntarPublico(saludar) {
      mensajeHopper(
        '<p>' + escapar(saludar ? TEXTOS.saludo : TEXTOS.publicoCambiado) + '</p>',
        botonera([
          { texto: TEXTOS.publicoEstudiante, accion: function () { elegirPublico('estudiante'); } },
          { texto: TEXTOS.publicoVisitante, accion: function () { elegirPublico('visitante'); } }
        ], 'hopper-opciones-publico')
      );
    }

    function elegirPublico(publico) {
      estado.publico = publico;
      mensajeUsuario(publico === 'estudiante' ? TEXTOS.publicoEstudiante : TEXTOS.publicoVisitante);
      pensando(function () {
        mensajeHopper('<p>' + escapar(publico === 'estudiante'
          ? TEXTOS.listoEstudiante : TEXTOS.listoVisitante) + '</p>');
        pintarChips();
        campo.disabled = false;
        btnEnviar.disabled = false;
        campo.placeholder = TEXTOS.placeholder;
        campo.focus();
      });
    }

    /* Orden de vitrina: primero las entradas propias del público
       elegido y recién después las de "ambos" (si no, un estudiante
       ve como chips las preguntas pensadas para quien recién conoce
       la materia), y dentro de cada grupo, las destacadas primero. */
    function entradasOrdenadas() {
      if (!estado.motor || !estado.publico) return [];
      var disponibles = estado.motor.porPublico(estado.publico);
      var propias = disponibles.filter(function (e) { return e.publico === estado.publico; });
      var comunes = disponibles.filter(function (e) { return e.publico !== estado.publico; });
      var ordenadas = propias.concat(comunes);
      return ordenadas.filter(function (e) { return e.destacada; })
        .concat(ordenadas.filter(function (e) { return !e.destacada; }));
    }

    function pintarChips() {
      chips.textContent = '';
      var elegidas = entradasOrdenadas().slice(0, CHIPS_VISIBLES);
      elegidas.forEach(function (entrada) {
        var chip = crear('button', 'hopper-chip', entrada.pregunta);
        chip.type = 'button';
        /* El chip va a una linea y puede quedar recortado: el texto
           entero tiene que seguir disponible al pasar el mouse. */
        chip.title = entrada.pregunta;
        chip.addEventListener('click', function () { responderEntrada(entrada, entrada.pregunta); });
        chips.appendChild(chip);
      });
    }

    function enlaceDe(entrada) {
      if (!entrada.link) return null;
      var a = crear('a', 'hopper-enlace', TEXTOS.verEnElSitio + ' →');
      a.href = entrada.link;
      if (entrada.link.indexOf('#') === 0) {
        a.addEventListener('click', function () { cerrar(); });
      } else {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      return a;
    }

    function responderEntrada(entrada, textoUsuario) {
      if (textoUsuario) mensajeUsuario(textoUsuario);
      pensando(function () {
        mensajeHopper(entrada.respuesta, enlaceDe(entrada));
      });
    }

    /* Las tres más cercanas. Si ninguna puntuó (la consulta no tocó
       ni una keyword), el ranking está en orden de archivo y no dice
       nada: en ese caso se ofrecen las destacadas del público. */
    function masCercanas(ranking) {
      var vistas = Object.create(null);
      var lista = [];
      ranking.forEach(function (r) {
        if (r.puntaje > 0 && lista.length < SUGERENCIAS_FALLBACK && !vistas[r.entrada.id]) {
          vistas[r.entrada.id] = true;
          lista.push(r.entrada);
        }
      });
      entradasOrdenadas().forEach(function (e) {
        if (lista.length < SUGERENCIAS_FALLBACK && !vistas[e.id]) {
          vistas[e.id] = true;
          lista.push(e);
        }
      });
      return lista;
    }

    function responderFallback(ranking) {
      var cercanas = masCercanas(ranking).map(function (entrada) {
        return {
          texto: entrada.pregunta,
          accion: function () { responderEntrada(entrada, entrada.pregunta); }
        };
      });
      var globo = mensajeHopper('<p>' + escapar(TEXTOS.fallback) + '</p>', botonera(cercanas));
      globo.appendChild(crear('p', 'hopper-fallback-cierre', TEXTOS.fallbackCierre));
      alFinal();
    }

    function consultar(texto) {
      var limpio = String(texto || '').trim();
      if (!limpio) return;
      mensajeUsuario(limpio);

      if (!estado.motor) {
        pensando(function () {
          mensajeHopper('<p>' + escapar(TEXTOS.errorCarga) + '</p>', null, 'hopper-globo-senal');
        });
        return;
      }

      /* Las senales van primero y no pasan por el umbral: una consulta
         sobre crisis no puede quedar sujeta a cuanto puntua. */
      var senal = estado.detectar ? estado.detectar(limpio) : null;

      pensando(function () {
        if (senal) {
          mensajeHopper(senal.respuesta, null, 'hopper-globo-senal');
          if (senal.corta) return;
        }
        var res = estado.motor.buscar(limpio, estado.publico);
        if (res.entrada) mensajeHopper(res.entrada.respuesta, enlaceDe(res.entrada));
        else responderFallback(res.ranking);
      });
    }

    /* ── Apertura, cierre y foco ── */

    function focalizables() {
      return Array.prototype.filter.call(
        panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]'),
        function (n) { return n.offsetParent !== null || n === document.activeElement; }
      );
    }

    function abrir() {
      if (estado.abierto) return;
      estado.previo = document.activeElement;
      estado.abierto = true;
      panel.hidden = false;
      raiz.classList.add('hopper-abierto');
      contraerBurbuja();
      burbuja.setAttribute('aria-expanded', 'true');
      if (!hilo.childNodes.length) preguntarPublico(true);
      var destino = estado.publico ? campo : panel.querySelector('.hopper-opcion');
      (destino || btnCerrar).focus();
    }

    function cerrar() {
      if (!estado.abierto) return;
      estado.abierto = false;
      panel.hidden = true;
      raiz.classList.remove('hopper-abierto');
      burbuja.setAttribute('aria-expanded', 'false');
      /* El foco vuelve a donde estaba, y si eso ya no sirve (era el
         body, o el nodo desapareció), a la burbuja: nunca puede
         quedarse dentro de un panel oculto. */
      var destino = estado.previo;
      if (!destino || destino === document.body ||
          typeof destino.focus !== 'function' || !document.contains(destino)) {
        destino = burbuja;
      }
      destino.focus();
    }

    /* Pasa de pildora (logo + nombre) a solo logo. Se llama cuando
       se agota la presentacion o cuando el usuario ya abrio el panel:
       a esa altura la burbuja ya cumplio con presentarse. */
    function contraerBurbuja() {
      if (estado.presentacion) {
        clearTimeout(estado.presentacion);
        estado.presentacion = null;
      }
      burbuja.classList.remove('hopper-burbuja--extendida');
    }

    burbuja.addEventListener('click', function () {
      if (estado.abierto) cerrar(); else abrir();
    });
    btnCerrar.addEventListener('click', cerrar);

    btnPublico.addEventListener('click', function () {
      estado.publico = null;
      chips.textContent = '';
      campo.disabled = true;
      btnEnviar.disabled = true;
      campo.placeholder = TEXTOS.placeholderBloqueado;
      preguntarPublico(false);
      /* Los botones de público de turnos anteriores quedan deshabilitados
         en el hilo: el foco tiene que ir a los del turno nuevo, el último. */
      var grupos = hilo.querySelectorAll('.hopper-opciones-publico');
      var ultimo = grupos[grupos.length - 1];
      if (ultimo && ultimo.firstElementChild) ultimo.firstElementChild.focus();
    });

    formulario.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var texto = campo.value;
      campo.value = '';
      consultar(texto);
      campo.focus();
    });

    /* Esc cierra; Tab queda atrapado adentro del panel. */
    panel.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); cerrar(); return; }
      if (ev.key !== 'Tab') return;
      var nodos = focalizables();
      if (!nodos.length) return;
      var primero = nodos[0];
      var ultimo = nodos[nodos.length - 1];
      if (ev.shiftKey && document.activeElement === primero) {
        ev.preventDefault(); ultimo.focus();
      } else if (!ev.shiftKey && document.activeElement === ultimo) {
        ev.preventDefault(); primero.focus();
      }
    });

    /* ── Carga de datos ── */

    function leerJson(url) {
      return fetch(url, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' en ' + url);
        return r.json();
      });
    }

    leerJson(conf.faq)
      .then(function (datos) {
        estado.motor = crearMotor(datos);
        pintarChips();
      })
      .catch(function (err) {
        if (global.console) global.console.warn('[Hopper] ' + TEXTOS.errorCarga, err);
      });

    /* Las senales se cargan aparte: si faltan, el asistente sigue
       respondiendo preguntas, pero queda el aviso en consola porque
       la deteccion de crisis dejo de estar activa. */
    leerJson(conf.senales)
      .then(function (senales) { estado.detectar = crearDetector(senales); })
      .catch(function (err) {
        if (global.console) {
          global.console.warn('[Hopper] No pude cargar data/senales.json: la deteccion ' +
            'de netiqueta y de senales de crisis queda desactivada.', err);
        }
      });

    /* La burbuja se presenta con el nombre y despues se contrae al
       logo, que es lo que queda identificandola en el sitio. */
    if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      burbuja.classList.add('hopper-burbuja--extendida');
      estado.presentacion = setTimeout(contraerBurbuja, PRESENTACION_MS);
    }

    return { estado: estado, abrir: abrir, cerrar: cerrar, consultar: consultar };
  }

  api.iniciar = iniciar;
  api.config = CONFIG;
  global.Hopper = api;

  if (CONFIG.auto) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { iniciar(); });
    } else {
      iniciar();
    }
  }

})(typeof window !== 'undefined' ? window : globalThis);
