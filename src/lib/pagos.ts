import { site } from "@/config/site";
import { formatPrecio } from "@/config/negocios";

/**
 * CAPA DE PAGOS — solo estructura, SIN pasarela integrada.
 *
 * Hoy el único proveedor es "manual": la solicitud queda pendiente en la base y el botón
 * abre WhatsApp para coordinar el pago. Vos activás la suscripción con
 * `select public.activar_suscripcion(<id>)`.
 *
 * Para integrar una pasarela (ej. Mercado Pago) más adelante:
 *   1. Crear un proveedor que implemente `ProveedorPagos` (iniciarPago devuelve la URL de checkout).
 *   2. Un webhook que, al confirmarse el pago, llame a activar_suscripcion / renovar_suscripcion
 *      y guarde el id externo en suscripciones.proveedor_ref.
 *   3. Cambiar `proveedorActivo`.
 * Las tablas y el panel no cambian.
 */

export type Ciclo = "mensual" | "anual";
export type EstadoSuscripcion = "pendiente" | "activa" | "vencida" | "cancelada";

export interface Suscripcion {
  id: number;
  organizacion_id: string;
  plan: string;
  ciclo: Ciclo;
  precio: number;
  fundador: boolean;
  fundador_hasta: string | null;
  estado: EstadoSuscripcion;
  inicio: string | null;
  vence: string | null;
  proveedor: "manual" | "mercadopago";
  proveedor_ref: string | null;
  created_at: string;
}

export type AccionPago = { tipo: "contacto"; url: string } | { tipo: "checkout"; url: string };

export interface ProveedorPagos {
  id: Suscripcion["proveedor"];
  /** Texto del botón para pagar una solicitud pendiente. */
  etiqueta: string;
  iniciarPago(s: Suscripcion, ctx: { negocio: string; slug: string; planNombre: string }): AccionPago;
}

/** Proveedor manual: coordinar el pago por WhatsApp. */
export const proveedorManual: ProveedorPagos = {
  id: "manual",
  etiqueta: "Coordinar el pago por WhatsApp",
  iniciarPago(s, ctx) {
    const msg =
      `Hola! Quiero activar el plan ${ctx.planNombre} (${s.ciclo}) por ${formatPrecio(s.precio)}` +
      `${s.fundador ? " con precio fundador" : ""} para ${ctx.negocio} (prestum.com.ar/${ctx.slug}). Solicitud #${s.id}.`;
    return { tipo: "contacto", url: `https://wa.me/${site.whatsappVentas}?text=${encodeURIComponent(msg)}` };
  },
};

/** Proveedor en uso. Al integrar una pasarela, se cambia solo esta línea. */
export const proveedorActivo: ProveedorPagos = proveedorManual;
