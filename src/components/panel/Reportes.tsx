"use client";

import { useEffect, useState } from "react";
import { getSupabase, hoyAR } from "@/lib/supabase";
import { usePanel, NoIncluido } from "./contexto";
import { DIAS_SEMANA, PAGO_LABEL, formatPrecio, minAHora } from "./helpers";
import { TURNO_COLS, type TurnoRow } from "./Panel";

interface Reporte {
  turnos: number;
  ingresos: number;
  ticket_promedio: number;
  ausentes: number;
  marcados: number;
  por_hora: Array<{ hora: number; n: number }>;
  por_dia: Array<{ dia: number; n: number }>;
  por_mes: Array<{ mes: string; n: number; ingresos: number }>;
  top_clientes: Array<{ cliente: string; tel: string; n: number; monto: number }>;
}

const restarDias = (d: number) => {
  const [y, m, dd] = hoyAR().split("-").map(Number);
  return new Date(y, m - 1, dd - d).toLocaleDateString("en-CA");
};

/** Reportes avanzados + exportación a Excel (CSV generado en el navegador, sin servidor). */
export function Reportes({ variasSucursales }: { variasSucursales: boolean }) {
  const { negocio, recursos, tiene } = usePanel();
  const [dias, setDias] = useState(30);
  const [todas, setTodas] = useState(false);
  const [r, setR] = useState<Reporte | null>(null);
  const [exportando, setExportando] = useState(false);

  const desde = restarDias(dias);
  const hasta = hoyAR();

  useEffect(() => {
    if (!tiene("reportes")) return;
    setR(null);
    getSupabase()
      .rpc("reporte", { p_negocio: todas ? null : negocio.id, p_desde: desde, p_hasta: hasta })
      .then(({ data }) => setR(data as Reporte));
  }, [negocio.id, desde, hasta, todas, tiene]);

  if (!tiene("reportes")) return <NoIncluido funcion="reportes" nombre="Los reportes avanzados" />;

  async function exportar() {
    setExportando(true);
    const { data } = await getSupabase()
      .from("turnos")
      .select(TURNO_COLS + ", cancelado")
      .eq("negocio_id", negocio.id)
      .gte("fecha", desde)
      .lte("fecha", hasta)
      .order("fecha")
      .order("hora")
      .limit(5000);
    const filas = (data as unknown as Array<TurnoRow & { cancelado: boolean }>) ?? [];
    const cab = ["Fecha", "Hora", "Cliente", "WhatsApp", "Servicio", negocio.recurso_etiqueta, "Precio", "Medio de pago", "Seña", "Estado seña", "Gratis", "Asistió", "Cobrado", "Cancelado", "Nota"];
    const esc = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lineas = filas.map((t) =>
      [
        t.fecha,
        minAHora(t.hora),
        t.cliente,
        t.cliente_tel ?? "",
        t.servicio,
        recursos.find((x) => x.id === t.recurso_id)?.nombre ?? "",
        t.precio,
        PAGO_LABEL[t.pago],
        t.sena_monto || "",
        t.sena_estado === "no_aplica" ? "" : t.sena_estado,
        t.gratis ? "Sí" : "",
        t.asistio === null ? "" : t.asistio ? "Sí" : "No",
        t.cobrado ? "Sí" : "",
        t.cancelado ? "Sí" : "",
        t.nota ?? "",
      ]
        .map(esc)
        .join(";"),
    );
    // BOM + ";" → Excel en español lo abre con acentos y columnas bien separadas.
    const csv = "﻿" + [cab.join(";"), ...lineas].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `turnos-${negocio.slug}-${desde}-a-${hasta}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportando(false);
  }

  const maxHora = Math.max(1, ...(r?.por_hora.map((h) => h.n) ?? [1]));
  const pico = r?.por_hora.reduce((a, b) => (b.n > a.n ? b : a), { hora: 0, n: 0 });
  const ausentismo = r && r.marcados > 0 ? Math.round((r.ausentes / r.marcados) * 100) : null;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          Reportes
          {variasSucursales && (
            <select value={todas ? "todas" : "esta"} onChange={(e) => setTodas(e.target.value === "todas")} className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-sm font-medium">
              <option value="esta">Esta sucursal</option>
              <option value="todas">Todas las sucursales</option>
            </select>
          )}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-white p-0.5 text-sm ring-1 ring-slate-200">
            {[30, 90, 365].map((d) => (
              <button key={d} onClick={() => setDias(d)} className={`rounded-md px-3 py-1.5 font-medium ${d === dias ? "bg-brand-700 text-white" : "text-slate-600"}`}>
                {d === 365 ? "1 año" : `${d} días`}
              </button>
            ))}
          </div>
          <button onClick={exportar} disabled={exportando} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {exportando ? "Generando…" : "⬇ Exportar a Excel"}
          </button>
        </div>
      </div>

      {!r ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Turnos" valor={String(r.turnos)} />
            <Stat label="Ingresos" valor={formatPrecio(r.ingresos)} />
            <Stat label="Ticket promedio" valor={formatPrecio(r.ticket_promedio)} />
            <Stat label="Ausentismo" valor={ausentismo === null ? "—" : `${ausentismo}%`} sub={`${r.ausentes} de ${r.marcados} marcados`} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-700">
                Horarios pico {pico && pico.n > 0 && <span className="font-normal text-slate-500">· más pedido: {pico.hora}:00 hs</span>}
              </p>
              <div className="mt-3 flex h-28 items-end gap-1">
                {Array.from({ length: 15 }, (_, i) => i + 8).map((h) => {
                  const n = r.por_hora.find((x) => x.hora === h)?.n ?? 0;
                  return (
                    <div key={h} className="flex flex-1 flex-col items-center gap-1" title={`${h}:00 · ${n} turnos`}>
                      <div className="w-full rounded-t bg-brand-500" style={{ height: `${(n / maxHora) * 90}px` }} />
                      <span className="text-[9px] text-slate-400">{h}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-700">Por día de la semana</p>
              <ul className="mt-3 grid gap-1.5 text-sm">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                  const n = r.por_dia.find((x) => x.dia === d)?.n ?? 0;
                  const max = Math.max(1, ...r.por_dia.map((x) => x.n));
                  return (
                    <li key={d} className="flex items-center gap-2">
                      <span className="w-9 text-slate-500">{DIAS_SEMANA[d]}</span>
                      <div className="h-2 flex-1 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-brand-600" style={{ width: `${(n / max) * 100}%` }} />
                      </div>
                      <span className="w-8 text-right font-semibold text-slate-900">{n}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-700">Mejores clientes</p>
              {r.top_clientes.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Sin datos todavía.</p>
              ) : (
                <ol className="mt-3 grid gap-1.5 text-sm">
                  {r.top_clientes.map((c, i) => (
                    <li key={c.tel} className="flex justify-between gap-2">
                      <span className="truncate">
                        <span className="text-slate-400">{i + 1}.</span> {c.cliente}
                      </span>
                      <span className="whitespace-nowrap text-slate-600">
                        <strong className="text-slate-900">{c.n}</strong> turnos · {formatPrecio(c.monto)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-700">Por mes</p>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {r.por_mes.map((m) => (
                    <tr key={m.mes} className="border-t border-slate-100 first:border-0">
                      <td className="py-1.5 text-slate-600">{m.mes}</td>
                      <td className="py-1.5 text-right">{m.n} turnos</td>
                      <td className="py-1.5 text-right font-semibold">{formatPrecio(m.ingresos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-slate-400">El ausentismo se calcula sobre los turnos marcados como “Cobrado” o “No vino”.</p>
        </>
      )}
    </div>
  );
}

function Stat({ label, valor, sub }: { label: string; valor: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{valor}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
