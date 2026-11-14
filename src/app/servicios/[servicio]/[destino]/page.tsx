import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio, precioTexto, servicioPath } from "@/config/servicios/estudio";
import { lugarConProvincia } from "@/config/seo-content";
import { cercanas, destinoPath, getDestino, serviciosRoutes, servicioLd, textosCiudad, textosRubro, type Destino } from "@/lib/servicios";
import { Diagnostico, Faqs, HeroEstudio, ListaCheck, Pildoras, Seccion } from "@/components/servicios/ui";
import type { Caso } from "@/config/servicios/extras";

type Props = { params: Promise<{ servicio: string; destino: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return serviciosRoutes();
}

function armar(d: Destino) {
  const s = d.servicio;
  const path = destinoPath(s, d.tipo === "rubro" ? d.rubro : d.ciudad);
  if (d.tipo === "rubro") {
    const t = textosRubro(s, d.rubro);
    return { path, t, nombre: d.rubro.nombre, ...t };
  }
  const t = textosCiudad(s, d.ciudad);
  return { path, t, nombre: d.ciudad.corto, bajada: t.intro[0], ...t };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const d = getDestino(p.servicio, p.destino);
  if (!d) return {};
  const a = armar(d);
  return buildMetadata({
    title: a.title,
    brand: estudio.nombre,
    description: a.description,
    path: a.path,
    keywords:
      d.tipo === "rubro"
        ? [`${d.servicio.titulo.toLowerCase()} para ${d.rubro.nombre.toLowerCase()}`, `página web ${d.rubro.negocio}`, ...d.rubro.busquedas.slice(0, 2)]
        : [`${d.servicio.titulo.toLowerCase()} ${d.ciudad.corto}`, `${d.servicio.nombre.toLowerCase()} en ${d.ciudad.corto}`, `página web ${d.ciudad.corto}`],
  });
}

const INCLUYE: Record<string, string> = {
  "diseno-web": "la landing page",
  tiendanube: "el armado de la tienda",
  "posicionamiento-seo": "el trabajo de SEO",
  "sistemas-a-medida": "el desarrollo",
};

function CasoCard({ caso, titulo }: { caso: Caso; titulo: string }) {
  return (
    <Seccion titulo={titulo} gris>
      <Link href={`${estudio.base}/casos/${caso.slug}`} className="mt-6 block rounded-2xl border border-slate-200 bg-white p-6 hover:border-amber-400">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{caso.rubro}</p>
        <p className="mt-2 text-xl font-bold text-slate-900">{caso.nombre}</p>
        <p className="mt-2 text-slate-600">{caso.desafio}</p>
        <p className="mt-4 text-sm font-semibold text-slate-900">Ver qué hicimos →</p>
      </Link>
    </Seccion>
  );
}

export default async function DestinoPage({ params }: Props) {
  const p = await params;
  const d = getDestino(p.servicio, p.destino);
  if (!d) notFound();
  const s = d.servicio;
  const a = armar(d);
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: s.titulo, path: servicioPath(s) },
    { name: a.nombre, path: a.path },
  ];
  const mensaje =
    d.tipo === "rubro"
      ? `Hola! Quiero cotizar ${s.titulo.toLowerCase()} para mi ${d.rubro.negocio}.`
      : `Hola! Quiero cotizar ${s.titulo.toLowerCase()} para mi negocio en ${d.ciudad.corto}.`;

  return (
    <>
      <JsonLd
        data={[
          servicioLd(s, {
            path: a.path,
            name: a.h1,
            description: a.description,
            area: d.tipo === "ciudad" ? d.ciudad : undefined,
            audiencia: d.tipo === "rubro" ? d.rubro.nombre : undefined,
          }),
          faqLd(a.faqs),
          breadcrumbLd(crumbs),
        ]}
      />
      <HeroEstudio
        migas={crumbs}
        etiqueta={d.tipo === "rubro" ? `${d.rubro.emoji} ${d.rubro.nombre} · ${s.nombre}` : `${s.emoji} ${s.nombre} · ${lugarConProvincia(d.ciudad)}`}
        titulo={a.h1}
        bajada={d.tipo === "rubro" ? a.bajada : `${s.bajada}`}
        mensaje={mensaje}
        precio={s.precio ? `${precioTexto(s).replace(/^d/, "D")}, en pesos` : "Presupuesto sin cargo"}
      />

      {d.tipo === "rubro" ? <ContenidoRubro d={d} t={textosRubro(s, d.rubro)} /> : <ContenidoCiudad d={d} t={textosCiudad(s, d.ciudad)} />}

      {a.caso && <CasoCard caso={a.caso} titulo={d.tipo === "ciudad" ? `Un trabajo real en ${d.ciudad.corto}` : "Un trabajo real del rubro"} />}

      <Seccion titulo={`Qué incluye ${INCLUYE[s.slug]}`}>
        <ListaCheck items={s.incluye.slice(0, 6)} />
      </Seccion>

      {s.slug !== "sistemas-a-medida" && <Diagnostico />}

      <Faqs faqs={a.faqs} />
    </>
  );
}

function ContenidoRubro({ d, t }: { d: Extract<Destino, { tipo: "rubro" }>; t: ReturnType<typeof textosRubro> }) {
  const { servicio: s, rubro: r } = d;
  return (
    <>
      <Seccion titulo={`Cómo elige tu cliente ${r.una === "una" ? "una" : "un"} ${r.negocio}`}>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">{r.cliente}</p>
        {s.slug === "posicionamiento-seo" && <p className="mt-4 max-w-3xl text-slate-600">{r.seo}</p>}
      </Seccion>
      <Seccion titulo={t.lista.titulo} gris>
        <ListaCheck items={t.lista.items} />
        {s.slug === "diseno-web" && (
          <p className="mt-6 max-w-3xl text-slate-600">
            <strong className="text-slate-900">Para aparecer en Google:</strong> {r.seo}
          </p>
        )}
      </Seccion>
      {t.otros.length > 0 && (
        <Seccion titulo={`Más servicios para ${r.nombre.toLowerCase()}`}>
          <Pildoras items={t.otros.map((o) => ({ href: destinoPath(o, r), texto: `${o.emoji} ${o.titulo} para ${r.nombre.toLowerCase()}` }))} />
        </Seccion>
      )}
    </>
  );
}

function ContenidoCiudad({ d, t }: { d: Extract<Destino, { tipo: "ciudad" }>; t: ReturnType<typeof textosCiudad> }) {
  const { servicio: s, ciudad: c } = d;
  return (
    <>
      <Seccion titulo={`${s.nombre} para negocios de ${c.corto}`}>
        <div className="mt-4 grid max-w-3xl gap-4 text-slate-700">
          {t.intro.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </div>
      </Seccion>
      <Seccion titulo={t.tituloBusquedas} gris>
        <p className="mt-3 max-w-3xl text-slate-600">{t.textoBusquedas}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {t.busquedas.map((b) => (
            <li key={b} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800">
              🔎 {b}
            </li>
          ))}
        </ul>
      </Seccion>
      <Seccion titulo={`${s.nombre} por rubro en ${c.corto}`}>
        <Pildoras items={t.rubrosLinks.map((r) => ({ href: destinoPath(s, r), texto: `${r.emoji} ${r.nombre}` }))} />
      </Seccion>
      <Seccion titulo={`${s.nombre} en otras ciudades`} gris>
        <Pildoras items={cercanas(c).map((o) => ({ href: destinoPath(s, o), texto: `${s.nombre} en ${o.corto}` }))} />
      </Seccion>
    </>
  );
}
