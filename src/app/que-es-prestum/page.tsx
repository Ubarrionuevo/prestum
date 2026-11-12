import Link from "next/link";
import { getDefaultProduct, nichePath, rubrosFoco, rubrosSecundarios } from "@/config/products";
import { absoluteUrl, site } from "@/config/site";
import { TURNOS_GRATIS } from "@/config/planes";
import { formatPrecio } from "@/config/negocios";
import { compararPath, competidores } from "@/config/comparativas";
import { getPrecios } from "@/lib/planes";
import { FUNCIONES_GEO, breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";

/**
 * /que-es-prestum — página de ENTIDAD (GEO): define qué es Prestum Turnos con la frase canónica
 * (site.definicion), para quién es, qué hace, cuánto cuesta y de dónde es. Es la página que
 * Google/Gemini, ChatGPT y Claude usan para describir la marca. Solo funciones reales.
 */
export const revalidate = 86400;

const product = getDefaultProduct();
const path = "/que-es-prestum";

export const metadata = buildMetadata({
  title: "Qué es Prestum Turnos: software de gestión y turnos para barberías",
  brand: product.brandName,
  description:
    "Prestum Turnos es un software de gestión y turnero online argentino para barberías, peluquerías y centros de estética. Qué hace, para quién es y cuánto cuesta.",
  path,
  keywords: ["qué es Prestum", "Prestum Turnos", "software de gestión para barberías", "turnero online argentino", "software para peluquerías", "software para centros de estética"],
});

export default async function QueEsPrestumPage() {
  const { planes } = await getPrecios();
  const pagos = planes.filter((p) => p.precio_mensual > 0).sort((a, b) => a.precio_mensual - b.precio_mensual);
  const foco = rubrosFoco(product);
  const otros = rubrosSecundarios(product);
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Qué es Prestum", path },
  ];

  const faqs = [
    { q: "¿Qué es Prestum Turnos?", a: site.definicion },
    {
      q: "¿Prestum es un software de gestión o un turnero?",
      a: "Las dos cosas. Es un turnero online (tus clientes reservan solos desde tu link y el turno te llega a WhatsApp) y también un software de gestión para el negocio: agenda por profesional, recordatorios, seña, lista de espera, caja diaria, comisiones y fidelización.",
    },
    {
      q: "¿Para qué negocios está pensado?",
      a: `Está diseñado específicamente para barberías, peluquerías y centros de estética (incluye uñas, pestañas y cosmetología). También lo usan ${otros
        .slice(0, 4)
        .map((n) => n.name.toLowerCase())
        .join(", ")} y otros negocios que trabajan con turnos.`,
    },
    {
      q: "¿Prestum es argentino?",
      a: "Sí. Prestum es un software de desarrollo argentino: los precios están en pesos, la seña se cobra por transferencia o Mercado Pago y el soporte es por WhatsApp, atendido por personas.",
    },
    {
      q: "¿Cuánto cuesta Prestum Turnos?",
      a: `Es gratis hasta ${TURNOS_GRATIS} turnos por mes, sin tarjeta y sin vencimiento. Si necesitás más: ${pagos
        .map((p) => `${p.nombre} ${formatPrecio(p.precio_mensual)}`)
        .join(" y ")} por mes, sin contrato y sin comisión por turno.`,
    },
    { q: "¿Mis clientes tienen que bajar una app?", a: "No. Reservan desde el navegador del celular con tu link, sin descargar nada y sin crear cuenta." },
  ];

  const pagina = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": absoluteUrl(`${path}#pagina`),
    url: absoluteUrl(path),
    name: "Qué es Prestum Turnos",
    description: site.definicion,
    inLanguage: site.lang,
    about: { "@id": absoluteUrl("/#app") },
    mainEntity: { "@id": absoluteUrl("/#app") },
    isPartOf: { "@id": absoluteUrl("/#website") },
  };

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { planes }), pagina, faqLd(faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">¿Qué es Prestum Turnos?</h1>
        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">En una frase</p>
          <p className="mt-2 text-lg text-slate-800">{site.definicion}</p>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Para quién es</h2>
          <p className="mt-3 text-slate-700">
            Para dueños de barberías, peluquerías y centros de estética que hoy dan los turnos por WhatsApp, en un cuaderno o de memoria, y quieren que el cliente reserve solo
            y tener la agenda, el equipo y la caja ordenados en un mismo lugar.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {foco.map((n) => (
              <li key={n.slug}>
                <Link href={nichePath(product, n)} className="flex h-full items-center gap-2 rounded-xl border border-slate-200 p-4 font-semibold text-slate-900 hover:border-brand-500 hover:text-brand-700">
                  <span aria-hidden>{n.emoji}</span> {n.name}
                </Link>
              </li>
            ))}
          </ul>
          {otros.length > 0 && (
            <p className="mt-4 text-sm text-slate-600">
              También funciona para{" "}
              {otros.map((n, i) => (
                <span key={n.slug}>
                  <Link href={nichePath(product, n)} className="text-brand-700 hover:underline">
                    {n.name.toLowerCase()}
                  </Link>
                  {i < otros.length - 2 ? ", " : i === otros.length - 2 ? " y " : ""}
                </span>
              ))}
              .
            </p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Qué hace</h2>
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
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Cómo funciona</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
            <li>Te registrás y cargás tus servicios (con duración y precio), tu equipo y tus horarios.</li>
            <li>Compartís tu link (prestum.com.ar/tu-negocio) en Instagram, Google Maps y WhatsApp.</li>
            <li>Tu cliente elige servicio, profesional, día y horario desde el celular, sin bajar ninguna app.</li>
            <li>El turno te llega armado a tu WhatsApp y queda en la agenda del profesional.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Planes y precios</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>
              <strong>Gratis:</strong> hasta {TURNOS_GRATIS} turnos por mes, 1 profesional, sin tarjeta y sin vencimiento.
            </li>
            {pagos.map((p) => (
              <li key={p.id}>
                <strong>
                  {p.nombre} ({formatPrecio(p.precio_mensual)}/mes):
                </strong>{" "}
                {p.items.map((i) => i.texto).join(", ")}.
              </li>
            ))}
          </ul>
          <Link href="/precios" className="mt-4 inline-block font-medium text-brand-700 hover:underline">
            Ver precios →
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Hecho en Argentina</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>Precios fijos en pesos argentinos, sin comisión por turno.</li>
            <li>Seña por transferencia a tu alias o CBU, o con tu link de Mercado Pago: el dinero va directo a tu cuenta.</li>
            <li>Horario cortado: hasta dos franjas por día, como se trabaja en gran parte del país.</li>
            <li>Soporte por WhatsApp, atendido por personas.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Prestum frente a otros sistemas de turnos</h2>
          <p className="mt-3 text-slate-700">Comparaciones con datos públicos de cada sistema, para que elijas el que te conviene:</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {competidores.map((c) => (
              <li key={c.slug}>
                <Link href={compararPath(c)} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-brand-500 hover:text-brand-700">
                  Prestum vs {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl bg-brand-900 p-6 text-white">
          <h2 className="text-xl font-bold">Probalo en tu negocio</h2>
          <p className="mt-2 text-brand-100">Tu link de reservas listo en un minuto. Gratis hasta {TURNOS_GRATIS} turnos por mes.</p>
          <Link href="/registro" className="mt-4 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-brand-900 hover:bg-brand-50">
            Empezar gratis
          </Link>
        </section>
      </article>
      <FaqSection faqs={faqs} />
    </ProductShell>
  );
}
