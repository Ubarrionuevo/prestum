import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio } from "@/config/servicios/estudio";
import { casos } from "@/config/servicios/extras";
import { HeroEstudio, Seccion } from "@/components/servicios/ui";

const path = `${estudio.base}/casos`;

export const metadata: Metadata = buildMetadata({
  title: "Casos reales: páginas web y SEO publicados",
  brand: estudio.nombre,
  description: `Trabajos reales y publicados: ${casos.map((c) => c.nombre).join(" y ")}. Qué necesitaba cada negocio y qué hicimos.`,
  path,
});

export default function Casos() {
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: "Casos", path },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs)]} />
      <HeroEstudio migas={crumbs} etiqueta="Trabajos publicados" titulo="Casos reales" bajada="Webs que están online y funcionando. Entrá, miralas en tu celular y escribinos." mensaje="Hola! Vi sus casos y quiero algo parecido para mi negocio." />
      <Seccion>
        <div className="grid gap-4 md:grid-cols-2">
          {casos.map((c) => (
            <Link key={c.slug} href={`${path}/${c.slug}`} className="rounded-2xl border border-slate-200 p-6 hover:border-amber-400">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{c.rubro}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{c.nombre}</p>
              <p className="mt-2 text-slate-600">{c.resumen}</p>
            </Link>
          ))}
        </div>
      </Seccion>
    </>
  );
}
