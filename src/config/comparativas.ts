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
  /** Fecha en que se revisaron SUS datos, si es distinta de REVISADO (AAAA-MM-DD). */
  revisado?: string;
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
  {
    slug: "trimito",
    nombre: "Trimito",
    revisado: "2026-11-17",
    fuente: "https://trimito.com.ar/precios/",
    queEs: "Sistema de turnos y CRM argentino dedicado a peluquerías y barberías, con plan gratis y planes por local.",
    datos: {
      precio: "Gratis; Turnos $12.500/mes y Completo $49.999/mes (precio por local)",
      gratis: "Plan gratis: 1 profesional, turnos sin límite, hasta 100 recordatorios por WhatsApp/mes. Planes pagos con 7 días de prueba",
      equipo: "Sin límite en los planes pagos",
      whatsapp: "Recordatorios automáticos por WhatsApp (100/mes en el gratis; todos los turnos en los pagos)",
      cobros: "Sin comisión por cliente ni por reserva",
      sucursales: "Precio por local; no figura un plan multisucursal",
      ia: "No figura",
      rubros: "Solo peluquerías y barberías",
    },
    respuesta:
      "Trimito tiene un plan gratis con turnos sin límite para 1 profesional y recordatorios automáticos por WhatsApp, y planes de $12.500 y $49.999 por mes. Prestum Turnos es gratis hasta {gratis} turnos por mes y, para un equipo, cuesta menos: profesionales ilimitados con caja, comisiones y lista de espera por {premium}/mes (en Trimito, caja y comisiones están en Completo, a $49.999).",
    ventajas: [
      "Caja, comisiones por profesional y lista de espera por {premium}/mes (en Trimito, caja y comisiones están en el plan Completo de $49.999).",
      "Plan de {basico}/mes para hasta 2 profesionales.",
      "Sirve también para centros de estética, uñas, cejas y pestañas (Trimito es solo para peluquerías y barberías).",
    ],
    convieneElOtro: [
      "Trabajás solo, tenés más de {gratis} turnos por mes y no querés pagar: su plan gratis no limita los turnos.",
      "Querés recordatorios por WhatsApp que salgan solos, sin tocar nada (en Prestum se mandan con un toque desde tu número).",
      "Te interesa su servicio de puesta a punto (dominio, Google Maps, identidad visual) por un pago único.",
    ],
    faqs: [
      { q: "¿Prestum manda los recordatorios solo, como Trimito?", a: "No: en Prestum el recordatorio sale desde tu propio WhatsApp con un toque, sin cupo mensual. Trimito los envía automáticamente." },
      { q: "¿Cuál conviene para una barbería con varios barberos?", a: "En Prestum, Premium cuesta {premium}/mes con barberos ilimitados, caja y comisiones. En Trimito, el plan con caja y comisiones (Completo) cuesta $49.999/mes." },
    ],
  },
  {
    slug: "reservasimple",
    nombre: "ReservaSimple",
    revisado: "2026-11-17",
    fuente: "https://www.reservasimple.com/app-turnos-peluqueria-argentina",
    queEs: "App de reservas online para negocios de muchos rubros y países de Latinoamérica, con plan gratis y un plan Premium.",
    datos: {
      precio: "Gratis; Premium $18.999/mes en Argentina",
      gratis: "Plan gratis para siempre: hasta 30 turnos/mes",
      equipo: "Profesionales ilimitados, también en el gratis",
      whatsapp: "WhatsApp automático (confirmación y hasta 3 recordatorios) en Premium; en el gratis, recordatorios por email",
      cobros: "Seña o pago total por Mercado Pago o transferencia, 0% de comisión de ReservaSimple",
      sucursales: "Calendarios por sede, sin plan específico",
      ia: "No (solo un filtro anti-spam)",
      rubros: "Muchos rubros y países",
    },
    respuesta:
      "ReservaSimple es gratis hasta 30 turnos por mes con profesionales ilimitados, y su Premium cuesta $18.999/mes con WhatsApp automático. Prestum Turnos es gratis hasta {gratis} turnos por mes y sus planes pagos cuestan menos: {basico}/mes (hasta 2 profesionales, con recordatorios por WhatsApp y seña) y {premium}/mes con equipo ilimitado, caja y comisiones.",
    ventajas: [
      "{gratis} turnos gratis por mes (ReservaSimple: 30).",
      "Planes pagos más baratos: {basico} y {premium}/mes (Premium de ReservaSimple: $18.999).",
      "Caja del día y comisiones por profesional en Premium.",
      "Hecho solo para barberías, peluquerías y estética, con textos y ejemplos de esos rubros.",
    ],
    convieneElOtro: [
      "Tenés un equipo grande y menos de 30 turnos por mes: su plan gratis no limita profesionales.",
      "Querés WhatsApp automático (sin tocar nada) o integrar las reservas en tu web, Tiendanube o Shopify.",
      "Trabajás en varios países o en un rubro fuera de belleza.",
    ],
    faqs: [
      { q: "¿Prestum tiene más turnos gratis que ReservaSimple?", a: "Sí: el plan Gratis de Prestum incluye hasta {gratis} turnos por mes; el de ReservaSimple, hasta 30." },
      { q: "¿Alguno cobra comisión por la seña?", a: "Ninguno de los dos cobra comisión propia por la seña. En Prestum el cliente la paga a tu alias o link de pago." },
    ],
  },
  {
    slug: "yaturno",
    nombre: "YaTurno",
    revisado: "2026-11-17",
    fuente: "https://www.yaturno.com.ar/precios",
    queEs: "Sistema de turnos argentino para estética, belleza y salud, con plan gratis y planes por equipo y sucursales.",
    datos: {
      precio: "Gratis; Pro $14.000, Equipo $25.000 y Empresa $34.000/mes (IVA incluido)",
      gratis: "Plan gratis: 30 turnos/mes, 1 profesional. Planes pagos con 14 días de prueba",
      equipo: "Ilimitados desde Equipo ($25.000/mes)",
      whatsapp: "Recordatorios automáticos desde Pro: ilimitados desde tu número (Meta cobra cada mensaje) o 50/mes desde el de YaTurno",
      cobros: "Seña por Mercado Pago: 4% de comisión en el gratis, 0% en los pagos",
      sucursales: "Empresa: 2 sucursales, +$6.000/mes cada una extra",
      ia: "No figura",
      rubros: "Estética, peluquería, barbería, uñas, pestañas, depilación, masajes y salud",
    },
    respuesta:
      "YaTurno tiene recordatorios automáticos por WhatsApp desde $14.000/mes y planes para varias sucursales. Prestum Turnos es gratis hasta {gratis} turnos por mes (YaTurno: 30) y un equipo con profesionales ilimitados, caja y comisiones cuesta {premium}/mes (en YaTurno, el plan Equipo cuesta $25.000).",
    ventajas: [
      "{gratis} turnos gratis por mes (YaTurno: 30), y sin comisión por la seña en ningún plan (YaTurno cobra 4% en el gratis).",
      "Equipo ilimitado con caja y comisiones por {premium}/mes (Equipo de YaTurno: $25.000).",
      "Recordatorios por WhatsApp desde tu número sin cupo y sin costo por mensaje.",
    ],
    convieneElOtro: [
      "Querés recordatorios automáticos que salgan solos, sin tocar nada.",
      "Tenés varias sucursales y necesitás caja y stock por sede.",
      "Querés pedido automático de reseñas en Google o sincronización con Google Calendar.",
    ],
    faqs: [
      { q: "¿Prestum tiene planes para varias sucursales como YaTurno?", a: "No: Prestum Turnos está pensado para un local con su equipo. Si tenés varias sedes, YaTurno tiene un plan Empresa para eso." },
      { q: "¿Cuál tiene más turnos gratis?", a: "Prestum: hasta {gratis} turnos por mes gratis. YaTurno: 30 turnos por mes con 1 profesional." },
    ],
  },
  {
    slug: "gendu",
    nombre: "Gendu",
    revisado: "2026-11-17",
    fuente: "https://www.gendu.com.ar/planes",
    queEs: "Agenda de turnos argentina para peluquerías, estética, salud y otros rubros, con plan gratis y cinco planes por cantidad de agendas.",
    datos: {
      precio: "Gratis; $9.100, $14.400, $24.000 y $42.100/mes",
      gratis: "Plan Básico gratis: turnos ilimitados, 1 agenda, recordatorios por email. Planes pagos con 15 días de prueba",
      equipo: "1 agenda hasta $9.100; 3 por $14.400; 15 por $24.000; 34 por $42.100",
      whatsapp: "Recordatorio por WhatsApp con un click en los planes pagos; el automático es un adicional (50 por $3.900/mes)",
      cobros: "Cobro online con Mercado Pago o transferencia, sin comisión de Gendu",
      sucursales: "No figura",
      ia: "No figura",
      rubros: "Peluquería, estética, uñas, tatuajes, salud y psicología",
    },
    respuesta:
      "Gendu tiene un plan gratis sin límite de turnos para 1 agenda, con recordatorios por email, y planes desde $9.100/mes. Prestum Turnos es gratis hasta {gratis} turnos por mes y, para un equipo, tiene profesionales ilimitados por {premium}/mes; en Gendu, 3 agendas cuestan $14.400 y 15 agendas, $24.000.",
    ventajas: [
      "Profesionales ilimitados por {premium}/mes (en Gendu, 3 agendas cuestan $14.400 y 15, $24.000).",
      "Caja del día y comisiones por profesional incluidas en Premium.",
      "Hecho solo para barberías, peluquerías y estética.",
    ],
    convieneElOtro: [
      "Trabajás solo, tenés más de {gratis} turnos por mes y te alcanzan los recordatorios por email: su plan gratis no limita turnos.",
      "Querés turnos recurrentes, sincronización con Google Calendar o códigos de descuento.",
      "Tenés un rubro de salud y necesitás ficha de pacientes.",
    ],
    faqs: [
      { q: "¿Los recordatorios por WhatsApp son iguales?", a: "Parecidos: en los dos se mandan con un toque. En Gendu el envío automático es un adicional pago; en Prestum los recordatorios salen desde tu número, sin cupo." },
      { q: "¿Cuál conviene para un equipo de 4 o 5 profesionales?", a: "En Prestum, Premium cuesta {premium}/mes con profesionales ilimitados. En Gendu, 3 agendas cuestan $14.400 y para más hay que pasar al plan de 15 agendas ($24.000)." },
    ],
  },
  {
    slug: "turnify",
    nombre: "Turnify",
    revisado: "2026-11-17",
    fuente: "https://www.turnifyapp.com/#precios",
    queEs: "Sistema de turnos online para profesionales de belleza y salud, con plan gratis y planes Pro y Premium.",
    datos: {
      precio: "Gratis; Pro $24.900/mes y Premium $34.900/mes",
      gratis: "Plan gratis para siempre: hasta 30 turnos/mes, 1 profesional",
      equipo: "1 en Gratis y Pro; hasta 5 en Premium (con costo extra por profesional)",
      whatsapp: "No figura (confirmaciones y recordatorios por email)",
      cobros: "No figura",
      sucursales: "No figura",
      ia: "No figura",
      rubros: "Peluquería, barbería, estética, uñas, masajes y salud",
    },
    respuesta:
      "Turnify es gratis hasta 30 turnos por mes y sus planes pagos cuestan $24.900 y $34.900 por mes, con recordatorios por email. Prestum Turnos es gratis hasta {gratis} turnos por mes, manda los recordatorios por WhatsApp desde tu número, permite pedir seña y tiene profesionales ilimitados por {premium}/mes.",
    ventajas: [
      "{gratis} turnos gratis por mes (Turnify: 30).",
      "Recordatorios por WhatsApp desde tu número (Turnify los manda por email).",
      "Seña opcional por alias o link de pago, sin comisión.",
      "Profesionales ilimitados por {premium}/mes (Premium de Turnify: hasta 5, por $34.900).",
    ],
    convieneElOtro: [
      "Preferís recordatorios automáticos por email en lugar de WhatsApp.",
      "Querés exportar reportes a Excel o un sistema de reseñas de clientes dentro de la plataforma.",
    ],
    faqs: [
      { q: "¿Prestum es más barato que Turnify?", a: "Sí, según sus precios publicados: Prestum cuesta {basico} o {premium}/mes, y Turnify $24.900 (Pro) o $34.900 (Premium)." },
      { q: "¿Los dos tienen plan gratis?", a: "Sí. Turnify incluye hasta 30 turnos por mes y Prestum, hasta {gratis}, en los dos casos sin tarjeta." },
    ],
  },
];

export const getCompetidor = (slug: string) => competidores.find((c) => c.slug === slug);
export const compararPath = (c: Competidor) => `/comparar/prestum-vs-${c.slug}`;
export const slugDeRuta = (ruta: string) => (ruta.startsWith("prestum-vs-") ? ruta.slice("prestum-vs-".length) : undefined);
