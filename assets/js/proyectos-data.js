/**
 * Proyectos finalizados 2026 · datos
 * Fuente única: la usan assets/js/proyectos.js (tarjetas) y scripts/capturas.mjs (capturas).
 *
 * Para agregar o corregir un proyecto, editá este array.
 * - curso: "A" o "B"
 * - links: solo los que tengan URL web pública y funcionando.
 *   No se publican Demo, GitHub ni archivos alojados en github.com (acceso a los sistemas y al código): se cuidan los proyectos.
 * - captura: assets/proyectos/<slug>.webp (si falta, se muestran las iniciales)
 * - capturaTema: 'dark' para capturar la versión oscura de la landing (opcional)
 */
window.PROYECTOS = [
  /* Orden de presentación (carrusel): se alternan 7mo INFO A y 7mo INFO B */
  {
    slug: 'tres-reyes',
    nombre: 'Logística Tres Reyes',
    alias: 'TruckRoute',
    iniciales: 'TR',
    curso: 'A',
    rubro: 'Fraccionadora de aceitunas y encurtidos',
    descripcion: 'Sistema de logística con hojas de ruta para la distribución de una fraccionadora de aceitunas y encurtidos.',
    tipo: ['Software', 'Web'],
    integrantes: ['Crupi', 'García', 'Silva', 'Traverso', 'Varela'],
    landing: 'https://varelajoaquin2007-rgb.github.io/Landing-Page-Tres-Reyes/',
    linktree: 'https://linktr.ee/proyectointermiami',
    links: [
      { label: 'Documentación', url: 'https://varelajoaquin2007-rgb.github.io/Documentacion_Tres-Reyes/' },
      { label: 'FAQ', url: 'https://varelajoaquin2007-rgb.github.io/FAQs_Tresreyes/' }
    ]
  },
  {
    slug: 'vacunatorio',
    nombre: 'SGV - Sistema de Gestión de Vacunas',
    iniciales: 'SGV',
    curso: 'B',
    rubro: 'Salud pública · CAPS San José Obrero',
    descripcion: 'Sistema de gestión de vacunatorio para un centro de atención primaria, con roles y vistas por perfil, pensado para escalar a otros CAPS.',
    tipo: ['Software', 'Web'],
    integrantes: ['Aloia A.', 'Aloia M.', 'Cosimi', 'Dellepiane'],
    landing: 'https://linktree-production-af90843c.up.railway.app/landing/',
    linktree: null,
    links: [
      { label: 'Presentación', url: 'https://cosimitomas.github.io/SGV-Presentacion-/' }
    ]
  },
  {
    slug: 'smartrack',
    nombre: 'SmartRACK',
    iniciales: 'SR',
    curso: 'A',
    rubro: 'Aucatek · Infraestructura B2B',
    descripcion: 'Sistema de gestión para una ePDU autónoma (rack inteligente) con tres roles de usuario y registro completo de cambios.',
    tipo: ['Hardware + Software'],
    integrantes: ['Hermosilla', 'Martini', 'Morgado', 'Spinelli'],
    landing: 'https://ezemorgado07.github.io/smartrack-landing/',
    linktree: null,
    links: [
      { label: 'Documentación', url: 'https://ezemorgado07.github.io/smartrack/smartrack-docs/' },
      { label: 'FAQ', url: 'https://ezemorgado07.github.io/faq-smartrack/' }
    ]
  },
  {
    slug: 'ecr',
    nombre: 'ECR',
    alias: 'Sistema para Estudio Contable',
    iniciales: 'ECR',
    curso: 'B',
    rubro: 'Estudio contable',
    descripcion: 'Sistema de gestión para un estudio contable con roles y vistas diferenciadas por tipo de usuario.',
    tipo: ['Software', 'Web'],
    integrantes: ['Di Menna', 'Ippolito', 'Loureiro', 'Pereyra'],
    landing: 'https://ecr-landing-page.up.railway.app/',
    capturaTema: 'dark',   /* la landing tiene versión oscura: se captura con esa */
    linktree: 'https://linktree-estudiocontable.up.railway.app/',
    links: [
      { label: 'Documentación', url: 'https://proyecto2026-estudio.github.io/Documentacion/' },
      { label: 'Manual', url: 'https://proyecto2026-estudio.github.io/DocumentacionEC/Manual_Uso_ECR.pdf' },
      { label: 'FAQ', url: 'https://proyecto2026-estudio.github.io/Documentacion/#faq' }
    ]
  },
  {
    slug: 'cannon',
    nombre: 'CANNON',
    iniciales: 'CA',
    curso: 'A',
    rubro: 'Comercio minorista (red de sucursales)',
    descripcion: 'Seguimiento del desempeño comercial y la experiencia de venta, con encuestas, roles por sucursal y dashboards para detectar necesidades de capacitación.',
    tipo: ['Software', 'Web'],
    integrantes: ['Gonzalez Pacheco', 'Rearte', 'Soto', 'Waisbein'],
    landing: 'https://proyectocannon.alwaysdata.net/landing/index.html',
    linktree: null,
    links: []
  },
  {
    slug: 'rutas-eficientes',
    nombre: 'Rutas Eficientes',
    alias: 'Logística GEO',
    iniciales: 'RE',
    curso: 'B',
    rubro: 'Empresa de logística',
    descripcion: 'Digitalización de los procesos administrativos de una empresa de logística, con gestión móvil de viajes, georreferencia y confirmación de entrega del cliente.',
    tipo: ['Software', 'Web'],
    integrantes: ['Abraham', 'Bravo Cejas', 'Cerredo', 'Dutra', 'Mascioli'],
    landing: 'https://nayitoo.github.io/RE-doc/landing/',
    linktree: 'https://rutas-eficientes.taplink.bio/',
    links: [
      { label: 'Documentación', url: 'https://nayitoo.github.io/RE-doc/' },
      { label: 'Manual', url: 'https://nayitoo.github.io/RE-doc/manual/' },
      { label: 'Guía rápida', url: 'https://nayitoo.github.io/RE-doc/quickstart/' }
    ]
  },
  {
    slug: 'pulso1',
    nombre: 'Pulso1',
    iniciales: 'P1',
    curso: 'A',
    rubro: 'Gimnasio',
    descripcion: 'Sistema web para un gimnasio con gestión de alumnos y créditos de clases, con manuales separados para administrador y alumno.',
    tipo: ['Software', 'Web'],
    integrantes: ['Bosio', 'Goyechea'],
    landing: 'https://juanjoybeto.github.io/Pulso-landing/',
    linktree: 'https://linktr.ee/Pulso1',
    links: [
      { label: 'Documentación', url: 'https://juanjoybeto.github.io/Pulso-documentacion/' },
      { label: 'Manual admin', url: 'https://newlogin.alwaysdata.net/manual_administrador.html' },
      { label: 'Manual alumno', url: 'https://newlogin.alwaysdata.net/manual_alumno.html' },
      { label: 'FAQ', url: 'https://newlogin.alwaysdata.net/faq.html' }
    ]
  },
  {
    slug: 'telar-cit',
    nombre: 'Automatización de Telar',
    alias: 'CIT',
    iniciales: 'CIT',
    curso: 'B',
    rubro: 'Industria textil',
    descripcion: 'Control de inserción de trama para telares industriales, con prototipo sobre ESP32 y aplicación web de monitoreo.',
    tipo: ['Hardware + Software', 'IoT'],
    integrantes: ['Ferrando', 'Iannone', 'Lede', 'Manfredo', 'Montenegro'],
    landing: 'https://manfredojuanignacio08-prog.github.io/Landing_Page_CIT/',
    linktree: 'https://manfredojuanignacio08-prog.github.io/Linktree_CIT/',
    links: [
      { label: 'Documentación', url: 'https://manfredojuanignacio08-prog.github.io/Documentacion-AutotizaciondeTelar/' },
      { label: 'Manual', url: 'https://manfredojuanignacio08-prog.github.io/Manuales_de_Uso_CIT/' }
    ]
  },
  {
    slug: 'altoque',
    nombre: 'Al.toque',
    iniciales: 'AT',
    curso: 'A',
    rubro: 'Servicios de oficios',
    descripcion: 'Plataforma que conecta a personas que necesitan un trabajo de oficio con profesionales disponibles.',
    tipo: ['Software', 'Web'],
    integrantes: ['Begnes', 'Ledesma', 'Montes', 'Remeeriee', 'Vargas'],
    landing: 'https://altoque-landing.vercel.app/',
    linktree: null,
    links: [
      { label: 'Manual', url: 'https://altoque-manual.vercel.app/' },
      { label: 'FAQ', url: 'https://altoque-faq.vercel.app/' }
    ]
  },
  {
    slug: 'tadin',
    nombre: 'TADIN',
    iniciales: 'TA',
    curso: 'B',
    rubro: 'Pintura electrostática sobre chapa',
    descripcion: 'Digitalización y automatización de procesos para una empresa de esmaltado, con control de acceso por huella y tarjetas NFC.',
    tipo: ['Hardware + Software'],
    integrantes: ['Bravo', 'Camino', 'Niello', 'Perri', 'Quintana'],
    landing: 'https://cataquintana11.github.io/landing-page/',
    linktree: null,
    links: [
      { label: 'Documentación', url: 'https://mianiello.github.io/Documentacion-TA-DIN/' },
      { label: 'Presentación', url: 'https://mianiello.github.io/ETAPA04-TADIN/' },
      { label: 'Sitio', url: 'http://tadin.com.ar/' }
    ]
  },
  {
    slug: 'tandar',
    nombre: 'TANDAR-CNEA',
    alias: 'Gestión de turnos experimentales',
    iniciales: 'TC',
    curso: 'A',
    rubro: 'Ciencia y tecnología · CNEA',
    descripcion: 'Plataforma web que reemplaza la planilla de Excel para solicitar, revisar y aprobar turnos experimentales, con etapas para la línea experimental, Radioprotección y administración.',
    tipo: ['Software', 'Web'],
    integrantes: ['Fernandez Lopez', 'Morán'],
    landing: 'https://lautaro-fernandez6907-byte.github.io/Landingpage/',
    linktree: null,
    links: []
  },
  {
    slug: 'stellantis-sga',
    nombre: 'Stellantis · SGA',
    iniciales: 'SGA',
    curso: 'B',
    rubro: 'Industria automotriz · Logística y abastecimiento',
    descripcion: 'Sistema de gestión de abastecimiento que importa planillas de stock y genera reportes de materiales críticos y quiebres de stock.',
    tipo: ['Software'],
    integrantes: ['Arena', 'Lede', 'Pascuzzi', 'Serlik', 'Tosi'],
    landing: 'https://landing-sga.vercel.app/',
    linktree: 'https://linktr.ee/sgaproyecto',
    links: [
      { label: 'Documentación', url: 'https://landing-sga.vercel.app/documentation.html' },
      { label: 'Manual', url: 'https://landing-sga.vercel.app/user-manual.html' }
    ]
  },
  {
    slug: 'centro-molisano',
    nombre: 'Centro Molisano Monforte',
    alias: 'Sistema de Gestión Digital',
    iniciales: 'CM',
    curso: 'A',
    rubro: 'Club social · Villa Bosch',
    descripcion: 'Sistema de gestión para un club: padrón de socios, carnet digital con QR, cuotas automáticas, pagos con Mercado Pago y reservas de salones.',
    tipo: ['Software', 'Web'],
    integrantes: ['Laborde', 'Carmele', 'Damario', 'Alonso J.', 'Alonso L.'],
    landing: 'https://proyectogrupo123456-cloud.github.io/Centro-Molisano-Conforte-landing-page/',
    linktree: null,
    links: []
  },
  {
    slug: 'datalogger',
    nombre: 'Datalogger',
    iniciales: 'DL',
    curso: 'B',
    rubro: 'INTI · Área de robótica',
    descripcion: 'Datalogger que registra la temperatura de los sensores de un robot y envía alertas en forma inalámbrica mediante MQTT.',
    tipo: ['Hardware + Software', 'IoT'],
    integrantes: ['Puleo', 'Risoli', 'Varilni', 'Dabbah'],
    landing: 'https://fr2311.github.io/landingDatalogger/',
    linktree: 'https://linktr.ee/Datalogger',
    links: [
      { label: 'Documentación', url: 'https://fr2311.github.io/landingDatalogger/documentacion.html' },
      { label: 'Manual', url: 'https://fr2311.github.io/landingDatalogger/manual.html' },
      { label: 'FAQ', url: 'https://fr2311.github.io/landingDatalogger/faq.html' }
    ]
  }
];
