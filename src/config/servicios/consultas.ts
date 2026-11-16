import type { Guia } from "./guias";
import { getServicio, precioTexto } from "./estudio";

/**
 * GUÍAS "ANTES DE CONTRATAR" → /servicios/guias/<slug>
 * Apuntan a lo que busca un dueño cuando está pensando en tener web o aparecer en Google
 * ("cuánto cuesta una página web", "cómo hacer una página web para mi negocio", "cómo aparecer en Google Maps").
 * Misma forma que las guías de "cómo conseguir clientes": responden la pregunta de verdad y al final
 * cuentan cómo ayuda Solvion. Regla: nada de cifras inventadas; los únicos precios son los nuestros.
 */
const precio = (slug: string) => {
  const s = getServicio(slug);
  return s ? precioTexto(s) : "a consultar";
};

const web = precio("diseno-web");
const tienda = precio("tiendanube");
const seo = precio("posicionamiento-seo");

export const consultas: Guia[] = [
  {
    slug: "cuanto-cuesta-una-pagina-web",
    busqueda: "cuánto cuesta una página web",
    corto: "Cuánto cuesta una página web",
    emoji: "💲",
    titulo: "Cuánto cuesta una página web en Argentina: qué define el precio",
    descripcion: `Cuánto cuesta una página web en Argentina y qué cambia el precio: tipo de web, contenido, tienda, SEO, dominio y hosting. En Solvion, landing page ${web}.`,
    h1: "Cuánto cuesta una página web en Argentina",
    bajada: "El precio de una web depende de qué tiene que hacer: no cuesta lo mismo una página para que te escriban por WhatsApp que una tienda con cientos de productos. Acá tenés qué mirar para saber cuánto pagar y qué pedir que incluya.",
    intro: [
      `Una página web en Argentina puede costar muy distinto según el tipo de sitio, quién la hace y qué incluye. En Solvion, una landing page para un negocio arranca ${web}, una tienda Tiendanube ${tienda} y el posicionamiento SEO ${seo}, con precio cerrado en pesos antes de empezar.`,
      "Más que el número, importa qué estás comprando: si el diseño es a medida o una plantilla, si incluye los textos, si queda optimizada para Google, si el dominio queda a tu nombre y qué costos fijos vas a pagar cada año. Dos presupuestos con el mismo precio pueden incluir cosas muy distintas.",
    ],
    pasos: [
      { t: "Definí qué tiene que hacer la web", d: "Que te escriban por WhatsApp, que reserven, que compren online o que te encuentren en Google. Una landing de una página alcanza para lo primero; vender online necesita una tienda; aparecer en muchas búsquedas necesita varias páginas y SEO." },
      { t: "Elegí el tipo de sitio", d: "Landing page (una página larga con un objetivo), web institucional (varias secciones), tienda online (catálogo, carrito y pagos) o sistema a medida (turnos, presupuestos, gestión). Cada salto suma trabajo y precio." },
      { t: "Revisá qué incluye el presupuesto", d: "Diseño adaptado al celular, textos, fotos, botón de WhatsApp, formulario, mapa, preguntas frecuentes y SEO técnico base (títulos, descripciones, datos estructurados). Pedí la lista por escrito." },
      { t: "Preguntá por los costos fijos", d: "El dominio .com.ar se renueva todos los años y el hosting puede tener un costo mensual o anual. Las tiendas suman el plan de la plataforma y la comisión del medio de pago. Que no aparezcan después." },
      { t: "Confirmá que todo quede a tu nombre", d: "El dominio, la cuenta de la tienda y los accesos tienen que ser tuyos. Si mañana cambiás de proveedor, te llevás la web." },
      { t: "Pensá en lo que pasa después de publicar", d: "Cambios de precios, nuevas fotos, ajustes. Preguntá cuánto cuesta modificar algo y si podés hacerlo vos." },
    ],
    errores: [
      "Comparar solo el precio final sin ver qué incluye cada presupuesto.",
      "Pagar una web que no está pensada para el celular, que es desde donde entra la mayoría.",
      "Que el dominio quede a nombre del diseñador y no del negocio.",
      "Hacer una web linda que no aparece en Google ni lleva a WhatsApp.",
    ],
    solvion: `En Solvion trabajamos con precio cerrado en pesos: landing page ${web}, tienda Tiendanube ${tienda} y SEO ${seo}. Incluye diseño para celular, botón de WhatsApp, SEO técnico base y dominio a tu nombre. Te pasamos el presupuesto por WhatsApp con todo lo que incluye.`,
    links: [
      { href: "/precios", texto: "Precios de Solvion" },
      { href: "/diseno-web", texto: "Diseño de páginas web" },
      { href: "/tiendanube", texto: "Tiendas Tiendanube" },
      { href: "/vs/wix", texto: "Solvion vs. hacerla en Wix" },
    ],
    faqs: [
      { q: "¿Cuánto cuesta una página web para un negocio chico?", a: `Para un negocio que necesita que lo encuentren y le escriban, alcanza con una landing page. En Solvion arranca ${web}, con diseño a medida y botón de WhatsApp.` },
      { q: "¿Hay que pagar algo todos los meses?", a: "Una web informativa tiene costos fijos bajos: la renovación anual del dominio y el hosting. Una tienda online suma el plan de la plataforma y la comisión del medio de pago." },
      { q: "¿Conviene hacerla yo con Wix o una plantilla?", a: "Si tenés tiempo y no te importa tanto aparecer en Google, puede servir para empezar. Si querés que te encuentren y que el que entra te escriba, conviene una web hecha para eso." },
      { q: "¿Por qué hay presupuestos tan distintos?", a: "Porque incluyen cosas distintas: plantilla o diseño a medida, textos, SEO, cantidad de páginas, tienda y soporte. Compará qué incluye cada uno, no solo el número." },
    ],
  },
  {
    slug: "como-hacer-una-pagina-web-para-mi-negocio",
    busqueda: "cómo hacer una página web para mi negocio",
    corto: "Cómo hacer la web de tu negocio",
    emoji: "🛠️",
    titulo: "Cómo hacer una página web para mi negocio: paso a paso",
    descripcion: "Cómo hacer una página web para tu negocio paso a paso: objetivo, dominio, contenido, diseño para celular, WhatsApp, Google y qué conviene hacer vos y qué delegar.",
    h1: "Cómo hacer una página web para tu negocio",
    bajada: "Una buena web de negocio no necesita ser grande: necesita decir qué hacés, para quién, dónde y cuánto, y que escribirte sea un toque. Estos son los pasos, los hagas vos o los encargues.",
    intro: [
      "Para hacer una página web para tu negocio, primero definí qué querés que haga el visitante (escribirte, reservar o comprar), registrá un dominio a tu nombre, prepará el contenido (servicios, precios, fotos, ubicación) y armala pensando primero en el celular, con un botón de WhatsApp a la vista.",
      "Después hay que hacer que Google la encuentre: títulos claros, una página por servicio importante, la ficha de Google Business Profile conectada y el sitio dado de alta en Search Console. Una web que nadie encuentra no trae clientes, por linda que sea.",
    ],
    pasos: [
      { t: "Definí el objetivo", d: "Una sola acción principal: escribirte por WhatsApp, reservar un turno o comprar. Todo en la página tiene que llevar a eso." },
      { t: "Registrá tu dominio", d: "Un .com.ar con el nombre de tu negocio, registrado a tu nombre en NIC Argentina. Es lo que te da una dirección propia y profesional." },
      { t: "Prepará el contenido", d: "Qué hacés, para quién, en qué zona, precios o desde cuánto, horarios, fotos reales de tu trabajo y las preguntas que más te hacen. Es lo que más pesa para que te escriban." },
      { t: "Elegí cómo armarla", d: "Un constructor (Wix, plantillas) si querés hacerla vos; Tiendanube si vas a vender online; un diseño a medida si querés que cargue rápido, se vea profesional y esté pensada para Google." },
      { t: "Diseñala para el celular primero", d: "La mayoría entra desde el teléfono. Textos cortos, botones grandes, carga rápida y el WhatsApp siempre a mano." },
      { t: "Dejala lista para Google", d: "Un título que diga qué hacés y dónde, una descripción, una página por servicio, tu dirección y teléfono iguales en todos lados, y el sitio cargado en Google Search Console." },
      { t: "Publicala y compartila", d: "En la bio de Instagram, en tu ficha de Google, en el estado de WhatsApp y en las tarjetas. Cuantos más lugares lleven a tu web, mejor." },
    ],
    errores: [
      "Empezar por el diseño antes de tener claro el objetivo y el contenido.",
      "Llenar la web de texto genérico (\"somos líderes, calidad y compromiso\") en vez de explicar qué hacés.",
      "No poner ningún precio ni rango.",
      "Publicarla y no cargarla en Google ni compartirla.",
    ],
    solvion: `En Solvion hacemos la web de tu negocio de punta a punta: textos, diseño para celular, botón de WhatsApp, dominio a tu nombre y la base de SEO para que Google la encuentre. Landing page ${web}, con precio cerrado y todo por WhatsApp.`,
    links: [
      { href: "/diseno-web", texto: "Diseño de páginas web" },
      { href: "/posicionamiento-seo", texto: "Posicionamiento SEO" },
      { href: "/rubros", texto: "Qué necesita la web de tu rubro" },
      { href: "/vs/wordpress", texto: "Solvion vs. WordPress" },
    ],
    faqs: [
      { q: "¿Puedo hacer la web de mi negocio yo mismo?", a: "Sí, con un constructor como Wix o una plantilla. Lleva tiempo hacerla bien y que aparezca en Google; por eso muchos negocios prefieren encargarla y dedicarse a atender." },
      { q: "¿Cuánto tarda hacer una página web?", a: "Una landing page con el contenido listo puede estar en pocos días. Lo que más demora suele ser juntar fotos, textos y precios." },
      { q: "¿Qué tiene que tener la web de un negocio?", a: "Qué hacés, para quién y dónde, precios o desde cuánto, fotos reales, horarios, ubicación, preguntas frecuentes y un botón de WhatsApp visible en todo momento." },
      { q: "¿Necesito dominio propio?", a: "Conviene: un dominio .com.ar con tu nombre da confianza, es fácil de recordar y queda a tu nombre aunque cambies de proveedor." },
    ],
  },
  {
    slug: "como-aparecer-en-google-maps",
    busqueda: "cómo aparecer en Google Maps",
    corto: "Cómo aparecer en Google Maps",
    emoji: "📍",
    titulo: "Cómo aparecer en Google Maps con tu negocio (y salir más arriba)",
    descripcion: "Cómo aparecer en Google Maps con tu negocio: crear y verificar el Perfil de Empresa de Google, completarlo, conseguir reseñas y qué hace subir tu ficha en tu zona.",
    h1: "Cómo aparecer en Google Maps con tu negocio",
    bajada: "Cuando alguien busca \"cerca de mí\" o tu rubro en tu ciudad, Google muestra primero el mapa con tres negocios. Para estar ahí necesitás tu Perfil de Empresa de Google, completo, verificado y con reseñas.",
    intro: [
      "Para aparecer en Google Maps tenés que crear el Perfil de Empresa de Google (Google Business Profile), que es gratis: cargás el nombre, la categoría, la dirección o zona donde atendés, el teléfono y los horarios, y verificás que el negocio es tuyo. Una vez verificado, tu negocio puede aparecer en Maps y en el mapa de los resultados de Google.",
      "Aparecer es el primer paso; salir arriba depende de tres cosas que Google explica abiertamente: qué tan relevante es tu ficha para lo que buscan, qué tan cerca está de quien busca y qué tan conocido es tu negocio (reseñas, menciones, tu web). Lo que sí podés controlar es tener la ficha completa, activa y bien conectada con tu web.",
    ],
    pasos: [
      { t: "Creá tu Perfil de Empresa de Google", d: "Desde google.com/business, con la cuenta de Google del negocio. Si ya existe una ficha con tu nombre, reclamala en vez de crear otra." },
      { t: "Elegí bien la categoría principal", d: "Es lo que más pesa para aparecer en las búsquedas de tu rubro. Elegí la más específica (\"Barbería\", no \"Servicio de belleza\") y sumá categorías secundarias si corresponden." },
      { t: "Verificá el negocio", d: "Google pide verificar que el negocio es tuyo (por video, teléfono, mail o correo postal, según el caso). Sin verificación, la ficha no aparece o aparece limitada." },
      { t: "Completá todo", d: "Horarios, teléfono, WhatsApp, web, zona de servicio, servicios con precio, atributos y descripción. Una ficha completa da más motivos para mostrarte." },
      { t: "Subí fotos reales y seguí subiendo", d: "Fachada, interior, equipo y trabajos. Las fichas activas, con fotos nuevas y publicaciones, transmiten que el negocio está funcionando." },
      { t: "Conseguí reseñas y respondelas", d: "Pedile la reseña a cada cliente conforme con el link directo de tu ficha. Respondé todas: Google y los clientes lo ven." },
      { t: "Conectá la ficha con tu web", d: "Una web con el mismo nombre, dirección y teléfono que la ficha, que diga qué hacés y en qué zona, refuerza tu ficha en Maps. Sin web, competís en desventaja." },
    ],
    errores: [
      "Poner palabras clave en el nombre del negocio: Google puede suspender la ficha.",
      "Tener horarios o teléfono desactualizados.",
      "Crear fichas duplicadas en vez de reclamar la existente.",
      "Dejar reseñas sin responder, sobre todo las negativas.",
    ],
    solvion: `En Solvion configuramos y optimizamos tu Perfil de Empresa de Google como parte del SEO local (${seo}), y armamos la web que lo respalda, con tu nombre, dirección y teléfono iguales en todos lados, para que tu negocio tenga más chances de aparecer en Maps en tu zona.`,
    links: [
      { href: "/posicionamiento-seo", texto: "Posicionamiento SEO y SEO local" },
      { href: "/diseno-web", texto: "Diseño de páginas web" },
      { href: "/conseguir-clientes/para-mi-negocio", texto: "Cómo conseguir clientes para tu negocio" },
    ],
    faqs: [
      { q: "¿Aparecer en Google Maps es gratis?", a: "Sí. Crear y mantener el Perfil de Empresa de Google es gratis. Lo pago es solo si querés hacer publicidad para aparecer como anuncio." },
      { q: "¿Puedo aparecer en Maps si no tengo local?", a: "Sí. Si vas a domicilio o atendés en una zona, cargás tu zona de servicio y ocultás la dirección. Google te muestra en esa zona." },
      { q: "¿Cuánto tarda en aparecer mi negocio?", a: "Después de verificar, la ficha suele aparecer en pocos días. Salir entre los primeros de tu zona lleva más tiempo y depende de la competencia, las reseñas y tu web." },
      { q: "¿Por qué aparece otro negocio antes que el mío?", a: "Porque Google lo considera más relevante, más cerca de quien busca o más conocido. Completar la ficha, sumar reseñas y tener una web conectada son las palancas que podés mover." },
    ],
  },
];

export const getConsulta = (slug: string) => consultas.find((g) => g.slug === slug);
export const consultaPath = (g: Pick<Guia, "slug">) => `/servicios/guias/${g.slug}`;
