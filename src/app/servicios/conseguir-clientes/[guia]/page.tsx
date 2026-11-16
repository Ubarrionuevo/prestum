import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/config/site";
import { ACTUALIZADO } from "@/config/fechas";
import { estudio } from "@/config/servicios/estudio";
import { getGuia, guiaPath, guias } from "@/config/servicios/guias";
import { estudioId } from "@/lib/servicios";
import { Diagnostico, Faqs, HeroEstudio, Pildoras, Seccion } from "@/components/servicios/ui";

type Props = { params: Promise<{ guia: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => guias.map((g) => ({ guia: g.slug }));

const HUB = `${estudio.base}/conseguir-clientes`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuia((await params).guia);
  if (!g) return {};
  return buildMetadata({ title: g.titulo, brand: estudio.nombre, description: g.descripcion, path: guiaPath(g), keywords: [g.busqueda, g.busqueda.replace("cómo", "como")] });
}

export default async function GuiaPage({ params }: Props) {
  const g = getGuia((await params).guia);
  if (!g) notFound();
  const path = guiaPath(g);
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: "Cómo conseguir clientes", path: HUB },
    { name: g.corto, path },
  ];
  const otras = guias.filter((x) => x.slug !== g.slug);
  const articulo = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.h1,
    description: g.descripcion,
    url: absoluteUrl(path),
    inLanguage: "es-AR",
    dateModified: ACTUALIZADO.guias,
    author: { "@id": estudioId() },
    publisher: { "@id": estudioId() },
    mainEntityOfPage: absoluteUrl(path),
  };

  return (
    <>
      <JsonLd data={[articulo, faqLd(g.faqs), breadcrumbLd(crumbs)]} />
      <HeroEstudio
        migas={crumbs}
        etiqueta={`${g.emoji} Guía · Cómo conseguir clientes`}
        titulo={g.h1}
        bajada={g.bajada}
        mensaje={`Hola! Leí la guía "${g.h1}" y quiero ayuda para conseguir más clientes.`}
        secundario={{ href: "#pasos", texto: "Ver los pasos" }}
      />

      <Seccion titulo="La respuesta corta">
        <div className="mt-4 grid max-w-3xl gap-4 text-lg text-slate-700">
          {g.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Paso a paso" id="pasos" gris>
        <ol className="mt-6 grid max-w-4xl gap-4">
          {g.pasos.map((p, i) => (
            <li key={p.t} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                {i + 1}. {p.t}
              </h3>
              <p className="mt-2 text-slate-600">{p.d}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      <Seccion titulo="Errores comunes">
        <ul className="mt-5 grid max-w-3xl gap-3">
          {g.errores.map((e) => (
            <li key={e} className="flex gap-3 rounded-xl border border-slate-200 p-4 text-slate-700">
              <span aria-hidden className="font-bold text-red-600">✗</span>
              {e}
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion titulo="Cómo te ayudamos en Solvion" gris>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">{g.solvion}</p>
        <Pildoras items={g.links.map((l) => ({ href: `${estudio.base}${l.href}`, texto: l.texto }))} />
      </Seccion>

      <Diagnostico />

      <Faqs faqs={g.faqs} />

      <Seccion titulo="Más guías para conseguir clientes" gris>
        <Pildoras items={otras.map((o) => ({ href: guiaPath(o), texto: `${o.emoji} ${o.corto}` }))} />
        <Link href={HUB} className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:underline">
          Ver todas las guías →
        </Link>
      </Seccion>
    </>
  );
}
