"use client";

import { createContext, useContext } from "react";
import type { NegocioDB, RecursoDB, Rol } from "@/lib/supabase";
import type { Funcion } from "@/lib/funciones";

/** Datos que comparten todas las pestañas del panel. */
export interface PanelCtx {
  negocio: NegocioDB;
  recursos: RecursoDB[];
  rol: Rol;
  /** ¿El plan de la cuenta incluye esta función? (en la prueba: todas) */
  tiene: (f: Funcion) => boolean;
  /** Nombre del plan más barato que la incluye (para "Disponible en…"). */
  planPara: (f: Funcion) => string | undefined;
}

const Ctx = createContext<PanelCtx | null>(null);
export const PanelProvider = Ctx.Provider;

export function usePanel() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePanel fuera del panel");
  return c;
}

/** Cartel para funciones que el plan no incluye. */
export function NoIncluido({ funcion, nombre }: { funcion: Funcion; nombre: string }) {
  const { planPara } = usePanel();
  const plan = planPara(funcion);
  return (
    <div className="rounded-2xl bg-slate-50 p-6 text-center ring-1 ring-slate-200">
      <p className="text-3xl">🔒</p>
      <p className="mt-2 font-semibold text-slate-900">{nombre} no está incluido en tu plan</p>
      {plan && <p className="mt-1 text-sm text-slate-600">Está disponible desde el plan {plan}. Cambialo en la pestaña Plan.</p>}
    </div>
  );
}
