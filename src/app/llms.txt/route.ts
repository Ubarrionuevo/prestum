import { getDefaultProduct, nichePath } from "@/config/products";
import { getPrecios } from "@/lib/planes";
import { PRUEBA_DIAS } from "@/config/planes";
import { absoluteUrl, site } from "@/config/site";
import { formatPrecio } from "@/config/negocios";

// /llms.txt: resumen del producto para asistentes de IA. Se regenera 1 vez por día.
export const revalidate = 86400;

export async function GET() {
  const p = getDefaultProduct();
  const { planes, fundador } = await getPrecios();
  const txt = `# ${p.brandName}

> ${p.brandName} es un turnero online para profesionales y comercios de Argentina, hecho por ${site.name}. Cada negocio tiene su link propio (prestum.com.ar/nombre-del-negocio) donde sus clientes eligen servicio, día, horario y medio de pago; la reserva le llega armada al WhatsApp del negocio. ${PRUEBA_DIAS} días gratis con todas las funciones, sin tarjeta.

## Qué resuelve
${p.benefits.map((b) => `- ${b.title}: ${b.text}`).join("\n")}
- Panel con métricas simples: turnos tomados, ingresos estimados, próximos turnos y medios de pago más usados.

## Precios (en pesos argentinos)
- Prueba gratis: ${PRUEBA_DIAS} días con todas las funciones, sin tarjeta.
${planes.map((pl) => `- ${pl.nombre}: ${formatPrecio(pl.precio_mensual)}/mes o ${formatPrecio(pl.precio_anual)}/año. ${pl.items.filter((i) => !i.pronto).map((i) => i.texto).join(", ")}.`).join("\n")}
${fundador.activo ? `- Precio fundador: los primeros ${fundador.cupo} negocios tienen el plan ${planes.find((x) => x.id === fundador.plan)?.nombre ?? ""} a ${formatPrecio(fundador.precio_mensual)}/mes, congelado ${fundador.meses} meses.` : ""}
- Anual: 2 meses gratis. Sin contrato y sin comisión por turno.

## Rubros
${p.niches.map((n) => `- [${p.name} para ${n.name.toLowerCase()}](${absoluteUrl(nichePath(p, n))})`).join("\n")}

## Enlaces
- [Inicio](${absoluteUrl("/")})
- [Precios](${absoluteUrl("/precios")})
- [Crear cuenta gratis](${absoluteUrl("/registro")})
- [Demo](${absoluteUrl("/demo")})
- [Glosario](${absoluteUrl("/glosario")})
- Contacto: ${site.email}
`;
  return new Response(txt, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
