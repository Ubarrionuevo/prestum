import Link from "next/link";
import { getDefaultProduct } from "@/config/products";
import { OFERTA_CORTA, PLANES_BARBERIAS_DEFAULT } from "@/config/planes";
import { solucionPath, soluciones } from "@/config/soluciones";
import { planMinimo } from "@/lib/funciones";
import { FUNCIONES_GEO, breadcrumbLd, buildMetadata, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs } from "@/components/sections";

const product = getDefaultProduct();
const path = "/funciones";

export const metadata = buildMetadata({
  title: "Funciones del sistema de turnos y gestión para barberías, peluquerías y estética",
  brand: product.brandName,
  description: "Link de reservas, turnos a WhatsApp, recordatorios, seña, lista de espera, caja y comisiones: todo lo que hace Prestum Turnos por tu barbería, peluquería o centro de estética.",
  path,
  keywords: ["funciones sistema de turnos", "software de gestión para barberías", "software para peluquerías", "sistema de turnos con seña", "recordatorios por whatsapp"],
});

export default function FuncionesPage() {
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Funciones", path },
  ];
  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path }), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Funciones de {product.brandName}</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Software de gestión y turnos para barberías, peluquerías y centros de estética. {OFERTA_CORTA}; las funciones de cada plan, abajo.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {soluciones.map((s) => {
            const plan = planMinimo(PLANES_BARBERIAS_DEFAULT, s.funcion);
            return (
              <li key={s.slug}>
                <Link href={solucionPath(s)} className="block h-full rounded-2xl border border-slate-200 p-5 hover:border-brand-500">
                  <span className="text-2xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <span className="mt-2 block text-lg font-semibold text-slate-900">{s.nombre}</span>
                  <span className="mt-1 block text-sm text-slate-600">{s.descripcion}</span>
                  {plan && <span className="mt-2 block text-xs font-medium text-brand-700">Desde el plan {plan}</span>}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/calculadora-ausencias" className="block h-full rounded-2xl border border-slate-200 p-5 hover:border-brand-500">
              <span className="text-2xl" aria-hidden>
                📉
              </span>
              <span className="mt-2 block text-lg font-semibold text-slate-900">Calculadora de ausencias</span>
              <span className="mt-1 block text-sm text-slate-600">Cuánta plata perdés por mes con los turnos que no vienen.</span>
            </Link>
          </li>
        </ul>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Todo lo que incluye</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            {FUNCIONES_GEO.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-brand-700" aria-hidden>
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/precios" className="mt-4 inline-block font-medium text-brand-700 hover:underline">
            Ver qué incluye cada plan →
          </Link>
        </section>
      </div>
    </ProductShell>
  );
}
