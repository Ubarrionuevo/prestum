"use client";

import { Section, SectionHead } from "./ui";
import { useLanding } from "./LandingState";

/** 02 · CÓMO FUNCIONA: los 3 pasos, bien arriba, para que se entienda qué es antes de probar. */
export function ComoFunciona({ n }: { n: number }) {
  const { demo } = useLanding();
  const pasos = [
    { t: "Cargás tus servicios y horarios", d: "Cada servicio con su precio y lo que dura. Lo hacés una vez, desde el celular." },
    { t: "Compartís tu link", d: "Lo pegás en Instagram, en tu WhatsApp y en Google Maps: prestum.com.ar/tu-negocio." },
    { t: "Te llega cada turno a WhatsApp", d: `Tus ${demo.cliente}s eligen servicio, día y horario solos. A vos te llega el turno armado para confirmar.` },
  ];
  return (
    <Section id="como-funciona" className="bg-brand-50/60">
      <SectionHead n={n} eyebrow="Cómo funciona" title="Tres pasos y tus turnos se dan solos." />
      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {pasos.map((p, i) => (
          <li key={p.t} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-lg font-bold text-white">{i + 1}</span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{p.t}</h3>
            <p className="mt-1 text-slate-600">{p.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
