import Link from "next/link";
import type { ReactNode } from "react";
import type { Faq } from "@/config/types";
import { funcionGestionPath, funcionesGestion, gestion, precioGestion, rubroGestionPath, rubrosGestion, waGestion } from "@/config/gestion";

/**
 * Componentes de Prestum Gestión. Identidad propia (blanco + índigo), distinta de Prestum Turnos
 * (verde) y de Solvion (oscuro + ámbar). Sin enlaces cruzados con los otros productos.
 */
const B = gestion.base;
const MENSAJE_DEMO = "Hola! Quiero ver una demo de Prestum Gestión para mi negocio.";

export function LogoGestion() {
  return (
    <Link href={B} className="flex shrink-0 items-center gap-2 whitespace-nowrap font-extrabold tracking-tight text-slate-900">
      <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white">
        P
      </span>
      {gestion.marca}
    </Link>
  );
}

export function BotonDemo({ mensaje = MENSAJE_DEMO, className = "", children = "Pedí una demo" }: { mensaje?: string; className?: string; children?: ReactNode }) {
  return (
    <a href={waGestion(mensaje)} className={`inline-block rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white hover:bg-indigo-700 ${className}`}>
      {children}
    </a>
  );
}

export function HeaderGestion() {
  const links = [
    ...rubrosGestion.map((r) => ({ href: rubroGestionPath(r), texto: r.nombre })),
    { href: `${B}#funciones`, texto: "Funciones" },
    { href: `${B}#precio`, texto: "Precio" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav aria-label="Principal" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <LogoGestion />
        <ul className="hidden items-center gap-1 text-sm md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="whitespace-nowrap px-2 py-1 text-slate-600 hover:text-indigo-700">
                {l.texto}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={waGestion(MENSAJE_DEMO)} className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Pedí una demo
          </a>
          <details className="relative md:hidden">
            <summary aria-label="Abrir menú" className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-xl text-slate-800 marker:hidden hover:bg-slate-100">
              ☰
            </summary>
            <ul className="absolute right-0 top-11 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {[...links, ...funcionesGestion.map((f) => ({ href: funcionGestionPath(f), texto: `${f.emoji} ${f.nombre}` }))].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block rounded-lg px-3 py-2.5 font-medium text-slate-800 hover:bg-indigo-50">
                    {l.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}

export function FooterGestion() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <LogoGestion />
          <p className="mt-3 text-sm text-slate-600">Sistema de gestión para kioscos, almacenes y minimercados de Argentina. {precioGestion} por mes.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Rubros</p>
          <ul className="mt-3 grid gap-1 text-sm text-slate-600">
            {rubrosGestion.map((r) => (
              <li key={r.slug}>
                <Link href={rubroGestionPath(r)} className="inline-block py-0.5 hover:text-indigo-700">
                  Sistema para {r.nombre.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Funciones</p>
          <ul className="mt-3 grid gap-1 text-sm text-slate-600">
            {funcionesGestion.map((f) => (
              <li key={f.slug}>
                <Link href={funcionGestionPath(f)} className="inline-block py-0.5 hover:text-indigo-700">
                  {f.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">© {gestion.marca} · Argentina</p>
    </footer>
  );
}

export function WaFlotanteGestion() {
  return (
    <a
      href={waGestion(MENSAJE_DEMO)}
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-4 right-4 z-50 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-95"
    >
      WhatsApp
    </a>
  );
}

export function Migas({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <nav aria-label="Ruta" className="mx-auto max-w-6xl px-4 pt-4 text-sm text-slate-500">
      <ol className="flex flex-wrap gap-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex gap-1">
            {i > 0 && <span aria-hidden>›</span>}
            {i < items.length - 1 ? (
              <Link href={it.path} className="hover:text-indigo-700">
                {it.name}
              </Link>
            ) : (
              <span className="text-slate-700">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Seccion({ titulo, children, id, gris }: { titulo?: string; children: ReactNode; id?: string; gris?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-20 ${gris ? "bg-slate-50" : ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        {titulo && <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{titulo}</h2>}
        {children}
      </div>
    </section>
  );
}

export function ListaDolores({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((d) => (
        <li key={d} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
          <span aria-hidden className="font-bold text-red-500">✗</span>
          {d}
        </li>
      ))}
    </ul>
  );
}

export function ListaCheck({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((x) => (
        <li key={x} className="flex gap-3 text-slate-700">
          <span aria-hidden className="font-bold text-indigo-600">✓</span>
          {x}
        </li>
      ))}
    </ul>
  );
}

export function TarjetasFunciones({ excluir }: { excluir?: string }) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {funcionesGestion
        .filter((f) => f.slug !== excluir)
        .map((f) => (
          <li key={f.slug}>
            <Link href={funcionGestionPath(f)} className="block h-full rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-400">
              <span aria-hidden className="text-2xl">{f.emoji}</span>
              <p className="mt-2 font-bold text-slate-900">{f.nombre}</p>
              <p className="mt-1 text-sm text-slate-600">{f.corto}</p>
            </Link>
          </li>
        ))}
    </ul>
  );
}

export function TarjetasRubros({ excluir }: { excluir?: string }) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-3">
      {rubrosGestion
        .filter((r) => r.slug !== excluir)
        .map((r) => (
          <li key={r.slug}>
            <Link href={rubroGestionPath(r)} className="flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-indigo-400 hover:text-indigo-700">
              <span aria-hidden className="text-2xl">{r.emoji}</span>
              Sistema para {r.nombre.toLowerCase()}
            </Link>
          </li>
        ))}
    </ul>
  );
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <Seccion titulo="Preguntas frecuentes">
      <div className="mt-6 grid max-w-3xl gap-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border border-slate-200 p-4">
            <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
              {f.q}
            </summary>
            <p className="mt-2 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </Seccion>
  );
}

/** Bloque de precio y demo, igual en todas las páginas. */
export function PrecioDemo({ mensaje }: { mensaje?: string }) {
  return (
    <section id="precio" className="scroll-mt-20 bg-indigo-700">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 text-white md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{precioGestion} por mes, con todo incluido</h2>
          <p className="mt-2 max-w-2xl text-indigo-100">Control de stock, ventas y caja, proveedores y compras, y clientes y fiado. Sin instalar nada: desde la computadora o el celular.</p>
        </div>
        <a href={waGestion(mensaje ?? MENSAJE_DEMO)} className="inline-block rounded-xl bg-white px-6 py-3 text-center font-semibold text-indigo-700 hover:bg-indigo-50">
          Pedí una demo por WhatsApp
        </a>
      </div>
    </section>
  );
}

/** Ilustración de la pantalla de venta (productos de ejemplo, sin datos reales). */
export function PantallaVenta() {
  const items = [
    { n: "Alfajor triple", c: 2, p: 1800 },
    { n: "Gaseosa 1,5 L", c: 1, p: 3200 },
    { n: "Pan lactal", c: 1, p: 2900 },
  ];
  const total = items.reduce((s, i) => s + i.c * i.p, 0);
  const $ = (n: number) => `$${n.toLocaleString("es-AR")}`;
  return (
    <div aria-hidden className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Venta</span>
        <span>Caja abierta</span>
      </div>
      <div className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400">Buscar producto…</div>
      <ul className="mt-3 divide-y divide-slate-100 text-sm">
        {items.map((i) => (
          <li key={i.n} className="flex justify-between py-2">
            <span className="text-slate-700">
              {i.c} × {i.n}
            </span>
            <span className="font-medium text-slate-900">{$(i.c * i.p)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
        <span className="text-sm text-slate-500">Total</span>
        <span className="text-xl font-extrabold text-slate-900">{$(total)}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
        <span className="rounded-lg bg-indigo-600 py-2 text-white">Efectivo</span>
        <span className="rounded-lg bg-slate-100 py-2 text-slate-700">Transferencia</span>
        <span className="rounded-lg bg-slate-100 py-2 text-slate-700">Fiado</span>
      </div>
    </div>
  );
}
