import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultProduct, nichePath, rubrosFoco } from "@/config/products";
import { OFERTA_CORTA, PLANES_BARBERIAS_DEFAULT } from "@/config/planes";
import { getSolucion, solucionPath, soluciones } from "@/config/soluciones";
import { getArticulo } from "@/config/blog";
import { getTermino } from "@/config/glosario";
import { planMinimo } from "@/lib/funciones";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";

type Props = { params: Promise<{ solucion: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => soluciones.map((s) => ({ solucion: s.slug }));

const product = getDefaultProduct();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSolucion((await params).solucion);
  if (!s) return {};
  return buildMetadata({ title: s.titulo, brand: product.brandName, description: s.descripcion, path: solucionPath(s), keywords: s.keywords });
}

export default async function SolucionPage({ params }: Props) {
  const s = getSolucion((await params).solucion);
  if (!s) notFound();
  const path = solucionPath(s);
  const plan = planMinimo(PLANES_BARBERIAS_DEFAULT, s.funcion);
  const rubros = rubrosFoco(product);
  const articulo = s.blog ? getArticulo(s.blog) : undefined;
  const terminos = s.glosario.map(getTermino).filter((t) => t !== undefined);
  const otras = soluciones.filter((x) => x.slug !== s.slug);
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Funciones", path: "/funciones" },
    { name: s.nombre, path },
  ];

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path, description: s.descripcion }), faqLd(s.faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <header className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <p className="text-sm font-semibold text-brand-700">
            <span aria-hidden>{s.emoji}</span> {s.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{s.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">{s.bajada}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/registro" className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-900">
              Empezar gratis
            </Link>
            <Link href="/precios" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700">
              Ver precios
            </Link>
          </div>
          {plan && <p className="mt-3 text-sm text-slate-500">Incluido desde el plan {plan}. {OFERTA_CORTA}, sin tarjeta.</p>}
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 pb-6">
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-900">{s.problema.titulo}</h2>
          {s.problema.texto.map((p) => (
            <p key={p} className="mt-3 text-slate-700">
              {p}
            </p>
          ))}
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-900">Cómo funciona en {product.brandName}</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {s.pasos.map((p, i) => (
              <li key={p.titulo} className="rounded-2xl border border-slate-200 p-5">
                <span className="text-sm font-bold text-brand-700">{i + 1}</span>
                <h3 className="mt-1 font-semibold text-slate-900">{p.titulo}</h3>
                <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-900">En tu rubro</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {rubros.map((n) => {
              const texto = s.porRubro[n.slug as keyof typeof s.porRubro];
              if (!texto) return null;
              return (
                <div key={n.slug} className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-900">
                    <span aria-hidden>{n.emoji}</span> {n.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{texto}</p>
                  <Link href={nichePath(product, n)} className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline">
                    Sistema de turnos para {n.name.toLowerCase()} →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {(articulo || terminos.length > 0) && (
          <section className="py-8">
            <h2 className="text-xl font-bold text-slate-900">Para profundizar</h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {articulo && (
                <li>
                  <Link href={`/blog/${articulo.slug}`} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                    📖 {articulo.titulo}
                  </Link>
                </li>
              )}
              {terminos.map((t) => (
                <li key={t.slug}>
                  <Link href={`/glosario/${t.slug}`} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                    Qué es {t.termino.replace(/\s*\(.*\)$/, "").toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <FaqSection faqs={s.faqs} />

      <section className="mx-auto max-w-4xl px-4 pb-14">
        <div className="rounded-2xl bg-brand-900 p-6 text-white">
          <h2 className="text-xl font-bold">Probalo en tu barbería, peluquería o centro de estética</h2>
          <p className="mt-2 text-brand-100">Tu link de reservas listo en un minuto. {OFERTA_CORTA}, sin tarjeta y sin comisión por turno.</p>
          <Link href="/registro" className="mt-4 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-brand-900 hover:bg-brand-50">
            Empezar gratis
          </Link>
        </div>
        <h2 className="mt-10 text-lg font-semibold text-slate-900">Otras funciones</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {otras.map((x) => (
            <li key={x.slug}>
              <Link href={solucionPath(x)} className="block h-full rounded-xl border border-slate-200 p-4 hover:border-brand-500">
                <span className="font-semibold text-slate-900">
                  <span aria-hidden>{x.emoji}</span> {x.nombre}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm text-slate-500">{x.descripcion}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ProductShell>
  );
}
