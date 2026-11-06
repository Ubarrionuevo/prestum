"use client";

import { useState } from "react";
import { getSupabase, hoyAR, errorAmigable } from "@/lib/supabase";
import { textoRecordatorio, waLink } from "@/lib/funciones";
import type { TurnoRow } from "./Panel";
import { usePanel } from "./contexto";
import { PAGO_ICON, PAGO_LABEL, fechaCorta, formatPrecio, minAHora } from "./helpers";

/**
 * Un turno con sus acciones según el rol y el plan:
 * recordar por WhatsApp · seña pagada · cobrado (caja) · no vino · escribir · cancelar.
 */
export function TurnoItem({ t, onCambio }: { t: TurnoRow; onCambio: () => void }) {
  const { negocio, recursos, rol, tiene } = usePanel();
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const equipo = rol !== "profesional";
  const futuro = t.fecha >= hoyAR();
  const recurso = recursos.length > 1 ? recursos.find((r) => r.id === t.recurso_id)?.nombre : undefined;

  async function accion(fn: () => PromiseLike<{ error: { message: string } | null }>) {
    setError(null);
    const { error } = await fn();
    if (error) return setError(errorAmigable(error.message));
    setAbierto(false);
    onCambio();
  }

  const recordar = () => {
    if (!t.cliente_tel) return;
    const texto = textoRecordatorio(negocio.recordatorio_plantilla, {
      nombre: t.cliente.split(" ")[0],
      negocio: negocio.nombre,
      fecha: fechaCorta(t.fecha).toLowerCase(),
      hora: minAHora(t.hora),
      servicio: t.servicio,
    });
    window.open(waLink(t.cliente_tel, texto), "_blank");
    accion(() => getSupabase().from("turnos").update({ recordado: true }).eq("id", t.id));
  };

  const boton = "rounded-lg border px-3 py-1.5 text-sm";

  return (
    <li className="px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="w-16 flex-none text-center">
          <p className="text-xs text-slate-500">{fechaCorta(t.fecha)}</p>
          <p className="font-bold text-slate-900">{minAHora(t.hora)}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5 font-semibold text-slate-900">
            <span className="truncate">{t.cliente}</span>
            {recurso && <Badge color="brand">{recurso}</Badge>}
            {t.gratis && <Badge color="amber">⭐ Gratis</Badge>}
            {t.sena_estado === "pendiente" && <Badge color="rose">Seña pendiente {formatPrecio(t.sena_monto)}</Badge>}
            {t.sena_estado === "pagada" && <Badge color="emerald">Seña ✓</Badge>}
            {t.cobrado && <Badge color="emerald">Cobrado</Badge>}
            {t.asistio === false && <Badge color="slate">No vino</Badge>}
            {t.recordado && futuro && <Badge color="slate">Recordado</Badge>}
          </p>
          <p className="truncate text-sm text-slate-500">
            {t.servicio} · {formatPrecio(t.precio)} · {PAGO_ICON[t.pago]} {PAGO_LABEL[t.pago]}
          </p>
          {t.nota && <p className="truncate text-xs text-slate-400">📝 {t.nota}</p>}
        </div>
        {(equipo || t.cliente_tel) && (
          <button onClick={() => setAbierto((v) => !v)} className="px-2 text-slate-400 hover:text-slate-700" aria-label="Acciones" aria-expanded={abierto}>
            ⋯
          </button>
        )}
      </div>

      {abierto && (
        <div className="mt-2 flex flex-wrap justify-end gap-2">
          {tiene("recordatorios") && t.cliente_tel && futuro && (
            <button onClick={recordar} className={`${boton} border-[#25D366] text-[#128C7E]`}>
              {t.recordado ? "Recordar de nuevo" : "Recordar por WhatsApp"}
            </button>
          )}
          {t.cliente_tel && (
            <a href={waLink(t.cliente_tel, `Hola ${t.cliente.split(" ")[0]}!`)} target="_blank" rel="noopener noreferrer" className={`${boton} border-slate-200 text-slate-700`}>
              Escribir
            </a>
          )}
          {equipo && t.sena_estado === "pendiente" && (
            <button onClick={() => accion(() => getSupabase().rpc("marcar_sena", { p_turno: t.id, p_medio: 1 }))} className={`${boton} border-emerald-300 text-emerald-700`}>
              Seña pagada
            </button>
          )}
          {equipo && !t.cobrado && (
            <button onClick={() => accion(() => getSupabase().rpc("cobrar_turno", { p_turno: t.id, p_medio: t.pago }))} className={`${boton} border-emerald-300 text-emerald-700`}>
              {t.gratis ? "Vino (gratis)" : "Cobrado"}
            </button>
          )}
          {equipo && t.asistio !== false && !t.cobrado && (
            <button onClick={() => accion(() => getSupabase().from("turnos").update({ asistio: false }).eq("id", t.id))} className={`${boton} border-slate-200 text-slate-600`}>
              No vino
            </button>
          )}
          {equipo && futuro && (
            <button
              onClick={() => {
                if (!confirm(`¿Cancelar el turno de ${t.cliente}? El horario vuelve a quedar libre.`)) return;
                accion(() => getSupabase().from("turnos").update({ cancelado: true }).eq("id", t.id));
              }}
              className={`${boton} border-rose-200 text-rose-600 hover:bg-rose-50`}
            >
              Cancelar turno
            </button>
          )}
        </div>
      )}
      {error && <p className="mt-1 text-right text-xs text-rose-600">{error}</p>}
    </li>
  );
}

function Badge({ color, children }: { color: "brand" | "amber" | "rose" | "emerald" | "slate"; children: React.ReactNode }) {
  const c = {
    brand: "bg-brand-50 text-brand-700",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-50 text-rose-700",
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-600",
  }[color];
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${c}`}>{children}</span>;
}
