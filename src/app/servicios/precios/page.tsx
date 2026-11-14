import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio, precioTexto, servicioPath, servicios, waLink } from "@/config/servicios/estudio";
import { estudioLd } from "@/lib/servicios";
import { Faqs, HeroEstudio, Seccion } from "@/components/servicios/ui";

const path = `${estudio.base}/precios`;
const faqs = [
  { q: "¿Cuánto cuesta una página web en Argentina en 2026?", a: "Con nosotros, una landing page arranca en $150.000, precio fijo en pesos. Una web con varias secciones, blog o funciones especiales se cotiza según lo que necesite." },
  { q: "¿Cuánto cuesta armar una tienda en Tiendanube?", a: "El armado desde cero o el rediseño arranca en $250.000. El plan mensual de Tiendanube se paga aparte, directo a Tiendanube." },
  { q: "¿Cuánto cuesta el SEO?", a: "Arranca en $150.000. Antes te hacemos un diagnóstico gratis por WhatsApp para decirte qué le falta a tu web y si te conviene." },
  { q: "¿Los precios son en dólares?", a: "No. Todos los precios son en pesos argentinos." },
  { q: "¿Hay costos que no estén en el precio?", a: "El dominio y, si corresponde, el plan de Tiendanube se pagan aparte a cada empresa. Te lo aclaramos antes de empezar, con el precio cerrado por escrito." },
];

export const metadata: Metadata = buildMetadata({
  title: "Precios de páginas web, Tiendanube y SEO en Argentina (2026)",
  brand: estudio.nombre,
  description: "Cuánto cuesta una página web en Argentina: landing desde $150.000, Tiendanube desde $250.000, SEO desde $150.000 y sistemas a medida con presupuesto sin cargo. En pesos.",
  path,
  keywords: ["cuánto cuesta una página web", "precio página web argentina", "precio tiendanube armado", "precio seo"],
});

export default function PreciosServicios() {
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: "Precios", path },
  ];
  return (
    <>
      <JsonLd data={[estudioLd(), faqLd(faqs), breadcrumbLd(crumbs)]} />
      <HeroEstudio
        migas={crumbs}
        etiqueta="Precios en pesos argentinos"
        titulo="Cuánto cuesta una página web, una Tiendanube o el SEO"
        bajada="Precios claros, en pesos y con el precio cerrado antes de empezar. Sin sorpresas."
        mensaje="Hola! Quiero consultar precios."
      />
      <Seccion>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {servicios.map((s) => (
            <div key={s.slug} className="flex flex-col rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{s.plan}</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{s.titulo}</p>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">{s.precio ? precioTexto(s).replace(/^desde /, "") : "A consultar"}</p>
              <p className="text-sm text-slate-500">{s.precio ? (s.desde ? "desde, en pesos" : "en pesos") : "presupuesto sin cargo"}</p>
              <ul className="mt-5 grid gap-2 text-sm text-slate-700">
                {s.incluye.slice(0, 5).map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden className="text-amber-600">
                      ✓
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-auto grid gap-2 pt-6">
                <a href={waLink(`Hola! Quiero cotizar ${s.titulo.toLowerCase()}.`)} className="rounded-xl bg-slate-950 px-4 py-2.5 text-center font-semibold text-white hover:bg-slate-800">
                  Cotizar
                </a>
                <Link href={servicioPath(s)} className="text-center text-sm font-semibold text-slate-700 hover:underline">
                  Ver detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Seccion>
      <Faqs faqs={faqs} />
    </>
  );
}
