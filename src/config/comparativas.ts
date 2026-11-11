import type { Faq } from "./types";

/**
 * COMPARATIVAS → /comparar y /comparar/prestum-vs-<app>
 *
 * Reglas (para no tener problemas y para que Google y las IA confíen):
 *  - Solo datos de la web oficial de cada empresa, con su fuente y la fecha de revisión.
 *  - Decir también cuándo conviene el otro.
 *  - Revisar los precios cada 2–3 meses y actualizar `revisado`.
 * Los datos de Prestum salen de los planes (src/config/planes.ts / Supabase), no de acá.
 */

export const REVISADO = "2026-11-06";

/** Filas de la tabla comparativa, en orden. */
export const FILAS = [
  { id: "precio", label: "Precio" },
  { id: "gratis", label: "Prueba o plan gratis" },
  { id: "equipo", label: "Varios profesionales" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "cobros", label: "Seña y comisión por cobro" },
  { id: "sucursales", label: "Varias sucursales" },
  { id: "ia", label: "Bot con IA" },
  { id: "rubros", label: "Rubros" },
] as const;

export type FilaId = (typeof FILAS)[number]["id"];

export interface Competidor {
  slug: string;
  nombre: string;
  /** Página oficial de donde salen los datos. */
  fuente: string;
  /** Qué es, en una frase neutral. */
  queEs: string;
  datos: Record<FilaId, string>;
  /** Respuesta corta (arriba de la página). Usar {gratis} (turnos gratis por mes), {basico} y {premium} para la oferta de Prestum. */
  respuesta: string;
  /** En qué conviene Prestum, con datos. */
  ventajas: string[];
  /** Cuándo conviene el otro (honestidad = confianza). */
  convieneElOtro: string[];
  faqs: Faq[];
}

export const competidores: Competidor[] = [
  {
    slug: "cortik",
    nombre: "Cortik",
    fuente: "https://cortik.app/precios",
    queEs: "Turnero online argentino hecho para barberías, con link de reservas y plan gratis.",
    datos: {
      precio: "Gratis; pagos de $9.000, $15.000 y $25.000/mes",
      gratis: "Plan gratis para siempre: 40 turnos/mes, 1 profesional",
      equipo: "Plan Barbería: $25.000/mes para varios barberos",
      whatsapp: "Recordatorio por WhatsApp desde el plan de $9.000",
      cobros: "Seña opcional por transferencia, sin comisión",
      sucursales: "No figura en sus planes",
      ia: "No",
      rubros: "Barberías (también peluquería, estética y uñas)",
    },
    respuesta:
      "Los dos tienen plan gratis para siempre: Cortik incluye 40 turnos por mes y Prestum Turnos {gratis}. Los planes pagos arrancan en el mismo precio, pero para un equipo la diferencia es grande: en Prestum los profesionales ilimitados están en Premium por {premium}/mes, y Cortik cobra $25.000 por su plan para varios barberos.",
    ventajas: [
      "{gratis} turnos gratis por mes, sin tarjeta y sin vencimiento (Cortik: 40).",
      "Profesionales ilimitados por {premium}/mes (el plan de Cortik para varios barberos cuesta $25.000).",
      "Lista de espera, caja y comisiones por profesional y fidelización incluidas en Premium.",
      "Seña opcional por alias o link de pago, sin comisión.",
    ],
    convieneElOtro: [
      "Ya usás Cortik, trabajás solo y no pasás de 40 turnos por mes: cambiar no te suma mucho.",
    ],
    faqs: [
      { q: "¿Prestum tiene plan gratis como Cortik?", a: "Sí, y con más turnos: hasta {gratis} turnos por mes gratis (Cortik: 40), sin tarjeta y sin vencimiento. Si necesitás más, planes desde {basico}/mes." },
      { q: "¿Puedo pasarme de Cortik a Prestum?", a: "Sí. Cargás tus servicios, horarios y equipo en Prestum (te ayudamos por WhatsApp) y cambiás el link en tu Instagram." },
    ],
  },
  {
    slug: "turnofacil",
    nombre: "TurnoFácil",
    fuente: "https://turnofacil.io/#precios",
    queEs: "Sistema de turnos argentino con bot de WhatsApp con IA que atiende desde el número del negocio.",
    datos: {
      precio: "$29.900/mes (Profesional); $89.000/mes (Empresarial)",
      gratis: "30 días gratis del plan Profesional, sin tarjeta",
      equipo: "Ilimitados en el plan Profesional",
      whatsapp: "Bot con IA en tu propio WhatsApp (vinculado por QR), entiende audios",
      cobros: "Señas por Mercado Pago, opcionales, 0% comisión",
      sucursales: "Plan Empresarial: $89.000/mes",
      ia: "Sí",
      rubros: "Varios rubros",
    },
    respuesta:
      "Si querés un bot que conteste tu WhatsApp con inteligencia artificial y entienda audios, TurnoFácil lo tiene y Prestum no. Si preferís que tus clientes reserven desde un link y vos confirmar desde tu WhatsApp, Prestum Turnos es gratis hasta {gratis} turnos por mes y los profesionales ilimitados cuestan {premium}/mes (TurnoFácil Profesional: $29.900).",
    ventajas: [
      "Plan gratis para siempre hasta {gratis} turnos por mes (TurnoFácil tiene 30 días de prueba).",
      "Más barato: profesionales ilimitados por {premium}/mes, y un plan de {basico}/mes para hasta 2 profesionales.",
      "No hace falta vincular tu WhatsApp a ningún sistema: el cliente reserva en tu link y te escribe a tu número.",
    ],
    convieneElOtro: [
      "Querés que un bot con IA atienda y agende solo dentro de tu WhatsApp, incluso con audios.",
      "Necesitás venta de productos dentro del chat, reseñas automáticas en Google o Google Calendar.",
      "Tenés varias sucursales: TurnoFácil tiene un plan Empresarial para eso.",
    ],
    faqs: [
      { q: "¿Prestum tiene bot de WhatsApp con IA?", a: "No. El cliente reserva desde tu link y la reserva te llega armada a tu WhatsApp; los recordatorios se mandan con un toque desde tu número." },
      { q: "¿Los dos se pueden usar gratis?", a: "TurnoFácil tiene 30 días de prueba sin tarjeta. Prestum Turnos tiene un plan gratis sin vencimiento, hasta {gratis} turnos por mes." },
    ],
  },
  {
    slug: "agendapro",
    nombre: "AgendaPro",
    fuente: "https://agendapro.com/ar/planes",
    queEs: "Plataforma de agenda y gestión para belleza, estética, salud y fitness, con marketplace de clientes y app móvil.",
    datos: {
      precio: "$7.900/mes (1 profesional); $15.900 (2 a 5); $69.900 (PRO IA). IVA incluido",
      gratis: "Primeros 3 meses a $990 para cuentas nuevas",
      equipo: "Hasta 5 en Full; en PRO IA, 2 incluidos y +$20.000 por profesional",
      whatsapp: "50 recordatorios por WhatsApp/mes; recepcionista IA aparte (+$15.000)",
      cobros: "Integración con Mercado Pago",
      sucursales: "Plan a medida (consultar)",
      ia: "Sí, en PRO IA o como adicional",
      rubros: "Belleza, estética, salud y fitness",
    },
    respuesta:
      "AgendaPro suma marketplace de clientes y app móvil, y su plan para 1 profesional cuesta $7.900/mes. Prestum Turnos es gratis hasta {gratis} turnos por mes, tiene profesionales ilimitados por {premium}/mes (en AgendaPro, Full llega hasta 5) y los recordatorios salen de tu propio WhatsApp, sin cupo mensual.",
    ventajas: [
      "Plan gratis para siempre hasta {gratis} turnos por mes, sin tarjeta.",
      "Profesionales ilimitados por {premium}/mes (en AgendaPro, Full llega hasta 5).",
      "Recordatorios por WhatsApp sin cupo mensual: los mandás con un toque desde tu número.",
    ],
    convieneElOtro: [
      "Atendés solo, tenés más de {gratis} turnos por mes y querés pagar lo mínimo: su plan de 1 profesional cuesta $7.900/mes.",
      "Querés aparecer en un marketplace que te traiga clientes nuevos.",
      "Necesitás app nativa para iOS y Android o ficha clínica (planes de estética y salud).",
    ],
    faqs: [
      { q: "¿Prestum tiene app para el celular?", a: "Funciona desde el navegador del celular, sin instalar nada, tanto para vos como para tus clientes." },
      { q: "¿Prestum tiene marketplace?", a: "No. Cada negocio tiene su propio link y sus clientes no ven otros negocios." },
    ],
  },
  {
    slug: "turnito",
    nombre: "Turnito",
    fuente: "https://turnito.app/ar/planes/",
    queEs: "App argentina de agendas y turnos online con plan gratis y cobro online con Mercado Pago y PayPal.",
    datos: {
      precio: "Gratis; $12.000, $24.500 y $42.000/mes (IVA incluido)",
      gratis: "Plan gratis para siempre: 100 reservas/mes, 3 agendas, 1 servicio por agenda",
      equipo: "3 agendas (gratis), 5 (Plus), ilimitadas desde Advance ($24.500)",
      whatsapp: "30, 100 o 250 mensajes de WhatsApp/mes según el plan",
      cobros: "Cobro online con comisión: 5% (gratis), 3,5%, 1% o 0% (Pro)",
      sucursales: "No figura en sus planes",
      ia: "No",
      rubros: "Varios rubros",
    },
    respuesta:
      "Turnito tiene un plan gratis con 100 reservas por mes y cobra online con Mercado Pago y PayPal, pero con comisión por cada cobro (5% en el plan gratis). Prestum Turnos es gratis hasta {gratis} turnos por mes, no cobra comisión en ningún plan, no limita los mensajes de WhatsApp y tiene profesionales ilimitados por {premium}/mes.",
    ventajas: [
      "0% de comisión en todos los planes: la seña va directo a tu cuenta.",
      "Recordatorios por WhatsApp sin cupo mensual.",
      "Profesionales ilimitados por {premium}/mes.",
    ],
    convieneElOtro: [
      "Tenés menos de 100 reservas por mes y querés no pagar nada.",
      "Querés cobrar online automáticamente con PayPal o Mercado Pago integrado.",
      "Necesitás turnos recurrentes o campos personalizados en el formulario.",
    ],
    faqs: [
      { q: "¿Prestum cobra comisión por la seña?", a: "No. El cliente paga la seña a tu alias o a tu link de pago; Prestum no toca el dinero." },
      { q: "¿Prestum limita los mensajes de WhatsApp?", a: "No. Los recordatorios se envían desde tu propio WhatsApp con un toque, sin cupo." },
    ],
  },
];

export const getCompetidor = (slug: string) => competidores.find((c) => c.slug === slug);
export const compararPath = (c: Competidor) => `/comparar/prestum-vs-${c.slug}`;
export const slugDeRuta = (ruta: string) => (ruta.startsWith("prestum-vs-") ? ruta.slice("prestum-vs-".length) : undefined);
