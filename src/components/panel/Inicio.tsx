"use client";

import { useEffect, useState } from "react";
import { getSupabase, type NegocioDB, type RecursoDB } from "@/lib/supabase";
import type { TurnoRow } from "./Panel";
import { PAGO_ICON, PAGO_LABEL, formatPrecio } from "./helpers";
import { TurnoItem } from "./TurnoItem";
import { Avisos } from "./Avisos";

interface Metricas {
  total: number;
  ingresos: number;
  proximos: number;
  hoy: number;
  por_pago: Record<string, number>;
  por_servicio: Array<{ nombre: string; n: number }>;
  por_recurso?: Array<{ nombre: string; n: number; ingresos: number }>;
  por_sucursal?: Array<{ nombre: string; n: number; ingresos: number }>;
}

/** Inicio: link para compartir + métricas compactas + próximos turnos. */
export function Inicio({
  negocio,
  proximos,
  recursos,
  bienvenida,
  verMetricas = true,
  variasSucursales = false,
  onCancelar,
  irA,
}: {
  negocio: NegocioDB;
  proximos: TurnoRow[];
  recursos: RecursoDB[];
  bienvenida: boolean;
  verMetricas?: boolean;
  variasSucursales?: boolean;
  onCancelar: () => void;
  irA: (t: "turnos" | "pagina") => void;
}) {
  const link = `prestum.com.ar/${negocio.slug}`;
  const [copiado, setCopiado] = useState(false);
  const [dias, setDias] = useState(30);
  const [m, setM] = useState<Metricas | null>(null);
  const [todas, setTodas] = useState(false);

  useEffect(() => {
    if (!verMetricas) return;
    getSupabase()
      .rpc("metricas", { p_negocio: todas ? null : negocio.id, p_dias: dias })
      .then(({ data }) => setM(data as Metricas));
  }, [dias, proximos.length, negocio.id, todas, verMetricas]);

  const copiar = () => {
    navigator.clipboard?.writeText(`https://www.${link}`).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };
  const compartir = `https://wa.me/?text=${encodeURIComponent(`¡Ya podés sacar turno online en ${negocio.nombre}! 👉 https://www.${link}`)}`;

  const totalPagos = m ? Object.values(m.por_pago).reduce((a, b) => a + b, 0) : 0;
  const pagoTop = m && totalPagos ? Object.entries(m.por_pago).sort((a, b) => b[1] - a[1])[0] : null;
  const maxServ = m?.por_servicio[0]?.n ?? 1;

  return (
    <div className="grid gap-5">
      {bienvenida && (
        <section className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white">
          <p className="text-sm font-semibold text-brand-100">¡Bienvenido! 🎉</p>
          <h1 className="mt-1 text-2xl font-extrabold">Tu agenda ya está online</h1>
          <p className="mt-1 text-brand-100">Cargamos servicios y horarios de ejemplo. Revisalos y compartí tu link.</p>
          <ol className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <li className="rounded-xl bg-white/10 p-3">
              <button onClick={() => irA("pagina")} className="text-left">
                <strong>1.</strong> Revisá servicios y precios →
              </button>
            </li>
            <li className="rounded-xl bg-white/10 p-3">
              <button onClick={() => irA("pagina")} className="text-left">
                <strong>2.</strong> Ajustá tus horarios →
              </button>
            </li>
            <li className="rounded-xl bg-white/10 p-3">
              <strong>3.</strong> Compartí tu link 👇
            </li>
          </ol>
        </section>
      )}

      <Avisos proximos={proximos} irATurnos={() => irA("turnos")} />

      {/* Link */}
      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <p className="text-xs font-bold tracking-widest text-slate-400">TU LINK DE RESERVAS</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <a href={`/${negocio.slug}`} target="_blank" className="min-w-0 flex-1 truncate font-mono text-lg font-semibold text-brand-700 hover:underline">
            {link}
          </a>
          <button onClick={copiar} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
            {copiado ? "¡Copiado!" : "Copiar"}
          </button>
          <a href={compartir} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white">
            Compartir
          </a>
        </div>
        <p className="mt-2 text-xs text-slate-500">Pegalo en tu bio de Instagram, tu estado de WhatsApp y Google Maps.</p>
      </section>

      {/* Métricas: 4 números + 2 listas cortas. Nada más. Solo el dueño. */}
      {verMetricas && (
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-bold text-slate-900">
            Tus números
            {variasSucursales && (
              <select value={todas ? "todas" : "esta"} onChange={(e) => setTodas(e.target.value === "todas")} className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium">
                <option value="esta">Esta sucursal</option>
                <option value="todas">Todas las sucursales</option>
              </select>
            )}
          </h2>
          <div className="flex rounded-lg bg-white p-0.5 text-xs ring-1 ring-slate-200">
            {[7, 30, 90].map((d) => (
              <button key={d} onClick={() => setDias(d)} className={`rounded-md px-2.5 py-1 font-medium ${d === dias ? "bg-brand-700 text-white" : "text-slate-600"}`}>
                {d} días
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Turnos tomados" valor={m ? String(m.total) : "—"} />
          <Stat label="Ingresos estimados" valor={m ? formatPrecio(m.ingresos) : "—"} />
          <Stat label="Próximos turnos" valor={m ? String(m.proximos) : "—"} sub={m ? `${m.hoy} hoy` : undefined} />
          <Stat label="Pago más usado" valor={pagoTop ? `${PAGO_ICON[+pagoTop[0]]} ${PAGO_LABEL[+pagoTop[0]]}` : "—"} small />
        </div>
        {m && m.total > 0 && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-700">Cómo te pagan</p>
              <ul className="mt-3 grid gap-2">
                {[0, 1, 2].map((i) => {
                  const n = m.por_pago[i] ?? 0;
                  const pct = totalPagos ? Math.round((n / totalPagos) * 100) : 0;
                  return (
                    <li key={i} className="text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>
                          {PAGO_ICON[i]} {PAGO_LABEL[i]}
                        </span>
                        <span className="font-semibold text-slate-900">{pct}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                        <div className="h-1.5 rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            {recursos.length > 1 && (m.por_recurso?.length ?? 0) > 0 ? (
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-700">Por {negocio.recurso_etiqueta.toLowerCase()}</p>
                <ul className="mt-3 grid gap-2">
                  {m.por_recurso!.slice(0, 4).map((r) => (
                    <li key={r.nombre} className="flex justify-between text-sm text-slate-600">
                      <span className="truncate">{r.nombre}</span>
                      <span>
                        <span className="font-semibold text-slate-900">{r.n}</span> · {formatPrecio(r.ingresos)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-700">Servicios más pedidos</p>
              <ul className="mt-3 grid gap-2">
                {m.por_servicio.slice(0, 3).map((s) => (
                  <li key={s.nombre} className="text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span className="truncate">{s.nombre}</span>
                      <span className="font-semibold text-slate-900">{s.n}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                      <div className="h-1.5 rounded-full bg-brand-600" style={{ width: `${Math.round((s.n / maxServ) * 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            )}
          </div>
        )}
        {todas && m && (m.por_sucursal?.length ?? 0) > 1 && (
          <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-700">Por sucursal</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {m.por_sucursal!.map((s) => (
                <li key={s.nombre} className="flex justify-between text-sm text-slate-600">
                  <span className="truncate">{s.nombre}</span>
                  <span>
                    <span className="font-semibold text-slate-900">{s.n}</span> · {formatPrecio(s.ingresos)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      )}

      {/* Próximos */}
      <section className="rounded-2xl bg-white ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h2 className="font-bold text-slate-900">Próximos turnos</h2>
          <button onClick={() => irA("turnos")} className="text-sm font-medium text-brand-700">
            Ver todos →
          </button>
        </div>
        {proximos.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Todavía no hay turnos. Compartí tu link y empiezan a llegar acá. 🙌</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {proximos.slice(0, 5).map((t) => (
              <TurnoItem key={t.id} t={t} onCambio={onCancelar} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, valor, sub, small }: { label: string; valor: string; sub?: string; small?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 font-extrabold text-slate-900 ${small ? "text-base" : "text-2xl"}`}>{valor}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
