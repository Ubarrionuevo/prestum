"use client";

import { useEffect, useState } from "react";
import { getSupabase, hoyAR, type NegocioDB, type RecursoDB } from "@/lib/supabase";
import { TURNO_COLS, type TurnoRow } from "./Panel";
import { TurnoItem } from "./TurnoItem";
import { PAGO_ICON, PAGO_LABEL, fechaCorta, formatPrecio, minAHora } from "./helpers";

/** Turnos: próximos (agrupados por día) y los últimos 30 días. */
export function Turnos({
  negocio,
  proximos,
  recursos,
  puedeCancelar = true,
  onCambio,
}: {
  negocio: NegocioDB;
  proximos: TurnoRow[];
  recursos: RecursoDB[];
  puedeCancelar?: boolean;
  onCambio: () => void;
}) {
  const [filtro, setFiltro] = useState<string>("todos");
  const nombreRecurso = (id: string | null) => (recursos.length > 1 ? recursos.find((r) => r.id === id)?.nombre : undefined);
  const [vista, setVista] = useState<"proximos" | "pasados">("proximos");
  const [pasados, setPasados] = useState<TurnoRow[] | null>(null);

  useEffect(() => {
    if (vista !== "pasados" || pasados) return;
    const hace30 = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    getSupabase()
      .from("turnos")
      .select(TURNO_COLS)
      .eq("negocio_id", negocio.id)
      .eq("cancelado", false)
      .gte("fecha", hace30)
      .lt("fecha", hoyAR())
      .order("fecha", { ascending: false })
      .order("hora", { ascending: false })
      .limit(100)
      .then(({ data }) => setPasados((data as TurnoRow[]) ?? []));
  }, [vista, pasados, negocio.id]);

  const lista = (vista === "proximos" ? proximos : pasados ?? []).filter((t) => filtro === "todos" || t.recurso_id === filtro);
  const grupos = lista.reduce<Record<string, TurnoRow[]>>((acc, t) => ((acc[t.fecha] ??= []).push(t), acc), {});

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Turnos</h1>
        <div className="flex rounded-lg bg-white p-0.5 text-sm ring-1 ring-slate-200">
          {(
            [
              ["proximos", "Próximos"],
              ["pasados", "Últimos 30 días"],
            ] as const
          ).map(([v, l]) => (
            <button key={v} onClick={() => setVista(v)} className={`rounded-md px-3 py-1.5 font-medium ${v === vista ? "bg-brand-700 text-white" : "text-slate-600"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {recursos.length > 1 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 text-sm">
          {[{ id: "todos", nombre: "Todos" }, ...recursos].map((r) => (
            <button
              key={r.id}
              onClick={() => setFiltro(r.id)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 ${filtro === r.id ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}
            >
              {r.nombre}
            </button>
          ))}
        </div>
      )}

      {vista === "pasados" && pasados === null ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando…</p>
      ) : lista.length === 0 ? (
        <p className="rounded-2xl bg-white py-12 text-center text-sm text-slate-500 ring-1 ring-slate-200">No hay turnos acá todavía.</p>
      ) : (
        Object.entries(grupos).map(([fecha, ts]) => (
          <section key={fecha} className="rounded-2xl bg-white ring-1 ring-slate-200">
            <h2 className="border-b border-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700">
              {fechaCorta(fecha)} <span className="font-normal text-slate-400">· {ts.length} turno{ts.length > 1 ? "s" : ""}</span>
            </h2>
            <ul className="divide-y divide-slate-100">
              {vista === "proximos"
                ? ts.map((t) => <TurnoItem key={t.id} t={t} onCambio={onCambio} />)
                : ts.map((t) => (puedeCancelar ? <TurnoItem key={t.id} t={t} onCambio={() => setPasados(null)} /> : (
                    <li key={t.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                      <span className="w-12 font-semibold text-slate-900">{minAHora(t.hora)}</span>
                      <span className="min-w-0 flex-1 truncate">
                        {t.cliente} · <span className="text-slate-500">{t.servicio}{nombreRecurso(t.recurso_id) ? ` · ${nombreRecurso(t.recurso_id)}` : ""}</span>
                      </span>
                      <span className="text-slate-500">
                        {PAGO_ICON[t.pago]} {formatPrecio(t.precio)}
                      </span>
                      <span className="sr-only">{PAGO_LABEL[t.pago]}</span>
                    </li>
                  )))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
