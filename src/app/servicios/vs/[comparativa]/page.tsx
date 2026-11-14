import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio, getServicio, precioTexto, servicioPath } from "@/config/servicios/estudio";
import { comparativasServ, getComparativaServ } from "@/config/servicios/extras";
import { Faqs, HeroEstudio, Pildoras, Seccion } from "@/components/servicios/ui";

type Props = { params: Promise<{ comparativa: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return comparativasServ.map((c) => ({ comparativa: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getComparativaServ((await params).comparativa);
  if (!c) return {};
  return buildMetadata({ title: c.titulo, brand: estudio.nombre, description: c.descripcion, path: `${estudio.base}/vs/${c.slug}` });
}

export default async function ComparativaPage({ params }: Props) {
  const c = getComparativaServ((await params).comparativa);
  if (!c) notFound();
  const path = `${estudio.base}/vs/${c.slug}`;
  const s = getServicio(c.servicio)!;
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: c.h1, path },
  ];
  return (
    <>
      <JsonLd data={[faqLd(c.faqs), breadcrumbLd(crumbs)]} />
      <HeroEstudio migas={crumbs} etiqueta="Comparativa" titulo={c.h1} bajada={c.intro} mensaje={`Hola! Estoy comparando ${c.nosotros.toLowerCase()} con ${c.otro} y quiero consultar.`} />
      <Seccion>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th scope="col" className="p-4 font-semibold"></th>
                <th scope="col" className="p-4 font-semibold">{c.otro}</th>
                <th scope="col" className="p-4 font-semibold">{c.nosotros}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {c.filas.map((f) => (
                <tr key={f.aspecto}>
                  <th scope="row" className="p-4 font-medium text-slate-900">{f.aspecto}</th>
                  <td className="p-4 text-slate-600">{f.otro}</td>
                  <td className="p-4 text-slate-800">{f.nosotros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-3xl text-slate-600">
          <strong className="text-slate-900">Cuándo conviene {c.otro}:</strong> {c.cuandoOtro}
        </p>
      </Seccion>
      <Faqs faqs={c.faqs} />
      <Seccion titulo="Seguir leyendo" gris>
        <Pildoras
          items={[
            { href: servicioPath(s), texto: `${s.emoji} ${s.titulo} · ${precioTexto(s)}` },
            ...comparativasServ.filter((x) => x.slug !== c.slug).map((x) => ({ href: `${estudio.base}/vs/${x.slug}`, texto: x.h1 })),
          ]}
        />
      </Seccion>
    </>
  );
}
