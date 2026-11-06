"use client";

import { useEffect, useState } from "react";
import { AVISOS_PRUEBA } from "@/config/planes";
import { formatPrecio } from "@/config/negocios";
import { site } from "@/config/site";
import { Logo } from "@/components/Logo";
import { getSupabase, type NegocioDB } from "@/lib/supabase";
import { usePreciosPanel } from "./usePreciosPanel";
import { MiPlan } from "./MiPlan";

export { usePreciosPanel } from "./usePreciosPanel";

/** Cantidad de turnos gestionados (no cancelados) desde que se creó la cuenta. */
export function useTurnosGestionados(negocioId: string) {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    getSupabase()
      .from("turnos")
      .select("id", { count: "exact", head: true })
      .eq("negocio_id", negocioId)
      .eq("cancelado", false)
      .then(({ count }) => setN(count ?? 0));
  }, [negocioId]);
  return n;
}

function linkContacto(negocio: NegocioDB) {
  const msg = `Hola! Tengo una consulta sobre los planes para ${negocio.nombre} (prestum.com.ar/${negocio.slug}).`;
  return `https://wa.me/${site.whatsappVentas}?text=${encodeURIComponent(msg)}`;
}

/**
 * Pantalla de bloqueo: la prueba terminó y no hay plan pago.
 * Solo deja elegir un plan (queda como solicitud pendiente) o salir. Los datos NO se borran.
 */
export function PruebaVencida({ negocio, onSalir }: { negocio: NegocioDB; onSalir: () => void }) {
  const turnos = useTurnosGestionados(negocio.id);
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo brandName="Prestum Turnos" href="/panel" />
          <button onClick={onSalir} className="text-sm text-slate-500 hover:text-slate-900">
            Salir
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-4xl">⏳</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Tu prueba gratis terminó</h1>
          <p className="mt-3 text-lg text-slate-600">
            {turnos ? (
              <>
                En la prueba gestionaste <strong>{turnos} turnos</strong>.{" "}
              </>
            ) : null}
            Elegí un plan para seguir recibiendo reservas. <strong>Tus datos, servicios y turnos están guardados.</strong>
          </p>
        </div>
        <div className="mt-8">
          <MiPlan negocio={negocio} compacto />
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Dudas?{" "}
          <a href={linkContacto(negocio)} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">
            Escribinos por WhatsApp
          </a>
        </p>
      </main>
    </div>
  );
}

/**
 * Aviso de los días 7, 20 y 27 de la prueba: cuántos días quedan y cuántos turnos gestionó.
 * Aparece una vez por hito al entrar al panel (se recuerda en el navegador).
 */
export function AvisoPrueba({ negocio, diasRestantes, onElegirPlan }: { negocio: NegocioDB; diasRestantes: number; onElegirPlan: () => void }) {
  const { planes, fundador, pruebaDias } = usePreciosPanel();
  const turnos = useTurnosGestionados(negocio.id);
  const [hito, setHito] = useState<number | null>(null);
  const diaActual = pruebaDias - diasRestantes;

  useEffect(() => {
    const alcanzados = AVISOS_PRUEBA.filter((d) => diaActual >= d);
    const ultimo = alcanzados[alcanzados.length - 1];
    if (!ultimo) return;
    try {
      if (!localStorage.getItem(`prestum-aviso-${negocio.id}-${ultimo}`)) setHito(ultimo);
    } catch {
      setHito(ultimo);
    }
  }, [diaActual, negocio.id]);

  if (hito === null || turnos === null) return null;

  const cerrar = () => {
    try {
      localStorage.setItem(`prestum-aviso-${negocio.id}-${hito}`, "1");
    } catch {}
    setHito(null);
  };
  const recomendado = planes.find((p) => p.destacado) ?? planes[0];
  const esFundador = fundador.activo && recomendado?.id === fundador.plan;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <p className="text-sm font-semibold text-brand-700">Tu prueba gratis</p>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
          {diasRestantes <= 3 ? "⚠️ " : ""}Te quedan {diasRestantes} {diasRestantes === 1 ? "día" : "días"}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-brand-50 p-4 text-center">
            <p className="text-3xl font-extrabold text-brand-900">{turnos}</p>
            <p className="text-xs text-slate-600">turnos gestionados</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-3xl font-extrabold text-slate-900">{diaActual}</p>
            <p className="text-xs text-slate-600">de {pruebaDias} días usados</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          {turnos > 0
            ? "Tus clientes ya reservan solos. Elegí un plan para que tu agenda siga andando cuando termine la prueba."
            : "Compartí tu link en Instagram y WhatsApp para que empiecen a llegar los turnos."}
        </p>
        {esFundador && recomendado && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            ⭐ Precio fundador: {recomendado.nombre} a <strong>{formatPrecio(fundador.precio_mensual)}/mes</strong> por {fundador.meses} meses
            {fundador.restantes != null ? ` · quedan ${fundador.restantes} lugares` : ` (primeros ${fundador.cupo} negocios)`}.
          </p>
        )}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            onClick={() => {
              cerrar();
              onElegirPlan();
            }}
            className="flex-1 rounded-xl bg-brand-700 py-3 text-center font-semibold text-white hover:bg-brand-900"
          >
            Elegir plan
          </button>
          <button onClick={cerrar} className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700">
            Seguir probando
          </button>
        </div>
      </div>
    </div>
  );
}
