import type { Faq, Niche, Product } from "@/config/types";
import { esRubroFoco, getProduct, rubrosFoco } from "@/config/products";
import { PSEO_PRODUCTO } from "@/config/aliases";
import { NO_PSEO_RUBROS, ciudades, getCiudad, lugarConProvincia, tituloWhatsApp, type Ciudad, type Region } from "@/config/seo-content";
import { OFERTA_CORTA, TURNOS_GRATIS } from "@/config/planes";

/**
 * SEO programático: una página por Rubro × Ciudad → /turnero/<rubro>/<ciudad>.
 * Solo para los RUBROS FOCO (barberías, peluquerías, estética) y escrita para el DUEÑO del negocio,
 * no para quien busca dónde cortarse el pelo.
 * El texto se arma combinando datos reales del rubro (dolores, servicios, preguntas)
 * con datos reales de la ciudad (zonas, horario cortado, temporada, región), para que
 * cada página diga algo útil y distinto, no solo cambie el nombre de la ciudad.
 */

export const pseoProduct = (): Product | undefined => getProduct(PSEO_PRODUCTO);

export const rubrosConCiudades = (p: Product) => rubrosFoco(p).filter((n) => !NO_PSEO_RUBROS.includes(n.slug));

export const cityNichePath = (p: Product, n: Niche, c: Ciudad) => `/${p.slug}/${n.slug}/${c.slug}`;

/** Todas las combinaciones publicables (para generateStaticParams y el sitemap). */
export function pseoRoutes() {
  const p = pseoProduct();
  if (!p) return [];
  return rubrosConCiudades(p).flatMap((n) => ciudades.map((c) => ({ producto: p.slug, nicho: n.slug, ciudad: c.slug })));
}

export function getCityNiche(producto: string, nicho: string, ciudad: string) {
  const p = pseoProduct();
  if (!p || p.slug !== producto || NO_PSEO_RUBROS.includes(nicho)) return undefined;
  const niche = p.niches.find((n) => n.slug === nicho && esRubroFoco(n));
  const city = getCiudad(ciudad);
  return niche && city ? { product: p, niche, city } : undefined;
}

/** Ciudades de la misma región primero (enlazado interno con sentido geográfico). */
export function ciudadesCercanas(c: Ciudad, max = 6) {
  const otras = ciudades.filter((x) => x.slug !== c.slug);
  return [...otras.filter((x) => x.region === c.region), ...otras.filter((x) => x.region !== c.region)].slice(0, max);
}

/* ---------------------------- Textos ---------------------------- */

/** Elige una variante de forma estable según la combinación (misma página = mismo texto). */
function pick<T>(seed: string, opciones: T[]): T {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return opciones[h % opciones.length];
}

/** "una barbería" / "un centro de estética". */
const conArticulo = (negocio: string) => `${/a$/.test(negocio.split(" ")[0]) ? "una" : "un"} ${negocio}`;

const lista = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} y ${xs[xs.length - 1]}`);

const REGION: Record<Region, string> = {
  AMBA: "En una ciudad tan grande, la competencia está a pocas cuadras: el que contesta primero se queda con el cliente.",
  "Provincia de Buenos Aires": "La gente reserva desde el celular y espera respuesta rápida: si tarda, consulta en otro lado.",
  Centro: "Es una plaza con mucha oferta y clientes que comparan antes de elegir: mostrar precios y horarios claros marca la diferencia.",
  Cuyo: "Los clientes valoran resolver todo rápido y por WhatsApp, sin llamadas ni idas y vueltas.",
  NOA: "Acá casi todo se arregla por WhatsApp: tener un link que muestre los horarios libres ahorra decenas de mensajes por día.",
  NEA: "El WhatsApp es el canal de siempre: con un link de reservas, los clientes eligen solos y vos solo confirmás.",
  Patagonia: "Es una ciudad que crece rápido y con gente que trabaja en horarios largos: poder reservar a la noche o el fin de semana suma clientes.",
};

export function textosCiudadRubro(p: Product, n: Niche, c: Ciudad, precioDesde: string) {
  const seed = `${n.slug}/${c.slug}`;
  const rubro = n.name.toLowerCase();
  const zonas = c.zonas.length > 1 ? lista(c.zonas) : null;

  const h1 = `Sistema de turnos para ${rubro} en ${lugarConProvincia(c)}`;
  const lema = tituloWhatsApp(n.business);

  const bajada = `Tus clientes de ${c.nombre} eligen ${n.examples.slice(0, 2).map((e) => e.toLowerCase()).join(" o ")}, el día y el horario desde tu link. La reserva te llega armada a WhatsApp. ${OFERTA_CORTA}, sin tarjeta.`;

  const local: string[] = [
    zonas
      ? `Si tenés ${conArticulo(n.business)} en ${c.nombre} —en ${zonas} o en cualquier otra zona—, tus clientes ya buscan turno desde el celular. ${REGION[c.region]}`
      : `Si tenés ${conArticulo(n.business)} en ${c.nombre}, ${c.provincia}, tus clientes ya buscan turno desde el celular. ${REGION[c.region]}`,
  ];
  if (c.siesta)
    local.push(
      `En ${c.corto} es común trabajar con horario cortado. En ${p.brandName} cargás la mañana y la tarde por separado (por ejemplo 9 a 13 y 17 a 21) y el link nunca ofrece turnos en la siesta.`,
    );
  if (c.temporada)
    local.push(
      `Como ${c.corto} tiene temporada turística, la demanda cambia en el año: podés ampliar días y horarios en temporada alta y achicarlos después, en un minuto y sin avisarle a nadie.`,
    );
  local.push(
    pick(seed + "c", [
      `Compartís el link en tu Instagram, en Google Maps o en tu estado de WhatsApp, y los turnos entran solos aunque estés atendiendo.`,
      `Lo ponés en la bio de Instagram y en tu ficha de Google Maps: cada reserva te llega con nombre, servicio, día, hora y medio de pago.`,
      `Tus clientes no bajan ninguna app: abren el link, eligen y listo. Vos recibís el turno en WhatsApp para confirmarlo con un toque.`,
    ]),
  );

  const faqs: Faq[] = [
    {
      q: `¿${p.brandName} funciona para ${rubro} en ${c.corto}?`,
      a: `Sí. Funciona en ${c.nombre} y en toda la provincia de ${c.provincia}: solo necesitás tu link y WhatsApp. No hay que instalar nada.`,
    },
    {
      q: `¿Cuánto cuesta un turnero para ${rubro} en ${c.corto}?`,
      a: `Lo mismo que en todo el país: es gratis hasta ${TURNOS_GRATIS} turnos por mes, sin tarjeta y sin vencimiento. Si necesitás más, planes desde ${precioDesde} por mes, sin comisión por turno.`,
    },
    c.siesta
      ? { q: "¿Puedo poner horario cortado?", a: "Sí. Cargás dos franjas por día (mañana y tarde) y el link solo ofrece turnos dentro de esos horarios." }
      : { q: "¿Puedo tener horarios distintos cada día?", a: "Sí. Cada día de la semana tiene su propio horario, y podés cerrar los días que no atendés." },
    {
      q: "¿Tengo que cobrar seña?",
      a: "No, es 100% opcional. Podés dejar que reserven sin pagar nada o pedir una seña; si no la marcás como pagada en el plazo que elijas, el horario se libera solo.",
    },
    ...n.faqs,
  ];

  return { h1, lema, bajada, local, faqs };
}
