import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase.
 *
 * Ahorro en Vercel: el panel, el registro y las reservas hablan DIRECTO con Supabase desde
 * el navegador (no pasan por funciones de Vercel). La seguridad la dan las políticas RLS y
 * las funciones RPC de supabase/schema.sql.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && key);

let browserClient: SupabaseClient | null = null;

/** Cliente para el navegador (guarda la sesión en localStorage). */
export function getSupabase(): SupabaseClient {
  if (!supabaseConfigured) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  browserClient ??= createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true } });
  return browserClient;
}

/** Cliente para el servidor (sin sesión): solo lecturas públicas. */
export function getServerSupabase(accessToken?: string): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  return createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}

/** Columnas públicas del negocio (las mismas que permite el GRANT a anon). */
export const NEGOCIO_PUBLICO =
  "id, slug, nombre, rubro, whatsapp, descripcion, direccion, servicios, horarios, medios_pago, dias_anticipacion, plan, prueba_hasta, pago_hasta, recurso_etiqueta, sena, fidelizacion";

export type PagoKey = "efectivo" | "transferencia" | "mercadopago";
export const PAGOS: PagoKey[] = ["efectivo", "transferencia", "mercadopago"];

export type Rol = "dueno" | "recepcion" | "profesional";

export interface OrganizacionDB {
  id: string;
  nombre: string;
  plan: "prueba" | "inicial" | "profesional" | "empresa" | "barberia_basico" | "barberia_premium";
  prueba_hasta: string;
  pago_hasta: string | null;
}

export interface MiembroDB {
  id: number;
  organizacion_id: string;
  user_id: string | null;
  email: string;
  rol: Rol;
  negocio_id: string | null;
  recurso_id: string | null;
  estado: "invitado" | "activo";
}

export interface NegocioDB {
  id: string;
  organizacion_id?: string;
  slug: string;
  nombre: string;
  rubro: string | null;
  whatsapp: string;
  descripcion: string | null;
  direccion: string | null;
  servicios: Array<{ id: string; nombre: string; precio: number; duracion: number }>;
  horarios: Record<string, Array<[string, string]>>;
  medios_pago: PagoKey[];
  dias_anticipacion: number;
  plan: "prueba" | "inicial" | "profesional" | "empresa" | "barberia_basico" | "barberia_premium";
  prueba_hasta: string;
  pago_hasta: string | null;
  recurso_etiqueta: string;
  sena?: SenaConfig;
  fidelizacion?: FidelizacionConfig;
  recordatorio_plantilla?: string | null;
}

export interface SenaConfig {
  activa: boolean;
  tipo: "porcentaje" | "fijo";
  valor: number;
  alias: string;
  /** Link de pago del negocio (ej. link de Mercado Pago que el negocio genera por su cuenta). */
  link: string;
  /** Minutos para pagar antes de que se libere el horario. */
  minutos: number;
}

export interface FidelizacionConfig {
  activa: boolean;
  /** Cada cuántas visitas la siguiente es gratis. */
  cada: number;
}

export interface RecursoDB {
  id: string;
  negocio_id: string;
  nombre: string;
  servicios: string[];
  horarios: Record<string, Array<[string, string]>> | null;
  activo: boolean;
  orden: number;
  comision_pct?: number;
}

/** Fecha de hoy en Argentina (YYYY-MM-DD). */
export function hoyAR() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date());
}

/** ¿La agenda acepta reservas? (prueba vigente o plan pago vigente) */
export function negocioActivo(n: Pick<NegocioDB, "prueba_hasta" | "pago_hasta">) {
  const hoy = hoyAR();
  return n.prueba_hasta >= hoy || (n.pago_hasta ?? "") >= hoy;
}

export function diasRestantes(hasta: string) {
  const ms = new Date(`${hasta}T23:59:59-03:00`).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}

/** Mensajes de error de las RPC → texto para el usuario. */
export function errorAmigable(msg?: string) {
  const m = msg ?? "";
  if (m.includes("horario_ocupado")) return "Ese horario se acaba de ocupar. Elegí otro.";
  if (m.includes("telefono_invalido")) return "Revisá el WhatsApp (código de área + número).";
  if (m.includes("funcion_no_disponible")) return "Esta función no está incluida en el plan.";
  if (m.includes("lista_completa")) return "La lista de espera de ese día está completa.";
  if (m.includes("limite_sucursales")) return "Tu plan no permite más sucursales. Pasate a Empresa para tener varias.";
  if (m.includes("plan_sin_roles")) return "Tu plan no incluye equipo con roles. Pasate a Empresa.";
  if (m.includes("ultima_sucursal")) return "No podés borrar tu única sucursal.";
  if (m.includes("email_invalido")) return "Revisá el email.";
  if (m.includes("es_dueno")) return "Esa persona es la dueña de la cuenta.";
  if (m.includes("limite_recursos")) return "Tu plan no permite más recursos activos. Desactivá uno o pasate a un plan superior.";
  if (m.includes("recurso_invalido")) return "Esa opción ya no está disponible. Elegí otra.";
  if (m.includes("agenda_pausada")) return "Esta agenda no está recibiendo reservas por el momento.";
  if (m.includes("horario_pasado")) return "Ese horario ya pasó. Elegí otro.";
  if (m.includes("demasiadas_reservas")) return "Hay muchas reservas en este momento. Probá en unos minutos.";
  if (m.includes("fuera_de_horario") || m.includes("fecha_invalida")) return "Ese horario no está disponible.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Ese email ya tiene una cuenta. Ingresá con tu contraseña.";
  if (m.includes("Invalid login credentials")) return "Email o contraseña incorrectos.";
  if (m.includes("Password should be")) return "La contraseña tiene que tener al menos 6 caracteres.";
  if (m.includes("rate limit")) return "Demasiados intentos. Esperá un minuto y probá de nuevo.";
  if (m.includes("Database error")) return "No pudimos crear la cuenta. Revisá el WhatsApp (código de área + número).";
  return "Algo salió mal. Probá de nuevo.";
}
