"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface Item {
  slug: string;
  termino: string;
  categoria: string;
  definicion: string;
}

const normalizar = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Buscador en vivo + filtro por categoría. Sin JS se ve la lista completa (rastreable). */
export function GlosarioBuscador({ items, categorias }: { items: Item[]; categorias: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const visibles = useMemo(() => {
    const nq = normalizar(q.trim());
    return items.filter((t) => (!cat || t.categoria === cat) && (!nq || normalizar(`${t.termino} ${t.definicion}`).includes(nq)));
  }, [items, q, cat]);

  const chip = (activo: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium ${activo ? "bg-brand-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-brand-500"}`;

  return (
    <div className="mt-8">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar un término (ej: seña, caja, no-show)"
        aria-label="Buscar en el glosario"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-600"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setCat(null)} className={chip(cat === null)}>
          Todos
        </button>
        {categorias.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>
            {c}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">No encontramos ese término.</p>
      ) : (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {visibles.map((t) => (
            <div key={t.slug} className="rounded-2xl border border-slate-200 p-5 hover:border-brand-500">
              <dt className="flex items-start justify-between gap-2">
                <Link href={`/glosario/${t.slug}`} className="text-lg font-semibold text-brand-700 hover:underline">
                  {t.termino}
                </Link>
                <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{t.categoria}</span>
              </dt>
              <dd className="mt-1 text-sm text-slate-600">{t.definicion}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
