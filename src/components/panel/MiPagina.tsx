"use client";

import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { errorAmigable, getSupabase, hoyAR, PAGOS, type FidelizacionConfig, type NegocioDB, type PagoKey, type RecursoDB, type SenaConfig } from "@/lib/supabase";
import { PLANTILLA_RECORDATORIO, type Funcion } from "@/lib/funciones";
import { usePanel } from "./contexto";
import { normalizarWhatsApp } from "@/lib/telefono";
import { DIAS_SEMANA, PAGO_ICON, PAGO_LABEL } from "./helpers";
import { usePreciosPanel } from "./usePreciosPanel";

type Servicio = NegocioDB["servicios"][number];
type Horarios = NegocioDB["horarios"];
const DURACIONES = [15, 20, 30, 40, 45, 60, 75, 90, 120, 150, 180, 240];
const ORDEN_DIAS = [1, 2, 3, 4, 5, 6, 0];
const ETIQUETAS = ["Profesional", "Cancha", "Sala", "Consultorio", "Box", "Recurso"];
const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-700";
const uuid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

/** Editor de la página pública: servicios, equipo/recursos, horarios, pagos y datos. Un solo botón Guardar. */
export function MiPagina({
  negocio,
  recursos: recursosIniciales,
  session,
  onGuardado,
}: {
  negocio: NegocioDB;
  recursos: RecursoDB[];
  session: Session;
  onGuardado: (n: NegocioDB, r: RecursoDB[]) => void;
}) {
  const { planes } = usePreciosPanel();
  const [servicios, setServicios] = useState<Servicio[]>(negocio.servicios);
  const [horarios, setHorarios] = useState<Horarios>(negocio.horarios);
  const [pagos, setPagos] = useState<PagoKey[]>(negocio.medios_pago);
  const [nombre, setNombre] = useState(negocio.nombre);
  const [wa, setWa] = useState(negocio.whatsapp);
  const [descripcion, setDescripcion] = useState(negocio.descripcion ?? "");
  const [direccion, setDireccion] = useState(negocio.direccion ?? "");
  const [anticipacion, setAnticipacion] = useState(negocio.dias_anticipacion);
  const [etiqueta, setEtiqueta] = useState(negocio.recurso_etiqueta ?? "Profesional");
  const [recursos, setRecursos] = useState<RecursoDB[]>(recursosIniciales);
  const { tiene, planPara } = usePanel();
  const [sena, setSena] = useState<SenaConfig>({ activa: false, tipo: "porcentaje", valor: 30, alias: "", link: "", minutos: 60, ...(negocio.sena ?? {}) });
  const [fidelizacion, setFidelizacion] = useState<FidelizacionConfig>({ activa: false, cada: 5, ...(negocio.fidelizacion ?? {}) });
  const [plantilla, setPlantilla] = useState(negocio.recordatorio_plantilla ?? "");
  const [estado, setEstado] = useState<"idle" | "guardando" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  // Límite de recursos activos: solo con plan pago (en la prueba, sin límite).
  const pago = negocio.pago_hasta && negocio.pago_hasta >= hoyAR();
  const limite = pago ? planes.find((p) => p.id === negocio.plan)?.recursos_max ?? null : null;
  const activos = recursos.filter((r) => r.activo).length;
  const alLimite = limite !== null && activos >= limite;

  const setServ = (i: number, cambio: Partial<Servicio>) => setServicios((s) => s.map((x, j) => (j === i ? { ...x, ...cambio } : x)));
  const setRec = (id: string, cambio: Partial<RecursoDB>) => setRecursos((rs) => rs.map((r) => (r.id === id ? { ...r, ...cambio } : r)));

  async function guardar() {
    const waNorm = normalizarWhatsApp(wa.startsWith("54") ? `+${wa}` : wa);
    const servLimpios = servicios.filter((s) => s.nombre.trim()).map((s) => ({ ...s, nombre: s.nombre.trim().slice(0, 60), precio: Math.max(0, Math.round(s.precio || 0)) }));
    const recLimpios = recursos.filter((r) => r.nombre.trim()).map((r, i) => ({ ...r, nombre: r.nombre.trim().slice(0, 40), orden: i }));
    if (nombre.trim().length < 2) return mostrarError("Poné el nombre del negocio.");
    if (!waNorm) return mostrarError("Revisá el WhatsApp (código de área + número).");
    if (!servLimpios.length) return mostrarError("Cargá al menos un servicio.");
    if (!pagos.length) return mostrarError("Elegí al menos un medio de pago.");
    if (!recLimpios.some((r) => r.activo)) return mostrarError(`Tiene que haber al menos un ${etiqueta.toLowerCase()} activo.`);
    if (limite !== null && recLimpios.filter((r) => r.activo).length > limite) return mostrarError(`Tu plan permite ${limite} activos. Desactivá alguno.`);
    const limpiarHorarios = (h: Horarios) => Object.fromEntries(Object.entries(h).filter(([, r]) => r.length && r.every(([a, b]) => a < b)));
    const idsServicios = new Set(servLimpios.map((s) => s.id));

    setEstado("guardando");
    const sb = getSupabase();
    const cambios = {
      nombre: nombre.trim(),
      whatsapp: waNorm,
      descripcion: descripcion.trim() || null,
      direccion: direccion.trim() || null,
      servicios: servLimpios,
      horarios: limpiarHorarios(horarios),
      medios_pago: pagos,
      dias_anticipacion: anticipacion,
      recurso_etiqueta: etiqueta,
      sena: { ...sena, valor: Math.max(0, Math.round(sena.valor || 0)), alias: sena.alias.trim().slice(0, 60), link: sena.link.trim().slice(0, 300) },
      fidelizacion: { activa: fidelizacion.activa, cada: Math.min(50, Math.max(1, Math.round(fidelizacion.cada || 5))) },
      recordatorio_plantilla: plantilla.trim() || null,
    };
    if (sena.activa && sena.link && !/^https:\/\//.test(sena.link.trim())) return mostrarError("El link de pago tiene que empezar con https://");
    const { error: e1 } = await sb.from("negocios").update(cambios).eq("id", negocio.id);
    if (e1) return mostrarError("No se pudo guardar. Probá de nuevo.");

    // Recursos: borrar los quitados y guardar el resto (una llamada cada uno, sin tocar Vercel).
    const borrados = recursosIniciales.filter((r) => !recLimpios.some((x) => x.id === r.id)).map((r) => r.id);
    if (borrados.length) {
      const { error } = await sb.from("recursos").delete().in("id", borrados);
      if (error) return mostrarError(errorAmigable(error.message));
    }
    const filas = recLimpios.map((r) => ({
      id: r.id,
      negocio_id: negocio.id,
      nombre: r.nombre,
      servicios: r.servicios.filter((s) => idsServicios.has(s)),
      horarios: r.horarios ? limpiarHorarios(r.horarios) : null,
      activo: r.activo,
      orden: r.orden,
      comision_pct: Math.min(100, Math.max(0, Math.round(r.comision_pct ?? 0))),
    }));
    // Primero se desactivan/actualizan y después se activan, para no chocar con el límite del plan.
    const ordenadas = [...filas].sort((a, b) => Number(a.activo) - Number(b.activo));
    const { error: e2 } = await sb.from("recursos").upsert(ordenadas);
    if (e2) return mostrarError(errorAmigable(e2.message));

    fetch("/api/revalidar", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ negocio_id: negocio.id }),
    }).catch(() => {});
    onGuardado({ ...negocio, ...cambios }, filas.map((f) => ({ ...f, servicios: f.servicios })));
    setEstado("ok");
    setTimeout(() => setEstado("idle"), 2500);
  }

  function mostrarError(m: string) {
    setError(m);
    setEstado("error");
  }

  return (
    <div className="grid gap-5 pb-24">
      <h1 className="text-xl font-bold text-slate-900">Mi página</h1>

      <Card titulo="Servicios" ayuda="Lo que tus clientes pueden reservar. El precio y la duración se muestran al reservar.">
        <ul className="grid gap-2">
          {servicios.map((s, i) => (
            <li key={s.id} className="grid grid-cols-[1fr_110px_auto] items-center gap-2 sm:grid-cols-[1fr_130px_110px_auto]">
              <input className={`${input} col-span-3 sm:col-span-1`} value={s.nombre} onChange={(e) => setServ(i, { nombre: e.target.value })} placeholder="Nombre del servicio" aria-label="Nombre" />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                <input className={`${input} pl-6`} type="number" inputMode="numeric" min={0} step={500} value={s.precio} onChange={(e) => setServ(i, { precio: Number(e.target.value) })} aria-label="Precio" />
              </div>
              <select className={input} value={s.duracion} onChange={(e) => setServ(i, { duracion: Number(e.target.value) })} aria-label="Duración">
                {DURACIONES.map((d) => (
                  <option key={d} value={d}>
                    {d} min
                  </option>
                ))}
              </select>
              <button onClick={() => setServicios((x) => x.filter((_, j) => j !== i))} className="px-2 text-slate-400 hover:text-rose-600" aria-label="Quitar">
                ✕
              </button>
            </li>
          ))}
        </ul>
        {servicios.length < 30 && (
          <button
            onClick={() => setServicios((x) => [...x, { id: `s${Date.now().toString(36)}`, nombre: "", precio: 0, duracion: 30 }])}
            className="mt-3 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-brand-500 hover:text-brand-700"
          >
            + Agregar servicio
          </button>
        )}
      </Card>

      <Card
        titulo="Equipo y recursos"
        ayuda="Profesionales, canchas o salas. Cada uno tiene su propia agenda: dos turnos a la misma hora pueden ser en recursos distintos."
      >
        <label className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          Se llaman
          <select className="rounded-md border border-slate-300 px-2 py-1" value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)}>
            {ETIQUETAS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <span className="text-slate-400">(así se lo pregunta la página de reservas)</span>
        </label>

        <ul className="grid gap-3">
          {recursos.map((r) => (
            <RecursoEditor
              key={r.id}
              r={r}
              servicios={servicios}
              horariosNegocio={horarios}
              puedeActivar={r.activo || !alLimite}
              onChange={(c) => setRec(r.id, c)}
              onQuitar={() => {
                if (recursos.length === 1) return mostrarError("Tiene que quedar al menos uno.");
                if (confirm(`¿Quitar a ${r.nombre || "este recurso"}? Sus turnos futuros quedan sin asignar.`)) setRecursos((rs) => rs.filter((x) => x.id !== r.id));
              }}
            />
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            disabled={alLimite || recursos.length >= 50}
            onClick={() =>
              setRecursos((rs) => [...rs, { id: uuid(), negocio_id: negocio.id, nombre: "", servicios: [], horarios: null, activo: true, orden: rs.length }])
            }
            className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Agregar {etiqueta.toLowerCase()}
          </button>
          {limite !== null && (
            <span className={`text-sm ${alLimite ? "text-amber-700" : "text-slate-500"}`}>
              {activos} de {limite} activos en tu plan{alLimite ? " · pasate a Profesional para tener ilimitados" : ""}
            </span>
          )}
        </div>
      </Card>

      <Card titulo="Días y horarios del negocio" ayuda="Los turnos se arman solos según la duración de cada servicio. Si alguien tiene otro horario, configuralo en su ficha.">
        <HorariosEditor horarios={horarios} onChange={setHorarios} />
        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          Se puede reservar hasta
          <select className="rounded-md border border-slate-300 px-2 py-1" value={anticipacion} onChange={(e) => setAnticipacion(Number(e.target.value))}>
            {[7, 14, 21, 30, 60, 90].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          días antes
        </label>
      </Card>

      <Card titulo="Medios de pago" ayuda="Tu cliente elige cómo va a pagar al reservar.">
        <div className="flex flex-wrap gap-2">
          {PAGOS.map((p, i) => {
            const on = pagos.includes(p);
            return (
              <button
                key={p}
                onClick={() => setPagos((x) => (on ? x.filter((y) => y !== p) : [...x, p]))}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${on ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 text-slate-600"}`}
              >
                {PAGO_ICON[i]} {PAGO_LABEL[i]}
              </button>
            );
          })}
        </div>
      </Card>

      <Card titulo="Seña" ayuda="Pedí una parte por adelantado para que no te falten. El turno queda “seña pendiente” hasta que lo marques como pagado.">
        <Gate f="sena" tiene={tiene} planPara={planPara}>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={sena.activa} onChange={(e) => setSena({ ...sena, activa: e.target.checked })} className="h-4 w-4 accent-brand-700" />
            Pedir seña al reservar
          </label>
          {sena.activa && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm text-slate-600">
                Monto
                <div className="flex gap-2">
                  <select className={input} value={sena.tipo} onChange={(e) => setSena({ ...sena, tipo: e.target.value as SenaConfig["tipo"] })}>
                    <option value="porcentaje">% del precio</option>
                    <option value="fijo">Monto fijo $</option>
                  </select>
                  <input className={input} type="number" min={0} value={sena.valor} onChange={(e) => setSena({ ...sena, valor: Number(e.target.value) })} />
                </div>
              </label>
              <label className="grid gap-1 text-sm text-slate-600">
                Plazo para pagar
                <select className={input} value={sena.minutos} onChange={(e) => setSena({ ...sena, minutos: Number(e.target.value) })}>
                  {[30, 60, 120, 240, 720, 1440].map((m) => (
                    <option key={m} value={m}>
                      {m < 60 ? `${m} minutos` : `${m / 60} ${m === 60 ? "hora" : "horas"}`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm text-slate-600">
                Alias / CBU para transferir
                <input className={input} value={sena.alias} onChange={(e) => setSena({ ...sena, alias: e.target.value })} placeholder="ej: mi.negocio.mp" />
              </label>
              <label className="grid gap-1 text-sm text-slate-600">
                Link de pago (opcional)
                <input className={input} value={sena.link} onChange={(e) => setSena({ ...sena, link: e.target.value })} placeholder="https://link.mercadopago.com.ar/…" />
              </label>
              <p className="text-xs text-slate-500 sm:col-span-2">
                El cliente ve estos datos al reservar y te manda el comprobante por WhatsApp. Si no lo marcás como pagado dentro del plazo, el horario se libera solo.
              </p>
            </div>
          )}
        </Gate>
      </Card>

      <Card titulo="Recordatorios por WhatsApp" ayuda="Desde Turnos, tocás “Recordar” y se abre WhatsApp con este mensaje listo para enviar.">
        <Gate f="recordatorios" tiene={tiene} planPara={planPara}>
          <textarea className={input} rows={3} maxLength={400} value={plantilla} onChange={(e) => setPlantilla(e.target.value)} placeholder={PLANTILLA_RECORDATORIO} />
          <p className="mt-1 text-xs text-slate-500">Podés usar: {"{nombre} {negocio} {fecha} {hora} {servicio}"}</p>
        </Gate>
      </Card>

      <Card titulo="Fidelización" ayuda="Premiá a los que vuelven: se identifican con su WhatsApp al reservar.">
        <Gate f="fidelizacion" tiene={tiene} planPara={planPara}>
          <label className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={fidelizacion.activa} onChange={(e) => setFidelizacion({ ...fidelizacion, activa: e.target.checked })} className="h-4 w-4 accent-brand-700" />
            Cada
            <input
              type="number"
              min={1}
              max={50}
              value={fidelizacion.cada}
              onChange={(e) => setFidelizacion({ ...fidelizacion, cada: Number(e.target.value) })}
              className="w-16 rounded-md border border-slate-300 px-2 py-1"
            />
            visitas, la siguiente es gratis
          </label>
        </Gate>
      </Card>

      <Card titulo="Datos del negocio">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-600">
            Nombre
            <input className={input} value={nombre} onChange={(e) => setNombre(e.target.value.slice(0, 60))} />
          </label>
          <label className="grid gap-1 text-sm text-slate-600">
            WhatsApp (donde te llegan las reservas)
            <input className={input} type="tel" value={wa} onChange={(e) => setWa(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 sm:col-span-2">
            Descripción corta (opcional)
            <input className={input} value={descripcion} maxLength={200} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Cortes clásicos y modernos en el centro" />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 sm:col-span-2">
            Dirección (opcional)
            <input className={input} value={direccion} maxLength={120} onChange={(e) => setDireccion(e.target.value)} placeholder="Ej: San Martín 123, Catamarca" />
          </label>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Tu link: <span className="font-mono">prestum.com.ar/{negocio.slug}</span> (para cambiarlo, escribinos).
        </p>
      </Card>

      <div className="fixed inset-x-0 bottom-14 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:bottom-0">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3">
          {estado === "error" && <span className="text-sm text-rose-600">{error}</span>}
          {estado === "ok" && <span className="text-sm text-emerald-600">✓ Guardado. Tu página ya está actualizada.</span>}
          <button onClick={guardar} disabled={estado === "guardando"} className="rounded-xl bg-brand-700 px-6 py-2.5 font-semibold text-white hover:bg-brand-900 disabled:opacity-60">
            {estado === "guardando" ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Ficha de un recurso: nombre, activo, servicios que hace y horario propio opcional. */
function RecursoEditor({
  r,
  servicios,
  horariosNegocio,
  puedeActivar,
  onChange,
  onQuitar,
}: {
  r: RecursoDB;
  servicios: Servicio[];
  horariosNegocio: Horarios;
  puedeActivar: boolean;
  onChange: (c: Partial<RecursoDB>) => void;
  onQuitar: () => void;
}) {
  const [abierto, setAbierto] = useState(!r.nombre);
  const todos = r.servicios.length === 0;
  const toggleServ = (id: string) => {
    const base = todos ? servicios.map((s) => s.id) : r.servicios;
    const nuevo = base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
    onChange({ servicios: nuevo.length === servicios.length ? [] : nuevo });
  };

  return (
    <li className={`rounded-xl border p-3 ${r.activo ? "border-slate-200" : "border-dashed border-slate-200 bg-slate-50"}`}>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">{(r.nombre || "?").charAt(0).toUpperCase()}</span>
        <input className={`${input} flex-1`} value={r.nombre} onChange={(e) => onChange({ nombre: e.target.value })} placeholder="Nombre (ej: Fede, Cancha 1)" aria-label="Nombre" />
        <label className="flex items-center gap-1.5 text-sm text-slate-600" title={!puedeActivar ? "Llegaste al límite de tu plan" : undefined}>
          <input type="checkbox" checked={r.activo} disabled={!puedeActivar} onChange={(e) => onChange({ activo: e.target.checked })} className="h-4 w-4 accent-brand-700" />
          Activo
        </label>
        <button onClick={() => setAbierto((v) => !v)} className="px-2 text-sm text-brand-700" aria-expanded={abierto}>
          {abierto ? "Cerrar" : "Editar"}
        </button>
        <button onClick={onQuitar} className="px-1 text-slate-400 hover:text-rose-600" aria-label="Quitar">
          ✕
        </button>
      </div>
      {!abierto && (
        <p className="mt-1.5 pl-11 text-xs text-slate-500">
          {todos ? "Todos los servicios" : `${r.servicios.length} servicio(s)`} · {r.horarios ? "Horario propio" : "Horario del negocio"}
        </p>
      )}
      {abierto && (
        <div className="mt-3 grid gap-3 pl-11">
          <div>
            <p className="text-xs font-semibold text-slate-500">SERVICIOS QUE HACE</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {servicios.filter((s) => s.nombre.trim()).map((s) => {
                const on = todos || r.servicios.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleServ(s.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs ${on ? "border-brand-700 bg-brand-50 text-brand-900" : "border-slate-200 text-slate-500"}`}
                  >
                    {on ? "✓ " : ""}
                    {s.nombre}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            Comisión
            <input
              type="number"
              min={0}
              max={100}
              value={r.comision_pct ?? 0}
              onChange={(e) => onChange({ comision_pct: Number(e.target.value) })}
              className="w-16 rounded-md border border-slate-300 px-2 py-1"
            />
            % de lo que factura (para Caja)
          </label>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={!!r.horarios}
                onChange={(e) => onChange({ horarios: e.target.checked ? structuredClone(horariosNegocio) : null })}
                className="h-4 w-4 accent-brand-700"
              />
              Tiene un horario distinto al del negocio
            </label>
            {r.horarios && (
              <div className="mt-2">
                <HorariosEditor horarios={r.horarios} onChange={(h) => onChange({ horarios: h })} />
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

/** Editor de días y franjas horarias (hasta 2 por día). */
function HorariosEditor({ horarios, onChange }: { horarios: Horarios; onChange: (h: Horarios) => void }) {
  const setDia = (d: number, rangos: Array<[string, string]>) => onChange({ ...horarios, [d]: rangos });
  const setRango = (d: number, idx: number, pos: 0 | 1, valor: string) => {
    const rangos = [...(horarios[d] ?? [])].map((r) => [...r] as [string, string]);
    rangos[idx][pos] = valor;
    setDia(d, rangos);
  };
  return (
    <ul className="grid gap-2">
      {ORDEN_DIAS.map((d) => {
        const rangos = horarios[d] ?? [];
        const abierto = rangos.length > 0;
        return (
          <li key={d} className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
            <label className="flex w-20 items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={abierto} onChange={() => setDia(d, abierto ? [] : [["09:00", "18:00"]])} className="h-4 w-4 accent-brand-700" />
              {DIAS_SEMANA[d]}
            </label>
            {!abierto && <span className="text-sm text-slate-400">Cerrado</span>}
            {rangos.map((r, idx) => (
              <span key={idx} className="flex items-center gap-1 text-sm">
                {idx > 0 && <span className="px-1 text-slate-400">y</span>}
                <input type="time" step={900} value={r[0]} onChange={(e) => setRango(d, idx, 0, e.target.value)} className="rounded-md border border-slate-300 px-2 py-1" aria-label="Desde" />
                –
                <input type="time" step={900} value={r[1]} onChange={(e) => setRango(d, idx, 1, e.target.value)} className="rounded-md border border-slate-300 px-2 py-1" aria-label="Hasta" />
              </span>
            ))}
            {abierto && rangos.length < 2 && (
              <button onClick={() => setDia(d, [...rangos, ["16:00", "20:00"]])} className="text-xs text-brand-700">
                + turno tarde
              </button>
            )}
            {rangos.length === 2 && (
              <button onClick={() => setDia(d, rangos.slice(0, 1))} className="text-xs text-slate-400">
                quitar
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Card({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="font-bold text-slate-900">{titulo}</h2>
      {ayuda && <p className="mt-0.5 text-sm text-slate-500">{ayuda}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Muestra el contenido si el plan incluye la función; si no, un aviso. */
function Gate({ f, tiene, planPara, children }: { f: Funcion; tiene: (f: Funcion) => boolean; planPara: (f: Funcion) => string | undefined; children: React.ReactNode }) {
  if (tiene(f)) return <>{children}</>;
  const plan = planPara(f);
  return <p className="text-sm text-slate-500">🔒 Incluido desde el plan {plan ?? "superior"}.</p>;
}
