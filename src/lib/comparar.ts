import type { Plan } from "@/config/planes";
import { TURNOS_GRATIS } from "@/config/planes";
import { formatPrecio } from "@/config/negocios";
import type { FilaId } from "@/config/comparativas";

/** Datos de la oferta de Prestum para los textos de las comparativas (siempre los vigentes). */
export function preciosPrestum(planes: Plan[]) {
  const p = (id: string) => formatPrecio(planes.find((x) => x.id === id)?.precio_mensual ?? 0);
  return { gratis: String(TURNOS_GRATIS), basico: p("barberia_basico"), premium: p("barberia_premium") };
}

/** Reemplaza {gratis} (turnos gratis por mes), {basico} y {premium} por los valores reales. */
export function conPrecios(texto: string, precios: ReturnType<typeof preciosPrestum>) {
  return texto.replace(/\{(gratis|basico|premium)\}/g, (_, k: keyof typeof precios) => precios[k]);
}

/** Columna de Prestum en la tabla (sale de la oferta real). */
export function datosPrestum(planes: Plan[]): Record<FilaId, string> {
  const { gratis, basico, premium } = preciosPrestum(planes);
  return {
    precio: `Gratis; pagos de ${basico} y ${premium}/mes`,
    gratis: `Plan gratis para siempre: ${gratis} turnos/mes, 1 profesional, sin tarjeta`,
    equipo: `Hasta 2 en Básico (${basico}); ilimitados en Premium (${premium}/mes)`,
    whatsapp: "La reserva llega a tu WhatsApp; recordatorios con un toque, sin cupo",
    cobros: "Seña opcional a tu alias o link de pago, 0% comisión",
    sucursales: "Una sucursal por cuenta",
    ia: "No",
    rubros: "Barberías, peluquerías y estética (también otros rubros con turnos)",
  };
}
