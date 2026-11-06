"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Logo } from "@/components/Logo";
import { site } from "@/config/site";
import {
  diasRestantes,
  getSupabase,
  hoyAR,
  negocioActivo,
  supabaseConfigured,
  type MiembroDB,
  type NegocioDB,
  type OrganizacionDB,
  type RecursoDB,
  type Rol,
} from "@/lib/supabase";
import { Inicio } from "./Inicio";
import { Turnos } from "./Turnos";
import { MiPagina } from "./MiPagina";
import { AvisoPrueba, PruebaVencida } from "./Prueba";
import { MiPlan } from "./MiPlan";
import { Equipo } from "./Equipo";
import { Caja } from "./Caja";
import { Reportes } from "./Reportes";
import { PanelProvider } from "./contexto";
import { usePreciosPanel } from "./usePreciosPanel";
import { planMinimo, tieneFuncion, type Funcion } from "@/lib/funciones";

export interface TurnoRow {
  id: number;
  fecha: string;
  hora: number;
  duracion: number;
  servicio: string;
  precio: number;
  pago: number;
  cliente: string;
  nota: string | null;
  recurso_id: string | null;
  cliente_tel: string | null;
  sena_monto: number;
  sena_estado: "no_aplica" | "pendiente" | "pagada";
  gratis: boolean;
  asistio: boolean | null;
  cobrado: boolean;
  recordado: boolean;
}

/** Columnas de turnos que usa el panel. */
export const TURNO_COLS =
  "id, fecha, hora, duracion, servicio, precio, pago, cliente, nota, recurso_id, cliente_tel, sena_monto, sena_estado, gratis, asistio, cobrado, recordado";

type Tab = "inicio" | "turnos" | "caja" | "reportes" | "pagina" | "equipo" | "plan";
const TABS: Array<[Tab, string, string]> = [
  ["inicio", "Inicio", "🏠"],
  ["turnos", "Turnos", "🗓️"],
  ["caja", "Caja", "💵"],
  ["reportes", "Reportes", "📈"],
  ["pagina", "Mi página", "⚙️"],
  ["equipo", "Equipo", "👥"],
  ["plan", "Plan", "💳"],
];

/** Qué pestañas ve cada rol. */
const TABS_POR_ROL: Record<Rol, Tab[]> = {
  dueno: ["inicio", "turnos", "caja", "reportes", "pagina", "equipo", "plan"],
  recepcion: ["inicio", "turnos", "caja"],
  profesional: ["turnos"],
};
const ROL_LABEL: Record<Rol, string> = { dueno: "Dueño", recepcion: "Recepción", profesional: "Profesional" };
const ORDEN_ROL: Record<Rol, number> = { dueno: 1, recepcion: 2, profesional: 3 };

/**
 * Panel. Todo corre en el navegador contra Supabase (las reglas RLS por rol protegen los datos):
 * la página /panel es estática en Vercel y no consume funciones.
 */
export function Panel() {
  const router = useRouter();
  const params = useSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const [miembro, setMiembro] = useState<MiembroDB | null>(null);
  const [org, setOrg] = useState<OrganizacionDB | null>(null);
  const [negocios, setNegocios] = useState<NegocioDB[]>([]);
  const [negocioId, setNegocioId] = useState<string | null>(null);
  const [proximos, setProximos] = useState<TurnoRow[]>([]);
  const [recursos, setRecursos] = useState<RecursoDB[]>([]);
  const [estado, setEstado] = useState<"cargando" | "listo" | "sin-acceso">("cargando");
  const [tab, setTab] = useState<Tab>("inicio");
  const [recuperando, setRecuperando] = useState(params.has("nueva-clave"));

  const negocio = negocios.find((n) => n.id === negocioId) ?? null;
  const rol: Rol = miembro?.rol ?? "profesional";
  const { planes } = usePreciosPanel();

  const cargarProximos = useCallback(async (id: string) => {
    const { data } = await getSupabase()
      .from("turnos")
      .select(TURNO_COLS)
      .eq("negocio_id", id)
      .eq("cancelado", false)
      .gte("fecha", hoyAR())
      .order("fecha")
      .order("hora")
      .limit(50);
    setProximos((data as TurnoRow[]) ?? []);
  }, []);

  const cargarRecursos = useCallback(async (id: string) => {
    const { data } = await getSupabase().from("recursos").select("*").eq("negocio_id", id).order("orden").order("created_at");
    setRecursos((data as RecursoDB[]) ?? []);
  }, []);

  /** Organización + sucursales a las que el usuario tiene acceso. */
  const cargarCuenta = useCallback(async (uid: string) => {
    const sb = getSupabase();
    await sb.rpc("aceptar_invitaciones"); // por si lo invitaron y ya tenía cuenta
    const { data: ms } = await sb.from("miembros").select("*").eq("user_id", uid).eq("estado", "activo");
    const m = ((ms as MiembroDB[]) ?? []).sort((a, b) => ORDEN_ROL[a.rol] - ORDEN_ROL[b.rol])[0];
    if (!m) return setEstado("sin-acceso");
    const [{ data: o }, { data: ns }] = await Promise.all([
      sb.from("organizaciones").select("*").eq("id", m.organizacion_id).maybeSingle(),
      sb.from("negocios").select("*").eq("organizacion_id", m.organizacion_id).order("created_at"),
    ]);
    const visibles = ((ns as NegocioDB[]) ?? []).filter((n) => !m.negocio_id || n.id === m.negocio_id);
    if (!o || !visibles.length) return setEstado("sin-acceso");
    setMiembro(m);
    setOrg(o as OrganizacionDB);
    setNegocios(visibles);
    let guardado: string | null = null;
    try {
      guardado = localStorage.getItem(`prestum-sucursal-${uid}`);
    } catch {}
    setNegocioId((id) => id ?? (visibles.some((n) => n.id === guardado) ? guardado : visibles[0].id));
    setTab((t) => (TABS_POR_ROL[m.rol].includes(t) ? t : TABS_POR_ROL[m.rol][0]));
    setEstado("listo");
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return;
    const sb = getSupabase();
    const { data: sub } = sb.auth.onAuthStateChange((evento, s) => {
      if (evento === "PASSWORD_RECOVERY") setRecuperando(true);
      if (evento === "SIGNED_OUT") router.replace("/ingresar");
      setSession(s);
    });
    sb.auth.getSession().then(({ data }) => {
      if (!data.session) return router.replace("/ingresar");
      setSession(data.session);
      cargarCuenta(data.session.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [router, cargarCuenta]);

  // Al cambiar de sucursal: sus recursos y sus próximos turnos.
  useEffect(() => {
    if (!negocioId) return;
    cargarRecursos(negocioId);
    cargarProximos(negocioId);
    if (session) {
      try {
        localStorage.setItem(`prestum-sucursal-${session.user.id}`, negocioId);
      } catch {}
    }
  }, [negocioId, session, cargarRecursos, cargarProximos]);

  if (!supabaseConfigured) {
    return <Centro>Falta conectar Supabase (variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY).</Centro>;
  }
  if (estado === "cargando") return <Centro>Cargando tu panel…</Centro>;
  if (estado === "sin-acceso" || !negocio || !session || !org || !miembro) {
    return (
      <Centro>
        No encontramos una cuenta asociada a tu usuario.{" "}
        <a className="text-brand-700 underline" href={`https://wa.me/${site.whatsappVentas}`}>
          Escribinos
        </a>{" "}
        y lo resolvemos.
      </Centro>
    );
  }

  const enPrueba = !(org.pago_hasta && org.pago_hasta >= hoyAR());
  const dias = diasRestantes(org.prueba_hasta);
  const activo = negocioActivo(org);
  const esDueno = rol === "dueno";
  const tabs = TABS.filter(([id]) => TABS_POR_ROL[rol].includes(id));

  // Prueba vencida sin plan pago → panel bloqueado (los datos quedan guardados).
  if (!activo) {
    if (esDueno) return <PruebaVencida negocio={negocio} onSalir={() => getSupabase().auth.signOut()} />;
    return <Centro>La cuenta de {org.nombre} está pausada. Avisale al dueño para que active un plan.</Centro>;
  }

  const pagoVigente = Boolean(org.pago_hasta && org.pago_hasta >= hoyAR());
  const ctx = {
    negocio,
    recursos,
    rol,
    tiene: (f: Funcion) => tieneFuncion(planes, org.plan, pagoVigente, f),
    planPara: (f: Funcion) => planMinimo(planes, f),
  };

  return (
    <PanelProvider value={ctx}>
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Logo brandName="Prestum Turnos" href="/panel" />
          <nav className="hidden gap-0.5 md:flex" aria-label="Panel">
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`rounded-lg px-2.5 py-2 text-sm font-medium ${tab === id ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:text-slate-900"}`}>
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/${negocio.slug}`} target="_blank" className="hidden rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:border-brand-500 lg:block">
              Ver página ↗
            </Link>
            <button onClick={() => getSupabase().auth.signOut()} className="px-2 py-2 text-slate-500 hover:text-slate-900">
              Salir
            </button>
          </div>
        </div>
        {/* Sucursal y rol */}
        <div className="border-t border-slate-100 bg-slate-50/60">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
            {negocios.length > 1 ? (
              <label className="flex items-center gap-2 text-slate-600">
                Sucursal
                <select value={negocio.id} onChange={(e) => setNegocioId(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1 font-medium text-slate-900">
                  {negocios.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nombre}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <span className="font-medium text-slate-900">{negocio.nombre}</span>
            )}
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{ROL_LABEL[rol]}</span>
          </div>
        </div>
      </header>

      {enPrueba && esDueno && (
        <div className={`${dias <= 3 ? "bg-rose-50 text-rose-900" : "bg-amber-50 text-amber-900"} border-b border-black/5`}>
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
            <span>
              🎁 Prueba gratis con todas las funciones: te quedan <strong>{dias} {dias === 1 ? "día" : "días"}</strong>.
            </span>
            <button onClick={() => setTab("plan")} className="rounded-lg bg-slate-900 px-3 py-1.5 font-semibold text-white">
              Elegir plan
            </button>
          </div>
        </div>
      )}
      {enPrueba && esDueno && <AvisoPrueba negocio={negocio} diasRestantes={dias} onElegirPlan={() => setTab("plan")} />}

      <main className="mx-auto max-w-5xl px-4 py-6">
        {tab === "inicio" && (
          <Inicio
            negocio={negocio}
            proximos={proximos}
            recursos={recursos}
            bienvenida={params.has("bienvenida") && esDueno}
            verMetricas={esDueno}
            variasSucursales={esDueno && negocios.length > 1}
            onCancelar={() => cargarProximos(negocio.id)}
            irA={(t) => setTab(t)}
          />
        )}
        {tab === "turnos" && (
          <Turnos negocio={negocio} proximos={proximos} recursos={recursos} puedeCancelar={rol !== "profesional"} onCambio={() => cargarProximos(negocio.id)} />
        )}
        {tab === "plan" && esDueno && <MiPlan negocio={negocio} />}
        {tab === "caja" && rol !== "profesional" && <Caja />}
        {tab === "reportes" && esDueno && <Reportes variasSucursales={negocios.length > 1} />}
        {tab === "equipo" && esDueno && (
          <Equipo
            org={org}
            negocios={negocios}
            onSucursales={() => cargarCuenta(session.user.id)}
          />
        )}
        {tab === "pagina" && esDueno && (
          <MiPagina
            key={negocio.id}
            negocio={negocio}
            recursos={recursos}
            session={session}
            onGuardado={(n, r) => {
              setNegocios((ns) => ns.map((x) => (x.id === n.id ? n : x)));
              setRecursos(r);
            }}
          />
        )}
      </main>

      {/* Navegación inferior en celular */}
      {tabs.length > 1 && (
        <nav className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto border-t border-slate-200 bg-white md:hidden" aria-label="Panel">
          {tabs.map(([id, label, icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex min-w-[4.25rem] flex-1 flex-col items-center py-2.5 text-xs font-medium ${tab === id ? "text-brand-700" : "text-slate-500"}`}>
              <span className="text-lg" aria-hidden>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>
      )}

      {recuperando && <NuevaClave onListo={() => setRecuperando(false)} />}
    </div>
    </PanelProvider>
  );
}

function Centro({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center text-slate-600">{children}</div>;
}

function NuevaClave({ onListo }: { onListo: () => void }) {
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await getSupabase().auth.updateUser({ password: pass });
          if (error) return setMsg("No se pudo cambiar. Probá con otra contraseña (mín. 6).");
          onListo();
        }}
      >
        <h2 className="text-lg font-bold">Nueva contraseña</h2>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} minLength={6} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" autoFocus />
        {msg && <p className="mt-2 text-sm text-rose-600">{msg}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onListo} className="px-3 py-2 text-sm text-slate-500">
            Cancelar
          </button>
          <button className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Guardar</button>
        </div>
      </form>
    </div>
  );
}
