/**
 * Contenido para SEO programático (mismo patrón que los líderes del rubro):
 *  - Ciudades → /turnos-online/<ciudad>
 *  - Glosario → /glosario/<termino> (ver glosario.ts)
 * Agregar una ciudad o un término acá crea la página, la suma al sitemap y la enlaza.
 */

export type Region = "AMBA" | "Provincia de Buenos Aires" | "Centro" | "Cuyo" | "NOA" | "NEA" | "Patagonia";

export interface Ciudad {
  slug: string;
  /** Nombre completo, para el cuerpo del texto. */
  nombre: string;
  /** Nombre corto, para títulos (ej: "Tucumán"). */
  corto: string;
  provincia: string;
  region: Region;
  /** Barrios o zonas conocidas, para dar contexto local real. */
  zonas: string[];
  /** Es habitual el horario cortado (siesta) en el comercio local. */
  siesta?: boolean;
  /** Ciudad con temporada turística fuerte (cambia la demanda en el año). */
  temporada?: boolean;
}

export const ciudades: Ciudad[] = [
  { slug: "buenos-aires", nombre: "Buenos Aires", corto: "CABA", provincia: "CABA", region: "AMBA", zonas: ["Palermo", "Belgrano", "Caballito", "Villa Urquiza"] },
  { slug: "cordoba", nombre: "Córdoba", corto: "Córdoba", provincia: "Córdoba", region: "Centro", zonas: ["Nueva Córdoba", "Cerro de las Rosas", "General Paz"] },
  { slug: "rosario", nombre: "Rosario", corto: "Rosario", provincia: "Santa Fe", region: "Centro", zonas: ["el Centro", "Pichincha", "Fisherton", "Funes"] },
  { slug: "mendoza", nombre: "Mendoza", corto: "Mendoza", provincia: "Mendoza", region: "Cuyo", zonas: ["el Centro", "la Quinta Sección", "Godoy Cruz", "Chacras de Coria"], siesta: true },
  { slug: "la-plata", nombre: "La Plata", corto: "La Plata", provincia: "Buenos Aires", region: "AMBA", zonas: ["el Centro", "City Bell", "Tolosa"] },
  { slug: "mar-del-plata", nombre: "Mar del Plata", corto: "Mar del Plata", provincia: "Buenos Aires", region: "Provincia de Buenos Aires", zonas: ["el Centro", "Güemes", "Los Troncos"], temporada: true },
  { slug: "san-miguel-de-tucuman", nombre: "San Miguel de Tucumán", corto: "Tucumán", provincia: "Tucumán", region: "NOA", zonas: ["Barrio Norte", "Barrio Sur", "Yerba Buena"], siesta: true },
  { slug: "salta", nombre: "Salta", corto: "Salta", provincia: "Salta", region: "NOA", zonas: ["el Centro", "Tres Cerritos", "Grand Bourg"], siesta: true, temporada: true },
  { slug: "santa-fe", nombre: "Santa Fe", corto: "Santa Fe", provincia: "Santa Fe", region: "Centro", zonas: ["el Centro", "Candioti", "Guadalupe"], siesta: true },
  { slug: "san-juan", nombre: "San Juan", corto: "San Juan", provincia: "San Juan", region: "Cuyo", zonas: ["el Centro", "Rivadavia", "Santa Lucía", "Rawson"], siesta: true },
  { slug: "catamarca", nombre: "San Fernando del Valle de Catamarca", corto: "Catamarca", provincia: "Catamarca", region: "NOA", zonas: ["el Centro", "Valle Viejo", "Fray Mamerto Esquiú"], siesta: true },
  { slug: "resistencia", nombre: "Resistencia", corto: "Resistencia", provincia: "Chaco", region: "NEA", zonas: ["el Centro", "Barranqueras", "Fontana"], siesta: true },
  { slug: "neuquen", nombre: "Neuquén", corto: "Neuquén", provincia: "Neuquén", region: "Patagonia", zonas: ["el Centro", "Santa Genoveva", "Plottier", "Cipolletti"] },
  { slug: "santiago-del-estero", nombre: "Santiago del Estero", corto: "Santiago del Estero", provincia: "Santiago del Estero", region: "NOA", zonas: ["el Centro", "La Banda"], siesta: true },
  { slug: "corrientes", nombre: "Corrientes", corto: "Corrientes", provincia: "Corrientes", region: "NEA", zonas: ["el Centro", "Camba Cuá"], siesta: true },
  { slug: "posadas", nombre: "Posadas", corto: "Posadas", provincia: "Misiones", region: "NEA", zonas: ["el Centro", "Villa Sarita", "Itaembé Miní"], siesta: true },
  { slug: "bahia-blanca", nombre: "Bahía Blanca", corto: "Bahía Blanca", provincia: "Buenos Aires", region: "Provincia de Buenos Aires", zonas: ["el Centro", "Universitario", "Palihue"] },
  { slug: "parana", nombre: "Paraná", corto: "Paraná", provincia: "Entre Ríos", region: "Centro", zonas: ["el Centro", "San Benito", "Oro Verde"], siesta: true },
  { slug: "san-salvador-de-jujuy", nombre: "San Salvador de Jujuy", corto: "Jujuy", provincia: "Jujuy", region: "NOA", zonas: ["el Centro", "Los Perales", "Alto Comedero", "Palpalá"], siesta: true },
  { slug: "la-rioja", nombre: "La Rioja", corto: "La Rioja", provincia: "La Rioja", region: "NOA", zonas: ["el Centro"], siesta: true },
  { slug: "rio-cuarto", nombre: "Río Cuarto", corto: "Río Cuarto", provincia: "Córdoba", region: "Centro", zonas: ["el Centro", "Banda Norte"] },
];

/**
 * Filtro "francotirador": rubros que NO generan páginas por ciudad (solo su página madre).
 * Útil al sumar rubros nuevos mientras Google todavía indexa la tanda anterior.
 */
export const NO_PSEO_RUBROS: string[] = [];

export const getCiudad = (slug: string) => ciudades.find((c) => c.slug === slug);

// El glosario vive en ./glosario.ts (se re-exporta para no romper imports).
export { glosario, getTermino, type Termino } from "./glosario";
