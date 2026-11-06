import Link from "next/link";
import { getDefaultProduct } from "@/config/products";
import { absoluteUrl } from "@/config/site";
import { articulos } from "@/config/blog";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs } from "@/components/sections";

const product = getDefaultProduct();
export const metadata = buildMetadata({
  title: "Blog: guías para negocios con turnos",
  brand: product.brandName,
  description: "Guías prácticas para dueños de negocios con turnos: menos mensajes, menos ausencias, cómo cobrar seña, comisiones del equipo y cómo sumar clientes.",
  path: "/blog",
});

export default function BlogPage() {
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Blog", path: "/blog" },
  ];
  const ld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/blog#blog"),
    name: `Blog de ${product.brandName}`,
    url: absoluteUrl("/blog"),
    blogPost: articulos.map((a) => ({ "@type": "BlogPosting", headline: a.titulo, url: absoluteUrl(`/blog/${a.slug}`), datePublished: a.publicado })),
  };
  return (
    <ProductShell product={product}>
      <JsonLd data={[ld, breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Blog</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">Guías cortas y prácticas para ordenar la agenda, cobrar mejor y que tus clientes vuelvan.</p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articulos.map((a) => (
            <li key={a.slug}>
              <Link href={`/blog/${a.slug}`} className="block h-full overflow-hidden rounded-2xl border border-slate-200 hover:border-brand-500">
                <img src={`/blog/${a.slug}/opengraph-image`} alt="" width={1200} height={675} loading="lazy" className="aspect-video w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-medium text-brand-700">
                    {a.categoria} · {a.minutos} min
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">{a.titulo}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{a.descripcion}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ProductShell>
  );
}
