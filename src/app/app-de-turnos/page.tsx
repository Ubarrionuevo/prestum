import type { Metadata } from "next";
import Link from "next/link";
import { getDefaultProduct, nichePath, rubrosFoco } from "@/config/products";
import { OFERTA_CORTA, TURNOS_GRATIS } from "@/config/planes";
import { solucionPath, soluciones } from "@/config/soluciones";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";

/**
 * /app-de-turnos — apunta a la búsqueda de dueño "app de turnos" (y "aplicación de turnos").
 * Es la única búsqueda de dueño que no tenía página propia: las de rubro y recordatorios ya la tienen.
 */
const product = getDefaultProduct();
const path = "/app-de-turnos";
const titulo = "App de turnos para barberías, peluquerías y estética";
const descripcion = `App de turnos online para tu negocio: tus clientes reservan solos desde un link, sin descargar nada, y vos manejás agenda, recordatorios y caja. ${OFERTA_CORTA}.`;

export const metadata: Metadata = buildMetadata({
  title: titulo,
  brand: product.brandName,
  description: descripcion,
  path,
  keywords: ["app de turnos", "aplicación de turnos", "app para dar turnos", "app de turnos para negocios", "app de turnos gratis", "app de turnos para barbería", "app de turnos para peluquería"],
});

const faqs = [
  {
    q: "¿Qué es una app de turnos?",
    a: "Es una herramienta para que tus clientes reserven un turno solos, eligiendo servicio, profesional, día y hora, sin tener que escribirte. Vos ves todos los turnos ordenados en una agenda y dejás de coordinar por mensaje.",
  },
  {
    q: "¿Mis clientes tienen que descargar una app?",
    a: "No. Reservan desde tu link, que se abre en el navegador del celular. Lo ponés en la bio de Instagram, en WhatsApp o en Google, y cualquiera puede reservar en segundos.",
  },
  {
    q: "¿Y yo tengo que instalar algo?",
    a: "No hace falta. Entrás a tu panel desde el celular o la computadora. Si querés tenerlo a mano, lo agregás a la pantalla de inicio y se abre como una app.",
  },
  {
    q: "¿La app de turnos es gratis?",
    a: `Sí: el plan Gratis incluye hasta ${TURNOS_GRATIS} turnos por mes, sin tarjeta y sin comisión por turno. Si necesitás más turnos o funciones como seña, recordatorios o caja, hay planes pagos en pesos.`,
  },
  {
    q: "¿Sirve si somos varios profesionales?",
    a: "Sí. Cada barbero, peluquera o esteticista tiene su propia agenda y horarios, y el cliente elige con quién atenderse o toma el primer turno libre.",
  },
  {
    q: "¿Me avisa cuando entra un turno?",
    a: "Sí, el turno te llega a WhatsApp y queda en tu agenda al instante. Además podés mandarle el recordatorio al cliente por WhatsApp con un toque.",
  },
];

const pasos = [
  { titulo: "Cargás tus servicios y horarios", texto: "Cada servicio con su precio y su duración, y cada profesional con sus días de trabajo." },
  { titulo: "Compartís tu link", texto: "En Instagram, WhatsApp y Google. Es tu página de reservas: prestum.com.ar/tu-negocio." },
  { titulo: "Tus clientes reservan solos", texto: "Ven los horarios libres de verdad y eligen. El turno entra a tu agenda sin que contestes un mensaje." },
];

export default function AppDeTurnosPage() {
  const rubros = rubrosFoco(product);
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "App de turnos", path },
  ];

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path, name: titulo, description: descripcion }), faqLd(faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <header className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <p className="text-sm font-semibold text-brand-700">📱 App de turnos online</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">App de turnos para tu barbería, peluquería o centro de estética</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Tus clientes reservan solos desde un link, sin descargar nada. Vos ves la agenda de cada profesional, mandás recordatorios por WhatsApp y llevás la caja del día, todo desde el celular.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/registro" className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-900">
              Empezar gratis
            </Link>
            <Link href="/precios" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700">
              Ver precios
            </Link>
          </div>
          <p className="mt-3 text-sm text-slate-500">{OFERTA_CORTA}, sin tarjeta y sin comisión por turno.</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 pb-6">
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-900">Una app de turnos que no hay que descargar</h2>
          <p className="mt-3 text-slate-700">
            La mayoría de los clientes no va a bajar una app solo para sacar un turno en tu negocio. Por eso {product.brandName} funciona con un link: tu cliente lo toca desde Instagram o WhatsApp, elige el servicio y el horario, y listo.
          </p>
          <p className="mt-3 text-slate-700">
            Del otro lado, vos tenés tu panel: la agenda del día, los turnos de cada profesional y los avisos de reservas nuevas. Lo abrís desde el navegador o lo agregás a la pantalla de inicio del celular.
          </p>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-900">Cómo empezar a dar turnos online</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="rounded-2xl border border-slate-200 p-5">
                <span className="text-sm font-bold text-brand-700">{i + 1}</span>
                <h3 className="mt-1 font-semibold text-slate-900">{p.titulo}</h3>
                <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-900">Qué más hace, además de los turnos</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {soluciones.map((s) => (
              <li key={s.slug}>
                <Link href={solucionPath(s)} className="block h-full rounded-xl border border-slate-200 p-4 hover:border-brand-500">
                  <span className="font-semibold text-slate-900">
                    <span aria-hidden>{s.emoji}</span> {s.nombre}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm text-slate-500">{s.descripcion}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-900">Pensada para tu rubro</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {rubros.map((n) => (
              <li key={n.slug}>
                <Link href={nichePath(product, n)} className="flex h-full items-center gap-2 rounded-xl border border-slate-200 p-4 font-semibold text-slate-900 hover:border-brand-500 hover:text-brand-700">
                  <span aria-hidden>{n.emoji}</span> Turnos para {n.name.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <FaqSection faqs={faqs} />

      <section className="mx-auto max-w-4xl px-4 pb-14">
        <div className="rounded-2xl bg-brand-900 p-6 text-white">
          <h2 className="text-xl font-bold">Tu app de turnos, lista en un minuto</h2>
          <p className="mt-2 text-brand-100">{OFERTA_CORTA}, sin tarjeta y sin comisión por turno.</p>
          <Link href="/registro" className="mt-4 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-brand-900 hover:bg-brand-50">
            Empezar gratis
          </Link>
        </div>
      </section>
    </ProductShell>
  );
}
