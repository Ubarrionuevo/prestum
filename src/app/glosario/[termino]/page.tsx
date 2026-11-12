import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultProduct } from "@/config/products";
import { getTermino, glosario } from "@/config/glosario";
import { absoluteUrl, site } from "@/config/site";
import { PLANES_BARBERIAS_DEFAULT } from "@/config/planes";
import { planMinimo } from "@/lib/funciones";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";
import { RubrosFocoLinks } from "@/components/RubrosFocoLinks";

type Props = { params: Promise<{ termino: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => glosario.map((t) => ({ termino: t.slug }));

const product = getDefaultProduct();
const nombreCorto = (t: string) => t.replace(/\s*\(.*\)$/, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTermino((await params).termino);
  if (!t) return {};
  return buildMetadata({
    title: t.titulo ?? `Qué es ${nombreCorto(t.termino).toLowerCase()}`,
    brand: product.brandName,
    description: t.definicion,
    path: `/glosario/${t.slug}`,
    keywords: [t.termino, `qué es ${nombreCorto(t.termino).toLowerCase()}`, t.categoria.toLowerCase()],
  });
}

export default async function TerminoPage({ params }: Props) {
  const t = getTermino((await params).termino);
  if (!t) notFound();
  const path = `/glosario/${t.slug}`;
  const nombre = nombreCorto(t.termino);
  // "¿Qué es la caja diaria?", "¿Qué son los horarios pico?"; las marcas (WhatsApp) mantienen mayúsculas.
  const verbo = t.articulo === "los" || t.articulo === "las" ? "Qué son" : "Qué es";
  const enTexto = /[A-Z]/.test(nombre.slice(1)) ? nombre : nombre.toLowerCase();
  const pregunta = `¿${verbo} ${t.articulo ? t.articulo + " " : ""}${enTexto}?`;
  const plan = t.funcion ? planMinimo(PLANES_BARBERIAS_DEFAULT, t.funcion) : undefined;
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Glosario", path: "/glosario" },
    { name: nombre, path },
  ];
  const definedTerm = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": absoluteUrl(`${path}#termino`),
    name: t.termino,
    description: t.definicion,
    url: absoluteUrl(path),
    inDefinedTermSet: { "@type": "DefinedTermSet", "@id": absoluteUrl("/glosario#glosario"), name: "Glosario de Prestum Turnos", url: absoluteUrl("/glosario") },
  };
  const relacionados = t.relacionados.map(getTermino).filter((x) => x !== undefined);
  const wa = `https://wa.me/${site.whatsappVentas}?text=${encodeURIComponent(`Hola! Vi la explicación de ${nombre} en ${product.brandName} y quería hacer una consulta.`)}`;

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product), definedTerm, faqLd(t.faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm font-medium text-brand-700">{t.categoria}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">{pregunta}</h1>

        <div className="mt-6 rounded-2xl border-l-4 border-brand-600 bg-brand-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Definición rápida</p>
          <p className="mt-2 text-lg text-slate-800">{t.definicion}</p>
        </div>

        {t.analisis.map((s) => (
          <section key={s.titulo} className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900">{s.titulo}</h2>
            {s.texto.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-slate-600">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-10 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">Cómo lo resuelve {product.brandName}</h2>
          <ul className="mt-4 grid gap-2 text-slate-600">
            {t.solucion.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="text-brand-700" aria-hidden>
                  ✓
                </span>
                {x}
              </li>
            ))}
          </ul>
          {plan && <p className="mt-4 text-sm text-slate-500">Incluido desde el plan {plan}.</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/registro" className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-900">
              Empezar gratis
            </Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700">
              Consultar por WhatsApp
            </a>
          </div>
        </section>
      </article>

      <RubrosFocoLinks product={product} />

      <FaqSection faqs={t.faqs} />

      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="text-lg font-semibold text-slate-900">Términos relacionados</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {relacionados.map((r) => (
            <li key={r.slug}>
              <Link href={`/glosario/${r.slug}`} className="block h-full rounded-xl border border-slate-200 p-4 hover:border-brand-500">
                <span className="font-semibold text-slate-900">{nombreCorto(r.termino)}</span>
                <span className="mt-1 line-clamp-2 block text-sm text-slate-500">{r.definicion}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/glosario" className="mt-6 inline-block text-sm font-medium text-brand-700 hover:underline">
          ← Ver todo el glosario
        </Link>
      </section>
    </ProductShell>
  );
}
