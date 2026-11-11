import type { Faq, Niche, Product } from "@/config/types";
import { TURNOS_GRATIS, planesPagos, tieneAnual, type Plan } from "@/config/planes";
import { formatPrecio } from "@/config/negocios";

/**
 * Preguntas de una página de rubro, con la de precio armada con los planes reales de ese rubro
 * (barberías tiene 2 planes sin anual; el resto, 3 con anual). Reemplaza el "¿Cuánto cuesta?"
 * genérico del producto para que nunca diga algo distinto a lo que muestra la tabla de precios.
 */
export function faqsDeRubro(product: Product, niche: Niche | undefined, planes: Plan[]): Faq[] {
  const pagos = planesPagos(planes);
  const lista = pagos.map((p) => `${p.nombre} (${formatPrecio(p.precio_mensual)}/mes)`);
  const nombres = lista.length > 1 ? `${lista.slice(0, -1).join(", ")} y ${lista[lista.length - 1]}` : lista.join("");
  const anual = pagos.some((p) => tieneAnual(p)) ? " Con pago anual te ahorrás 2 meses." : "";
  const precio: Faq = {
    q: niche ? `¿Cuánto cuesta un sistema de turnos para ${niche.name.toLowerCase()}?` : "¿Cuánto cuesta?",
    a: `Es gratis hasta ${TURNOS_GRATIS} turnos por mes, sin tarjeta y sin vencimiento. Si necesitás más, hay ${pagos.length} planes con precio fijo en pesos: ${nombres}.${anual} Sin contrato y sin comisión por turno.`,
  };
  const delProducto = product.faqs.map((f) => (f.q === "¿Cuánto cuesta?" && pagos.length ? precio : f));
  return niche ? [...niche.faqs, ...delProducto] : delProducto;
}
