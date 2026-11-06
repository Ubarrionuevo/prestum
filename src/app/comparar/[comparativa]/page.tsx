import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultProduct } from "@/config/products";
import { site, absoluteUrl } from "@/config/site";
import { PRUEBA_DIAS } from "@/config/planes";
import { REVISADO, compararPath, competidores, getCompetidor, slugDeRuta } from "@/config/comparativas";
import { conPrecios, datosPrestum, preciosPrestum } from "@/lib/comparar";
import { getPrecios } from "@/lib/planes";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";
import { TablaComparativa } from "@/components/TablaComparativa";

type Props = { params: Promise<{ comparativa: string }> };
export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => competidores.map((c) => ({ comparativa: `prestum-vs-${c.slug}` }));

const product = getDefaultProduct();
const anio = REVISADO.slice(0, 4);
const fechaLarga = new Date(`${REVISADO}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

async function cargar(params: Props["params"]) {
  const slug = slugDeRuta((await params).comparativa);
  const c = slug ? getCompetidor(slug) : undefined;
  if (!c) return undefined;
  const { planes } = await getPrecios();
  return { c, planes, precios: preciosPrestum(planes) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await cargar(params);
  if (!d) return {};
  return buildMetadata({
    title: `${product.brandName} vs ${d.c.nombre} (${anio}): cuál conviene`,
    brand: "Prestum",
    description: `Comparativa ${product.brandName} vs ${d.c.nombre} en Argentina: precios en pesos, prueba gratis, WhatsApp, comisiones y equipo. Con fuentes, revisado en ${fechaLarga}.`,
    path: compararPath(d.c),
    keywords: [`${d.c.nombre} vs ${product.brandName}`, `alternativa a ${d.c.nombre}`, `${d.c.nombre} precios`, "comparativa app de turnos"],
  });
}

export default async function ComparativaPage({ params }: Props) {
  const d = await cargar(params);
  if (!d) notFound();
  const { c, planes, precios } = d;
  const path = compararPath(c);
  const t = (s: string) => conPrecios(s, precios);
  const faqs = [
    ...c.faqs.map((f) => ({ q: f.q, a: t(f.a) })),
    { q: `¿Los precios de ${c.nombre} están actualizados?`, a: `Los tomamos de su web oficial el ${fechaLarga}. Pueden cambiar: confirmalos en ${c.fuente}.` },
  ];
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Comparar", path: "/comparar" },
    { name: `vs ${c.nombre}`, path },
  ];
  const pagina = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(`${path}#pagina`),
    name: `${product.brandName} vs ${c.nombre}`,
    url: absoluteUrl(path),
    dateModified: REVISADO,
    inLanguage: site.lang,
    about: [{ "@type": "SoftwareApplication", name: product.brandName }, { "@type": "SoftwareApplication", name: c.nombre, url: c.fuente }],
  };
  const wa = `https://wa.me/${site.whatsappVentas}?text=${encodeURIComponent(`Hola! Estuve viendo la comparativa de ${product.brandName} con ${c.nombre} y quería consultar sobre los planes.`)}`;

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path, planes }), pagina, faqLd(faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <article className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <p className="text-sm font-medium text-brand-700">Comparativa · revisado el {fechaLarga}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {product.brandName} vs {c.nombre}
        </h1>
        <p className="mt-3 text-lg text-slate-600">¿Cuál conviene para tu negocio en Argentina? Precios, prueba gratis, WhatsApp y comisiones, con fuentes.</p>

        <div className="mt-6 rounded-2xl border-l-4 border-brand-600 bg-brand-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Respuesta corta</p>
          <p className="mt-2 text-slate-800">{t(c.respuesta)}</p>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Comparación lado a lado</h2>
          <p className="mt-2 text-sm text-slate-500">{c.nombre}: {c.queEs}</p>
          <div className="mt-4">
            <TablaComparativa
              columnas={[
                { nombre: product.brandName, datos: datosPrestum(planes), destacar: true },
                { nombre: c.nombre, datos: c.datos },
              ]}
            />
          </div>
        </section>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Dónde conviene {product.brandName}</h2>
            <ul className="mt-3 grid gap-2 text-slate-600">
              {c.ventajas.map((v) => (
                <li key={v} className="flex gap-2">
                  <span className="text-brand-700" aria-hidden>✓</span>
                  {t(v)}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Cuándo te conviene {c.nombre}</h2>
            <ul className="mt-3 grid gap-2 text-slate-600">
              {c.convieneElOtro.map((v) => (
                <li key={v} className="flex gap-2">
                  <span className="text-slate-400" aria-hidden>→</span>
                  {v}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/registro" className="rounded-xl bg-brand-700 px-6 py-3.5 text-center font-semibold text-white hover:bg-brand-900">
            Probar {PRUEBA_DIAS} días gratis
          </Link>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-300 px-6 py-3.5 text-center font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700">
            Consultar por WhatsApp
          </a>
        </div>
      </article>

      <FaqSection faqs={faqs} />

      <section className="mx-auto max-w-4xl px-4 pb-12">
        <h2 className="text-lg font-semibold text-slate-900">Otras comparativas</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {competidores
            .filter((x) => x.slug !== c.slug)
            .map((x) => (
              <li key={x.slug}>
                <Link href={compararPath(x)} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                  {product.brandName} vs {x.nombre}
                </Link>
              </li>
            ))}
          <li>
            <Link href="/comparar" className="inline-block rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 font-medium text-brand-700">
              Todas las apps de turnos →
            </Link>
          </li>
        </ul>
        <p className="mt-6 text-xs text-slate-400">
          Datos de {c.nombre} tomados de su web oficial ({c.fuente}) el {fechaLarga}. Los precios y funciones pueden cambiar. {c.nombre} es una marca de su respectivo
          dueño; esta comparativa no está asociada ni respaldada por {c.nombre}. Si ves un dato desactualizado, escribinos a {site.email}.
        </p>
      </section>
    </ProductShell>
  );
}
