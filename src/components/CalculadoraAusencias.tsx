"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrecio } from "@/config/negocios";

const SEMANAS_MES = 4.3;

/** Valores de arranque por rubro (editables: son solo un ejemplo para empezar). */
const EJEMPLOS = {
  barberia: { nombre: "Barbería", turnos: 60, ausencias: 4, precio: 15000 },
  peluqueria: { nombre: "Peluquería", turnos: 40, ausencias: 3, precio: 25000 },
  estetica: { nombre: "Estética", turnos: 35, ausencias: 3, precio: 22000 },
} as const;
type Rubro = keyof typeof EJEMPLOS;

function Campo({ label, ayuda, value, onChange, prefijo }: { label: string; ayuda: string; value: number; onChange: (n: number) => void; prefijo?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="mt-1 flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-brand-500">
        {prefijo && <span className="text-slate-400">{prefijo}</span>}
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full bg-transparent px-1 py-2.5 text-lg font-semibold text-slate-900 outline-none"
        />
      </span>
      <span className="mt-1 block text-xs text-slate-500">{ayuda}</span>
    </label>
  );
}

/** Calculadora: cuánto se pierde por mes con los turnos que no se presentan. */
export function CalculadoraAusencias({ planes }: { planes: Array<{ nombre: string; precio: number }> }) {
  const [rubro, setRubro] = useState<Rubro>("barberia");
  const [turnos, setTurnos] = useState<number>(EJEMPLOS.barberia.turnos);
  const [ausencias, setAusencias] = useState<number>(EJEMPLOS.barberia.ausencias);
  const [precio, setPrecio] = useState<number>(EJEMPLOS.barberia.precio);

  const elegir = (r: Rubro) => {
    setRubro(r);
    setTurnos(EJEMPLOS[r].turnos);
    setAusencias(EJEMPLOS[r].ausencias);
    setPrecio(EJEMPLOS[r].precio);
  };

  const perdidaMes = Math.round(ausencias * precio * SEMANAS_MES);
  const perdidaAnio = perdidaMes * 12;
  const tasa = turnos > 0 ? Math.round((ausencias / turnos) * 100) : 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(EJEMPLOS) as Rubro[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => elegir(r)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${r === rubro ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300 text-slate-700 hover:border-brand-500"}`}
          >
            {EJEMPLOS[r].nombre}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Los valores de arranque son un ejemplo: cambialos por los de tu negocio.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Campo label="Turnos por semana" ayuda="Todos los turnos que das" value={turnos} onChange={setTurnos} />
        <Campo label="Ausencias por semana" ayuda="Reservan y no vienen ni avisan" value={ausencias} onChange={setAusencias} />
        <Campo label="Precio promedio" ayuda="Lo que sale un turno, en pesos" value={precio} onChange={setPrecio} prefijo="$" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-brand-900 p-5 text-center text-white">
          <p className="text-xs font-bold tracking-widest text-brand-100">PERDÉS POR MES</p>
          <p className="mt-2 text-3xl font-extrabold sm:text-4xl">{formatPrecio(perdidaMes)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 text-center">
          <p className="text-xs font-bold tracking-widest text-slate-500">POR AÑO</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">{formatPrecio(perdidaAnio)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 text-center">
          <p className="text-xs font-bold tracking-widest text-slate-500">AUSENTISMO</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">{tasa}%</p>
          <p className="mt-1 text-xs text-slate-500">{tasa > 10 ? "Más de 1 de cada 10: conviene sumar recordatorio y seña" : "de tus turnos"}</p>
        </div>
      </div>

      {precio > 0 && planes.length > 0 && (
        <ul className="mt-6 space-y-1 text-sm text-slate-700">
          {planes.map((p) => {
            const n = Math.max(1, Math.ceil(p.precio / precio));
            return (
              <li key={p.nombre}>
                El plan <strong>{p.nombre}</strong> ({formatPrecio(p.precio)}/mes) se paga evitando {n === 1 ? "1 ausencia" : `${n} ausencias`} por mes.
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/registro" className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-900">
          Empezar gratis
        </Link>
        <Link href="/funciones/recordatorios-whatsapp" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700">
          Cómo bajar las ausencias
        </Link>
      </div>
      <p className="mt-4 text-xs text-slate-500">Cálculo: ausencias por semana × precio promedio × {SEMANAS_MES} semanas por mes.</p>
    </div>
  );
}
