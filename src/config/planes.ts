/**
 * PLANES Y PRECIOS — valores de respaldo.
 *
 * Los precios REALES se editan en Supabase (tablas `planes` y `ajustes`), sin tocar código.
 * Estos valores se usan solo si Supabase no está conectado (ej: en desarrollo) y deben
 * coincidir con el seed de supabase/schema.sql.
 */

/** Días de prueba gratis (para los textos de marketing; la base usa ajustes.prueba_dias). */
export const PRUEBA_DIAS = 30;

/** Días de la prueba en que se le muestra un aviso al dueño. */
export const AVISOS_PRUEBA = [7, 20, 27];

export type PlanId = "inicial" | "profesional" | "empresa";

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
}

export interface Fundador {
  plan: PlanId;
  precio_mensual: number;
  precio_anual: number;
  cupo: number;
  meses: number;
  activo: boolean;
  /** Lugares que quedan (null = desconocido, ej. sin base conectada). */
  restantes?: number | null;
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

export const FUNDADOR_DEFAULT: Fundador = {
  plan: "profesional",
  precio_mensual: 14900,
  precio_anual: 149000,
  cupo: 50,
  meses: 12,
  activo: true,
};

/** Cuántos meses "regala" el plan anual frente a pagar 12 meses. */
export const mesesGratisAnual = (p: Pick<Plan, "precio_mensual" | "precio_anual">) =>
  p.precio_mensual > 0 ? Math.round(12 - p.precio_anual / p.precio_mensual) : 0;
