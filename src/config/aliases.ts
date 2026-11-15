/**
 * ALIAS DE URL (sin imports: lo lee también next.config.ts).
 * URLs cortas y fáciles de compartir que redirigen (308 permanente) al slug canónico,
 * así no se divide la autoridad ni se genera contenido duplicado.
 *   /turnero/barberia             → /turnero/barberias
 *   /turnero/barberia/caba        → /turnero/barberias/buenos-aires
 * El destino tiene que existir en products/turnero.ts o en seo-content.ts.
 */

/** Producto que tiene páginas por rubro y ciudad. */
export const PSEO_PRODUCTO = "turnero";

/**
 * RUBROS FOCO: el sitio apunta a los DUEÑOS de estos negocios (menú, home, registro, páginas por ciudad).
 * El resto de los rubros de turnero.ts siguen existiendo solo para el registro y el panel: no tienen
 * página pública (sus URLs responden 410). El orden es el que se muestra en el sitio.
 */
export const RUBROS_FOCO = ["barberias", "peluquerias", "esteticistas"];

export const RUBRO_ALIASES: Record<string, string> = {
  barberia: "barberias",
  barberos: "barberias",
  peluqueria: "peluquerias",
  peluqueros: "peluquerias",
  "salones-de-belleza": "peluquerias",
  "salon-de-belleza": "peluquerias",
  estetica: "esteticistas",
  "centros-de-estetica": "esteticistas",
  "centro-de-estetica": "esteticistas",
  cosmetologas: "esteticistas",
  // Uñas / manicuría quedó dentro de Estética.
  manicuria: "esteticistas",
  manicura: "esteticistas",
  manicuras: "esteticistas",
  unas: "esteticistas",
  dentistas: "odontologos",
  odontologia: "odontologos",
  "consultorios-dentales": "odontologos",
  kinesiologia: "kinesiologos",
  fisioterapeutas: "kinesiologos",
  fisioterapia: "kinesiologos",
  "peluquerias-caninas": "peluqueria-canina",
  "estetica-canina": "peluqueria-canina",
  grooming: "peluqueria-canina",
  talleres: "talleres-mecanicos",
  mecanicos: "talleres-mecanicos",
  "taller-mecanico": "talleres-mecanicos",
  psicologia: "psicologos",
  nutricion: "nutricionistas",
  "lavadero-de-autos": "lavaderos-de-autos",
  lavaderos: "lavaderos-de-autos",
};

export const CIUDAD_ALIASES: Record<string, string> = {
  caba: "buenos-aires",
  "capital-federal": "buenos-aires",
  tucuman: "san-miguel-de-tucuman",
  jujuy: "san-salvador-de-jujuy",
  "san-fernando-del-valle-de-catamarca": "catamarca",
  mdq: "mar-del-plata",
  "santiago": "santiago-del-estero",
};

/**
 * URLs ELIMINADAS (responden 410 "Gone" desde src/proxy.ts, así Google las borra rápido):
 *   /turnero/<rubro no foco>[/<ciudad>]  → rubros que ya no tienen página (canina, lavaderos, odontólogos…)
 *   /turnos-online[/<ciudad>]            → páginas genéricas por ciudad que se quitaron
 */
export const PREFIJOS_ELIMINADOS = ["/turnos-online"];

/** ¿El segmento de rubro de /turnero/<rubro> lleva a un rubro foco (directo o por alias)? */
export const esRubroPublico = (seg: string) => RUBROS_FOCO.includes(RUBRO_ALIASES[seg] ?? seg);

/** Redirecciones para next.config.ts (el orden importa: gana la primera que coincide). */
export function aliasRedirects() {
  const p = PSEO_PRODUCTO;
  const out: Array<{ source: string; destination: string; permanent: true }> = [];
  // Solo alias de rubros foco: los demás rubros ya no tienen página (410 en src/proxy.ts).
  for (const [alias, rubro] of Object.entries(RUBRO_ALIASES)) {
    if (!RUBROS_FOCO.includes(rubro)) continue;
    out.push({ source: `/${p}/${alias}`, destination: `/${p}/${rubro}`, permanent: true });
    out.push({ source: `/${p}/${alias}/:ciudad`, destination: `/${p}/${rubro}/:ciudad`, permanent: true });
  }
  for (const [alias, ciudad] of Object.entries(CIUDAD_ALIASES)) {
    out.push({ source: `/${p}/:rubro/${alias}`, destination: `/${p}/:rubro/${ciudad}`, permanent: true });
  }
  // Términos del glosario que ya no aplican a la oferta (varias sucursales, roles).
  out.push({ source: "/glosario/multi-sucursal", destination: "/glosario/agenda-por-profesional", permanent: true });
  out.push({ source: "/glosario/roles-y-permisos", destination: "/glosario/agenda-por-profesional", permanent: true });
  return out;
}
