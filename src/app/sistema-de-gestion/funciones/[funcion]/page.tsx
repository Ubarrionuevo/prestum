import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, breadcrumbLd, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { funcionGestionPath, funcionesGestion, gestion, getFuncionGestion, precioGestion } from "@/config/gestion";
import { gestionLd } from "@/lib/gestion-ld";
import { BotonDemo, Faqs, ListaCheck, ListaDolores, Migas, PrecioDemo, Seccion, TarjetasFunciones, TarjetasRubros } from "@/components/gestion/ui";

type Props = { params: Promise<{ funcion: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => funcionesGestion.map((f) => ({ funcion: f.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = getFuncionGestion((await params).funcion);
  if (!f) return {};
  return buildMetadata({ title: f.titulo, brand: gestion.marca, description: f.descripcion, path: funcionGestionPath(f), keywords: f.keywords });
}

export default async function FuncionGestionPage({ params }: Props) {
  const f = getFuncionGestion((await params).funcion);
  if (!f) notFound();
  const path = funcionGestionPath(f);
  const crumbs = [
    { name: gestion.marca, path: gestion.base },
    { name: f.nombre, path },
  ];
  const mensaje = `Hola! Quiero ver una demo de ${f.nombre.toLowerCase()} de ${gestion.marca}.`;

  return (
    <>
      <JsonLd data={[gestionLd({ path, name: `${f.nombre} · ${gestion.marca}`, description: f.descripcion }), faqLd(f.faqs), breadcrumbLd(crumbs)]} />
      <div className="bg-indigo-50">
        <Migas items={crumbs} />
      </div>
      <header className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
          <p className="text-sm font-semibold text-indigo-700">
            <span aria-hidden>{f.emoji}</span> {f.nombre}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{f.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">{f.bajada}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BotonDemo mensaje={mensaje} />
          </div>
          <p className="mt-3 text-sm text-slate-500">Incluido en {gestion.marca}: {precioGestion} por mes</p>
        </div>
      </header>

      <Seccion titulo="Qué hace">
        <ListaCheck items={f.incluye} />
      </Seccion>

      <Seccion titulo="Lo que deja de pasar" gris>
        <ListaDolores items={f.dolores} />
      </Seccion>

      <Seccion titulo="Un día normal en el mostrador">
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {f.dia.map((p) => (
            <li key={p.t} className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">{p.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.d}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      <PrecioDemo mensaje={mensaje} />

      <Faqs faqs={f.faqs} />

      <Seccion titulo="Las otras funciones" gris>
        <TarjetasFunciones excluir={f.slug} />
      </Seccion>

      <Seccion titulo="Por rubro">
        <TarjetasRubros />
      </Seccion>
    </>
  );
}
