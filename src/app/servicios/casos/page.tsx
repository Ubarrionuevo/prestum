import type { Metadata } from "next";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio } from "@/config/servicios/estudio";
import { casos } from "@/config/servicios/extras";
import { HeroEstudio, Seccion, TarjetaCaso } from "@/components/servicios/ui";

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
            <TarjetaCaso key={c.slug} caso={c} />
          ))}
        </div>
      </Seccion>
    </>
  );
}
