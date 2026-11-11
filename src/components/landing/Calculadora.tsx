"use client";

import { useState } from "react";
import { formatPrecio } from "@/config/negocios";
import { OFERTA_CORTA } from "@/config/planes";
import { Section, SectionHead } from "./ui";
import Link from "next/link";
import { useLanding, useRegistroLink } from "./LandingState";

const OPCIONES = [
  { label: "1 a 5", sub: "tranqui", valor: 3 },
  { label: "6 a 10", sub: "lo normal", valor: 8 },
  { label: "11 a 20", sub: "bastante", valor: 15 },
  { label: "+20", sub: "un clásico", valor: 25 },
];
const DIAS_MES = 24;
const MIN_POR_CONSULTA = 2;
const TASA_PERDIDA = 0.1; // 1 de cada 10 consultas que no contestás a tiempo, reserva en otro lado

/** 06 · "Hagamos números": cuánto tiempo y plata se va en dar turnos por chat. */
export function Calculadora({ n, planBase, planBaseNombre }: { n: number; planBase: number; planBaseNombre: string }) {
  const { precio, demo } = useLanding();
  const [op, setOp] = useState(1);
  const registro = useRegistroLink();
  const consultas = OPCIONES[op].valor;

  const turnosPerdidos = Math.max(1, Math.round(consultas * TASA_PERDIDA * DIAS_MES));
  const plataMes = turnosPerdidos * precio;
  const horasMes = Math.round((consultas * MIN_POR_CONSULTA * DIAS_MES) / 60);
  const turnosParaPagar = Math.max(1, Math.ceil(planBase / precio));

  return (
    <Section id="plata" className="bg-brand-900 text-white">
      <SectionHead
        n={n}
        dark
        center
        eyebrow="Hagamos números"
        title={
          <>
            ¿Cuántas consultas por día
            <br />
            te llegan por WhatsApp?
          </>
        }
      />
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {OPCIONES.map((o, i) => (
          <button
            key={o.label}
            type="button"
            onClick={() => setOp(i)}
            className={`rounded-2xl border px-4 py-4 text-center transition ${i === op ? "border-white bg-white text-brand-900" : "border-white/20 hover:border-white/50"}`}
          >
            <span className="block text-2xl font-extrabold">{o.label}</span>
            <span className={`text-sm ${i === op ? "text-brand-700" : "text-brand-100"}`}>{o.sub}</span>
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-white/10 p-6 text-center">
          <p className="text-xs font-bold tracking-widest text-brand-100">TURNOS QUE SE PIERDEN, POR MES</p>
          <p className="mt-2 text-5xl font-extrabold">{formatPrecio(plataMes)}</p>
          <p className="mt-1 text-brand-100">{formatPrecio(plataMes * 12)} por año</p>
          <p className="mt-3 text-xs text-brand-100/80">
            Con {demo.servicios[0].nombre.toLowerCase()} a {formatPrecio(precio)} · ~{turnosPerdidos} turnos/mes
          </p>
        </div>
        <div className="rounded-3xl bg-white/10 p-6 text-center">
          <p className="text-xs font-bold tracking-widest text-brand-100">TIEMPO CONTESTANDO, POR MES</p>
          <p className="mt-2 text-5xl font-extrabold">{horasMes} h</p>
          <p className="mt-1 text-brand-100">que podrías estar atendiendo</p>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-brand-100">
        Cada consulta que no contestás a tiempo es un {demo.cliente} que reserva en otro lado. Con tu link, reservan solos aunque estés ocupado.
      </p>
      <p className="mt-4 text-center text-lg font-semibold">
        El plan {planBaseNombre} se paga con {turnosParaPagar === 1 ? "1 turno" : `${turnosParaPagar} turnos`} al mes.
      </p>
      <div className="mt-8 text-center">
        <Link href={registro} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-900 hover:bg-brand-50">
          Empezar gratis →
        </Link>
        <p className="mt-2 text-sm text-brand-100">{OFERTA_CORTA} · sin tarjeta</p>
      </div>
      <p className="mx-auto mt-6 max-w-xl text-center text-xs text-brand-100/70">
        Estimación: {MIN_POR_CONSULTA} min por consulta, {DIAS_MES} días hábiles y 1 de cada 10 consultas sin respuesta a tiempo.
      </p>
    </Section>
  );
}
