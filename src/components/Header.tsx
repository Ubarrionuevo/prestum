import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/config/types";
import { nichePath, productHomePath, rubrosFoco, rubrosSecundarios } from "@/config/products";
import { Logo } from "./Logo";
import { MenuMovil, type GrupoMenu } from "./MenuMovil";

/**
 * Header propio de cada producto.
 * Menú principal: Producto · Precios · Rubros · Recursos (mismo esquema que los líderes del rubro).
 * Además de navegar, enlaza desde todas las páginas a las secciones que queremos posicionar.
 */
export function Header({ product }: { product: Product }) {
  const home = productHomePath(product);
  const anchor = (id: string) => (home === "/" ? `/#${id}` : `${home}#${id}`);
  const foco = rubrosFoco(product);
  const principales = foco.length ? foco : product.niches;
  const secundarios = foco.length ? rubrosSecundarios(product) : [];

  const grupos: GrupoMenu[] = [
    {
      titulo: "Producto",
      items: [
        { href: anchor("funciones"), texto: "Funcionalidades", detalle: "Agenda, recordatorios, seña, caja y más" },
        { href: anchor("como-funciona"), texto: "Cómo funciona", detalle: "Tu link de reservas en 3 pasos" },
        { href: "/que-es-prestum", texto: "Qué es Prestum", detalle: "Para quién es y qué incluye" },
      ],
    },
    {
      titulo: "Rubros",
      items: principales.map((n) => ({ href: nichePath(product, n), texto: `${n.emoji} ${n.name}` })),
      extra: secundarios.map((n) => ({ href: nichePath(product, n), texto: n.name })),
    },
    {
      titulo: "Recursos",
      items: [
        { href: "/comparar", texto: "Comparar sistemas de turnos", detalle: "Prestum vs Cortik, TurnoFácil y más" },
        { href: "/blog", texto: "Blog", detalle: "Guías para dueños" },
        { href: "/glosario", texto: "Glosario", detalle: "No-show, seña, comisiones y más" },
      ],
    },
  ];
  const [producto, rubros, recursos] = grupos;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4" aria-label="Principal">
        <Logo brandName={product.brandName} href={home} />
        <ul className="flex items-center gap-1 text-sm lg:gap-2">
          <li className="hidden md:block">
            <Desplegable titulo={producto.titulo}>
              <ListaItems grupo={producto} />
            </Desplegable>
          </li>
          <li className="hidden md:block">
            <Link href="/precios" className="px-2 py-1 text-slate-700 hover:text-brand-700">
              Precios
            </Link>
          </li>
          <li className="hidden md:block">
            <Desplegable titulo={rubros.titulo}>
              <ListaItems grupo={rubros} />
            </Desplegable>
          </li>
          <li className="hidden md:block">
            <Desplegable titulo={recursos.titulo}>
              <ListaItems grupo={recursos} />
            </Desplegable>
          </li>
          <li>
            <Link href="/ingresar" className="whitespace-nowrap px-1.5 py-1 font-medium text-slate-700 hover:text-brand-700 sm:px-2">
              Ingresar
            </Link>
          </li>
          <li>
            <Link href="/registro" className="whitespace-nowrap rounded-lg bg-brand-700 px-3 py-2 font-semibold text-white hover:bg-brand-900 sm:px-3.5">
              Empezar<span className="hidden sm:inline"> gratis</span>
            </Link>
          </li>
          <li className="md:hidden">
            <MenuMovil grupos={grupos} precios="/precios" />
          </li>
        </ul>
      </nav>
    </header>
  );
}

/** Menú desplegable de escritorio (hover y foco con teclado, sin JS). */
function Desplegable({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="group relative">
      <button type="button" className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:text-brand-700" aria-haspopup="true">
        {titulo} <span aria-hidden className="text-xs">▾</span>
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}

function ListaItems({ grupo }: { grupo: GrupoMenu }) {
  return (
    <ul className="grid gap-0.5 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-100">
      {grupo.items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} className="block rounded-lg px-3 py-2 hover:bg-brand-50">
            <span className="block font-medium text-slate-800">{it.texto}</span>
            {it.detalle && <span className="block text-xs text-slate-500">{it.detalle}</span>}
          </Link>
        </li>
      ))}
      {grupo.extra && grupo.extra.length > 0 && (
        <li className="mt-1 border-t border-slate-100 px-3 pb-1 pt-2">
          <p className="text-xs font-semibold text-slate-400">También para</p>
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {grupo.extra.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="text-slate-500 hover:text-brand-700">
                  {it.texto}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      )}
    </ul>
  );
}
