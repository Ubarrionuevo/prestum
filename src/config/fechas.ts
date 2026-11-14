/**
 * FECHAS REALES DE ACTUALIZACIÓN (lastmod de los sitemaps).
 *
 * Google solo le cree al <lastmod> si es honesto: si todas las páginas dicen "hoy" en cada
 * deploy, lo ignora. Por eso cada sección tiene la fecha en que cambió SU CONTENIDO
 * (no el diseño, el menú o el footer).
 *
 * REGLA: cuando cambies el texto de una sección, actualizá su fecha acá (formato AAAA-MM-DD).
 * Después del deploy, la tarea de GitHub avisa a Bing (IndexNow) solo de las páginas con fecha reciente.
 * Los artículos del blog usan su propio campo `actualizado` (config/blog.ts).
 */
export const ACTUALIZADO = {
  home: "2026-11-12",
  rubrosFoco: "2026-11-12",
  rubrosSecundarios: "2026-11-11",
  ciudades: "2026-11-13",
  funciones: "2026-11-13",
  calculadora: "2026-11-13",
  queEsPrestum: "2026-11-12",
  precios: "2026-11-11",
  registro: "2026-11-11",
  glosario: "2026-11-12",
  comparar: "2026-11-11",
  terminos: "2026-11-11",
  privacidad: "2026-11-05",
} as const;

export type SeccionFecha = keyof typeof ACTUALIZADO;

/** Fecha como Date (mediodía de Argentina, para que no cambie de día por la zona horaria). */
export const fechaDe = (s: SeccionFecha | string) => new Date(`${s in ACTUALIZADO ? ACTUALIZADO[s as SeccionFecha] : s}T12:00:00-03:00`);
