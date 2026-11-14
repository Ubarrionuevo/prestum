import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nichePath } from "@/config/products";
import { LandingState } from "@/components/landing/LandingState";
import { Hero } from "@/components/landing/Hero";
import { OFERTA_CORTA, TURNOS_GRATIS, planesPagos } from "@/config/planes";
import { formatPrecio } from "@/config/negocios";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { cityNichePath, ciudadesCercanas, getCityNiche, pseoRoutes, rubrosConCiudades, textosCiudadRubro } from "@/lib/pseo";
import { getPrecios } from "@/lib/planes";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Benefits, Breadcrumbs, FaqSection, HowItWorks } from "@/components/sections";

type Props = { params: Promise<{ slug: string; nicho: string; ciudad: string }> };

// Páginas estáticas (una por rubro × ciudad), con los precios refrescados 1 vez por día.
export const revalidate = 86400;
export const dynamicParams = false;
export function generateStaticParams() {
  return pseoRoutes().map((r) => ({ slug: r.producto, nicho: r.nicho, ciudad: r.ciudad }));
}

async function cargar(params: Props["params"]) {
  const { slug, nicho, ciudad } = await params;
  const found = getCityNiche(slug, nicho, ciudad);
  if (!found) return undefined;
  const { planes } = await getPrecios();
  const desde = formatPrecio(planesPagos(planes)[0]?.precio_mensual ?? 0);
  return { ...found, planes, desde, textos: textosCiudadRubro(found.product, found.niche, found.city, desde) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await cargar(params);
  if (!d) return {};
  const { product, niche, city } = d;
  const rubro = niche.name.toLowerCase();
  return buildMetadata({
    title: `Sistema de turnos y gestión para ${rubro} en ${city.corto}`,
    brand: product.brandName,
    description: `Software de gestión y turnos para dueños de ${rubro} en ${city.corto}, ${city.provincia}: reservas 24/7 a tu WhatsApp, recordatorios, seña, caja y comisiones. ${OFERTA_CORTA}, sin tarjeta.`,
    path: cityNichePath(product, niche, city),
    keywords: [
      `turnero ${rubro} ${city.corto}`,
      `turnos online ${rubro} ${city.corto}`,
      `agenda ${niche.business} ${city.corto}`,
      `sistema de turnos ${city.corto}`,
      `software de gestión ${niche.business} ${city.corto}`,
      ...niche.keywords.slice(0, 2),
    ],
  });
}

export default async function CiudadRubroPage({ params }: Props) {
  const d = await cargar(params);
  if (!d) notFound();
  const { product, niche, city, planes, desde, textos } = d;
  const rubro = niche.name.toLowerCase();
  const path = cityNichePath(product, niche, city);
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: niche.name, path: nichePath(product, niche) },
    { name: city.corto, path },
  ];
  const otrosRubros = rubrosConCiudades(product).filter((n) => n.slug !== niche.slug);

  return (
    <ProductShell product={product}>
      <JsonLd
        data={[
          graphLd(product, {
            path,
            name: `${product.brandName} para ${rubro} en ${city.corto}`,
            description: textos.bajada,
            audience: niche.name,
            area: { nombre: city.nombre, provincia: city.provincia },
            planes,
          }),
          faqLd(textos.faqs),
          breadcrumbLd(crumbs),
        ]}
      />
      <div className="bg-brand-50">
        <Breadcrumbs items={crumbs} />
      </div>
      {/* Mismo inicio que la página del rubro: título y botones a la izquierda y la app funcionando
          (página de reservas con servicios del rubro) a la derecha. El texto local sigue abajo. */}
      <LandingState initialRubro={niche.slug}>
        <Hero titulo={textos.h1} lema={textos.lema} etiqueta={`${niche.emoji} ${niche.name} · ${city.nombre}`} subtitle={textos.bajada} showRubros={false} compacto />
      </LandingState>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Agenda online para tu {niche.business} en {city.corto}
        </h2>
        <div className="mt-5 grid gap-4 text-slate-600">
          {textos.local.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">Lo que pasa sin un turnero</h2>
            <ul className="mt-4 grid gap-2 text-slate-600">
              {niche.pains.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-rose-500" aria-hidden>
                    ✕
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">Lo que tus clientes de {city.corto} pueden reservar</h2>
            <ul className="mt-4 grid gap-2 text-slate-600">
              {niche.examples.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-brand-700" aria-hidden>
                    ✓
                  </span>
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-slate-500">Cada servicio con su precio y duración. Vos los cargás y los cambiás cuando quieras.</p>
          </div>
        </div>
      </section>

      <Benefits title={`Pensado para tu ${niche.business}`} items={niche.benefits} />
      <section className="mx-auto max-w-6xl px-4 pb-4 text-center">
        <Link href="/funciones" className="font-semibold text-brand-700 hover:underline">
          Ver todas las funciones para dueños: recordatorios, seña, caja y comisiones, lista de espera →
        </Link>
      </section>
      <HowItWorks />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl bg-brand-900 px-6 py-10 text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Se paga solo con un turno</h2>
          <p className="mt-3 max-w-2xl text-brand-100">
            Si recuperás un solo turno por mes que antes se perdía por no contestar a tiempo, el sistema ya está pagado. Y para empezar no pagás nada: es gratis hasta {TURNOS_GRATIS} turnos por mes. Después,
            planes desde {desde}/mes, precio fijo en pesos y sin comisión por turno. La seña es 100% opcional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/registro" className="rounded-xl bg-white px-5 py-3 font-semibold text-brand-900 hover:bg-brand-50">
              Empezar gratis
            </Link>
            <Link href="/precios" className="rounded-xl border border-white/40 px-5 py-3 font-semibold hover:bg-white/10">
              Ver precios
            </Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={textos.faqs} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {niche.name} en otras ciudades
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              {ciudadesCercanas(city).map((o) => (
                <li key={o.slug}>
                  <Link href={cityNichePath(product, niche, o)} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                    {niche.name} en {o.corto}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={nichePath(product, niche)} className="inline-block rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 font-medium text-brand-700">
                  Sistema de turnos para {rubro} →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sistema de turnos para otros rubros en {city.corto}</h2>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              {otrosRubros.map((n) => (
                <li key={n.slug}>
                  <Link href={cityNichePath(product, n, city)} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                    {n.name} en {city.corto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </ProductShell>
  );
}
