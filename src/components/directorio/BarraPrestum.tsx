"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const CLAVE = "prestum-barra-cerrada";

/** Cartel fijo abajo (no tapa el contenido como un pop-up) para avisar quiénes somos. Se puede cerrar. */
export function BarraPrestum({ negocio }: { negocio: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let cerrada = false;
    try {
      cerrada = sessionStorage.getItem(CLAVE) === "1";
    } catch {}
    setVisible(!cerrada);
  }, []);
  if (!visible) return null;
  const cerrar = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(CLAVE, "1");
    } catch {}
  };
  return (
    <>
      <div aria-hidden className="h-20 sm:h-16" />
      <aside
        aria-label="Sobre Prestum"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur"
      >
        {/* A la derecha deja lugar al botón flotante de WhatsApp (en compu está abajo a la derecha; en celular, arriba de la barra). */}
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:pr-24">
          <p className="min-w-0 flex-1 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">¿Tenés una {negocio}?</span>{" "}
            <span className="sm:hidden">Turnos online gratis con Prestum.</span>
            <span className="hidden sm:inline">Con Prestum tus clientes sacan turno online, solos y a toda hora. Gratis para empezar.</span>
          </p>
          <Link href="/registro" className="shrink-0 whitespace-nowrap rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-900">
            Probar gratis
          </Link>
          <button type="button" onClick={cerrar} aria-label="Cerrar aviso" className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            ✕
          </button>
        </div>
      </aside>
    </>
  );
}
