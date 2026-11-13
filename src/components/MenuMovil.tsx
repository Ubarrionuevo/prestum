"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface ItemMenu {
  href: string;
  texto: string;
  detalle?: string;
}
export interface GrupoMenu {
  titulo: string;
  items: ItemMenu[];
  /** Enlaces secundarios ("También para…"). */
  extra?: ItemMenu[];
}

/** Menú del celular: botón ☰ que abre un panel con los mismos grupos del menú de escritorio. */
export function MenuMovil({ grupos, precios }: { grupos: GrupoMenu[]; precios: string }) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();
  useEffect(() => setAbierto(false), [ruta]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
      >
        <span aria-hidden className="text-xl leading-none">
          {abierto ? "✕" : "☰"}
        </span>
      </button>
      {abierto && (
        <div id="menu-movil" className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-6 pt-2 shadow-lg">
          <Link href={precios} onClick={() => setAbierto(false)} className="block border-b border-slate-100 py-3 font-semibold text-slate-900">
            Precios
          </Link>
          {grupos.map((g) => (
            <div key={g.titulo} className="border-b border-slate-100 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{g.titulo}</p>
              <ul className="mt-1">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} onClick={() => setAbierto(false)} className="block py-2 font-medium text-slate-800">
                      {it.texto}
                    </Link>
                  </li>
                ))}
              </ul>
              {g.extra && g.extra.length > 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  También para:{" "}
                  {g.extra.map((it, i) => (
                    <span key={it.href}>
                      <Link href={it.href} onClick={() => setAbierto(false)} className="underline-offset-2 hover:underline">
                        {it.texto}
                      </Link>
                      {i < g.extra!.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
          <Link href="/registro" onClick={() => setAbierto(false)} className="mt-4 block rounded-xl bg-brand-700 px-4 py-3 text-center font-semibold text-white">
            Empezar gratis
          </Link>
        </div>
      )}
    </>
  );
}
