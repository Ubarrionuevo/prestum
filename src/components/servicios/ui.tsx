import Link from "next/link";
import type { ReactNode } from "react";
import type { Faq } from "@/config/types";
import { ciudades } from "@/config/seo-content";
import { estudio, precioTexto, servicioPath, servicios, waLink } from "@/config/servicios/estudio";
import { rubrosServ } from "@/config/servicios/rubros";
import { casos, comparativasServ } from "@/config/servicios/extras";

/**
 * Componentes de la sección de servicios. Identidad visual propia (oscuro + ámbar),
 * distinta de Prestum Turnos: header, footer y botón de WhatsApp propios, sin enlaces cruzados.
 */
const B = estudio.base;

export function LogoEstudio() {
  return (
    <Link href={B} className="flex items-center gap-2 font-extrabold tracking-tight text-white">
      <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-sm text-slate-950">
        EW
      </span>
      {estudio.nombre}
    </Link>
  );
}

export function HeaderEstudio() {
  const links = [
    ...servicios.map((s) => ({ href: servicioPath(s), texto: s.nombre })),
    { href: `${B}/precios`, texto: "Precios" },
    { href: `${B}/casos`, texto: "Casos" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <nav aria-label="Principal" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <LogoEstudio />
        <ul className="hidden items-center gap-1 text-sm lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="px-2 py-1 text-slate-300 hover:text-amber-300">
                {l.texto}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={waLink(`Hola! Quiero cotizar un servicio para mi negocio.`)} className="whitespace-nowrap rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300">
            Cotizar por WhatsApp
          </a>
          <details className="relative lg:hidden">
            <summary aria-label="Abrir menú" className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-xl text-white marker:hidden hover:bg-white/10">
              ☰
            </summary>
            <ul className="absolute right-0 top-11 w-64 rounded-2xl bg-white p-2 shadow-xl">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block rounded-lg px-3 py-2.5 font-medium text-slate-800 hover:bg-amber-50">
                    {l.texto}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${B}/rubros`} className="block rounded-lg px-3 py-2.5 font-medium text-slate-800 hover:bg-amber-50">
                  Por rubro
                </Link>
              </li>
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}

export function FooterEstudio() {
  const destacadas = ciudades.slice(0, 12);
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <LogoEstudio />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{estudio.definicion}</p>
          <a href={waLink("Hola! Quiero hacer una consulta.")} className="mt-4 inline-block text-sm font-semibold text-amber-300 hover:underline">
            WhatsApp {estudio.telefono}
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Servicios</p>
          <ul className="mt-3 grid gap-1.5 text-sm">
            {servicios.map((s) => (
              <li key={s.slug}>
                <Link href={servicioPath(s)} className="inline-block py-0.5 hover:text-amber-300">
                  {s.titulo} <span className="text-slate-400">· {precioTexto(s)}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href={`${B}/precios`} className="inline-block py-0.5 hover:text-amber-300">
                Precios
              </Link>
            </li>
            <li>
              <Link href={`${B}/casos`} className="inline-block py-0.5 hover:text-amber-300">
                Casos reales
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Diseño web por ciudad</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
            {destacadas.map((c) => (
              <li key={c.slug}>
                <Link href={`${B}/diseno-web/${c.slug}`} className="inline-block py-0.5 hover:text-amber-300">
                  {c.corto}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`${B}/diseno-web#ciudades`} className="mt-2 inline-block text-sm text-amber-300 hover:underline">
            Todas las ciudades →
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recursos</p>
          <ul className="mt-3 grid gap-1.5 text-sm">
            <li>
              <Link href={`${B}/rubros`} className="inline-block py-0.5 hover:text-amber-300">
                Servicios por rubro ({rubrosServ.length})
              </Link>
            </li>
            {comparativasServ.map((c) => (
              <li key={c.slug}>
                <Link href={`${B}/vs/${c.slug}`} className="inline-block py-0.5 hover:text-amber-300">
                  {c.h1}
                </Link>
              </li>
            ))}
            {casos.map((c) => (
              <li key={c.slug}>
                <Link href={`${B}/casos/${c.slug}`} className="inline-block py-0.5 hover:text-amber-300">
                  Caso: {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {estudio.nombre} · Diseño web, Tiendanube, SEO y sistemas a medida en Argentina
      </p>
    </footer>
  );
}

export function WaFlotante({ mensaje }: { mensaje: string }) {
  return (
    <a
      href={waLink(mensaje)}
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700"
    >
      <span aria-hidden>💬</span> WhatsApp
    </a>
  );
}

export function Migas({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <nav aria-label="Ruta de navegación" className="mx-auto max-w-6xl px-4 pt-5 text-sm text-slate-400">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>›</span>}
            {i < items.length - 1 ? (
              <Link href={it.path} className="hover:text-amber-300">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-slate-200">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function HeroEstudio({
  migas,
  etiqueta,
  titulo,
  bajada,
  mensaje,
  precio,
  secundario,
}: {
  migas?: Array<{ name: string; path: string }>;
  etiqueta: string;
  titulo: string;
  bajada: string;
  mensaje: string;
  precio?: string;
  secundario?: { href: string; texto: string };
}) {
  return (
    <section className="bg-slate-950 text-white">
      {migas && <Migas items={migas} />}
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:pb-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">{etiqueta}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{titulo}</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-300">{bajada}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={waLink(mensaje)} className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-300">
            Cotizar por WhatsApp
          </a>
          {secundario && (
            <Link href={secundario.href} className="rounded-xl border border-white/25 px-5 py-3 font-semibold text-white hover:bg-white/10">
              {secundario.texto}
            </Link>
          )}
          {precio && <span className="text-sm text-slate-400">{precio}</span>}
        </div>
      </div>
    </section>
  );
}

export function Seccion({ titulo, children, id, gris }: { titulo?: string; children: ReactNode; id?: string; gris?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-20 ${gris ? "bg-slate-50" : ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        {titulo && <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{titulo}</h2>}
        {children}
      </div>
    </section>
  );
}

export function ListaCheck({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
      {items.map((x) => (
        <li key={x} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
          <span aria-hidden className="font-bold text-amber-600">
            ✓
          </span>
          {x}
        </li>
      ))}
    </ul>
  );
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <Seccion titulo="Preguntas frecuentes" id="preguntas">
      <div className="mt-6 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900 marker:hidden">
              {f.q}
              <span aria-hidden className="text-amber-600 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </Seccion>
  );
}

export function Diagnostico() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Gratis · por WhatsApp</p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Diagnóstico gratis de tu web o tu negocio en Google</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Mandanos el link de tu web, tu tienda o tu Instagram. Te respondemos qué le falta para que te encuentren en Google y te escriban más. Sin compromiso.
        </p>
        <a href={waLink("Hola! Quiero el diagnóstico gratis. Este es el link de mi web/negocio: ")} className="mt-6 inline-block rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-300">
          Pedir diagnóstico gratis
        </a>
      </div>
    </section>
  );
}

export function TarjetasServicios() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {servicios.map((s) => (
        <Link key={s.slug} href={servicioPath(s)} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:border-amber-400 hover:shadow-md">
          <span aria-hidden className="text-2xl">
            {s.emoji}
          </span>
          <span className="mt-3 font-bold text-slate-900">{s.titulo}</span>
          <span className="mt-1 text-sm text-slate-600">{s.bajada.split(".")[0]}.</span>
          <span className="mt-auto pt-4 font-semibold text-slate-900">{precioTexto(s).replace(/^d/, "D")}</span>
        </Link>
      ))}
    </div>
  );
}

export function Pildoras({ items }: { items: Array<{ href: string; texto: string }> }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2 text-sm">
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-amber-500 hover:text-amber-700">
            {it.texto}
          </Link>
        </li>
      ))}
    </ul>
  );
}
