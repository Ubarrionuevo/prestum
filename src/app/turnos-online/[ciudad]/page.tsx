import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultProduct } from "@/config/products";
import { cityNichePath, rubrosConCiudades } from "@/lib/pseo";
import { ciudades, getCiudad } from "@/config/seo-content";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { getPrecios } from "@/lib/planes";
import { PRUEBA_DIAS } from "@/config/planes";
import { Breadcrumbs, FaqSection, HowItWorks } from "@/components/sections";

type Props = { params: Promise<{ ciudad: string }> };
export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => ciudades.map((c) => ({ ciudad: c.slug }));

const product = getDefaultProduct();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCiudad((await params).ciudad);
  if (!c) return {};
  return buildMetadata({
    title: `App de turnos online en ${c.nombre}`,
    brand: product.brandName,
    description: `Sistema de turnos online para negocios de ${c.nombre}, ${c.provincia}. Tus clientes reservan solos 24/7 y la reserva te llega a WhatsApp. ${PRUEBA_DIAS} días gratis.`,
    path: `/turnos-online/${c.slug}`,
    keywords: [`turnos online ${c.nombre}`, `turnero ${c.nombre}`, `agenda online ${c.nombre}`, `sistema de turnos ${c.provincia}`],
  });
}

export default async function CiudadPage({ params }: Props) {
  const c = getCiudad((await params).ciudad);
  if (!c) notFound();
  const path = `/turnos-online/${c.slug}`;
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Turnos online por ciudad", path: "/turnos-online" },
    { name: c.nombre, path },
  ];
  const faqs = [
    { q: `¿Prestum Turnos funciona en ${c.nombre}?`, a: `Sí. Funciona en ${c.nombre} y en toda la provincia de ${c.provincia}: solo necesitás tu link y WhatsApp.` },
    { q: "¿Mis clientes tienen que bajar una app?", a: "No. Reservan desde tu link en el navegador del celular y la reserva te llega por WhatsApp." },
    { q: "¿Cuánto cuesta?", a: `Tenés ${PRUEBA_DIAS} días gratis sin tarjeta. Después, planes con precio fijo en pesos y sin comisión por turno.` },
  ];
  const otras = ciudades.filter((x) => x.slug !== c.slug);
  const { planes } = await getPrecios();

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path, name: `${product.brandName} en ${c.nombre}`, planes }), faqLd(faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Turnos online para negocios en {c.nombre}</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          Si tenés un negocio con turnos en {c.nombre}, {c.provincia}, tus clientes pueden reservar solos desde tu link, a cualquier hora. Vos recibís cada turno armado en WhatsApp.
        </p>
        {c.zonas.length > 1 && (
          <p className="mt-3 max-w-2xl text-slate-600">
            Lo usan negocios de {c.zonas.slice(0, -1).join(", ")} y {c.zonas[c.zonas.length - 1]}, y de cualquier otra zona de la ciudad.
            {c.siesta && " Si trabajás con horario cortado, cargás la mañana y la tarde por separado y nadie reserva en la siesta."}
          </p>
        )}
        <Link href="/registro" className="mt-8 inline-block rounded-xl bg-brand-700 px-6 py-3.5 font-semibold text-white hover:bg-brand-900">
          Empezar gratis · {PRUEBA_DIAS} días
        </Link>
      </section>
      <HowItWorks />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Rubros que usan turnos online en {c.nombre}</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rubrosConCiudades(product).map((n) => (
            <li key={n.slug}>
              <Link href={cityNichePath(product, n, c)} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-brand-500">
                <span className="text-2xl" aria-hidden>
                  {n.emoji}
                </span>
                <span className="font-medium text-slate-800">
                  {n.name} en {c.corto}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <FaqSection faqs={faqs} />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-lg font-semibold text-slate-900">Turnos online en otras ciudades</h2>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm">
          {otras.map((o) => (
            <li key={o.slug}>
              <Link href={`/turnos-online/${o.slug}`} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                {o.corto}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ProductShell>
  );
}
