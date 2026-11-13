import { absoluteUrl } from "@/config/site";
import { pseoRoutes } from "@/lib/pseo";
import { ACTUALIZADO } from "@/config/fechas";

// SITEMAP GEOLOCALIZADO (prioridad 0.7): combinaciones rubro × ciudad, solo de los RUBROS FOCO.
// Va separado del principal para que Google rastree primero lo importante.
// Los rubros en NO_PSEO_RUBROS (seo-content.ts) quedan afuera.
export const revalidate = 86400;

export function GET() {
  // Fecha REAL del último cambio de contenido de estas páginas (config/fechas.ts), no la del deploy.
  const fecha = ACTUALIZADO.ciudades;
  const paths = pseoRoutes().map((r) => `/${r.producto}/${r.nicho}/${r.ciudad}`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${absoluteUrl(p)}</loc><lastmod>${fecha}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
