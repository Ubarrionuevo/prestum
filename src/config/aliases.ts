/**
 * ALIAS DE URL (sin imports: lo lee también next.config.ts).
 * URLs cortas y fáciles de compartir que redirigen (308 permanente) al slug canónico,
 * así no se divide la autoridad ni se genera contenido duplicado.
 *   /turnero/dentistas            → /turnero/odontologos
 *   /turnero/dentistas/caba       → /turnero/odontologos/buenos-aires
 *   /turnos-online/tucuman        → /turnos-online/san-miguel-de-tucuman
 * El destino tiene que existir en products/turnero.ts o en seo-content.ts.
 */

/** Producto que tiene páginas por rubro y ciudad. */
export const PSEO_PRODUCTO = "turnero";

export const RUBRO_ALIASES: Record<string, string> = {
  dentistas: "odontologos",
  odontologia: "odontologos",
  "consultorios-dentales": "odontologos",
  kinesiologia: "kinesiologos",
  fisioterapeutas: "kinesiologos",
  fisioterapia: "kinesiologos",
  estetica: "esteticistas",
  "centros-de-estetica": "esteticistas",
  cosmetologas: "esteticistas",
  "peluquerias-caninas": "peluqueria-canina",
  "estetica-canina": "peluqueria-canina",
  grooming: "peluqueria-canina",
  talleres: "talleres-mecanicos",
  mecanicos: "talleres-mecanicos",
  "taller-mecanico": "talleres-mecanicos",
  barberia: "barberias",
  barberos: "barberias",
  psicologia: "psicologos",
  nutricion: "nutricionistas",
  manicura: "manicuria",
  manicuras: "manicuria",
  unas: "manicuria",
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

/** Redirecciones para next.config.ts. */
export function aliasRedirects() {
  const p = PSEO_PRODUCTO;
  const out: Array<{ source: string; destination: string; permanent: true }> = [];
  for (const [alias, rubro] of Object.entries(RUBRO_ALIASES)) {
    out.push({ source: `/${p}/${alias}`, destination: `/${p}/${rubro}`, permanent: true });
    out.push({ source: `/${p}/${alias}/:ciudad`, destination: `/${p}/${rubro}/:ciudad`, permanent: true });
  }
  for (const [alias, ciudad] of Object.entries(CIUDAD_ALIASES)) {
    out.push({ source: `/turnos-online/${alias}`, destination: `/turnos-online/${ciudad}`, permanent: true });
    out.push({ source: `/${p}/:rubro/${alias}`, destination: `/${p}/:rubro/${ciudad}`, permanent: true });
  }
  return out;
}
