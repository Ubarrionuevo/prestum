import Link from "next/link";
import { getDefaultProduct } from "@/config/products";
import { absoluteUrl, site } from "@/config/site";
import { REVISADO, compararPath, competidores } from "@/config/comparativas";
import { conPrecios, datosPrestum, preciosPrestum } from "@/lib/comparar";
import { getPrecios } from "@/lib/planes";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";
import { TablaComparativa } from "@/components/TablaComparativa";

export const revalidate = 86400;

const product = getDefaultProduct();
const anio = REVISADO.slice(0, 4);
const fechaLarga = new Date(`${REVISADO}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

export const metadata = buildMetadata({
  title: `Mejores apps de turnos en Argentina (${anio}): comparativa con precios`,
  brand: "Prestum",
  description: `Comparamos ${product.brandName}, ${competidores.map((c) => c.nombre).join(", ")}: precios en pesos, prueba gratis, WhatsApp, comisiones y equipo. Con fuentes, revisado en ${fechaLarga}.`,
  path: "/comparar",
  keywords: ["mejores apps de turnos argentina", "app de turnos comparativa", "sistema de turnos precios", ...competidores.map((c) => `alternativa a ${c.nombre}`)],
});

export default async function CompararPage() {
  const { planes } = await getPrecios();
  const precios = preciosPrestum(planes);
  const t = (s: string) => conPrecios(s, precios);
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Comparar", path: "/comparar" },
  ];

  const casos = [
    { si: "Trabajás solo y tenés pocos turnos por mes", conviene: t(`Un plan gratis: ${product.brandName} ({gratis} turnos por mes), Cortik (40) o Turnito (100 reservas, con comisión por cobro).`) },
    { si: "Querés un bot con IA que conteste tu WhatsApp", conviene: "TurnoFácil, o AgendaPro en su plan PRO IA." },
    { si: "Querés aparecer en un marketplace de clientes", conviene: "AgendaPro." },
    { si: "Tenés equipo y querés profesionales ilimitados sin comisión", conviene: t(`${product.brandName}: {premium}/mes con ilimitados, 0% comisión.`) },
    { si: "Tenés varias sucursales", conviene: "TurnoFácil (Empresarial, $89.000/mes) o AgendaPro (plan a medida)." },
  ];

  const faqs = [
    { q: "¿Cuál es la mejor app de turnos en Argentina?", a: t("Depende de tu negocio. Si trabajás solo con pocos turnos, un plan gratis alcanza (Prestum Turnos da {gratis} turnos por mes; Cortik, 40); si querés un bot con IA, TurnoFácil; si tenés una barbería, peluquería o centro de estética con equipo y no querés pagar comisiones, Prestum Turnos. Abajo está la tabla con todos los datos.") },
    { q: "¿Qué app de turnos no cobra comisión?", a: t(`${product.brandName}, Cortik y TurnoFácil no cobran comisión por turno ni por la seña. Turnito cobra entre 0% y 5% según el plan.`) },
    { q: "¿De dónde salen estos datos?", a: `De la web oficial de cada empresa, revisada el ${fechaLarga}. Los precios pueden cambiar: cada comparativa enlaza su fuente.` },
  ];

  const lista = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Apps de turnos en Argentina (${anio})`,
    itemListElement: competidores.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${product.brandName} vs ${c.nombre}`, url: absoluteUrl(compararPath(c)) })),
  };

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path: "/comparar", planes }), lista, faqLd(faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <p className="text-sm font-medium text-brand-700">Comparativa · revisado el {fechaLarga}</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Mejores apps de turnos en Argentina ({anio})</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Comparamos las apps de turnos más usadas del país con datos de sus webs oficiales: precios en pesos, prueba gratis, WhatsApp, comisiones y equipo.
          También te decimos cuándo te conviene otra.
        </p>

        <div className="mt-6 max-w-3xl rounded-2xl border-l-4 border-brand-600 bg-brand-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Respuesta corta</p>
          <p className="mt-2 text-slate-800">
            {t(
              `No hay una mejor para todos. Para arrancar gratis: ${product.brandName} ({gratis} turnos por mes), Cortik (40) o Turnito (100, con comisión por cobro). Para un bot con IA en WhatsApp: TurnoFácil. Para una barbería, peluquería o centro de estética con equipo y sin comisiones: ${product.brandName}, con profesionales ilimitados por {premium}/mes.`,
            )}
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-slate-900">Tabla comparativa</h2>
        <div className="mt-4">
          <TablaComparativa columnas={[{ nombre: product.brandName, datos: datosPrestum(planes), destacar: true }, ...competidores.map((c) => ({ nombre: c.nombre, datos: c.datos }))]} />
        </div>

        <h2 className="mt-12 text-2xl font-bold text-slate-900">¿Cuál conviene según tu negocio?</h2>
        <dl className="mt-4 grid gap-3 md:grid-cols-2">
          {casos.map((x) => (
            <div key={x.si} className="rounded-2xl border border-slate-200 p-4">
              <dt className="font-semibold text-slate-900">{x.si}</dt>
              <dd className="mt-1 text-sm text-slate-600">{x.conviene}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 text-2xl font-bold text-slate-900">Comparativas una por una</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {competidores.map((c) => (
            <li key={c.slug}>
              <Link href={compararPath(c)} className="block h-full rounded-2xl border border-slate-200 p-5 hover:border-brand-500">
                <span className="text-lg font-semibold text-brand-700">
                  {product.brandName} vs {c.nombre}
                </span>
                <span className="mt-1 block text-sm text-slate-600">{c.queEs}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/registro" className="rounded-xl bg-brand-700 px-6 py-3.5 text-center font-semibold text-white hover:bg-brand-900">
            Empezar gratis con {product.brandName}
          </Link>
          <Link href="/precios" className="rounded-xl border border-slate-300 px-6 py-3.5 text-center font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700">
            Ver precios
          </Link>
        </div>
      </section>

      <FaqSection faqs={faqs} />

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-lg font-semibold text-slate-900">Método y fuentes</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Revisamos la página de precios oficial de cada app el {fechaLarga} y anotamos solo lo que publican. No incluimos opiniones ni datos que no pudimos verificar.
          Los precios pueden cambiar y algunos incluyen IVA y otros no (lo aclaramos cuando la app lo indica).
        </p>
        <ul className="mt-3 grid gap-1 text-sm">
          {competidores.map((c) => (
            <li key={c.slug} className="text-slate-500">
              {c.nombre}: <span className="break-all">{c.fuente}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-400">
          Las marcas mencionadas pertenecen a sus respectivos dueños; esta comparativa no está asociada ni respaldada por ellas. Si ves un dato desactualizado, escribinos a {site.email}.
        </p>
      </section>
    </ProductShell>
  );
}
