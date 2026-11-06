"use client";

import { useCallback, useEffect, useState } from "react";
import { errorAmigable, getSupabase, hoyAR, type MiembroDB, type NegocioDB, type OrganizacionDB, type RecursoDB, type Rol } from "@/lib/supabase";
import { usePreciosPanel } from "./usePreciosPanel";

const ROLES: Array<{ id: Exclude<Rol, "dueno">; label: string; ayuda: string }> = [
  { id: "recepcion", label: "Recepción", ayuda: "Ve y cancela los turnos de la sucursal." },
  { id: "profesional", label: "Profesional", ayuda: "Ve solo sus propios turnos." },
];
const ROL_LABEL: Record<Rol, string> = { dueno: "Dueño", recepcion: "Recepción", profesional: "Profesional" };
const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-700";

/**
 * Equipo (solo dueño): sucursales de la organización y miembros con rol.
 * Las invitaciones NO mandan emails: se genera un link para compartir como quieras.
 */
export function Equipo({ org, negocios, onSucursales }: { org: OrganizacionDB; negocios: NegocioDB[]; onSucursales: () => void }) {
  const { planes } = usePreciosPanel();
  const [miembros, setMiembros] = useState<MiembroDB[]>([]);
  const [recursos, setRecursos] = useState<RecursoDB[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Qué permite el plan (en la prueba: todo).
  const pago = org.pago_hasta && org.pago_hasta >= hoyAR();
  const plan = planes.find((p) => p.id === org.plan);
  const permiteRoles = !pago || Boolean(plan?.roles);
  const maxSucursales = pago ? plan?.sucursales_max ?? null : null;

  const cargar = useCallback(async () => {
    const sb = getSupabase();
    const [{ data: ms }, { data: rs }] = await Promise.all([
      sb.from("miembros").select("*").eq("organizacion_id", org.id).order("created_at"),
      sb.from("recursos").select("*").in("negocio_id", negocios.map((n) => n.id)).order("orden"),
    ]);
    setMiembros((ms as MiembroDB[]) ?? []);
    setRecursos((rs as RecursoDB[]) ?? []);
  }, [org.id, negocios]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="grid gap-5">
      <h1 className="text-xl font-bold text-slate-900">Equipo</h1>
      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <Sucursales negocios={negocios} max={maxSucursales} onCambio={onSucursales} onError={setError} />

      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-900">Personas con acceso</h2>
        <p className="mt-0.5 text-sm text-slate-500">Recepción y profesionales entran con su propio usuario y ven solo lo que les corresponde.</p>

        <ul className="mt-4 divide-y divide-slate-100">
          {miembros.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">{m.email.charAt(0).toUpperCase()}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-slate-900">{m.email}</span>
                <span className="text-xs text-slate-500">
                  {ROL_LABEL[m.rol]}
                  {" · "}
                  {m.negocio_id ? negocios.find((n) => n.id === m.negocio_id)?.nombre ?? "Sucursal" : "Todas las sucursales"}
                  {m.recurso_id && ` · ${recursos.find((r) => r.id === m.recurso_id)?.nombre ?? ""}`}
                </span>
              </span>
              {m.estado === "invitado" ? (
                <>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Invitado</span>
                  <LinkInvitacion email={m.email} compacto />
                </>
              ) : (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Activo</span>
              )}
              {m.rol !== "dueno" && (
                <button
                  onClick={async () => {
                    if (!confirm(`¿Quitar el acceso de ${m.email}?`)) return;
                    await getSupabase().rpc("quitar_miembro", { p_id: m.id });
                    cargar();
                  }}
                  className="px-2 text-slate-400 hover:text-rose-600"
                  aria-label="Quitar"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>

        {permiteRoles ? (
          <Invitar negocios={negocios} recursos={recursos} onInvitado={cargar} />
        ) : (
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Tu plan no incluye equipo con roles. Con el plan <strong>Empresa</strong> sumás recepción y profesionales con su propio acceso.
          </p>
        )}
      </section>
    </div>
  );
}

function Sucursales({ negocios, max, onCambio, onError }: { negocios: NegocioDB[]; max: number | null; onCambio: () => void; onError: (e: string | null) => void }) {
  const [nombre, setNombre] = useState("");
  const [creando, setCreando] = useState(false);
  const alLimite = max !== null && negocios.length >= max;

  async function crear() {
    if (nombre.trim().length < 2) return;
    setCreando(true);
    onError(null);
    const { error } = await getSupabase().rpc("crear_sucursal", { p_nombre: nombre.trim() });
    setCreando(false);
    if (error) return onError(errorAmigable(error.message));
    setNombre("");
    onCambio();
  }

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="font-bold text-slate-900">Sucursales</h2>
      <p className="mt-0.5 text-sm text-slate-500">Cada sucursal tiene su propio link, servicios, horarios, equipo y turnos. Las manejás desde el mismo panel.</p>
      <ul className="mt-4 grid gap-2">
        {negocios.map((n) => (
          <li key={n.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
            <span className="flex-1 font-medium text-slate-900">{n.nombre}</span>
            <a href={`/${n.slug}`} target="_blank" className="font-mono text-xs text-brand-700 hover:underline">
              prestum.com.ar/{n.slug}
            </a>
            {negocios.length > 1 && (
              <button
                onClick={async () => {
                  if (!confirm(`¿Borrar la sucursal "${n.nombre}" y todos sus turnos? No se puede deshacer.`)) return;
                  const { error } = await getSupabase().rpc("eliminar_sucursal", { p_negocio: n.id });
                  if (error) return onError(errorAmigable(error.message));
                  onCambio();
                }}
                className="px-1 text-slate-400 hover:text-rose-600"
                aria-label="Borrar sucursal"
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
      {alLimite ? (
        <p className="mt-3 text-sm text-slate-600">
          Tu plan incluye {max} sucursal{max === 1 ? "" : "es"}. Con el plan <strong>Empresa</strong> sumás todas las que necesites.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <input className={`${input} max-w-xs`} value={nombre} onChange={(e) => setNombre(e.target.value.slice(0, 60))} placeholder="Nombre (ej: Fade House Centro)" />
          <button onClick={crear} disabled={creando || nombre.trim().length < 2} className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {creando ? "Creando…" : "+ Agregar sucursal"}
          </button>
        </div>
      )}
    </section>
  );
}

function Invitar({ negocios, recursos, onInvitado }: { negocios: NegocioDB[]; recursos: RecursoDB[]; onInvitado: () => void }) {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<Exclude<Rol, "dueno">>("recepcion");
  const [negocioId, setNegocioId] = useState<string>(negocios.length === 1 ? negocios[0].id : "");
  const [recursoId, setRecursoId] = useState<string>("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitado, setInvitado] = useState<MiembroDB | null>(null);

  const recursosDisponibles = recursos.filter((r) => !negocioId || r.negocio_id === negocioId);

  async function invitar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const { data, error } = await getSupabase().rpc("invitar_miembro", {
      p_email: email,
      p_rol: rol,
      p_negocio: negocioId || null,
      p_recurso: rol === "profesional" && recursoId ? recursoId : null,
    });
    setEnviando(false);
    if (error) return setError(errorAmigable(error.message));
    setInvitado(data as MiembroDB);
    setEmail("");
    onInvitado();
  }

  return (
    <form onSubmit={invitar} className="mt-5 rounded-xl border border-dashed border-slate-300 p-4">
      <p className="font-semibold text-slate-900">Invitar a alguien</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-slate-600">
          Email
          <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="persona@email.com" required />
        </label>
        <label className="grid gap-1 text-sm text-slate-600">
          Rol
          <select className={input} value={rol} onChange={(e) => setRol(e.target.value as Exclude<Rol, "dueno">)}>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} — {r.ayuda}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm text-slate-600">
          Sucursal
          <select className={input} value={negocioId} onChange={(e) => setNegocioId(e.target.value)}>
            {negocios.length > 1 && <option value="">Todas las sucursales</option>}
            {negocios.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre}
              </option>
            ))}
          </select>
        </label>
        {rol === "profesional" && (
          <label className="grid gap-1 text-sm text-slate-600">
            Su agenda
            <select className={input} value={recursoId} onChange={(e) => setRecursoId(e.target.value)} required>
              <option value="">Elegí a quién corresponde</option>
              {recursosDisponibles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                  {negocios.length > 1 ? ` (${negocios.find((n) => n.id === r.negocio_id)?.nombre ?? ""})` : ""}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      <button disabled={enviando} className="mt-4 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {enviando ? "Invitando…" : "Invitar"}
      </button>

      {invitado && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          {invitado.estado === "activo" ? (
            <p>✓ {invitado.email} ya tenía cuenta: tiene acceso desde ahora.</p>
          ) : (
            <>
              <p>✓ Listo. Mandale este link a {invitado.email} para que cree su acceso:</p>
              <div className="mt-2">
                <LinkInvitacion email={invitado.email} />
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
}

/** Link de invitación para copiar o compartir (no se envía ningún email desde la app). */
function LinkInvitacion({ email, compacto = false }: { email: string; compacto?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/registro?invitacion=${encodeURIComponent(email)}` : "";
  const copiar = () => {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };
  if (compacto) {
    return (
      <button type="button" onClick={copiar} className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:border-brand-500">
        {copiado ? "¡Copiado!" : "Copiar link"}
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 font-mono text-xs text-slate-700">{url}</span>
      <button type="button" onClick={copiar} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
        {copiado ? "¡Copiado!" : "Copiar"}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`Te invité al panel de turnos. Creá tu acceso acá: ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white"
      >
        Compartir
      </a>
    </div>
  );
}
