import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio, getServicio, precioTexto, servicioPath, servicios } from "@/config/servicios/estudio";
import { casos, comparativasServ } from "@/config/servicios/extras";
import { ciudadesDe, destinoPath, rubrosDe, servicioLd } from "@/lib/servicios";
import { Diagnostico, Faqs, HeroEstudio, ListaCheck, Pildoras, Seccion } from "@/components/servicios/ui";

type Props = { params: Promise<{ servicio: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return servicios.map((s) => ({ servicio: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getServicio((await params).servicio);
  if (!s) return {};
  return buildMetadata({
    title: s.precio ? `${s.titulo} en Argentina (${precioTexto(s)})` : `${s.titulo} en Argentina`,
    brand: estudio.nombre,
    description: s.descripcion,
    path: servicioPath(s),
    keywords: s.keywords,
  });
}

export default async function ServicioPage({ params }: Props) {
  const s = getServicio((await params).servicio);
  if (!s) notFound();
  const path = servicioPath(s);
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: s.titulo, path },
  ];
  const rubros = rubrosDe(s);
  const ciudades = ciudadesDe(s);
  const comps = comparativasServ.filter((c) => c.servicio === s.slug);
  const casosS = casos.filter((c) => c.servicios.includes(s.slug));
  const otros = servicios.filter((x) => x.slug !== s.slug);

  return (
    <>
      <JsonLd data={[servicioLd(s, { path, name: `${s.titulo} — ${estudio.nombre}`, description: s.descripcion }), faqLd(s.faqs), breadcrumbLd(crumbs)]} />
      <HeroEstudio
        migas={crumbs}
        etiqueta={`${s.emoji} ${s.plan} · ${precioTexto(s)}`}
        titulo={s.slug === "diseno-web" ? "Diseño de páginas web para negocios y profesionales" : s.slug === "posicionamiento-seo" ? "Posicionamiento SEO: aparecé primero en Google y en las IA" : s.slug === "tiendanube" ? "Tiendas Tiendanube que venden: armado desde cero y rediseño" : "Sistemas y apps a medida para tu negocio"}
        bajada={s.bajada}
        mensaje={`Hola! Quiero cotizar ${s.titulo.toLowerCase()} para mi negocio.`}
        precio={s.precio ? `${precioTexto(s).replace(/^d/, "D")}, en pesos` : "Presupuesto sin cargo"}
      />

      <Seccion titulo="Qué incluye">
        <ListaCheck items={s.incluye} />
      </Seccion>

      <Seccion titulo="Cómo lo hacemos" gris>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {s.proceso.map((p, i) => (
            <li key={p.t} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-bold text-slate-900">
                {i + 1}. {p.t}
              </p>
              <p className="mt-2 text-sm text-slate-600">{p.d}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      {casosS.length > 0 && (
        <Seccion titulo="Trabajos reales">
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {casosS.map((c) => (
              <Link key={c.slug} href={`${estudio.base}/casos/${c.slug}`} className="rounded-2xl border border-slate-200 p-6 hover:border-amber-400">
                <p className="text-xl font-bold text-slate-900">{c.nombre}</p>
                <p className="mt-2 text-slate-600">{c.resumen}</p>
              </Link>
            ))}
          </div>
        </Seccion>
      )}

      <Seccion titulo={`${s.nombre} por rubro`} gris>
        <Pildoras items={rubros.map((r) => ({ href: destinoPath(s, r), texto: `${r.emoji} ${r.nombre}` }))} />
      </Seccion>

      {ciudades.length > 0 && (
        <Seccion titulo={`${s.nombre} por ciudad`} id="ciudades">
          <Pildoras items={ciudades.map((c) => ({ href: destinoPath(s, c), texto: c.corto }))} />
        </Seccion>
      )}

      {s.slug !== "sistemas-a-medida" && <Diagnostico />}

      {comps.length > 0 && (
        <Seccion titulo="Comparativas">
          <Pildoras items={comps.map((c) => ({ href: `${estudio.base}/vs/${c.slug}`, texto: c.h1 }))} />
        </Seccion>
      )}

      <Faqs faqs={s.faqs} />

      <Seccion titulo="Otros servicios" gris>
        <Pildoras items={otros.map((o) => ({ href: servicioPath(o), texto: `${o.emoji} ${o.titulo} · ${precioTexto(o)}` }))} />
      </Seccion>
    </>
  );
}
