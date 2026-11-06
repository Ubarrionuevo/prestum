import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultProduct } from "@/config/products";
import { getTermino, glosario } from "@/config/seo-content";
import { absoluteUrl } from "@/config/site";
import { breadcrumbLd, buildMetadata, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs } from "@/components/sections";
import { PRUEBA_DIAS } from "@/config/planes";

type Props = { params: Promise<{ termino: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => glosario.map((t) => ({ termino: t.slug }));

const product = getDefaultProduct();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTermino((await params).termino);
  if (!t) return {};
  return buildMetadata({ title: `Qué es ${t.termino.toLowerCase()}`, brand: product.brandName, description: t.resumen, path: `/glosario/${t.slug}` });
}

export default async function TerminoPage({ params }: Props) {
  const t = getTermino((await params).termino);
  if (!t) notFound();
  const path = `/glosario/${t.slug}`;
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Glosario", path: "/glosario" },
    { name: t.termino, path },
  ];
  const definedTerm = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.termino,
    description: t.resumen,
    url: absoluteUrl(path),
    inDefinedTermSet: { "@type": "DefinedTermSet", name: "Glosario de Prestum Turnos", url: absoluteUrl("/glosario") },
  };
  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product), definedTerm, breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">¿Qué es {t.termino.toLowerCase()}?</h1>
        <p className="mt-4 text-xl text-slate-700">{t.resumen}</p>
        {t.cuerpo.map((p, i) => (
          <p key={i} className="mt-4 leading-relaxed text-slate-600">
            {p}
          </p>
        ))}
        <div className="mt-10 rounded-2xl bg-brand-50 p-6">
          <p className="font-semibold text-slate-900">Probalo en tu negocio</p>
          <p className="mt-1 text-sm text-slate-600">Tu link de reservas listo en 1 minuto. {PRUEBA_DIAS} días gratis, sin tarjeta.</p>
          <Link href="/registro" className="mt-4 inline-block rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white">
            Empezar gratis
          </Link>
        </div>
        <h2 className="mt-10 text-lg font-semibold text-slate-900">Términos relacionados</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {t.relacionados.map((r) => {
            const rel = getTermino(r);
            return rel ? (
              <li key={r}>
                <Link href={`/glosario/${r}`} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-brand-500">
                  {rel.termino}
                </Link>
              </li>
            ) : null;
          })}
        </ul>
      </article>
    </ProductShell>
  );
}
