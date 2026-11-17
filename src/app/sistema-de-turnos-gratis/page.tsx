import type { Metadata } from "next";
import Link from "next/link";
import { getDefaultProduct, nichePath, rubrosFoco, subrubrosDe } from "@/config/products";
import { TURNOS_GRATIS } from "@/config/planes";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";

/**
 * /sistema-de-turnos-gratis — búsqueda de dueño "sistema de turnos gratis" / "turnero gratis" / "agenda de turnos gratis".
 * Dice con claridad qué incluye el plan Gratis y qué no (sin letra chica), y deriva a precios.
 */
const product = getDefaultProduct();
const path = "/sistema-de-turnos-gratis";
const titulo = "Sistema de turnos gratis para barberías, peluquerías y estética";
const descripcion = `Sistema de turnos online gratis: hasta ${TURNOS_GRATIS} turnos por mes, sin tarjeta, sin vencimiento y sin comisión por turno. Tu link de reservas listo en un minuto.`;

export const metadata: Metadata = buildMetadata({
  title: titulo,
  brand: product.brandName,
  description: descripcion,
  path,
  keywords: [
    "sistema de turnos gratis",
    "turnero gratis",
    "agenda de turnos gratis",
    "app de turnos gratis",
    "turnos online gratis",
    "sistema de reservas gratis",
    "agenda online gratis para barbería",
    "agenda online gratis para peluquería",
  ],
});

const incluye = [
  `Hasta ${TURNOS_GRATIS} turnos por mes, con 1 profesional`,
  "Tu link de reservas (prestum.com.ar/tu-negocio)",
  "Servicios con precio y duración",
  "Tus días y horarios, con corte al mediodía",
  "La reserva te llega a WhatsApp",
  "Agenda en el celular o la computadora",
];

const pago = [
  "Más turnos por mes y más profesionales",
  "Recordatorios por WhatsApp y seña (plan Básico)",
  "Lista de espera, caja y comisiones (plan Premium)",
];

const faqs = [
  {
    q: "¿Es gratis de verdad o es una prueba?",
    a: `Es un plan Gratis, no una prueba: hasta ${TURNOS_GRATIS} turnos por mes, sin vencimiento y sin tarjeta. Si un mes necesitás más, pasás a un plan pago.`,
  },
  {
    q: "¿Cobran comisión por turno?",
    a: "No. Ni en el plan Gratis ni en los pagos: los planes pagos son un precio fijo mensual en pesos.",
  },
  {
    q: "¿Qué pasa si llego a los turnos del mes?",
    a: "Podés pasar a un plan pago para seguir tomando turnos ese mes. Si no, tu página deja de tomar turnos nuevos hasta el mes siguiente, cuando el cupo se renueva; tus datos no se borran.",
  },
  {
    q: "¿Mis clientes tienen que pagar o registrarse?",
    a: "No. Reservan gratis desde tu link, en el navegador del celular, sin crear cuenta.",
  },
];

export default function TurnosGratisPage() {
  const rubros = [...rubrosFoco(product), ...subrubrosDe(product)];
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Sistema de turnos gratis", path },
  ];

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path, name: titulo, description: descripcion }), faqLd(faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <header className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <p className="text-sm font-semibold text-brand-700">🎁 Plan Gratis</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Sistema de turnos gratis</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Hasta {TURNOS_GRATIS} turnos por mes, sin tarjeta, sin vencimiento y sin comisión por turno. Para tu barbería, peluquería o centro de estética.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/registro" className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-900">
              Crear mi link gratis
            </Link>
            <Link href="/precios" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700">
              Ver planes
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 pb-6">
        <section className="grid gap-4 py-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">Qué incluye gratis</h2>
            <ul className="mt-3 space-y-2 text-slate-700">
              {incluye.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-brand-700" aria-hidden>✓</span> {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">Qué suma un plan pago</h2>
            <ul className="mt-3 space-y-2 text-slate-700">
              {pago.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-slate-400" aria-hidden>+</span> {x}
                </li>
              ))}
            </ul>
            <Link href="/precios" className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline">
              Ver precios →
            </Link>
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-900">Gratis para tu rubro</h2>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm">
            {rubros.map((n) => (
              <li key={n.slug}>
                <Link href={nichePath(product, n)} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                  {n.emoji} Turnos para {n.name.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <FaqSection faqs={faqs} />

      <section className="mx-auto max-w-4xl px-4 pb-14">
        <div className="rounded-2xl bg-brand-900 p-6 text-white">
          <h2 className="text-xl font-bold">Tu link de turnos, gratis y en un minuto</h2>
          <p className="mt-2 text-brand-100">Sin tarjeta y sin comisión por turno.</p>
          <Link href="/registro" className="mt-4 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-brand-900 hover:bg-brand-50">
            Empezar gratis
          </Link>
        </div>
      </section>
    </ProductShell>
  );
}
