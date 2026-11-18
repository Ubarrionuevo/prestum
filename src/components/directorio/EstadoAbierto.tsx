"use client";
import { useEffect, useState } from "react";
import { abiertoAhora } from "@/lib/horario-osm";

/** "Abierta ahora" / "Cerrada ahora". Se calcula en el navegador (la página es estática), así siempre usa la hora real. */
export function EstadoAbierto({ horario }: { horario: string }) {
  const [abierto, setAbierto] = useState<boolean | null>(null);
  useEffect(() => {
    const calcular = () => setAbierto(abiertoAhora(horario));
    calcular();
    const id = setInterval(calcular, 60_000);
    return () => clearInterval(id);
  }, [horario]);
  if (abierto === null) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        abierto ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${abierto ? "bg-emerald-500" : "bg-slate-400"}`} />
      {abierto ? "Abierta ahora" : "Cerrada ahora"}
    </span>
  );
}
