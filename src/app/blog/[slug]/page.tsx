import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultProduct } from "@/config/products";
import { absoluteUrl, site } from "@/config/site";
import { OFERTA_CORTA } from "@/config/planes";
import { articulos, getArticulo } from "@/config/blog";
import { getTermino } from "@/config/glosario";
import { breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";
import { RubrosFocoLinks } from "@/components/RubrosFocoLinks";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => articulos.map((a) => ({ slug: a.slug }));

const product = getDefaultProduct();
const fecha = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticulo((await params).slug);
  if (!a) return {};
  const m = buildMetadata({ title: a.titulo, brand: product.brandName, description: a.descripcion, path: `/blog/${a.slug}` });
  return { ...m, openGraph: { ...m.openGraph, type: "article", publishedTime: a.publicado, modifiedTime: a.actualizado ?? a.publicado } };
}

export default async function ArticuloPage({ params }: Props) {
  const a = getArticulo((await params).slug);
  if (!a) notFound();
  const path = `/blog/${a.slug}`;
  const portada = `${path}/opengraph-image`;
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Blog", path: "/blog" },
    { name: a.titulo, path },
  ];
  const posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(`${path}#articulo`),
    headline: a.titulo,
    description: a.descripcion,
    image: absoluteUrl(portada),
    datePublished: a.publicado,
    dateModified: a.actualizado ?? a.publicado,
    inLanguage: site.lang,
    mainEntityOfPage: absoluteUrl(path),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": absoluteUrl("/#organization"), "@type": "Organization", name: site.name, logo: absoluteUrl("/icon.svg") },
  };
  const terminos = a.glosario.map(getTermino).filter((t) => t !== undefined);
  const otros = articulos.filter((x) => x.slug !== a.slug).slice(0, 3);
  const wa = `https://wa.me/${site.whatsappVentas}?text=${encodeURIComponent(`Hola! Leí el artículo "${a.titulo}" y quería hacer una consulta.`)}`;

  return (
    <ProductShell product={product}>
      <JsonLd data={[posting, faqLd(a.faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <p className="text-sm font-medium text-brand-700">
          {a.categoria} · {a.minutos} min de lectura
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{a.titulo}</h1>
        <p className="mt-3 text-sm text-slate-500">
          Por {site.name} · <time dateTime={a.publicado}>{fecha(a.actualizado ?? a.publicado)}</time>
        </p>
        <img src={portada} alt={a.portada} width={1200} height={675} className="mt-6 aspect-video w-full rounded-2xl object-cover" />

        <div className="mt-6 rounded-2xl border-l-4 border-brand-600 bg-brand-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">En resumen</p>
          <p className="mt-2 text-slate-800">{a.resumen}</p>
        </div>

        {a.bloques.map((b) => (
          <section key={b.h2} className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900">{b.h2}</h2>
            {b.p?.map((x) => (
              <p key={x} className="mt-3 leading-relaxed text-slate-600">
                {x}
              </p>
            ))}
            {b.lista && (
              <ul className="mt-3 grid gap-2 text-slate-600">
                {b.lista.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-brand-700" aria-hidden>
                      •
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            )}
            {b.copiar?.map((x) => (
              <blockquote key={x} className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-700">
                {x}
              </blockquote>
            ))}
          </section>
        ))}

        <section className="mt-10 rounded-2xl bg-brand-900 p-6 text-white">
          <h2 className="text-xl font-bold">Probalo en tu barbería, peluquería o centro de estética</h2>
          <p className="mt-2 text-brand-100">Tu link de reservas listo en un minuto. {OFERTA_CORTA}, sin tarjeta y sin comisión por turno.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/registro" className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-brand-900 hover:bg-brand-50">
              Empezar gratis
            </Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/40 px-5 py-3 text-center font-semibold hover:bg-white/10">
              Consultar por WhatsApp
            </a>
          </div>
        </section>
      </article>

      <RubrosFocoLinks product={product} />

      <FaqSection faqs={a.faqs} />

      <section className="mx-auto max-w-3xl px-4 pb-12">
        {terminos.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Conceptos relacionados</h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {terminos.map((t) => (
                <li key={t.slug}>
                  <Link href={`/glosario/${t.slug}`} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                    {t.termino}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <h2 className="mt-8 text-lg font-semibold text-slate-900">Seguí leyendo</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {otros.map((x) => (
            <li key={x.slug}>
              <Link href={`/blog/${x.slug}`} className="block h-full rounded-xl border border-slate-200 p-4 hover:border-brand-500">
                <span className="text-xl" aria-hidden>
                  {x.emoji}
                </span>
                <span className="mt-1 block font-semibold text-slate-900">{x.titulo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ProductShell>
  );
}
