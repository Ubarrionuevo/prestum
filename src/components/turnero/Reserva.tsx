"use client";

import { useEffect, useMemo, useState } from "react";
import type { MedioDePago, Servicio } from "@/config/negocios";
import { formatPrecio, mediosDePagoLabels } from "@/config/negocios";
import { diasDisponibles, formatFechaLarga, horariosDelDia, linkWhatsAppReserva } from "@/lib/turnos";
import type { FidelizacionConfig, SenaConfig } from "@/lib/supabase";

type Horarios = Record<string, Array<[string, string]>>;

/** Profesional, cancha, sala… que puede recibir el turno. */
export interface RecursoPub {
  id: string;
  nombre: string;
  /** ids de servicios que hace; vacío = todos. */
  servicios: string[];
  /** null = usa los horarios del negocio. */
  horarios: Horarios | null;
}

/** Datos mínimos para reservar (sirve para negocios de la base y para la demo de config). */
export interface ReservaNegocio {
  /** id en Supabase. Si falta (demo), no se guarda el turno ni se consultan ocupados. */
  id?: string;
  nombre: string;
  whatsapp: string;
  servicios: Servicio[];
  mediosDePago: MedioDePago[];
  horarios: Horarios;
  diasAnticipacion: number;
  recursos?: RecursoPub[];
  /** Cómo se llaman los recursos: "Profesional", "Cancha", "Sala"… */
  recursoEtiqueta?: string;
  /** Funciones activas del plan (recordatorios, sena, lista_espera, fidelizacion…). */
  funciones?: string[];
  sena?: SenaConfig;
  fidelizacion?: FidelizacionConfig;
}

interface Confirmacion {
  url: string;
  sena: number;
  alias?: string | null;
  link?: string | null;
  minutos?: number | null;
  gratis: boolean;
}

const telValido = (t: string) => /^[0-9]{8,15}$/.test(t.replace(/\D/g, ""));

const PAGOS: MedioDePago[] = ["efectivo", "transferencia", "mercadopago"];
const pagoIconos: Record<MedioDePago, string> = { efectivo: "💵", transferencia: "🏦", mercadopago: "📱" };
const toMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const CUALQUIERA = "cualquiera";

interface Ocupado {
  recurso_id: string | null;
  hora: number;
  duracion: number;
}

function Paso({ n, titulo, activo, children }: { n: number; titulo: string; activo: boolean; children: React.ReactNode }) {
  return (
    <section className={`min-w-0 rounded-2xl border bg-white p-5 transition ${activo ? "border-slate-200" : "pointer-events-none border-slate-100 opacity-40"}`}>
      <h2 className="mb-4 flex items-center gap-3 font-semibold text-slate-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-sm text-white">{n}</span>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

const opcion = (sel: boolean) =>
  `rounded-xl border px-4 py-3 text-left transition ${sel ? "border-brand-700 bg-brand-50 ring-2 ring-brand-700/20" : "border-slate-200 hover:border-brand-500"}`;

/** Une los horarios de varios recursos (solo para saber qué días hay atención). */
function unirHorarios(lista: Horarios[]): Horarios {
  const out: Horarios = {};
  for (const h of lista) for (const [d, r] of Object.entries(h)) out[d] = [...(out[d] ?? []), ...r];
  return out;
}

export function Reserva({ negocio }: { negocio: ReservaNegocio }) {
  // Las fechas dependen del reloj del visitante: se calculan recién en el navegador.
  const [ahora, setAhora] = useState<Date | null>(null);
  useEffect(() => setAhora(new Date()), []);

  const etiqueta = negocio.recursoEtiqueta ?? "Profesional";
  const [servicioId, setServicioId] = useState<string | null>(null);
  const [recursoSel, setRecursoSel] = useState<string | null>(null);
  const [diaKey, setDiaKey] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [pago, setPago] = useState<MedioDePago | null>(null);
  const [nombre, setNombre] = useState("");
  const [nota, setNota] = useState("");
  const [ocupados, setOcupados] = useState<Ocupado[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tel, setTel] = useState("");
  const [fidelidad, setFidelidad] = useState<{ activa: boolean; faltan?: number; proximo_gratis?: boolean; cada?: number } | null>(null);
  const [confirmacion, setConfirmacion] = useState<Confirmacion | null>(null);
  const [espera, setEspera] = useState<"cerrada" | "abierta" | "enviando" | "ok">("cerrada");

  const tiene = (f: string) => (negocio.funciones ?? []).includes(f);
  const senaActiva = tiene("sena") && !!negocio.sena?.activa;
  const fidelizacionActiva = tiene("fidelizacion") && !!negocio.fidelizacion?.activa;

  // Fidelización: al escribir el WhatsApp, muestra cuánto le falta para su turno gratis.
  useEffect(() => {
    setFidelidad(null);
    if (!negocio.id || !fidelizacionActiva || !telValido(tel)) return;
    const t = setTimeout(async () => {
      const { getSupabase } = await import("@/lib/supabase");
      const { data } = await getSupabase().rpc("progreso_fidelidad", { p_negocio: negocio.id, p_tel: tel });
      setFidelidad(data as typeof fidelidad);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tel, negocio.id, fidelizacionActiva]);

  const servicio = negocio.servicios.find((s) => s.id === servicioId) ?? null;

  // Recursos que hacen el servicio elegido.
  const compatibles = useMemo(
    () => (servicio ? (negocio.recursos ?? []).filter((r) => r.servicios.length === 0 || r.servicios.includes(servicio.id)) : []),
    [servicio, negocio.recursos],
  );
  const hayRecursos = (negocio.recursos?.length ?? 0) > 0;
  const mostrarPasoRecurso = compatibles.length > 1;

  // Con un solo recurso compatible, se elige solo (el cliente no ve ese paso).
  useEffect(() => {
    if (!servicio) return;
    if (compatibles.length === 1) setRecursoSel(compatibles[0].id);
    else if (compatibles.length > 1) setRecursoSel((r) => (r && (r === CUALQUIERA || compatibles.some((c) => c.id === r)) ? r : null));
  }, [servicio, compatibles]);

  // Recursos que se consideran para días y horarios.
  const enJuego = useMemo(() => {
    if (!hayRecursos) return [];
    if (recursoSel && recursoSel !== CUALQUIERA) return compatibles.filter((r) => r.id === recursoSel);
    return compatibles;
  }, [hayRecursos, recursoSel, compatibles]);

  const horariosDias = useMemo(
    () => (hayRecursos ? unirHorarios(enJuego.map((r) => r.horarios ?? negocio.horarios)) : negocio.horarios),
    [hayRecursos, enJuego, negocio.horarios],
  );
  const dias = useMemo(
    () => (ahora ? diasDisponibles(horariosDias as never, negocio.diasAnticipacion, ahora) : []),
    [ahora, horariosDias, negocio.diasAnticipacion],
  );
  const dia = dias.find((d) => d.toDateString() === diaKey) ?? null;

  // Turnos ya tomados ese día (consulta liviana directa a Supabase, sin pasar por Vercel).
  useEffect(() => {
    if (!negocio.id || !dia) return setOcupados([]);
    let vivo = true;
    import("@/lib/supabase").then(async ({ getSupabase, supabaseConfigured }) => {
      if (!supabaseConfigured) return;
      const { data } = await getSupabase().rpc("ocupados", { p_negocio: negocio.id, p_fecha: isoDate(dia) });
      if (vivo) setOcupados((data as Ocupado[]) ?? []);
    });
    return () => {
      vivo = false;
    };
  }, [negocio.id, dia]);

  /** Horarios libres de un recurso (o del negocio si no hay recursos). */
  const libresDe = (horarios: Horarios, recursoId: string | null, d: Date, dur: number, now: Date) =>
    horariosDelDia(horarios as never, d, dur, now).filter((h) => {
      const ini = toMin(h);
      return !ocupados.some((o) => (recursoId === null || o.recurso_id === recursoId) && ini < o.hora + o.duracion && ini + dur > o.hora);
    });

  const horas = useMemo(() => {
    if (!ahora || !dia || !servicio) return [];
    if (!hayRecursos) return libresDe(negocio.horarios, null, dia, servicio.duracion, ahora);
    if (!recursoSel) return [];
    const set = new Set<string>();
    for (const r of enJuego) for (const h of libresDe(r.horarios ?? negocio.horarios, r.id, dia, servicio.duracion, ahora)) set.add(h);
    return [...set].sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ahora, dia, servicio, hayRecursos, recursoSel, enJuego, ocupados, negocio.horarios]);

  const recursoListo = !hayRecursos || !!recursoSel;
  const listo = servicio && recursoListo && dia && hora && pago && nombre.trim().length >= 2;

  /** En la demo (sin base), "cualquiera" se resuelve acá: primer recurso libre a esa hora. */
  function recursoLocal(h: string): RecursoPub | undefined {
    if (!servicio || !dia || !ahora) return undefined;
    if (recursoSel && recursoSel !== CUALQUIERA) return compatibles.find((r) => r.id === recursoSel);
    return enJuego.find((r) => libresDe(r.horarios ?? negocio.horarios, r.id, dia, servicio.duracion, ahora).includes(h));
  }

  async function confirmar() {
    if (!listo || enviando) return;
    setError(null);
    let asignado = hayRecursos ? recursoLocal(hora)?.nombre : undefined;
    if (negocio.id) {
      setEnviando(true);
      const { getSupabase, errorAmigable } = await import("@/lib/supabase");
      const { data, error } = await getSupabase().rpc("crear_turno", {
        p_negocio: negocio.id,
        p_fecha: isoDate(dia),
        p_hora: toMin(hora),
        p_servicio: servicio.id,
        p_pago: PAGOS.indexOf(pago),
        p_cliente: nombre.trim(),
        p_nota: nota.trim() || null,
        p_recurso: hayRecursos && recursoSel !== CUALQUIERA ? recursoSel : null,
        p_tel: telValido(tel) ? tel.replace(/\D/g, "") : null,
      });
      if (error) {
        setEnviando(false);
        setError(errorAmigable(error.message));
        if (error.message.includes("ocupado")) {
          setHora(null);
          const { data: oc } = await getSupabase().rpc("ocupados", { p_negocio: negocio.id, p_fecha: isoDate(dia) });
          setOcupados((oc as Ocupado[]) ?? []);
        }
        return;
      }
      const r = (data ?? {}) as { recurso?: string; gratis?: boolean; sena?: number; alias?: string; link?: string; minutos?: number };
      asignado = r.recurso ?? asignado;
      const extras: string[] = [];
      if (r.gratis) extras.push("⭐ Turno gratis por fidelidad");
      if (r.sena && r.sena > 0) extras.push(`💰 Seña: ${formatPrecio(r.sena)}${r.alias ? ` (alias ${r.alias})` : ""} — te mando el comprobante`);
      const url = linkWhatsAppReserva({
        negocio,
        servicio,
        dia,
        hora,
        pago,
        nombreCliente: nombre.trim(),
        nota,
        recurso: (negocio.recursos?.length ?? 0) > 1 ? asignado : undefined,
        etiqueta,
        extras,
      });
      // Con seña: pantalla con los datos de pago antes de ir a WhatsApp.
      if (r.sena && r.sena > 0) {
        setEnviando(false);
        setConfirmacion({ url, sena: r.sena, alias: r.alias, link: r.link, minutos: r.minutos, gratis: !!r.gratis });
        return;
      }
      window.location.href = url;
      return;
    }
    window.location.href = linkWhatsAppReserva({
      negocio,
      servicio,
      dia,
      hora,
      pago,
      nombreCliente: nombre.trim(),
      nota,
      recurso: (negocio.recursos?.length ?? 0) > 1 ? asignado : undefined,
      etiqueta,
    });
  }

  if (confirmacion) return <PantallaSena c={confirmacion} />;

  let n = 1;
  const recursoNombre = recursoSel === CUALQUIERA ? "Cualquiera" : compatibles.find((r) => r.id === recursoSel)?.nombre;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4">
      <Paso n={n++} titulo="Elegí el servicio" activo>
        <div className="grid gap-3 sm:grid-cols-2">
          {negocio.servicios.map((s) => (
            <button
              key={s.id}
              type="button"
              className={opcion(s.id === servicioId)}
              onClick={() => {
                setServicioId(s.id);
                setHora(null);
              }}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{s.nombre}</span>
                <span className="font-semibold text-brand-700">{formatPrecio(s.precio)}</span>
              </span>
              <span className="mt-1 block text-sm text-slate-500">
                {s.duracion} min{s.descripcion ? ` · ${s.descripcion}` : ""}
              </span>
            </button>
          ))}
        </div>
      </Paso>

      {mostrarPasoRecurso && (
        <Paso n={n++} titulo={etiqueta === "Profesional" ? "¿Con quién?" : `Elegí ${etiqueta.toLowerCase()}`} activo={!!servicio}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              className={opcion(recursoSel === CUALQUIERA)}
              onClick={() => {
                setRecursoSel(CUALQUIERA);
                setHora(null);
              }}
            >
              <span className="font-medium">Cualquiera</span>
              <span className="block text-xs text-slate-500">El primero libre</span>
            </button>
            {compatibles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={opcion(recursoSel === r.id)}
                onClick={() => {
                  setRecursoSel(r.id);
                  setHora(null);
                }}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {r.nombre.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate">{r.nombre}</span>
                </span>
              </button>
            ))}
          </div>
        </Paso>
      )}

      <Paso n={n++} titulo="Elegí el día" activo={!!servicio && recursoListo}>
        {!ahora ? (
          <p className="text-sm text-slate-500">Cargando fechas…</p>
        ) : (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            {dias.map((d) => {
              const key = d.toDateString();
              const sel = key === diaKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setDiaKey(key);
                    setHora(null);
                  }}
                  className={`flex min-w-[4.5rem] flex-col items-center rounded-xl border px-3 py-2 ${sel ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 hover:border-brand-500"}`}
                >
                  <span className="text-xs uppercase">{d.toLocaleDateString("es-AR", { weekday: "short" })}</span>
                  <span className="text-xl font-bold">{d.getDate()}</span>
                  <span className="text-xs">{d.toLocaleDateString("es-AR", { month: "short" })}</span>
                </button>
              );
            })}
          </div>
        )}
      </Paso>

      <Paso n={n++} titulo="Elegí el horario" activo={!!dia && !!servicio && recursoListo}>
        {dia && servicio && horas.length === 0 ? (
          <p className="text-sm text-slate-500">No quedan horarios para este día. Probá con otra fecha.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {horas.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHora(h)}
                className={`rounded-lg border py-2 text-sm font-medium ${h === hora ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 hover:border-brand-500"}`}
              >
                {h}
              </button>
            ))}
          </div>
        )}
        {tiene("lista_espera") && negocio.id && dia && servicio && (
          <ListaEspera
            negocioId={negocio.id}
            servicioId={servicio.id}
            fecha={isoDate(dia)}
            recursoId={hayRecursos && recursoSel && recursoSel !== CUALQUIERA ? recursoSel : null}
            estado={espera}
            setEstado={setEspera}
            nombreInicial={nombre}
            telInicial={tel}
          />
        )}
      </Paso>

      <Paso n={n++} titulo="¿Cómo vas a pagar?" activo={!!hora}>
        <div className="grid gap-3 sm:grid-cols-3">
          {negocio.mediosDePago.map((m) => (
            <button key={m} type="button" className={opcion(m === pago)} onClick={() => setPago(m)}>
              <span className="mr-2" aria-hidden>
                {pagoIconos[m]}
              </span>
              {mediosDePagoLabels[m]}
            </button>
          ))}
        </div>
      </Paso>

      <Paso n={n++} titulo="Tus datos" activo={!!pago}>
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Nombre y apellido</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value.slice(0, 60))}
              autoComplete="name"
              className="rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20"
              placeholder="Ej: Juana Pérez"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Tu WhatsApp {fidelizacionActiva ? "(para sumar visitas)" : "(opcional)"}</span>
            <input
              value={tel}
              onChange={(e) => setTel(e.target.value.slice(0, 20))}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20"
              placeholder="Código de área + número"
            />
            {fidelidad?.activa && (
              <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                {fidelidad.proximo_gratis
                  ? "⭐ ¡Este turno es gratis por tu fidelidad!"
                  : `⭐ Te ${fidelidad.faltan === 1 ? "falta 1 visita" : `faltan ${fidelidad.faltan} visitas`} para tu turno gratis.`}
              </span>
            )}
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Nota (opcional)</span>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value.slice(0, 200))}
              rows={2}
              className="rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20"
              placeholder="Algo que el negocio deba saber"
            />
          </label>
        </div>
      </Paso>

      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border">
        {servicio && (
          <p className="mb-3 text-sm text-slate-600">
            <strong className="text-slate-900">{servicio.nombre}</strong> · {formatPrecio(servicio.precio)}
            {mostrarPasoRecurso && recursoNombre && <> · {recursoNombre}</>}
            {dia && <> · {formatFechaLarga(dia)}</>}
            {hora && <> · {hora} hs</>}
            {pago && <> · {mediosDePagoLabels[pago]}</>}
          </p>
        )}
        {senaActiva && servicio && negocio.sena && !fidelidad?.proximo_gratis && (
          <p className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            💰 Para confirmar se pide una seña de{" "}
            <strong>
              {formatPrecio(
                Math.min(servicio.precio, negocio.sena.tipo === "fijo" ? negocio.sena.valor : Math.round((servicio.precio * negocio.sena.valor) / 100)),
              )}
            </strong>
            .
          </p>
        )}
        {error && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <button
          type="button"
          disabled={!listo || enviando}
          onClick={confirmar}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-4 text-lg font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
            <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
          </svg>
          {enviando ? "Reservando…" : "Confirmar por WhatsApp"}
        </button>
        {!listo && <p className="mt-2 text-center text-xs text-slate-500">Completá los pasos para confirmar el turno.</p>}
      </div>
    </div>
  );
}

/** Después de reservar con seña: datos de pago y botón para mandar el comprobante. */
function PantallaSena({ c }: { c: Confirmacion }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="rounded-2xl bg-white p-6 text-center ring-1 ring-slate-200">
      <p className="text-4xl">✅</p>
      <h2 className="mt-3 text-2xl font-extrabold text-slate-900">¡Turno reservado!</h2>
      <p className="mt-2 text-slate-600">
        Para confirmarlo, pagá la seña de <strong>{formatPrecio(c.sena)}</strong>
        {c.minutos ? ` dentro de los próximos ${c.minutos} minutos` : ""}.
      </p>
      {c.alias && (
        <div className="mx-auto mt-4 flex max-w-sm items-center gap-2 rounded-xl bg-slate-50 p-2 pl-4">
          <span className="flex-1 truncate text-left font-mono text-sm">Alias: {c.alias}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(c.alias ?? "").catch(() => {});
              setCopiado(true);
            }}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
          >
            {copiado ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      )}
      {c.link && (
        <a href={c.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800">
          Pagar la seña con el link del negocio ↗
        </a>
      )}
      <a href={c.url} className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-4 text-lg font-semibold text-white">
        Enviar comprobante por WhatsApp
      </a>
      <p className="mt-2 text-xs text-slate-500">Si no se paga a tiempo, el horario se libera.</p>
    </div>
  );
}

/** Anotarse en la lista de espera de un día (si se libera un lugar, el negocio avisa). */
function ListaEspera({
  negocioId,
  servicioId,
  fecha,
  recursoId,
  estado,
  setEstado,
  nombreInicial,
  telInicial,
}: {
  negocioId: string;
  servicioId: string;
  fecha: string;
  recursoId: string | null;
  estado: "cerrada" | "abierta" | "enviando" | "ok";
  setEstado: (e: "cerrada" | "abierta" | "enviando" | "ok") => void;
  nombreInicial: string;
  telInicial: string;
}) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [tel, setTel] = useState(telInicial);
  const [franja, setFranja] = useState<"todo" | "manana" | "tarde">("todo");
  const [error, setError] = useState<string | null>(null);

  if (estado === "ok") return <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">✓ Te anotamos. Si se libera un lugar, te escriben por WhatsApp.</p>;
  if (estado === "cerrada")
    return (
      <button type="button" onClick={() => setEstado("abierta")} className="mt-4 text-sm font-medium text-brand-700 hover:underline">
        ¿No hay un horario que te sirva? Anotate en la lista de espera →
      </button>
    );

  return (
    <form
      className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setEstado("enviando");
        const { getSupabase, errorAmigable } = await import("@/lib/supabase");
        const rango = franja === "manana" ? [0, 780] : franja === "tarde" ? [780, 1440] : [null, null];
        const { error } = await getSupabase().rpc("anotar_lista_espera", {
          p_negocio: negocioId,
          p_servicio: servicioId,
          p_fecha: fecha,
          p_cliente: nombre,
          p_tel: tel,
          p_recurso: recursoId,
          p_desde: rango[0],
          p_hasta: rango[1],
        });
        if (error) {
          setEstado("abierta");
          return setError(errorAmigable(error.message));
        }
        setEstado("ok");
      }}
    >
      <p className="text-sm font-semibold text-slate-800">Lista de espera para este día</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value.slice(0, 60))} placeholder="Tu nombre" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <input value={tel} onChange={(e) => setTel(e.target.value.slice(0, 20))} placeholder="Tu WhatsApp" type="tel" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <select value={franja} onChange={(e) => setFranja(e.target.value as typeof franja)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="todo">Cualquier horario</option>
        <option value="manana">A la mañana (antes de las 13)</option>
        <option value="tarde">A la tarde (desde las 13)</option>
      </select>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <button disabled={estado === "enviando"} className="rounded-lg bg-brand-700 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {estado === "enviando" ? "Anotando…" : "Anotarme"}
      </button>
    </form>
  );
}
