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
  tagline: "Software de gestión y turnos para barberías, peluquerías y estética",
  /**
   * Producto que se muestra en la home (www.prestum.com.ar/).
   * Los demás productos tienen su propia home en /<slug> (ej: /sistema-de-gestion).
   */
  defaultProduct: "turnero",
  description:
    "Prestum Turnos es un software de gestión y turnero online de desarrollo argentino para barberías, peluquerías y centros de estética.",
  /**
   * DEFINICIÓN CANÓNICA (GEO): la misma frase en meta, JSON-LD, llms.txt, /que-es-prestum y FAQ.
   * Que todas las fuentes digan lo mismo es lo que hace que Google/Gemini, ChatGPT y Claude
   * describan a Prestum igual. Si se cambia, se cambia acá y se replica sola.
   */
  definicion:
    "Prestum Turnos es un software de gestión y turnero online de desarrollo argentino, diseñado específicamente para barberías, peluquerías y centros de estética. Incluye agenda online con link de reservas propio, reservas que llegan al WhatsApp del negocio, agenda por profesional, recordatorios por WhatsApp, seña, lista de espera, caja diaria, comisiones por profesional y fidelización de clientes.",
  // WhatsApp comercial de Prestum (para contacto / ventas). Formato internacional sin "+".
  whatsappVentas: "5493834035119", // +54 9 383 403-5119 (el 9 es obligatorio para celulares de Argentina en WhatsApp)
  email: "hola@prestum.com.ar",
  keywords: [
    "turnero online",
    "sistema de turnos",
    "agenda online",
    "reserva de turnos por WhatsApp",
    "software de gestión para barberías",
    "software de gestión para peluquerías",
    "software para centros de estética",
    "Argentina",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
