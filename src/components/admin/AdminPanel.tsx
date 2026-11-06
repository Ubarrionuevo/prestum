"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

interface Registro {
  id: string;
  created_at: string;
  cuenta: string;
  email: string | null;
  whatsapp: string;
  rubro: string | null;
  origen: string | null;
  plan: string;
  prueba_hasta: string;
  pago_hasta: string | null;
  paga: boolean;
  en_prueba: boolean;
  slug: string;
  sucursales: number;
  turnos: number;
  ultimo_turno: string | null;
}
interface Solicitud {
  id: number;
  created_at: string;
  cuenta: string;
  plan: string;
  ciclo: string;
  precio: number;
  fundador: boolean;
  whatsapp: string | null;
}
interface Suscripcion {
  id: number;
  cuenta: string;
  plan: string;
  ciclo: string;
  precio: number;
  mensual: number;
  fundador: boolean;
  inicio: string;
  vence: string;
  whatsapp: string | null;
}
interface KN {
  k: string;
  n: number;
}
interface Resumen {
  hoy: string;
  cuentas: number;
  nuevas_hoy: number;
  nuevas_7: number;
  nuevas_30: number;
  en_prueba: number;
  pagas: number;
  vencidas: number;
  vencen_7: number;
  ingreso_mensual: number;
  cobrado_30: number;
  pendiente_cobro: number;
  fundador_cupo: number;
  turnos_30: number;
  con_turnos_30: number;
  por_dia: Array<{ dia: string; n: number }>;
  por_origen: KN[];
  por_rubro: KN[];
  por_plan: KN[];
  registros: Registro[];
  solicitudes: Solicitud[];
  suscripciones: Suscripcion[];
}

type Filtro = "todos" | "prueba" | "pagas" | "vencidas" | "sin-turnos";

const pesos = (n: number) => `$${n.toLocaleString("es-AR")}`;
const fecha = (s: string | null) =>
  s ? new Date(s.length === 10 ? `${s}T12:00:00-03:00` : s).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—";
const estadoDe = (r: Registro) => (r.paga ? r.plan : r.en_prueba ? "prueba" : "vencida");

export function AdminPanel() {
  const [estado, setEstado] = useState<"cargando" | "sin-sesion" | "sin-permiso" | "ok" | "error">("cargando");
  const [datos, setDatos] = useState<Resumen | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const sb = getSupabase();
    const { data: ses } = await sb.auth.getSession();
    if (!ses.session) return setEstado("sin-sesion");
    const { data, error } = await sb.rpc("admin_resumen");
    if (error) {
      if (error.message.includes("sin_permiso")) return setEstado("sin-permiso");
      setError(error.message);
      return setEstado("error");
    }
    setDatos(data as Resumen);
    setEstado("ok");
  }, []);

  useEffect(() => {
    if (supabaseConfigured) cargar();
  }, [cargar]);

  if (!supabaseConfigured) return <Centro>Falta conectar Supabase.</Centro>;
  if (estado === "cargando") return <Centro>Cargando…</Centro>;
  if (estado === "sin-sesion")
    return (
      <Centro>
        Ingresá con tu cuenta de administrador.{" "}
        <Link className="font-semibold text-brand-700 underline" href="/ingresar?volver=/admin">
          Ingresar
        </Link>
      </Centro>
    );
  if (estado === "sin-permiso")
    return (
      <Centro>
        Tu usuario no tiene acceso a este panel. Para habilitarlo, corré en el SQL Editor de Supabase:
        <code className="mt-3 block rounded-lg bg-slate-900 p-3 text-left text-xs text-white">
          insert into privado.admins (user_id) select id from auth.users where email = &apos;tu@email.com&apos;;
        </code>
      </Centro>
    );
  if (estado === "error" || !datos) return <Centro>No se pudo cargar: {error}</Centro>;

  return <Tablero d={datos} recargar={cargar} />;
}

function Tablero({ d, recargar }: { d: Resumen; recargar: () => Promise<void> }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [q, setQ] = useState("");
  const [accion, setAccion] = useState<string | null>(null);

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    return d.registros.filter((r) => {
      if (filtro === "prueba" && !(r.en_prueba && !r.paga)) return false;
      if (filtro === "pagas" && !r.paga) return false;
      if (filtro === "vencidas" && (r.paga || r.en_prueba)) return false;
      if (filtro === "sin-turnos" && r.turnos > 0) return false;
      if (!t) return true;
      return [r.cuenta, r.email, r.whatsapp, r.rubro, r.slug, r.origen].some((x) => x?.toLowerCase().includes(t));
    });
  }, [d.registros, filtro, q]);

  async function ejecutar(fn: "admin_activar" | "admin_renovar", id: number, texto: string) {
    if (!window.confirm(texto)) return;
    setAccion(`${fn}-${id}`);
    const { error } = await getSupabase().rpc(fn, { p_id: id });
    setAccion(null);
    if (error) return window.alert(`No se pudo: ${error.message}`);
    await recargar();
  }

  function exportar() {
    const cols: Array<keyof Registro> = ["created_at", "cuenta", "email", "whatsapp", "rubro", "origen", "plan", "prueba_hasta", "pago_hasta", "slug", "sucursales", "turnos", "ultimo_turno"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(";"), ...lista.map((r) => cols.map((c) => esc(c === "plan" ? estadoDe(r) : r[c])).join(";"))].join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `prestum-registros-${d.hoy}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const activacion = d.cuentas ? Math.round((d.con_turnos_30 / d.cuentas) * 100) : 0;
  const maxDia = Math.max(1, ...d.por_dia.map((x) => x.n));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo brandName="Prestum" href="/admin" />
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">Admin</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => recargar()} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700">
              Actualizar
            </button>
            <button
              onClick={() => getSupabase().auth.signOut().then(() => window.location.assign("/"))}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-500"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6">
        <Seccion titulo="Registros">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi t="Cuentas totales" v={d.cuentas} />
            <Kpi t="Nuevas hoy" v={d.nuevas_hoy} />
            <Kpi t="Últimos 7 días" v={d.nuevas_7} />
            <Kpi t="Últimos 30 días" v={d.nuevas_30} />
          </div>
        </Seccion>

        <Seccion titulo="Estado de las cuentas">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi t="En prueba" v={d.en_prueba} sub={`${d.vencen_7} vencen en 7 días`} />
            <Kpi t="Pagan" v={d.pagas} />
            <Kpi t="Vencidas sin pagar" v={d.vencidas} />
            <Kpi t="Usan el sistema" v={`${activacion}%`} sub={`${d.con_turnos_30} con turnos en 30 días`} />
          </div>
        </Seccion>

        <Seccion titulo="Plata">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi t="Ingreso mensual" v={pesos(d.ingreso_mensual)} sub="Suscripciones activas (anual ÷ 12)" destacado />
            <Kpi t="Activado en 30 días" v={pesos(d.cobrado_30)} sub="Planes activados este mes" />
            <Kpi t="Pendiente de cobro" v={pesos(d.pendiente_cobro)} sub={`${d.solicitudes.length} solicitudes`} />
            <Kpi t="Cupo fundador libre" v={d.fundador_cupo} />
          </div>
          <p className="mt-2 text-xs text-slate-500">Turnos reservados en todas las agendas (30 días): {d.turnos_30.toLocaleString("es-AR")}</p>
        </Seccion>

        <Seccion titulo="Registros por día (30 días)">
          <div className="flex h-32 items-end gap-[3px] rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            {d.por_dia.map((x) => (
              <div key={x.dia} className="group relative flex-1" title={`${fecha(x.dia)}: ${x.n}`}>
                <div className="rounded-t bg-brand-600" style={{ height: `${Math.max(x.n ? 6 : 2, (x.n / maxDia) * 96)}px`, opacity: x.n ? 1 : 0.2 }} />
              </div>
            ))}
          </div>
        </Seccion>

        <div className="grid gap-4 md:grid-cols-3">
          <Barras titulo="De dónde vienen" items={d.por_origen} />
          <Barras titulo="Rubros" items={d.por_rubro} />
          <Barras titulo="Planes" items={d.por_plan} />
        </div>

        <Seccion titulo={`Solicitudes de plan pendientes (${d.solicitudes.length})`}>
          {d.solicitudes.length === 0 ? (
            <Vacio>No hay solicitudes pendientes.</Vacio>
          ) : (
            <div className="grid gap-2">
              {d.solicitudes.map((s) => (
                <Fila key={s.id}>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{s.cuenta}</p>
                    <p className="text-sm text-slate-500">
                      {s.plan} · {s.ciclo} · <strong>{pesos(s.precio)}</strong>
                      {s.fundador && " · fundador"} · pedido el {fecha(s.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-none gap-2">
                    {s.whatsapp && <Wa tel={s.whatsapp} />}
                    <button
                      disabled={accion === `admin_activar-${s.id}`}
                      onClick={() => ejecutar("admin_activar", s.id, `¿Ya cobraste ${pesos(s.precio)} a ${s.cuenta}? Se activa el plan ${s.plan} (${s.ciclo}).`)}
                      className="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Ya cobré · Activar
                    </button>
                  </div>
                </Fila>
              ))}
            </div>
          )}
        </Seccion>

        <Seccion titulo={`Suscripciones activas (${d.suscripciones.length})`}>
          {d.suscripciones.length === 0 ? (
            <Vacio>Todavía no hay suscripciones activas.</Vacio>
          ) : (
            <div className="grid gap-2">
              {d.suscripciones.map((s) => (
                <Fila key={s.id}>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{s.cuenta}</p>
                    <p className="text-sm text-slate-500">
                      {s.plan} · {s.ciclo} · {pesos(s.precio)}
                      {s.fundador && " · fundador"} · vence el <strong>{fecha(s.vence)}</strong>
                    </p>
                  </div>
                  <div className="flex flex-none gap-2">
                    {s.whatsapp && <Wa tel={s.whatsapp} />}
                    <button
                      disabled={accion === `admin_renovar-${s.id}`}
                      onClick={() => ejecutar("admin_renovar", s.id, `¿Cobraste la renovación de ${s.cuenta}? Se suma un período ${s.ciclo}.`)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
                    >
                      Renovar
                    </button>
                  </div>
                </Fila>
              ))}
            </div>
          )}
        </Seccion>

        <Seccion titulo={`Cuentas registradas (${lista.length})`}>
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, email, WhatsApp, rubro…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm md:max-w-sm"
            />
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["todos", "Todas"],
                  ["prueba", "En prueba"],
                  ["pagas", "Pagan"],
                  ["vencidas", "Vencidas"],
                  ["sin-turnos", "Sin turnos"],
                ] as Array<[Filtro, string]>
              ).map(([id, txt]) => (
                <button
                  key={id}
                  onClick={() => setFiltro(id)}
                  className={`rounded-full px-3 py-1 text-sm font-medium ${filtro === id ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
                >
                  {txt}
                </button>
              ))}
            </div>
            <button onClick={exportar} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 md:ml-auto">
              Descargar Excel (CSV)
            </button>
          </div>

          {lista.length === 0 ? (
            <Vacio>No hay cuentas con ese filtro.</Vacio>
          ) : (
            <>
              {/* Celular: tarjetas */}
              <div className="grid gap-2 md:hidden">
                {lista.map((r) => (
                  <Fila key={r.id}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-slate-900">{r.cuenta}</p>
                        <Estado r={r} />
                      </div>
                      <p className="truncate text-sm text-slate-600">{r.email ?? "—"}</p>
                      <p className="text-xs text-slate-500">
                        {fecha(r.created_at)} · {r.rubro ?? "sin rubro"} · {r.turnos} turnos · {r.origen ?? "directo"}
                      </p>
                    </div>
                    <Wa tel={r.whatsapp} />
                  </Fila>
                ))}
              </div>

              {/* Escritorio: tabla */}
              <div className="hidden overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200 md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      {["Alta", "Cuenta", "Email", "WhatsApp", "Rubro", "Origen", "Estado", "Prueba / pago hasta", "Turnos", "Último turno"].map((h) => (
                        <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lista.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-3 py-2 text-slate-500">{fecha(r.created_at)}</td>
                        <td className="px-3 py-2">
                          <a href={`/${r.slug}`} target="_blank" rel="noreferrer" className="font-semibold text-slate-900 hover:text-brand-700">
                            {r.cuenta}
                          </a>
                          {r.sucursales > 1 && <span className="ml-1 text-xs text-slate-400">({r.sucursales} suc.)</span>}
                        </td>
                        <td className="px-3 py-2 text-slate-600">{r.email ?? "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <a href={`https://wa.me/${r.whatsapp}`} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                            {r.whatsapp}
                          </a>
                        </td>
                        <td className="px-3 py-2 text-slate-600">{r.rubro ?? "—"}</td>
                        <td className="px-3 py-2 text-slate-600">{r.origen ?? "directo"}</td>
                        <td className="px-3 py-2">
                          <Estado r={r} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-slate-500">{fecha(r.paga ? r.pago_hasta : r.prueba_hasta)}</td>
                        <td className="px-3 py-2 font-semibold text-slate-900">{r.turnos}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-slate-500">{fecha(r.ultimo_turno)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Seccion>
      </main>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{titulo}</h2>
      {children}
    </section>
  );
}

function Kpi({ t, v, sub, destacado }: { t: string; v: number | string; sub?: string; destacado?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ring-1 ${destacado ? "bg-brand-700 text-white ring-brand-700" : "bg-white ring-slate-200"}`}>
      <p className={`text-xs font-medium ${destacado ? "text-brand-100" : "text-slate-500"}`}>{t}</p>
      <p className={`mt-1 text-2xl font-extrabold ${destacado ? "text-white" : "text-slate-900"}`}>{typeof v === "number" ? v.toLocaleString("es-AR") : v}</p>
      {sub && <p className={`mt-0.5 text-xs ${destacado ? "text-brand-100" : "text-slate-400"}`}>{sub}</p>}
    </div>
  );
}

function Barras({ titulo, items }: { titulo: string; items: KN[] }) {
  const max = Math.max(1, ...items.map((x) => x.n));
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <h3 className="mb-3 text-sm font-bold text-slate-900">{titulo}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">Sin datos todavía.</p>
      ) : (
        <ul className="grid gap-2">
          {items.slice(0, 8).map((x) => (
            <li key={x.k} className="text-sm">
              <div className="flex justify-between gap-2">
                <span className="truncate text-slate-700">{x.k}</span>
                <span className="font-semibold text-slate-900">{x.n}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-brand-600" style={{ width: `${(x.n / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Estado({ r }: { r: Registro }) {
  const e = estadoDe(r);
  const cls = r.paga ? "bg-emerald-100 text-emerald-800" : r.en_prueba ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600";
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{e}</span>;
}

function Wa({ tel }: { tel: string }) {
  return (
    <a
      href={`https://wa.me/${tel}`}
      target="_blank"
      rel="noreferrer"
      className="flex-none rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white"
      aria-label={`WhatsApp ${tel}`}
    >
      WhatsApp
    </a>
  );
}

function Fila({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">{children}</div>;
}

function Vacio({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-200">{children}</p>;
}

function Centro({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center text-slate-600">{children}</div>;
}
