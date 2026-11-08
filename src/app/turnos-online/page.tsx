import Link from "next/link";
import { getDefaultProduct } from "@/config/products";
import { ciudades } from "@/config/seo-content";
import { breadcrumbLd, buildMetadata, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs } from "@/components/sections";

const product = getDefaultProduct();
export const metadata = buildMetadata({
  title: "Turnos online por ciudad en Argentina",
  brand: product.brandName,
  description: "Sistema de turnos online para negocios de todo el país. Elegí tu ciudad y mirá cómo funciona Prestum Turnos cerca tuyo.",
  path: "/turnos-online",
});

export default function CiudadesPage() {
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Turnos online por ciudad", path: "/turnos-online" },
  ];
  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Automatizá los turnos de tu negocio en toda Argentina con tu propio WhatsApp</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">Tu link de reservas funciona en cualquier ciudad. Elegí la tuya:</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ciudades.map((c) => (
            <li key={c.slug}>
              <Link href={`/turnos-online/${c.slug}`} className="block rounded-xl border border-slate-200 p-4 hover:border-brand-500">
                <span className="font-semibold text-slate-900">Turnos online en {c.nombre}</span>
                <span className="block text-sm text-slate-500">{c.provincia}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ProductShell>
  );
}
