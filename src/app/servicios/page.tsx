import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio } from "@/config/servicios/estudio";
import { rubrosServ } from "@/config/servicios/rubros";
import { casos, comparativasServ } from "@/config/servicios/extras";
import { ciudades } from "@/config/seo-content";
import { estudioLd } from "@/lib/servicios";
import { Diagnostico, Faqs, HeroEstudio, Pildoras, Seccion, TarjetasServicios } from "@/components/servicios/ui";

const B = estudio.base;

const faqs = [
  { q: `¿Qué es ${estudio.nombre}?`, a: estudio.definicion },
  { q: "¿Cuánto cuesta una página web?", a: "Una landing page arranca en $150.000 y una tienda Tiendanube en $250.000, precios fijos en pesos. El SEO arranca en $150.000 y los sistemas a medida se cotizan sin cargo." },
  { q: "¿Trabajan con negocios de todo el país?", a: "Sí. Trabajamos a distancia con negocios de todas las provincias: todo se coordina por WhatsApp y videollamada." },
  { q: "¿Cómo empiezo?", a: "Escribinos por WhatsApp contando qué hace tu negocio. Te respondemos con lo que te conviene, el plazo y el precio cerrado." },
];

export const metadata: Metadata = buildMetadata({
  title: "Diseño de páginas web, Tiendanube, SEO y sistemas a medida en Argentina",
  brand: estudio.nombre,
  description: "Páginas web desde $150.000, tiendas Tiendanube desde $250.000, SEO para aparecer en Google y ChatGPT, y sistemas a medida. Precios fijos en pesos y todo por WhatsApp.",
  path: B,
  keywords: ["diseño de páginas web", "tiendanube", "posicionamiento seo", "sistemas a medida", "página web para negocios argentina"],
});

export default function ServiciosHome() {
  return (
    <>
      <JsonLd data={[estudioLd(), faqLd(faqs)]} />
      <HeroEstudio
        etiqueta="Diseño web · Tiendanube · SEO · Sistemas"
        titulo="Tu negocio, encontrado en Google y recibiendo consultas por WhatsApp"
        bajada={estudio.bajada}
        mensaje="Hola! Quiero cotizar un servicio para mi negocio."
        precio="Páginas web desde $150.000"
        secundario={{ href: `${B}/precios`, texto: "Ver precios" }}
      />

      <Seccion titulo="Servicios">
        <TarjetasServicios />
      </Seccion>

      <Seccion titulo="Trabajos reales" gris>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {casos.map((c) => (
            <Link key={c.slug} href={`${B}/casos/${c.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-amber-400">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{c.rubro}</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{c.nombre}</p>
              <p className="mt-2 text-slate-600">{c.resumen}</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">Ver el caso →</p>
            </Link>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Cómo trabajamos">
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { t: "1. Nos escribís", d: "Por WhatsApp nos contás qué hace tu negocio y qué necesitás." },
            { t: "2. Precio cerrado", d: "Te pasamos qué incluye, el plazo y el precio fijo en pesos." },
            { t: "3. Lo armamos", d: "Te mostramos avances funcionando y ajustamos lo que haga falta." },
            { t: "4. Publicado", d: "Queda online, a tu nombre y listo para recibir consultas." },
          ].map((p) => (
            <li key={p.t} className="rounded-2xl border border-slate-200 p-5">
              <p className="font-bold text-slate-900">{p.t}</p>
              <p className="mt-2 text-sm text-slate-600">{p.d}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      <Diagnostico />

      <Seccion titulo="Por rubro" gris>
        <p className="mt-3 max-w-2xl text-slate-600">Cada rubro necesita algo distinto de su web. Elegí el tuyo y mirá qué tiene que tener.</p>
        <Pildoras items={rubrosServ.map((r) => ({ href: `${B}/diseno-web/${r.slug}`, texto: `${r.emoji} ${r.nombre}` }))} />
      </Seccion>

      <Seccion titulo="En tu ciudad">
        <p className="mt-3 max-w-2xl text-slate-600">Trabajamos a distancia con negocios de todo el país.</p>
        <Pildoras items={ciudades.map((c) => ({ href: `${B}/diseno-web/${c.slug}`, texto: `Diseño web en ${c.corto}` }))} />
      </Seccion>

      <Seccion titulo="Comparativas" gris>
        <Pildoras items={comparativasServ.map((c) => ({ href: `${B}/vs/${c.slug}`, texto: c.h1 }))} />
      </Seccion>

      <Faqs faqs={faqs} />
    </>
  );
}
