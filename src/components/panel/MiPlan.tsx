"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPrecio } from "@/config/negocios";
import { PreciosTabla } from "@/components/landing/PreciosTabla";
import { diasRestantes, getSupabase, hoyAR, type NegocioDB } from "@/lib/supabase";
import { proveedorActivo, type Suscripcion } from "@/lib/pagos";
import { usePreciosPanel } from "./usePreciosPanel";
import { fechaCorta } from "./helpers";

const fechaLarga = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
};

/**
 * Pestaña "Plan": estado actual (prueba / pendiente / activa) y elección de plan.
 * Elegir un plan crea una solicitud PENDIENTE en la base (solicitar_plan). El cobro se coordina
 * con el proveedor activo (hoy: manual por WhatsApp) y la activación la hace el admin.
 */
export function MiPlan({ negocio, compacto = false }: { negocio: NegocioDB; compacto?: boolean }) {
  const { planes, ofrecidos, fundador } = usePreciosPanel(negocio.rubro);
  const [subs, setSubs] = useState<Suscripcion[] | null>(null);
  const [eligiendo, setEligiendo] = useState(compacto);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const { data } = await getSupabase()
      .from("suscripciones")
      .select("*")
      .eq("organizacion_id", negocio.organizacion_id ?? "")
      .in("estado", ["pendiente", "activa"])
      .order("created_at", { ascending: false });
    setSubs((data as Suscripcion[]) ?? []);
  }, [negocio.organizacion_id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const activa = subs?.find((s) => s.estado === "activa");
  const pendiente = subs?.find((s) => s.estado === "pendiente");
  const nombrePlan = (id: string) => planes.find((p) => p.id === id)?.nombre ?? id;
  const enPrueba = !activa && !(negocio.pago_hasta && negocio.pago_hasta >= hoyAR());

  async function solicitar(planId: string, ciclo: "mensual" | "anual") {
    setEnviando(true);
    setError(null);
    const { error } = await getSupabase().rpc("solicitar_plan", { p_plan: planId, p_ciclo: ciclo });
    setEnviando(false);
    if (error) return setError("No pudimos registrar tu elección. Probá de nuevo.");
    setEligiendo(false);
    cargar();
  }

  async function cancelar() {
    if (!confirm("¿Descartar la solicitud?")) return;
    await getSupabase().rpc("cancelar_solicitud");
    cargar();
  }

  if (subs === null) return <p className="py-10 text-center text-sm text-slate-500">Cargando…</p>;

  return (
    <div className="grid gap-5">
      {!compacto && <h1 className="text-xl font-bold text-slate-900">Tu plan</h1>}

      {/* Estado actual */}
      {!compacto && (
        <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          {activa ? (
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-400">PLAN ACTIVO</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {nombrePlan(activa.plan)} <span className="text-base font-medium text-slate-500">· {activa.ciclo}</span>
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {formatPrecio(activa.precio)}/{activa.ciclo === "anual" ? "año" : "mes"}
                  {activa.vence && <> · vence el {fechaLarga(activa.vence)}</>}
                </p>
              </div>
              {activa.fundador && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                  ⭐ Precio fundador{activa.fundador_hasta ? ` hasta ${fechaCorta(activa.fundador_hasta)}` : ""}
                </span>
              )}
            </div>
          ) : enPrueba ? (
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-400">PRUEBA GRATIS</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                Te quedan {diasRestantes(negocio.prueba_hasta)} días
              </p>
              <p className="mt-1 text-sm text-slate-600">Tenés todas las funciones hasta el {fechaLarga(negocio.prueba_hasta)}. Elegí tu plan cuando quieras.</p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Tu plan venció. Elegí uno para seguir recibiendo turnos.</p>
          )}
        </section>
      )}

      {/* Solicitud pendiente */}
      {pendiente && !eligiendo && (
        <section className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
          <p className="text-xs font-bold tracking-widest text-amber-800">SOLICITUD #{pendiente.id} · PENDIENTE DE PAGO</p>
          <p className="mt-1 text-xl font-extrabold text-slate-900">
            {nombrePlan(pendiente.plan)} {pendiente.ciclo} · {formatPrecio(pendiente.precio)}/{pendiente.ciclo === "anual" ? "año" : "mes"}
          </p>
          {pendiente.fundador && (
            <p className="mt-1 text-sm text-amber-900">⭐ Con precio fundador congelado por {fundador.meses} meses (sujeto a cupo al momento del pago).</p>
          )}
          <p className="mt-2 text-sm text-slate-600">Cuando se acredite el pago, tu plan se activa y queda guardado este precio.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={proveedorActivo.iniciarPago(pendiente, { negocio: negocio.nombre, slug: negocio.slug, planNombre: nombrePlan(pendiente.plan) }).url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
            >
              {proveedorActivo.etiqueta}
            </a>
            <button onClick={() => setEligiendo(true)} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
              Cambiar plan
            </button>
            <button onClick={cancelar} className="px-3 py-2.5 text-sm text-slate-500 hover:text-rose-600">
              Descartar
            </button>
          </div>
        </section>
      )}

      {!pendiente && !eligiendo && (
        <button onClick={() => setEligiendo(true)} className="w-fit rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-900">
          {activa ? "Cambiar de plan" : "Elegir plan"}
        </button>
      )}

      {eligiendo && (
        <section className={compacto ? "" : "rounded-2xl bg-slate-50"}>
          {error && <p className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          {enviando && <p className="mb-2 text-center text-sm text-slate-500">Guardando tu elección…</p>}
          <PreciosTabla planes={ofrecidos} fundador={fundador} modo="elegir" onElegir={(p, c) => solicitar(p.id, c)} />
          {!compacto && (
            <button onClick={() => setEligiendo(false)} className="mx-auto mt-4 block text-sm text-slate-500">
              Cancelar
            </button>
          )}
        </section>
      )}
    </div>
  );
}
