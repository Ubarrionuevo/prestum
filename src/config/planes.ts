/**
 * PLANES Y PRECIOS — valores de respaldo.
 *
 * Los precios REALES se editan en Supabase (tablas `planes` y `ajustes`), sin tocar código.
 * Estos valores se usan solo si Supabase no está conectado (ej: en desarrollo) y deben
 * coincidir con el seed de supabase/schema.sql.
 */

/** Días de prueba gratis de la base (ajustes.prueba_dias). Solo para el panel: la web pública vende el plan Gratis. */
export const PRUEBA_DIAS = 30;

/**
 * OFERTA PÚBLICA (lo que muestra la web): plan Gratis hasta TURNOS_GRATIS turnos por mes, sin vencimiento
 * y sin tarjeta, y después los planes pagos Básico y Premium (precios desde Supabase: barberia_basico / barberia_premium).
 * Referencia: Cortik da 40 turnos gratis por mes; acá damos 45.
 */
export const TURNOS_GRATIS = 45;
/** Frase corta de la oferta, para botones, etiquetas y títulos. */
export const OFERTA_CORTA = `Gratis hasta ${TURNOS_GRATIS} turnos por mes`;

/** Días de la prueba en que se le muestra un aviso al dueño. */
export const AVISOS_PRUEBA = [7, 20, 27];

export type PlanId = "gratis" | "inicial" | "profesional" | "empresa" | "barberia_basico" | "barberia_premium";

export interface PlanItem {
  texto: string;
  /** true = todavía no está disponible (se muestra "Próximamente"). */
  pronto?: boolean;
}

export interface Plan {
  id: PlanId;
  nombre: string;
  bajada: string;
  precio_mensual: number;
  precio_anual: number;
  recursos_max: number | null;
  /** Sucursales permitidas (null = ilimitadas). */
  sucursales_max?: number | null;
  /** ¿Permite equipo con roles (recepción, profesional)? */
  roles?: boolean;
  /** Funciones incluidas: recordatorios, sena, lista_espera, caja, fidelizacion, reportes. */
  funciones?: string[];
  items: PlanItem[];
  destacado: boolean;
  orden: number;
  /** Rubro al que pertenece el plan (null/ausente = planes generales, para todos los rubros). */
  rubro?: string | null;
  /** false = solo se paga por mes (no tiene opción anual). */
  anual?: boolean;
}

export const PLANES_DEFAULT: Plan[] = [
  {
    id: "inicial",
    nombre: "Inicial",
    bajada: "Para arrancar con hasta 2 profesionales, canchas o salas.",
    precio_mensual: 14900,
    precio_anual: 149000,
    recursos_max: 2,
    sucursales_max: 1,
    roles: false,
    funciones: ["recordatorios", "sena"],
    destacado: false,
    orden: 1,
    items: [
      { texto: "Hasta 2 recursos (profesionales, canchas o salas)" },
      { texto: "Link de reservas propio" },
      { texto: "Recordatorios por WhatsApp" },
      { texto: "Seña con Mercado Pago" },
    ],
  },
  {
    id: "profesional",
    nombre: "Profesional",
    bajada: "Para equipos que quieren llenar la agenda y ordenar la caja.",
    precio_mensual: 22900,
    precio_anual: 229000,
    recursos_max: null,
    sucursales_max: 1,
    roles: false,
    funciones: ["recordatorios", "sena", "lista_espera", "caja", "fidelizacion"],
    destacado: true,
    orden: 2,
    items: [
      { texto: "Todo lo del Inicial" },
      { texto: "Recursos ilimitados" },
      { texto: "Lista de espera automática" },
      { texto: "Comisiones y caja por profesional" },
      { texto: "Fidelización (cada X visitas, 1 gratis)" },
    ],
  },
  {
    id: "empresa",
    nombre: "Empresa",
    bajada: "Para negocios con varias sucursales y equipo grande.",
    precio_mensual: 44900,
    precio_anual: 449000,
    recursos_max: null,
    sucursales_max: null,
    roles: true,
    funciones: ["recordatorios", "sena", "lista_espera", "caja", "fidelizacion", "reportes"],
    destacado: false,
    orden: 3,
    items: [
      { texto: "Todo lo del Profesional" },
      { texto: "Varias sucursales en un mismo panel" },
      { texto: "Roles y permisos (dueño, recepción, profesional)" },
      { texto: "Reportes avanzados y exportación a Excel" },
      { texto: "Soporte prioritario por WhatsApp" },
    ],
  },
];

/**
 * Planes BÁSICO y PREMIUM (solo pago mensual). En la base están atados al rubro "barberias";
 * la web pública los muestra para todos (ver ofertaPublica). Los TEXTOS de la web salen de acá;
 * los PRECIOS, de Supabase.
 */
export const PLANES_BARBERIAS_DEFAULT: Plan[] = [
  {
    id: "barberia_basico",
    nombre: "Básico",
    bajada: "Para el que trabaja solo o con un compañero.",
    precio_mensual: 9000,
    precio_anual: 0,
    anual: false,
    rubro: "barberias",
    recursos_max: 2,
    sucursales_max: 1,
    roles: false,
    funciones: ["recordatorios", "sena"],
    destacado: false,
    orden: 11,
    items: [
      { texto: "Turnos ilimitados" },
      { texto: "Hasta 2 profesionales" },
      { texto: "Link de reservas propio" },
      { texto: "Recordatorios por WhatsApp" },
      { texto: "Seña con Mercado Pago" },
    ],
  },
  {
    id: "barberia_premium",
    nombre: "Premium",
    bajada: "Para el equipo que quiere llenar la agenda y ordenar la caja.",
    precio_mensual: 15000,
    precio_anual: 0,
    anual: false,
    rubro: "barberias",
    recursos_max: null,
    sucursales_max: 1,
    roles: false,
    funciones: ["recordatorios", "sena", "lista_espera", "caja", "fidelizacion"],
    destacado: true,
    orden: 12,
    items: [
      { texto: "Todo lo del Básico" },
      { texto: "Profesionales ilimitados" },
      { texto: "Lista de espera automática" },
      { texto: "Comisiones y caja por profesional" },
      { texto: "Fidelización (cada X visitas, 1 gratis)" },
    ],
  },
];

/** Plan Gratis de la web: sin vencimiento y sin tarjeta, hasta TURNOS_GRATIS turnos por mes. */
export const PLAN_GRATIS: Plan = {
  id: "gratis",
  nombre: "Gratis",
  bajada: "Para empezar sin pagar nada. Sin vencimiento.",
  precio_mensual: 0,
  precio_anual: 0,
  anual: false,
  recursos_max: 1,
  sucursales_max: 1,
  roles: false,
  funciones: [],
  destacado: false,
  orden: 0,
  items: [
    { texto: `Hasta ${TURNOS_GRATIS} turnos por mes` },
    { texto: "1 profesional" },
    { texto: "Link de reservas propio" },
    { texto: "Reservas directo a tu WhatsApp" },
  ],
};

/**
 * Lo que muestra la web pública: Gratis + Básico + Premium, con los precios de Supabase
 * (si están) y los textos de este archivo.
 */
export function ofertaPublica(todos: Plan[]): Plan[] {
  const pagos = PLANES_BARBERIAS_DEFAULT.map((def) => {
    const db = todos.find((p) => p.id === def.id);
    return db ? { ...def, precio_mensual: db.precio_mensual, precio_anual: db.precio_anual } : def;
  });
  return [PLAN_GRATIS, ...pagos];
}

/** Planes pagos de una lista (sin el Gratis), del más barato al más caro. */
export const planesPagos = (planes: Plan[]) => planes.filter((p) => p.precio_mensual > 0).sort((a, b) => a.precio_mensual - b.precio_mensual);

/** Todos los planes (generales + por rubro): para saber qué incluye el plan de una cuenta. */
export const PLANES_TODOS_DEFAULT: Plan[] = [...PLANES_DEFAULT, ...PLANES_BARBERIAS_DEFAULT];

/** Rubros que usan los planes Básico/Premium (en la base están cargados con rubro "barberias"). */
const RUBROS_PLAN_BARBERIA = ["barberias", "peluquerias", "esteticistas", "manicuria"];

/**
 * Planes que se ofrecen a un rubro: barberías, peluquerías y estética usan Básico/Premium;
 * el resto, los generales.
 */
export function planesPara(todos: Plan[], rubro?: string | null): Plan[] {
  const r = rubro && RUBROS_PLAN_BARBERIA.includes(rubro) ? "barberias" : rubro;
  const propios = r ? todos.filter((p) => p.rubro === r) : [];
  if (propios.length) return propios;
  const generales = todos.filter((p) => !p.rubro);
  return generales.length ? generales : PLANES_DEFAULT;
}

/** ¿El plan tiene opción de pago anual? */
export const tieneAnual = (p: Pick<Plan, "anual">) => p.anual !== false;

/** Cuántos meses "regala" el plan anual frente a pagar 12 meses. */
export const mesesGratisAnual = (p: Pick<Plan, "precio_mensual" | "precio_anual" | "anual">) =>
  p.precio_mensual > 0 && tieneAnual(p) ? Math.round(12 - p.precio_anual / p.precio_mensual) : 0;
