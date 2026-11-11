import type { MetadataRoute } from "next";
import { activeProducts, esRubroFoco, nichePath, productHomePath } from "@/config/products";
import { glosario } from "@/config/seo-content";
import { compararPath, competidores } from "@/config/comparativas";
import { articulos } from "@/config/blog";
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
    // Rubros foco arriba; los secundarios (páginas de "también sirve para…") con menos prioridad.
    for (const niche of product.niches) entries.push(url(nichePath(product, niche), esRubroFoco(niche) ? 0.9 : 0.5));
  }
  entries.push(url("/precios", 0.8), url("/registro", 0.7), url("/glosario", 0.8));
  for (const t of glosario) entries.push(url(`/glosario/${t.slug}`, 0.8));
  entries.push(url("/blog", 0.8));
  for (const a of articulos) entries.push({ ...url(`/blog/${a.slug}`, 0.8), lastModified: new Date(`${a.actualizado ?? a.publicado}T12:00:00`) });
  entries.push(url("/comparar", 0.8));
  for (const c of competidores) entries.push(url(compararPath(c), 0.8));
  entries.push(url("/legal/terminos", 0.1), url("/legal/privacidad", 0.1));

  // Negocios con plan pago (los de prueba no se indexan).
  const sb = getServerSupabase();
  if (sb) {
    const { data } = await sb.from("negocios").select("slug").gte("pago_hasta", hoyAR()).limit(5000);
    for (const n of data ?? []) entries.push(url(`/${n.slug}`, 0.5));
  }
  return entries;
}
