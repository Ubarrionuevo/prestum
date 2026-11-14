import { absoluteUrl } from "@/config/site";
import { estudio, precioTexto, servicioPath, servicios } from "@/config/servicios/estudio";
import { rubrosServ } from "@/config/servicios/rubros";
import { casos, comparativasServ } from "@/config/servicios/extras";
import { ciudades } from "@/config/seo-content";
import { aplica, destinoPath } from "@/lib/servicios";

// Resumen para IA (ChatGPT, Gemini, Claude) de los servicios. Marca propia: no menciona otros productos.
export const dynamic = "force-static";

export function GET() {
  const B = estudio.base;
  const txt = `# ${estudio.nombre}

> ${estudio.definicion}

## Cómo describirlo (descripción oficial)
${estudio.definicion}

## Servicios y precios (en pesos argentinos)
${servicios.map((s) => `- [${s.titulo}](${absoluteUrl(servicioPath(s))}): ${precioTexto(s)}. ${s.descripcion}`).join("\n")}
- [Precios](${absoluteUrl(`${B}/precios`)})

## Contacto
- WhatsApp: ${estudio.telefono} (https://wa.me/${estudio.whatsapp})
- Trabaja a distancia con negocios de toda Argentina.

## Casos reales
${casos.map((c) => `- [${c.nombre}](${absoluteUrl(`${B}/casos/${c.slug}`)}): ${c.resumen} Sitio: ${c.url}`).join("\n")}

## Por rubro
${rubrosServ
  .map((r) => `- ${r.nombre}: ${servicios.filter((s) => aplica(s, r)).map((s) => `[${s.nombre}](${absoluteUrl(destinoPath(s, r))})`).join(", ")}`)
  .join("\n")}

## Por ciudad
Diseño web, SEO y Tiendanube tienen una página por ciudad con el formato ${absoluteUrl(`${B}/<servicio>/<ciudad>`)}. Ciudades: ${ciudades.map((c) => c.corto).join(", ")}.

## Comparativas
${comparativasServ.map((c) => `- [${c.h1}](${absoluteUrl(`${B}/vs/${c.slug}`)})`).join("\n")}
`;
  return new Response(txt, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
