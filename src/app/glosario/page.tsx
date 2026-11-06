import Link from "next/link";
import { getDefaultProduct } from "@/config/products";
import { glosario } from "@/config/seo-content";
import { breadcrumbLd, buildMetadata, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs } from "@/components/sections";

const product = getDefaultProduct();
export const metadata = buildMetadata({
  title: "Glosario de turnos y agenda online",
  brand: product.brandName,
  description: "Qué es un turno online, una agenda online, el no-show, la seña, la tasa de ocupación y más. Explicado simple para negocios.",
  path: "/glosario",
});

export default function GlosarioPage() {
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Glosario", path: "/glosario" },
  ];
  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Glosario</h1>
        <p className="mt-3 text-lg text-slate-600">Los conceptos clave para manejar los turnos de tu negocio.</p>
        <dl className="mt-8 grid gap-4">
          {glosario.map((t) => (
            <div key={t.slug} className="rounded-2xl border border-slate-200 p-5">
              <dt>
                <Link href={`/glosario/${t.slug}`} className="text-lg font-semibold text-brand-700 hover:underline">
                  {t.termino}
                </Link>
              </dt>
              <dd className="mt-1 text-slate-600">{t.resumen}</dd>
            </div>
          ))}
        </dl>
      </section>
    </ProductShell>
  );
}
