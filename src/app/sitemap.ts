import type { MetadataRoute } from "next";
import { activeProducts, esRubroFoco, nichePath, productHomePath } from "@/config/products";
import { glosario } from "@/config/seo-content";
import { compararPath, competidores } from "@/config/comparativas";
import { articulos } from "@/config/blog";
import { solucionPath, soluciones } from "@/config/soluciones";
import { fechaDe, type SeccionFecha } from "@/config/fechas";
import { absoluteUrl } from "@/config/site";
import { getServerSupabase, hoyAR } from "@/lib/supabase";

// SITEMAP PRINCIPAL (alta prioridad): home, rubros, funciones, precios, glosario, blog, comparativas,
// legales y negocios pagos. Las páginas por ciudad van aparte en /sitemap-pseo.xml.
// lastmod = fecha REAL de cambio de contenido (config/fechas.ts), no la del deploy.
// Se regenera 1 vez por día (no en cada visita de un bot): ahorro de funciones y lecturas.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string, priority: number, fecha?: SeccionFecha | string, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: absoluteUrl(path),
    ...(fecha ? { lastModified: fechaDe(fecha) } : {}),
    changeFrequency,
    priority,
  });

  const entries: MetadataRoute.Sitemap = [];
  for (const product of activeProducts()) {
    const home = productHomePath(product);
    entries.push(url(home, home === "/" ? 1 : 0.9, "home", "weekly"));
    // Rubros foco arriba; los secundarios (páginas de "también sirve para…") con menos prioridad.
    for (const niche of product.niches) {
      const foco = esRubroFoco(niche);
      entries.push(url(nichePath(product, niche), foco ? 0.9 : 0.5, foco ? "rubrosFoco" : "rubrosSecundarios"));
    }
  }
  entries.push(url("/que-es-prestum", 0.9, "queEsPrestum"));
  entries.push(url("/funciones", 0.8, "funciones"));
  for (const s of soluciones) entries.push(url(solucionPath(s), 0.8, "funciones"));
  entries.push(url("/calculadora-ausencias", 0.7, "calculadora"));
  entries.push(url("/precios", 0.8, "precios"), url("/registro", 0.7, "registro"));
  entries.push(url("/glosario", 0.8, "glosario"));
  for (const t of glosario) entries.push(url(`/glosario/${t.slug}`, 0.8, "glosario"));
  const ultimoArticulo = articulos.map((a) => a.actualizado ?? a.publicado).sort().at(-1);
  entries.push(url("/blog", 0.8, ultimoArticulo));
  for (const a of articulos) entries.push(url(`/blog/${a.slug}`, 0.8, a.actualizado ?? a.publicado));
  entries.push(url("/comparar", 0.8, "comparar"));
  for (const c of competidores) entries.push(url(compararPath(c), 0.8, "comparar"));
  entries.push(url("/legal/terminos", 0.1, "terminos"), url("/legal/privacidad", 0.1, "privacidad"));

  // Negocios con plan pago (los de prueba no se indexan). Sin lastmod: no sabemos cuándo cambió su página.
  const sb = getServerSupabase();
  if (sb) {
    const { data } = await sb.from("negocios").select("slug").gte("pago_hasta", hoyAR()).limit(5000);
    for (const n of data ?? []) entries.push(url(`/${n.slug}`, 0.5));
  }
  return entries;
}
