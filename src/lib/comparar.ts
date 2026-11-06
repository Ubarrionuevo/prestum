import type { Plan } from "@/config/planes";
import { PRUEBA_DIAS } from "@/config/planes";
import { formatPrecio } from "@/config/negocios";
import type { FilaId } from "@/config/comparativas";

/** Precios de Prestum para los textos de las comparativas (siempre los vigentes). */
export function preciosPrestum(planes: Plan[]) {
  const p = (id: string) => formatPrecio(planes.find((x) => x.id === id)?.precio_mensual ?? 0);
  return { inicial: p("inicial"), profesional: p("profesional"), empresa: p("empresa") };
}

/** Reemplaza {inicial}, {profesional} y {empresa} por los precios reales. */
export function conPrecios(texto: string, precios: ReturnType<typeof preciosPrestum>) {
  return texto.replace(/\{(inicial|profesional|empresa)\}/g, (_, k: keyof typeof precios) => precios[k]);
}

/** Columna de Prestum en la tabla (sale de la configuración real de planes). */
export function datosPrestum(planes: Plan[]): Record<FilaId, string> {
  const { inicial, profesional, empresa } = preciosPrestum(planes);
  return {
    precio: `${inicial}, ${profesional} y ${empresa}/mes`,
    gratis: `${PRUEBA_DIAS} días gratis con todas las funciones, sin tarjeta`,
    equipo: `Hasta 2 en Inicial; ilimitados desde ${profesional}/mes`,
    whatsapp: "La reserva llega a tu WhatsApp; recordatorios con un toque, sin cupo",
    cobros: "Seña opcional a tu alias o link de pago, 0% comisión",
    sucursales: `Plan Empresa: ${empresa}/mes, con roles`,
    ia: "No",
    rubros: "Cualquier negocio con turnos",
  };
}
