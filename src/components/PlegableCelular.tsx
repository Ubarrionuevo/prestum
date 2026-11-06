"use client";

import { useState } from "react";

/**
 * Bloque que en celular arranca plegado detrás de un botón y en escritorio se ve siempre.
 * El contenido queda en el HTML (solo se oculta con CSS), así los enlaces se siguen rastreando.
 */
export function PlegableCelular({ titulo, className = "", children }: { titulo: string; className?: string; children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-slate-900 md:hidden"
      >
        {titulo}
        <span aria-hidden className={`text-lg text-brand-700 transition-transform ${abierto ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <div className={`${abierto ? "" : "hidden"} md:block ${className}`}>{children}</div>
    </>
  );
}
