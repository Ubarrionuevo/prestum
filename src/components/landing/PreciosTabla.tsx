"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrecio } from "@/config/negocios";
import { mesesGratisAnual, tieneAnual, type Plan } from "@/config/planes";

/**
 * Tabla de planes con selector mensual/anual.
 * `modo="registro"` (default) → botones al registro. `modo="elegir"` → `onElegir` (panel con la prueba vencida).
 * El plan Gratis (precio 0) se muestra como "Gratis" y no se puede "elegir" desde el panel.
 */
export function PreciosTabla({
  planes,
  modo = "registro",
  rubroRegistro,
  onElegir,
}: {
  planes: Plan[];
  modo?: "registro" | "elegir";
  /** Rubro que se preselecciona en el registro (ej: desde la página de peluquerías). */
  rubroRegistro?: string;
  onElegir?: (plan: Plan, ciclo: "mensual" | "anual") => void;
}) {
  const [cicloElegido, setCiclo] = useState<"mensual" | "anual">("mensual");
  // Si ningún plan tiene pago anual (ej: barberías), no se muestra el selector.
  const conAnual = planes.some(tieneAnual);
  const ciclo = conAnual ? cicloElegido : "mensual";
  const mesesGratis = Math.max(...planes.map(mesesGratisAnual));

  return (
    <div>
      {conAnual && (
      <div className="mt-10 flex justify-center">
        <div className="inline-flex rounded-xl bg-white p-1 ring-1 ring-slate-200" role="radiogroup" aria-label="Forma de pago">
          {(["mensual", "anual"] as const).map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={ciclo === c}
              onClick={() => setCiclo(c)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${ciclo === c ? "bg-brand-700 text-white" : "text-slate-600"}`}
            >
              {c === "mensual" ? "Mensual" : "Anual"}
              {c === "anual" && mesesGratis > 0 && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${ciclo === c ? "bg-white/20" : "bg-emerald-100 text-emerald-700"}`}>
                  {mesesGratis} meses gratis
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* En celular: carrusel horizontal con el recomendado primero (si hay 3 planes; con 2 van en orden de precio), en vez de tres planes
          largos uno abajo del otro. En escritorio: las tres columnas en su orden. */}
      <p className={`${conAnual ? "mt-6" : "mt-10"} text-center text-xs text-slate-500 lg:hidden`}>Deslizá para ver los {planes.length} planes →</p>
      <div className={`-mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-4 lg:mx-auto lg:mt-8 lg:grid lg:gap-6 ${planes.length === 2 ? "lg:max-w-4xl lg:grid-cols-2" : "lg:max-w-6xl lg:grid-cols-3"} lg:overflow-visible lg:px-0 lg:pb-0`}>
        {planes.map((p) => {
          const precio = ciclo === "mensual" ? p.precio_mensual : p.precio_anual;
          const gratis = p.precio_mensual === 0;
          const d = p.destacado;
          return (
            <article key={p.id} className={`relative flex w-[85%] flex-none snap-center flex-col rounded-3xl p-6 sm:w-[60%] lg:w-auto lg:p-7 ${d && planes.length > 2 ? "order-first lg:order-none " : ""}${d ?"bg-brand-900 text-white shadow-2xl shadow-brand-900/30" : "bg-white ring-1 ring-slate-200"}`}>
              {d && <span className="absolute -top-3 left-7 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950">RECOMENDADO</span>}
              <h3 className="text-xl font-bold">{p.nombre}</h3>
              <p className={`mt-1 min-h-[2.5rem] text-sm ${d ? "text-brand-100" : "text-slate-600"}`}>{p.bajada}</p>
              <p className="mt-5">
                {gratis ? (
                  <>
                    <span className="text-4xl font-extrabold">$ 0</span>
                    <span className={d ? "text-brand-100" : "text-slate-500"}> /mes, para siempre</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-extrabold">{formatPrecio(precio)}</span>
                    <span className={d ? "text-brand-100" : "text-slate-500"}> /{ciclo === "mensual" ? "mes" : "año"}</span>
                  </>
                )}
              </p>
              <p className={`mt-1 h-5 text-xs ${d ? "text-brand-100" : "text-slate-500"}`}>
                {ciclo === "anual" ? `Equivale a ${formatPrecio(Math.round(p.precio_anual / 12))}/mes` : ""}
              </p>
              <ul className={`mt-6 grid flex-1 content-start gap-3 text-sm ${d ? "text-white" : "text-slate-700"}`}>
                {p.items.map((i) => (
                  <li key={i.texto} className="flex items-start gap-2">
                    <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs ${d ? "bg-white/15" : "bg-brand-100 text-brand-700"}`}>✓</span>
                    <span>
                      {i.texto}
                      {i.pronto && (
                        <span className={`ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-semibold ${d ? "bg-white/15 text-brand-100" : "bg-slate-100 text-slate-500"}`}>Próximamente</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {modo === "registro" ? (
                <Link
                  href={`/registro?plan=${p.id}&ciclo=${ciclo}${rubroRegistro ? `&rubro=${rubroRegistro}` : ""}`}
                  className={`mt-8 rounded-xl py-3.5 text-center font-semibold ${d ? "bg-white text-brand-900 hover:bg-brand-50" : "bg-brand-700 text-white hover:bg-brand-900"}`}
                >
                  {gratis ? "Empezar gratis" : `Empezar con ${p.nombre}`}
                </Link>
              ) : gratis ? null : (
                <button
                  onClick={() => onElegir?.(p, ciclo)}
                  className={`mt-8 rounded-xl py-3.5 text-center font-semibold ${d ? "bg-white text-brand-900 hover:bg-brand-50" : "bg-brand-700 text-white hover:bg-brand-900"}`}
                >
                  Elegir {p.nombre}
                </button>
              )}
              {modo === "registro" && (
                <p className={`mt-2 text-center text-xs ${d ? "text-brand-100" : "text-slate-500"}`}>{gratis ? "Sin tarjeta · sin vencimiento" : "Sin contrato · sin comisión por turno"}</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
