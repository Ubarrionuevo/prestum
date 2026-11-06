import type { MetadataRoute } from "next";
import { activeProducts, nichePath, productHomePath } from "@/config/products";
import { glosario } from "@/config/seo-content";
import { absoluteUrl } from "@/config/site";
import { getServerSupabase, hoyAR } from "@/lib/supabase";

// SITEMAP PRINCIPAL (alta prioridad): home, rubros, precios, glosario, legales y negocios pagos.
// Las páginas por ciudad van aparte en /sitemap-pseo.xml (protege el presupuesto de rastreo).
// Se regenera 1 vez por día (no en cada visita de un bot): ahorro de funciones y lecturas.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const url = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  const entries: MetadataRoute.Sitemap = [];
  for (const product of activeProducts()) {
    const home = productHomePath(product);
    entries.push(url(home, home === "/" ? 1 : 0.9, "weekly"));
    for (const niche of product.niches) entries.push(url(nichePath(product, niche), 0.8));
  }
  entries.push(url("/precios", 0.8), url("/registro", 0.7), url("/turnos-online", 0.7), url("/glosario", 0.8));
  for (const t of glosario) entries.push(url(`/glosario/${t.slug}`, 0.8));
  entries.push(url("/legal/terminos", 0.1), url("/legal/privacidad", 0.1));

  // Negocios con plan pago (los de prueba no se indexan).
  const sb = getServerSupabase();
  if (sb) {
    const { data } = await sb.from("negocios").select("slug").gte("pago_hasta", hoyAR()).limit(5000);
    for (const n of data ?? []) entries.push(url(`/${n.slug}`, 0.5));
  }
  return entries;
}
