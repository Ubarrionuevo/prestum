import { absoluteUrl } from "@/config/site";
import { ACTUALIZADO } from "@/config/fechas";
import { estudio, servicioPath, servicios } from "@/config/servicios/estudio";
import { casos, comparativasServ } from "@/config/servicios/extras";
import { serviciosRoutes } from "@/lib/servicios";

// SITEMAP DE SERVICIOS (marca propia, separado de Prestum Turnos).
// Fecha REAL del último cambio de contenido (config/fechas.ts), no la del deploy.
export const dynamic = "force-static";

export function GET() {
  const fecha = ACTUALIZADO.servicios;
  const B = estudio.base;
  const urls: Array<[string, number]> = [
    [B, 0.9],
    [`${B}/precios`, 0.8],
    [`${B}/rubros`, 0.6],
    [`${B}/casos`, 0.6],
    ...servicios.map((s) => [servicioPath(s), 0.8] as [string, number]),
    ...casos.map((c) => [`${B}/casos/${c.slug}`, 0.5] as [string, number]),
    ...comparativasServ.map((c) => [`${B}/vs/${c.slug}`, 0.6] as [string, number]),
    ...serviciosRoutes().map((r) => [`${B}/${r.servicio}/${r.destino}`, 0.6] as [string, number]),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, pr]) => `  <url><loc>${absoluteUrl(p)}</loc><lastmod>${fecha}</lastmod><priority>${pr}</priority></url>`).join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
