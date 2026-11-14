import type { Faq } from "@/config/types";
import { absoluteUrl } from "@/config/site";
import { ciudades, getCiudad, lugarConProvincia, type Ciudad, type Region } from "@/config/seo-content";
import { estudio, getServicio, precioTexto, servicioPath, servicios, type Servicio, type ServicioSlug } from "@/config/servicios/estudio";
import { getRubroServ, rubrosServ, type RubroServ } from "@/config/servicios/rubros";
import { casos } from "@/config/servicios/extras";

/**
 * SERVICIOS — rutas y textos.
 *   /servicios/<servicio>/<rubro>    solo si el rubro aplica al servicio (tienda / sistema)
 *   /servicios/<servicio>/<ciudad>   diseño web, SEO y Tiendanube × todas las ciudades
 * Volumen con criterio: cada página combina datos reales del rubro o de la ciudad
 * (barrios, región, horario cortado, temporada, casos) para decir algo propio.
 */

export const SERVICIOS_CON_CIUDAD: ServicioSlug[] = ["diseno-web", "posicionamiento-seo", "tiendanube"];

/** ¿Este rubro tiene página para este servicio? */
export function aplica(s: Servicio, r: RubroServ) {
  if (s.slug === "tiendanube") return !!r.tienda;
  if (s.slug === "sistemas-a-medida") return !!r.sistema;
  return true;
}

export const rubrosDe = (s: Servicio) => rubrosServ.filter((r) => aplica(s, r));
export const ciudadesDe = (s: Servicio) => (SERVICIOS_CON_CIUDAD.includes(s.slug) ? ciudades : []);
export const destinoPath = (s: Servicio, d: { slug: string }) => `${servicioPath(s)}/${d.slug}`;

export function serviciosRoutes() {
  return servicios.flatMap((s) => [...rubrosDe(s), ...ciudadesDe(s)].map((d) => ({ servicio: s.slug, destino: d.slug })));
}

export type Destino =
  | { tipo: "rubro"; servicio: Servicio; rubro: RubroServ }
  | { tipo: "ciudad"; servicio: Servicio; ciudad: Ciudad };

export function getDestino(servicio: string, destino: string): Destino | undefined {
  const s = getServicio(servicio);
  if (!s) return undefined;
  const r = getRubroServ(destino);
  if (r && aplica(s, r)) return { tipo: "rubro", servicio: s, rubro: r };
  const c = getCiudad(destino);
  if (c && SERVICIOS_CON_CIUDAD.includes(s.slug)) return { tipo: "ciudad", servicio: s, ciudad: c };
  return undefined;
}

/* ------------------------------ utilidades ------------------------------ */

function hash(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}
/** Elige n elementos de forma estable según la semilla (misma página = mismo resultado). */
export function elegir<T>(seed: string, xs: T[], n: number): T[] {
  const h = hash(seed);
  const out: T[] = [];
  for (let i = 0; i < xs.length && out.length < n; i++) out.push(xs[(h + i * 7) % xs.length]);
  return [...new Set(out)];
}
const pick = <T,>(seed: string, xs: T[]) => xs[hash(seed) % xs.length];
const minus = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** "en Nueva Córdoba" / "en el centro de Ushuaia". */
const enZona = (z: string, c: Ciudad) => (z === "el Centro" ? `en el centro de ${c.corto}` : `en ${z}`);

/** Búsquedas locales reales que se pueden ganar en una ciudad (rubro × barrio). */
export function busquedasLocales(seed: string, c: Ciudad, rubros: RubroServ[], n = 8) {
  const elegidos = elegir(seed, rubros, n);
  return elegidos.map((r, i) => `${r.termino} ${enZona(c.zonas[i % c.zonas.length], c)}`);
}

/** Ciudades cercanas (misma región primero). */
export function cercanas(c: Ciudad, n = 8) {
  const otras = ciudades.filter((x) => x.slug !== c.slug);
  return [...otras.filter((x) => x.region === c.region), ...otras.filter((x) => x.region !== c.region)].slice(0, n);
}

export const casoDeCiudad = (c: Ciudad) => casos.find((k) => k.ciudad === c.slug);
export const casoDeRubro = (r: RubroServ) => casos.find((k) => k.slug === r.caso || k.rubroSlug === r.slug);

/* ------------------------------ textos por región ------------------------------ */

const REGION: Record<"diseno-web" | "posicionamiento-seo" | "tiendanube", Record<Region, string>> = {
  "diseno-web": {
    AMBA: "En el AMBA la competencia está a pocas cuadras: si tu negocio no aparece con una web clara cuando alguien busca desde el celular, el cliente termina en el de enfrente.",
    "Provincia de Buenos Aires": "En las ciudades de la provincia la gente busca primero en Google y después pregunta por WhatsApp: una web con precios y un botón directo acorta ese camino.",
    Centro: "Es una plaza con mucha oferta y clientes que comparan antes de elegir: una web que muestre trabajos, precios y ubicación te pone adelante.",
    Cuyo: "Los clientes valoran resolver rápido: una web simple, que cargue al instante y lleve a WhatsApp, rinde más que una llena de animaciones.",
    NOA: "Acá casi todo se arregla por WhatsApp y muchos negocios todavía no tienen web: tener una bien hecha ya te diferencia.",
    NEA: "Con pocos negocios con web propia en la zona, aparecer en Google con una página clara es una ventaja grande y accesible.",
    Patagonia: "Son ciudades que crecen rápido y con mucha gente que llega de otras provincias: lo primero que hacen para encontrar un negocio es buscarlo en Google.",
  },
  "posicionamiento-seo": {
    AMBA: "En el AMBA casi todas las búsquedas incluyen el barrio. Ganarlas pide páginas por zona y una ficha de Google Maps trabajada.",
    "Provincia de Buenos Aires": "En las ciudades bonaerenses hay menos competencia digital que en CABA: con un buen trabajo de SEO local se puede llegar primero.",
    Centro: "Las ciudades del centro tienen búsquedas con volumen y competencia media: el SEO bien hecho se nota en consultas reales.",
    Cuyo: "En Cuyo muchas búsquedas locales todavía las ganan directorios y portales: una web propia con buen SEO puede pasarlos.",
    NOA: "En el NOA pocos negocios trabajan el SEO, así que las primeras posiciones están al alcance con un trabajo prolijo.",
    NEA: "En el NEA la competencia en Google es baja en casi todos los rubros: es un buen momento para ocupar los primeros lugares.",
    Patagonia: "En la Patagonia buscan tanto los vecinos como la gente que viaja o se muda: el SEO local captura a los dos.",
  },
  tiendanube: {
    AMBA: "Desde el AMBA se vende a todo el país, pero la competencia es enorme: la diferencia la hacen el diseño, las fotos y un checkout sin vueltas.",
    "Provincia de Buenos Aires": "Desde la provincia podés vender a todo el país con envíos integrados, y a tus clientes de la ciudad con retiro en el local.",
    Centro: "Con clientes que compran online desde hace años, una tienda lenta o desordenada pierde ventas contra la competencia.",
    Cuyo: "Una tienda online te saca del límite de la ciudad: con Andreani o Correo Argentino integrados vendés a todo el país.",
    NOA: "Muchos clientes del NOA compran en Buenos Aires por falta de oferta local online: una tienda propia te deja quedarte con esas ventas.",
    NEA: "Vender online desde el NEA te abre a todo el país, y a tus clientes de la zona les ahorra ir hasta el local.",
    Patagonia: "En la Patagonia el envío es la gran duda del cliente: una tienda con costos de envío claros y retiro en el local vende más.",
  },
};

const SIESTA: Record<string, (c: Ciudad) => string> = {
  "diseno-web": (c) => `En ${c.corto} muchos negocios cortan al mediodía. La web sigue atendiendo en la siesta: muestra horarios y precios, y deja el mensaje armado para que te escriban.`,
  "posicionamiento-seo": (c) => `Con el horario cortado de ${c.corto}, mucha gente busca a la siesta o a la noche, con el local cerrado. Si aparecés en Google a esa hora, el contacto te queda igual.`,
  tiendanube: (c) => `Con el horario cortado de ${c.corto}, la tienda vende en la siesta y a la noche, cuando el local está cerrado.`,
};
const TEMPORADA: Record<string, (c: Ciudad) => string> = {
  "diseno-web": (c) => `${c.corto} tiene temporada turística: una web con información para el que viene de afuera (cómo llegar, horarios, qué ofrecés) capta clientes que todavía no te conocen.`,
  "posicionamiento-seo": (c) => `En temporada, gente de otras provincias busca en Google lo que necesita en ${c.corto}: el SEO local te pone delante de ellos antes de que lleguen.`,
  tiendanube: (c) => `En temporada sube la demanda en ${c.corto}: la tienda te deja seguir vendiéndoles a los turistas cuando vuelven a su ciudad.`,
};

/* ------------------------------ página servicio × ciudad ------------------------------ */

export function textosCiudad(s: Servicio, c: Ciudad) {
  const lugar = lugarConProvincia(c);
  const seed = `${s.slug}/${c.slug}`;
  const clave = s.slug as "diseno-web" | "posicionamiento-seo" | "tiendanube";
  const zonas = c.zonas.length > 1 ? c.zonas.join(", ").replace(/, ([^,]*)$/, " y $1") : null;
  const rubrosTienda = rubrosServ.filter((r) => r.tienda);

  const h1 =
    s.slug === "diseno-web"
      ? `Diseño de páginas web en ${lugar}`
      : s.slug === "posicionamiento-seo"
        ? `Posicionamiento SEO en ${lugar}`
        : `Tiendanube en ${lugar}: armado y rediseño de tiendas`;
  const title =
    s.slug === "diseno-web"
      ? `Diseño de páginas web en ${c.corto} (${precioTexto(s)})`
      : s.slug === "posicionamiento-seo"
        ? `Posicionamiento SEO en ${c.corto}: aparecé primero en Google`
        : `Tiendanube en ${c.corto}: armado y rediseño (${precioTexto(s)})`;
  const description =
    s.slug === "diseno-web"
      ? `Páginas web para negocios y profesionales de ${c.corto}, ${c.provincia}: rápidas, con WhatsApp directo y SEO incluido. Landing page ${precioTexto(s)}, precio fijo en pesos.`
      : s.slug === "posicionamiento-seo"
        ? `SEO local para negocios de ${c.corto}, ${c.provincia}: aparecé en Google, en Google Maps y en ChatGPT cuando buscan tu rubro en tu zona. ${precioTexto(s).replace(/^d/, "D")}.`
        : `Armamos o rediseñamos tu Tiendanube desde ${c.corto}, ${c.provincia}: catálogo, Mercado Pago, cuotas y envíos listos. ${precioTexto(s).replace(/^d/, "D")}, en pesos.`;

  const intro = [
    zonas
      ? `Trabajamos con negocios de ${c.nombre}: de ${zonas} y de cualquier otra zona de la ciudad. ${REGION[clave][c.region]}`.replace(/\bde el\b/g, "del")
      : `Trabajamos con negocios de ${c.nombre}, ${c.provincia}. ${REGION[clave][c.region]}`,
  ];
  if (c.siesta) intro.push(SIESTA[clave](c));
  if (c.temporada) intro.push(TEMPORADA[clave](c));
  intro.push(
    pick(seed, [
      `Todo se coordina por WhatsApp y videollamada: no hace falta que te muevas del local.`,
      `No hace falta reunirse en persona: nos pasás el material por WhatsApp y te mostramos avances funcionando.`,
      `Trabajamos a distancia con negocios de toda ${c.provincia}: vos seguís atendiendo y nosotros avanzamos.`,
    ]),
  );

  // Bloque local: búsquedas reales de la ciudad (rubro × barrio), distintas en cada página.
  const busquedas =
    s.slug === "tiendanube"
      ? elegir(seed, rubrosTienda, 6).map((r) => `${r.busquedas[hash(seed + r.slug) % r.busquedas.length]} con envío a ${c.corto}`)
      : busquedasLocales(seed, c, rubrosServ, 8);
  const tituloBusquedas =
    s.slug === "tiendanube" ? `Lo que se compra online desde ${c.corto}` : `Búsquedas que tu negocio puede ganar en ${c.corto}`;
  const textoBusquedas =
    s.slug === "posicionamiento-seo"
      ? "Son ejemplos de lo que escribe la gente de la ciudad en Google. Cada una es una página o una sección de tu web que la responde mejor que la competencia."
      : s.slug === "diseno-web"
        ? "Cuando alguien busca algo así, aparecen las webs que nombran el rubro y la zona. Si tu negocio no tiene web, esas consultas se las lleva otro."
        : "Búsquedas de productos que hacen los compradores de la zona. Una tienda con buenas categorías y fichas aparece para ellas.";

  const rubrosLinks = elegir(seed + "r", rubrosDe(s), 10);
  const faqs: Faq[] = [
    {
      q: `¿Trabajan con negocios de ${c.corto}?`,
      a: `Sí. Trabajamos con negocios de ${c.nombre} y de toda ${c.provincia === "CABA" ? "la Ciudad de Buenos Aires" : `la provincia de ${c.provincia}`} a distancia: todo se coordina por WhatsApp y videollamada.`,
    },
    {
      q:
        s.slug === "diseno-web"
          ? `¿Cuánto cuesta una página web en ${c.corto}?`
          : s.slug === "posicionamiento-seo"
            ? `¿Cuánto cuesta el SEO para un negocio de ${c.corto}?`
            : `¿Cuánto cuesta armar una Tiendanube en ${c.corto}?`,
      a:
        s.slug === "diseno-web"
          ? `Una landing page arranca en $150.000, precio fijo en pesos. Si necesitás más secciones o una tienda, te pasamos el precio cerrado antes de empezar.`
          : s.slug === "posicionamiento-seo"
            ? `El trabajo de SEO arranca en $150.000. Antes te hacemos un diagnóstico gratis por WhatsApp para decirte qué le falta a tu web para aparecer en ${c.corto}.`
            : `El armado o rediseño de la tienda arranca en $250.000, en pesos. El plan de Tiendanube lo pagás aparte, directo a Tiendanube.`,
    },
    pick(seed + "f", s.faqs),
  ];

  return { h1, title, description, intro, busquedas, tituloBusquedas, textoBusquedas, rubrosLinks, faqs, caso: casoDeCiudad(c) };
}

/* ------------------------------ página servicio × rubro ------------------------------ */

export function textosRubro(s: Servicio, r: RubroServ) {
  const n = r.nombre.toLowerCase();
  const una = `${r.una} ${r.negocio}`;
  let h1 = "";
  let title = "";
  let description = "";
  let bajada = "";
  let lista: { titulo: string; items: string[] } = { titulo: "", items: [] };

  switch (s.slug) {
    case "diseno-web":
      h1 = `Diseño de páginas web para ${n}`;
      title = `Página web para ${n} (${precioTexto(s)})`;
      description = `Páginas web para ${n}: ${r.necesita.slice(0, 2).map(minus).join(" y ")}, con WhatsApp directo. Landing ${precioTexto(s)}, en pesos.`;
      bajada = `Una web para tu ${r.negocio} pensada para que te escriban: ${r.necesita.slice(0, 3).map(minus).join(", ")}. Landing page ${precioTexto(s)}.`;
      lista = { titulo: `Qué tiene que tener la web de ${una}`, items: r.necesita };
      break;
    case "posicionamiento-seo":
      h1 = `Posicionamiento SEO para ${n}`;
      title = `SEO para ${n}: aparecé primero en Google`;
      description = `SEO para ${n}: aparecé cuando buscan "${r.busquedas[0]}" o "${r.termino}" en tu zona, en Google, Maps y ChatGPT. ${precioTexto(s).replace(/^d/, "D")}.`;
      bajada = `Hacemos que tu ${r.negocio} aparezca cuando buscan ${r.busquedas.slice(0, 2).map((b) => `"${b}"`).join(" o ")} en tu zona, en Google, en Google Maps y en las IA.`;
      lista = { titulo: "Lo que busca tu cliente en Google", items: [...r.busquedas, `${r.termino} en tu barrio`] };
      break;
    case "tiendanube":
      h1 = `Tiendanube para ${n}`;
      title = `Tiendanube para ${n}: armado y rediseño (${precioTexto(s)})`;
      description = `Armamos o rediseñamos la Tiendanube de tu ${r.negocio}: ${r.tienda!.claves.slice(0, 2).map(minus).join(" y ")}, Mercado Pago y envíos. ${precioTexto(s).replace(/^d/, "D")}.`;
      bajada = `Una tienda online para tu ${r.negocio} que se vea bien en el celular y venda sola: ${r.tienda!.claves.slice(0, 3).map(minus).join(", ")}.`;
      lista = { titulo: `Lo que necesita la tienda de ${una}`, items: r.tienda!.claves };
      break;
    case "sistemas-a-medida":
      h1 = `Sistema a medida para ${n}: ${r.sistema!.que}`;
      title = `Sistema para ${n}: ${r.sistema!.que}`;
      description = `Sistema a medida para ${n}: ${r.sistema!.funciones.map(minus).join(", ")}. Desde el celular, sin planillas. Presupuesto sin cargo.`;
      bajada = `Dejá las planillas y los cuadernos: un sistema propio para tu ${r.negocio} con ${r.sistema!.funciones.map(minus).join(", ")}.`;
      lista = { titulo: "Qué puede hacer el sistema", items: r.sistema!.funciones };
      break;
  }

  const faqs: Faq[] = [
    r.faq,
    s.slug === "sistemas-a-medida"
      ? { q: `¿Cuánto cuesta un sistema para ${una}?`, a: "Depende de lo que necesites. El presupuesto es sin cargo: nos contás cómo trabajás y te pasamos un precio cerrado." }
      : {
          q: `¿Cuánto cuesta ${s.slug === "diseno-web" ? "una página web" : s.slug === "tiendanube" ? "armar la Tiendanube" : "el SEO"} para ${una}?`,
          a: `${precioTexto(s).replace(/^d/, "D")}, en pesos. Te pasamos el precio cerrado por WhatsApp antes de empezar, según lo que necesite tu ${r.negocio}.`,
        },
    ...s.faqs.slice(0, 2),
  ];

  const otros = servicios.filter((x) => x.slug !== s.slug && aplica(x, r));
  return { h1, title, description, bajada, lista, faqs, otros, caso: casoDeRubro(r) };
}

/* ------------------------------ datos estructurados ------------------------------ */

export const estudioId = () => absoluteUrl(`${estudio.base}#estudio`);

export function estudioLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": estudioId(),
    name: estudio.nombre,
    url: absoluteUrl(estudio.base),
    description: estudio.definicion,
    telephone: estudio.telefono,
    priceRange: "$150.000 - $250.000",
    currenciesAccepted: "ARS",
    address: { "@type": "PostalAddress", addressRegion: estudio.region, addressCountry: "AR" },
    areaServed: { "@type": "Country", name: "Argentina" },
    contactPoint: { "@type": "ContactPoint", contactType: "sales", availableLanguage: ["Spanish"], url: `https://wa.me/${estudio.whatsapp}` },
    knowsAbout: ["Diseño de páginas web", "Landing pages", "Tiendanube", "Posicionamiento SEO", "SEO local", "GEO (optimización para IA)", "Sistemas a medida"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios",
      itemListElement: servicios.map((s) => ({
        "@type": "Offer",
        url: absoluteUrl(servicioPath(s)),
        itemOffered: { "@type": "Service", name: s.titulo, description: s.descripcion },
        ...(s.precio ? { price: s.precio, priceCurrency: "ARS" } : {}),
      })),
    },
  };
}

export function servicioLd(s: Servicio, opts: { path: string; name: string; description: string; area?: Ciudad; audiencia?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(`${opts.path}#servicio`),
    name: opts.name,
    serviceType: s.titulo,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { "@type": "ProfessionalService", "@id": estudioId(), name: estudio.nombre },
    areaServed: opts.area
      ? { "@type": "City", name: opts.area.nombre, containedInPlace: { "@type": "AdministrativeArea", name: opts.area.provincia } }
      : { "@type": "Country", name: "Argentina" },
    ...(opts.audiencia ? { audience: { "@type": "BusinessAudience", name: opts.audiencia } } : {}),
    ...(s.precio
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "ARS",
            priceSpecification: { "@type": "PriceSpecification", minPrice: s.precio, priceCurrency: "ARS" },
            url: absoluteUrl(opts.path),
          },
        }
      : {}),
  };
}
