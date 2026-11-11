import Link from "next/link";
import type { Product } from "@/config/types";
import { nichePath, productHomePath, rubrosFoco, rubrosSecundarios } from "@/config/products";
import { Logo } from "./Logo";

/** Header propio de cada producto: solo navega dentro de ese producto. */
export function Header({ product }: { product: Product }) {
  const home = productHomePath(product);
  const anchor = (id: string) => (home === "/" ? `/#${id}` : `${home}#${id}`);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4" aria-label="Principal">
        <Logo brandName={product.brandName} href={home} />
        <ul className="flex items-center gap-1 text-sm lg:gap-3">
          <li className="hidden md:block">
            <Link href={anchor("funciones")} className="px-2 py-1 text-slate-700 hover:text-brand-700">
              Funcionalidades
            </Link>
          </li>
          <li className="hidden md:block">
            <Link href={anchor("precios")} className="px-2 py-1 text-slate-700 hover:text-brand-700">
              Precios
            </Link>
          </li>
          {/* Menú de rubros: además de navegar, enlaza todas las landings (SEO interno). */}
          <li className="group relative hidden md:block">
            <button type="button" className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:text-brand-700" aria-haspopup="true">
              Rubros <span aria-hidden className="text-xs">▾</span>
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-72 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="grid gap-0.5 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-100">
                {(rubrosFoco(product).length ? rubrosFoco(product) : product.niches).map((n) => (
                  <li key={n.slug}>
                    <Link href={nichePath(product, n)} className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-800 hover:bg-brand-50 hover:text-brand-700">
                      <span aria-hidden>{n.emoji}</span> {n.name}
                    </Link>
                  </li>
                ))}
                {rubrosFoco(product).length > 0 && rubrosSecundarios(product).length > 0 && (
                  <li className="mt-1 border-t border-slate-100 px-3 pb-1 pt-2">
                    <p className="text-xs font-semibold text-slate-400">También para</p>
                    <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      {rubrosSecundarios(product).map((n) => (
                        <li key={n.slug}>
                          <Link href={nichePath(product, n)} className="text-slate-500 hover:text-brand-700">
                            {n.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
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
        </ul>
      </nav>
    </header>
  );
}
