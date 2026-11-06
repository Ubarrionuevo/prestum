"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase, hoyAR } from "@/lib/supabase";
import { waLink } from "@/lib/funciones";
import type { TurnoRow } from "./Panel";
import { usePanel } from "./contexto";
import { fechaCorta, minAHora } from "./helpers";

interface Espera {
  id: number;
  fecha: string;
  cliente: string;
  cliente_tel: string;
  servicio_id: string;
  estado: "esperando" | "hay_lugar";
  hora_libre: number | null;
}

/**
 * Avisos de Inicio:
 *  - Lista de espera: cuando se cancela un turno, la base marca a quién le sirve el lugar;
 *    acá aparece con un botón para avisarle por WhatsApp con un toque.
 *  - Recordatorios: turnos de mañana que todavía no se recordaron.
 */
export function Avisos({ proximos, irATurnos }: { proximos: TurnoRow[]; irATurnos: () => void }) {
  const { negocio, rol, tiene } = usePanel();
  const [espera, setEspera] = useState<Espera[]>([]);
  const verEspera = tiene("lista_espera") && rol !== "profesional";

  const cargar = useCallback(async () => {
    if (!verEspera) return;
    const { data } = await getSupabase()
      .from("lista_espera")
      .select("id, fecha, cliente, cliente_tel, servicio_id, estado, hora_libre")
      .eq("negocio_id", negocio.id)
      .in("estado", ["esperando", "hay_lugar"])
      .gte("fecha", hoyAR())
      .order("fecha")
      .limit(30);
    setEspera((data as Espera[]) ?? []);
  }, [negocio.id, verEspera]);

  useEffect(() => {
    cargar();
  }, [cargar, proximos.length]);

  const manana = new Date(Date.now() + 86400000).toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  const sinRecordar = tiene("recordatorios") ? proximos.filter((t) => t.fecha === manana && t.cliente_tel && !t.recordado).length : 0;
  const conLugar = espera.filter((e) => e.estado === "hay_lugar");
  const esperando = espera.length - conLugar.length;

  if (!conLugar.length && !sinRecordar && !esperando) return null;

  const marcar = async (id: number, estado: "avisado" | "descartado") => {
    await getSupabase().from("lista_espera").update({ estado }).eq("id", id);
    cargar();
  };
  const servicioNombre = (id: string) => negocio.servicios.find((s) => s.id === id)?.nombre ?? "tu turno";

  return (
    <div className="grid gap-3">
      {conLugar.map((e) => (
        <section key={e.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
          <span className="text-2xl" aria-hidden>
            🔔
          </span>
          <p className="min-w-0 flex-1 text-sm text-emerald-900">
            <strong>Se liberó un lugar</strong> {fechaCorta(e.fecha).toLowerCase()}
            {e.hora_libre != null && ` a las ${minAHora(e.hora_libre)}`}. <strong>{e.cliente}</strong> estaba en lista de espera.
          </p>
          <a
            href={waLink(
              e.cliente_tel,
              `¡Hola ${e.cliente.split(" ")[0]}! Se liberó un lugar ${fechaCorta(e.fecha).toLowerCase()}${e.hora_libre != null ? ` a las ${minAHora(e.hora_libre)}` : ""} para ${servicioNombre(e.servicio_id)} en ${negocio.nombre}. Reservalo acá: https://www.prestum.com.ar/${negocio.slug}`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => marcar(e.id, "avisado")}
            className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white"
          >
            Avisar por WhatsApp
          </a>
          <button onClick={() => marcar(e.id, "descartado")} className="text-sm text-emerald-800/70">
            Descartar
          </button>
        </section>
      ))}
      {sinRecordar > 0 && (
        <section className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <span className="text-2xl" aria-hidden>
            ⏰
          </span>
          <p className="flex-1 text-sm text-slate-700">
            Tenés <strong>{sinRecordar}</strong> turno{sinRecordar > 1 ? "s" : ""} de mañana sin recordar.
          </p>
          <button onClick={irATurnos} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
            Recordar →
          </button>
        </section>
      )}
      {esperando > 0 && !conLugar.length && (
        <p className="text-sm text-slate-500">📋 {esperando} persona{esperando > 1 ? "s" : ""} en lista de espera para los próximos días.</p>
      )}
    </div>
  );
}
