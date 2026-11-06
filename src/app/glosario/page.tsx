import { getDefaultProduct } from "@/config/products";
import { CATEGORIAS_GLOSARIO, glosario } from "@/config/glosario";
import { absoluteUrl } from "@/config/site";
import { breadcrumbLd, buildMetadata, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs } from "@/components/sections";
import { GlosarioBuscador } from "@/components/GlosarioBuscador";

const product = getDefaultProduct();
export const metadata = buildMetadata({
  title: "Glosario para negocios con turnos: agenda, caja y clientes",
  brand: product.brandName,
  description:
    "Qué es el no-show, la seña, la caja diaria, las comisiones, el ticket promedio, la lista de espera y más. Explicado simple para dueños de negocios.",
  path: "/glosario",
  keywords: ["glosario turnos", "qué es no-show", "cómo hacer la caja diaria", "cómo calcular comisiones", "ticket promedio"],
});

export default function GlosarioPage() {
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Glosario", path: "/glosario" },
  ];
  const termSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": absoluteUrl("/glosario#glosario"),
    name: "Glosario de Prestum Turnos",
    url: absoluteUrl("/glosario"),
    hasDefinedTerm: glosario.map((t) => ({ "@type": "DefinedTerm", name: t.termino, description: t.definicion, url: absoluteUrl(`/glosario/${t.slug}`) })),
  };
  const usadas = CATEGORIAS_GLOSARIO.filter((c) => glosario.some((t) => t.categoria === c));

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product), termSet, breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Glosario para negocios con turnos</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Los conceptos que usás todos los días para manejar la agenda, la caja y los clientes, explicados simple.
        </p>
        <GlosarioBuscador
          items={glosario.map(({ slug, termino, categoria, definicion }) => ({ slug, termino, categoria, definicion }))}
          categorias={usadas}
        />
      </section>
    </ProductShell>
  );
}
