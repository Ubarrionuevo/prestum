"use client";

import { useCallback, useEffect, useState } from "react";
import { errorAmigable, getSupabase, hoyAR } from "@/lib/supabase";
import { usePanel, NoIncluido } from "./contexto";
import { PAGO_ICON, PAGO_LABEL, fechaCorta, formatPrecio } from "./helpers";

interface Resumen {
  ingresos: number;
  egresos: number;
  por_medio: Record<string, number>;
  por_recurso: Array<{ nombre: string; ingresos: number; comision_pct: number; comision: number }>;
}
interface Movimiento {
  id: number;
  fecha: string;
  tipo: "ingreso" | "egreso";
  concepto: string;
  monto: number;
  medio: number;
  recurso_id: string | null;
}

const restarDias = (iso: string, d: number) => {
  const [y, m, dd] = iso.split("-").map(Number);
  return new Date(y, m - 1, dd - d).toLocaleDateString("en-CA");
};
const PERIODOS: Array<{ id: string; label: string; desde: () => string }> = [
  { id: "hoy", label: "Hoy", desde: () => hoyAR() },
  { id: "semana", label: "7 días", desde: () => restarDias(hoyAR(), 6) },
  { id: "mes", label: "Este mes", desde: () => hoyAR().slice(0, 8) + "01" },
];

/** Caja: ingresos (al marcar "Cobrado"), egresos manuales y comisiones por profesional. */
export function Caja() {
  const { negocio, recursos, rol, tiene } = usePanel();
  const [periodo, setPeriodo] = useState("hoy");
  const [res, setRes] = useState<Resumen | null>(null);
  const [movs, setMovs] = useState<Movimiento[]>([]);

  const desde = PERIODOS.find((p) => p.id === periodo)!.desde();
  const hasta = hoyAR();

  const cargar = useCallback(async () => {
    const sb = getSupabase();
    const [{ data: r }, { data: m }] = await Promise.all([
      sb.rpc("caja_resumen", { p_negocio: negocio.id, p_desde: desde, p_hasta: hasta }),
      sb.from("movimientos").select("id, fecha, tipo, concepto, monto, medio, recurso_id").eq("negocio_id", negocio.id).gte("fecha", desde).lte("fecha", hasta).order("created_at", { ascending: false }).limit(100),
    ]);
    setRes(r as Resumen);
    setMovs((m as Movimiento[]) ?? []);
  }, [negocio.id, desde, hasta]);

  useEffect(() => {
    if (tiene("caja")) cargar();
  }, [cargar, tiene]);

  if (!tiene("caja")) return <NoIncluido funcion="caja" nombre="La caja" />;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-slate-900">Caja</h1>
        <div className="flex rounded-lg bg-white p-0.5 text-sm ring-1 ring-slate-200">
          {PERIODOS.map((p) => (
            <button key={p.id} onClick={() => setPeriodo(p.id)} className={`rounded-md px-3 py-1.5 font-medium ${p.id === periodo ? "bg-brand-700 text-white" : "text-slate-600"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Ingresos" valor={res ? formatPrecio(res.ingresos) : "—"} color="text-emerald-700" />
        <Stat label="Egresos" valor={res ? formatPrecio(res.egresos) : "—"} color="text-rose-600" />
        <Stat label="Saldo" valor={res ? formatPrecio(res.ingresos - res.egresos) : "—"} />
      </div>

      {res && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-700">Ingresos por medio de pago</p>
            <ul className="mt-3 grid gap-1.5 text-sm">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex justify-between text-slate-600">
                  <span>
                    {PAGO_ICON[i]} {PAGO_LABEL[i]}
                  </span>
                  <span className="font-semibold text-slate-900">{formatPrecio(res.por_medio[i] ?? 0)}</span>
                </li>
              ))}
            </ul>
          </div>
          {rol === "dueno" && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-700">Comisiones por {negocio.recurso_etiqueta.toLowerCase()}</p>
              {res.por_recurso.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Todavía no hay cobros en este período.</p>
              ) : (
                <table className="mt-3 w-full text-sm">
                  <thead className="text-left text-xs text-slate-500">
                    <tr>
                      <th className="font-medium">Nombre</th>
                      <th className="text-right font-medium">Facturó</th>
                      <th className="text-right font-medium">Comisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.por_recurso.map((r) => (
                      <tr key={r.nombre} className="border-t border-slate-100">
                        <td className="py-1.5">{r.nombre}</td>
                        <td className="py-1.5 text-right">{formatPrecio(r.ingresos)}</td>
                        <td className="py-1.5 text-right font-semibold">
                          {formatPrecio(r.comision)} <span className="text-xs font-normal text-slate-400">({r.comision_pct}%)</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <p className="mt-2 text-xs text-slate-400">El % de cada uno se configura en Mi página → Equipo y recursos.</p>
            </div>
          )}
        </div>
      )}

      <NuevoMovimiento negocioId={negocio.id} recursos={recursos} onListo={cargar} />

      <section className="rounded-2xl bg-white ring-1 ring-slate-200">
        <h2 className="border-b border-slate-100 px-5 py-3 font-bold text-slate-900">Movimientos</h2>
        {movs.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Sin movimientos. Se cargan solos al marcar un turno como “Cobrado”.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {movs.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                <span className="w-16 text-xs text-slate-500">{fechaCorta(m.fecha)}</span>
                <span className="min-w-0 flex-1 truncate">
                  {m.concepto}
                  {m.recurso_id && recursos.length > 1 && <span className="text-slate-400"> · {recursos.find((r) => r.id === m.recurso_id)?.nombre}</span>}
                </span>
                <span className="text-xs text-slate-400">{PAGO_ICON[m.medio]}</span>
                <span className={`w-24 text-right font-semibold ${m.tipo === "ingreso" ? "text-emerald-700" : "text-rose-600"}`}>
                  {m.tipo === "ingreso" ? "+" : "−"}
                  {formatPrecio(m.monto)}
                </span>
                {rol === "dueno" && (
                  <button
                    onClick={async () => {
                      if (!confirm("¿Borrar este movimiento?")) return;
                      await getSupabase().rpc("eliminar_movimiento", { p_id: m.id });
                      cargar();
                    }}
                    className="text-slate-300 hover:text-rose-600"
                    aria-label="Borrar"
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function NuevoMovimiento({ negocioId, recursos, onListo }: { negocioId: string; recursos: Array<{ id: string; nombre: string }>; onListo: () => void }) {
  const [tipo, setTipo] = useState<"egreso" | "ingreso">("egreso");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [medio, setMedio] = useState(0);
  const [recurso, setRecurso] = useState("");
  const [error, setError] = useState<string | null>(null);
  const input = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <form
      className="flex flex-wrap items-end gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const { error } = await getSupabase().rpc("registrar_movimiento", {
          p_negocio: negocioId,
          p_tipo: tipo,
          p_concepto: concepto,
          p_monto: Math.round(Number(monto)),
          p_medio: medio,
          p_recurso: recurso || null,
        });
        if (error) return setError(errorAmigable(error.message));
        setConcepto("");
        setMonto("");
        onListo();
      }}
    >
      <select className={input} value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
        <option value="egreso">Egreso</option>
        <option value="ingreso">Ingreso</option>
      </select>
      <input className={`${input} min-w-[10rem] flex-1`} value={concepto} onChange={(e) => setConcepto(e.target.value.slice(0, 80))} placeholder="Concepto (ej: productos, alquiler)" required />
      <input className={`${input} w-28`} type="number" inputMode="numeric" min={1} value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="$ Monto" required />
      <select className={input} value={medio} onChange={(e) => setMedio(Number(e.target.value))}>
        {PAGO_LABEL.map((l, i) => (
          <option key={l} value={i}>
            {l}
          </option>
        ))}
      </select>
      {recursos.length > 1 && (
        <select className={input} value={recurso} onChange={(e) => setRecurso(e.target.value)}>
          <option value="">Sin asignar</option>
          {recursos.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      )}
      <button className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Agregar</button>
      {error && <p className="w-full text-xs text-rose-600">{error}</p>}
    </form>
  );
}

function Stat({ label, valor, color = "text-slate-900" }: { label: string; valor: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-extrabold sm:text-2xl ${color}`}>{valor}</p>
    </div>
  );
}
