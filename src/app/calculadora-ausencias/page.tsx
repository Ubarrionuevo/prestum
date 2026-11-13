import Link from "next/link";
import { getDefaultProduct } from "@/config/products";
import { planesPagos } from "@/config/planes";
import { solucionPath, soluciones } from "@/config/soluciones";
import { getPrecios } from "@/lib/planes";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { absoluteUrl, site } from "@/config/site";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs, FaqSection } from "@/components/sections";
import { CalculadoraAusencias } from "@/components/CalculadoraAusencias";

export const revalidate = 86400;

const product = getDefaultProduct();
const path = "/calculadora-ausencias";

export const metadata = buildMetadata({
  title: "Calculadora de ausencias: cuánto perdés por los turnos que no vienen",
  brand: product.brandName,
  description: "Calculá cuánta plata pierde tu barbería, peluquería o centro de estética por mes y por año con los clientes que reservan y no vienen. Gratis y en pesos.",
  path,
  keywords: ["calculadora de ausencias", "cuánto pierdo por ausencias", "no show barbería", "turnos que no vienen", "ausentismo peluquería"],
});

const faqs = [
  { q: "¿Cómo se calcula la plata que pierdo por ausencias?", a: "Multiplicás las ausencias por semana por el precio promedio de tu servicio y por 4,3 semanas que tiene un mes. Con 4 ausencias por semana y un servicio de $15.000, son unos $258.000 por mes." },
  { q: "¿Cuánto ausentismo es normal?", a: "Varía según el servicio, pero si más de 1 de cada 10 turnos no se presenta, conviene sumar recordatorio el día anterior y seña en los servicios largos o caros." },
  { q: "¿Cómo bajo las ausencias?", a: "Confirmando por escrito al reservar, mandando un recordatorio el día anterior, pidiendo seña en servicios largos o caros y teniendo lista de espera para llenar el hueco si alguien cancela." },
];

export default async function CalculadoraPage() {
  const { planes } = await getPrecios();
  const pagos = planesPagos(planes).map((p) => ({ nombre: p.nombre, precio: p.precio_mensual }));
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Calculadora de ausencias", path },
  ];
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": absoluteUrl(`${path}#calculadora`),
    name: "Calculadora de ausencias para barberías, peluquerías y estética",
    url: absoluteUrl(path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: site.lang,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
  const relacionadas = soluciones.filter((s) => ["sena", "recordatorios-whatsapp", "lista-de-espera"].includes(s.slug));

  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path }), app, faqLd(faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <p className="text-sm font-semibold text-brand-700">📉 Calculadora gratis</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">¿Cuánta plata perdés por los turnos que no vienen?</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Cargá cuántos turnos das, cuántos clientes faltan sin avisar y lo que sale tu servicio. Te mostramos cuánto se va por mes y por año en tu barbería, peluquería o centro de estética.
        </p>
        <div className="mt-8">
          <CalculadoraAusencias planes={pagos} />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Cómo bajar ese número</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {relacionadas.map((s) => (
              <li key={s.slug}>
                <Link href={solucionPath(s)} className="block h-full rounded-2xl border border-slate-200 p-5 hover:border-brand-500">
                  <span className="text-2xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <span className="mt-2 block font-semibold text-slate-900">{s.nombre}</span>
                  <span className="mt-1 block text-sm text-slate-600">{s.descripcion}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Guía completa:{" "}
            <Link href="/blog/reducir-ausentismo-turnos" className="font-medium text-brand-700 hover:underline">
              cómo reducir las ausencias en tu barbería, peluquería o centro de estética
            </Link>
            .
          </p>
        </section>
      </div>
      <FaqSection faqs={faqs} />
    </ProductShell>
  );
}
