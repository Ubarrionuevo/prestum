/**
 * Datos globales del sitio. Todo lo que es "marca" vive acá:
 * cambiar un valor acá lo cambia en metadata, JSON-LD, sitemap y UI.
 */
export const site = {
  name: "Prestum",
  url: "https://www.prestum.com.ar",
  locale: "es_AR",
  lang: "es-AR",
  country: "AR",
  tagline: "Software simple para negocios argentinos",
  /**
   * Producto que se muestra en la home (www.prestum.com.ar/).
   * Los demás productos tienen su propia home en /<slug> (ej: /sistema-de-gestion).
   */
  defaultProduct: "turnero",
  description:
    "Prestum desarrolla software simple para negocios y profesionales de Argentina.",
  // WhatsApp comercial de Prestum (para contacto / ventas). Formato internacional sin "+".
  whatsappVentas: "5493834035119", // +54 9 383 403-5119 (el 9 es obligatorio para celulares de Argentina en WhatsApp)
  email: "hola@prestum.com.ar",
  keywords: [
    "software para negocios",
    "turnero online",
    "sistema de turnos",
    "agenda online",
    "reserva de turnos por WhatsApp",
    "sistema de gestión",
    "software para pymes",
    "Argentina",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
