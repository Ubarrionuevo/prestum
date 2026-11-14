import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/config/site";
import { estudio, getServicio, servicioPath } from "@/config/servicios/estudio";
import { casos, getCaso } from "@/config/servicios/extras";
import { getRubroServ } from "@/config/servicios/rubros";
import { getCiudad } from "@/config/seo-content";
import { destinoPath, estudioId } from "@/lib/servicios";
import { HeroEstudio, ListaCheck, Pildoras, Seccion } from "@/components/servicios/ui";

type Props = { params: Promise<{ caso: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return casos.map((c) => ({ caso: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCaso((await params).caso);
  if (!c) return {};
  return buildMetadata({
    title: `Caso ${c.nombre}: ${c.rubro.toLowerCase()}`,
    brand: estudio.nombre,
    description: `${c.resumen} Qué necesitaba y qué hicimos: ${c.hicimos.slice(0, 2).join(", ").toLowerCase()}.`,
    path: `${estudio.base}/casos/${c.slug}`,
  });
}

export default async function CasoPage({ params }: Props) {
  const c = getCaso((await params).caso);
  if (!c) notFound();
  const path = `${estudio.base}/casos/${c.slug}`;
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: "Casos", path: `${estudio.base}/casos` },
    { name: c.nombre, path },
  ];
  const rubro = c.rubroSlug ? getRubroServ(c.rubroSlug) : undefined;
  const ciudad = c.ciudad ? getCiudad(c.ciudad) : undefined;
  const servs = c.servicios.map(getServicio).filter((s) => s !== undefined);
  const relacionados = [
    ...servs.map((s) => ({ href: servicioPath(s), texto: `${s.emoji} ${s.titulo}` })),
    ...(rubro ? servs.map((s) => ({ href: destinoPath(s, rubro), texto: `${s.nombre} para ${rubro.nombre.toLowerCase()}` })) : []),
    ...(ciudad ? servs.map((s) => ({ href: destinoPath(s, ciudad), texto: `${s.nombre} en ${ciudad.corto}` })) : []),
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: `${c.nombre} — ${c.rubro}`,
            url: absoluteUrl(path),
            description: c.resumen,
            creator: { "@type": "ProfessionalService", "@id": estudioId(), name: estudio.nombre },
            about: { "@type": "WebSite", name: c.nombre, url: c.url },
          },
          breadcrumbLd(crumbs),
        ]}
      />
      <HeroEstudio
        migas={crumbs}
        etiqueta={`Caso real · ${c.rubro}`}
        titulo={c.nombre}
        bajada={c.resumen}
        mensaje={`Hola! Vi el caso ${c.nombre} y quiero algo parecido para mi negocio.`}
      />
      <Seccion titulo="Qué necesitaba">
        <p className="mt-4 max-w-3xl text-lg text-slate-700">{c.desafio}</p>
      </Seccion>
      <Seccion titulo="Qué hicimos" gris>
        <ListaCheck items={c.hicimos} />
        <a href={c.url} target="_blank" rel="noopener" className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800">
          Ver la web en vivo ↗
        </a>
      </Seccion>
      <Seccion titulo="Servicios relacionados">
        <Pildoras items={relacionados} />
      </Seccion>
    </>
  );
}
