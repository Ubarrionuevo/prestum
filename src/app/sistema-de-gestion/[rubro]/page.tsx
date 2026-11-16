import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, breadcrumbLd, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { funcionGestionPath, gestion, getFuncionGestion, getRubroGestion, precioGestion, rubroGestionPath, rubrosGestion } from "@/config/gestion";
import { gestionLd } from "@/lib/gestion-ld";
import { BotonDemo, Faqs, ListaDolores, Migas, PantallaVenta, PrecioDemo, Seccion, TarjetasFunciones, TarjetasRubros } from "@/components/gestion/ui";

type Props = { params: Promise<{ rubro: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => rubrosGestion.map((r) => ({ rubro: r.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getRubroGestion((await params).rubro);
  if (!r) return {};
  return buildMetadata({ title: r.titulo, brand: gestion.marca, description: r.descripcion, path: rubroGestionPath(r), keywords: r.keywords });
}

export default async function RubroGestionPage({ params }: Props) {
  const r = getRubroGestion((await params).rubro);
  if (!r) notFound();
  const path = rubroGestionPath(r);
  const crumbs = [
    { name: gestion.marca, path: gestion.base },
    { name: r.nombre, path },
  ];
  const mensaje = `Hola! Tengo un ${r.singular} y quiero ver una demo de ${gestion.marca}.`;

  return (
    <>
      <JsonLd data={[gestionLd({ path, name: `${gestion.marca} para ${r.nombre.toLowerCase()}`, description: r.descripcion, audience: r.nombre }), faqLd(r.faqs), breadcrumbLd(crumbs)]} />
      <div className="bg-indigo-50">
        <Migas items={crumbs} />
      </div>
      <header className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:py-14 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-indigo-700">
              <span aria-hidden>{r.emoji}</span> {gestion.marca} para {r.nombre.toLowerCase()}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{r.h1}</h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">{r.bajada}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BotonDemo mensaje={mensaje} />
              <a href="#claves" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-indigo-500 hover:text-indigo-700">
                Qué resuelve
              </a>
            </div>
            <p className="mt-3 text-sm text-slate-500">{precioGestion} por mes · Computadora o celular</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <PantallaVenta />
          </div>
        </div>
      </header>

      <Seccion titulo={`Cómo se trabaja en un ${r.singular}`}>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">{r.contexto}</p>
        <ListaDolores items={r.dolores} />
      </Seccion>

      <Seccion titulo={`Lo que más te sirve en tu ${r.singular}`} id="claves" gris>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {r.claves.map((c) => {
            const f = getFuncionGestion(c.funcion);
            if (!f) return null;
            return (
              <li key={c.funcion}>
                <Link href={funcionGestionPath(f)} className="block h-full rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-400">
                  <span aria-hidden className="text-2xl">{f.emoji}</span>
                  <p className="mt-2 font-bold text-slate-900">{f.nombre}</p>
                  <p className="mt-1 text-sm text-slate-600">{c.d}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Seccion>

      <Seccion titulo="Todas las funciones">
        <TarjetasFunciones />
      </Seccion>

      <PrecioDemo mensaje={mensaje} />

      <Faqs faqs={r.faqs} />

      <Seccion titulo="También para" gris>
        <TarjetasRubros excluir={r.slug} />
      </Seccion>
    </>
  );
}
