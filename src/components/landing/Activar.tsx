"use client";

import Link from "next/link";
import { Section, SectionHead } from "./ui";
import { useLanding, useRegistroLink } from "./LandingState";
import { PRUEBA_DIAS } from "@/config/planes";

/** 10 · ÚLTIMO PASO: cierre con el nombre que escribió el visitante + 3 pasos + CTA. */
export function Activar({ n }: { n: number }) {
  const { slug } = useLanding();
  const registro = useRegistroLink();

  return (
    <Section id="activar" className="bg-gradient-to-b from-white to-brand-50">
      <SectionHead
        n={n}
        center
        eyebrow="Un minuto y listo"
        title={
          <>
            Tu agenda ya está lista.
            <br />
            <span className="text-brand-700">Vos atendé, los turnos se dan solos.</span>
          </>
        }
        subtitle={
          <>
            Creás tu cuenta gratis y tu link queda andando hoy mismo: <span className="font-mono text-brand-700">prestum.com.ar/{slug}</span>
          </>
        }
      />
      <ol className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
        {["Creás tu cuenta", "Pegás tu link en Instagram y WhatsApp", "Los turnos entran solos"].map((p, i) => (
          <li key={p} className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-lg font-bold text-white">{i + 1}</span>
            <p className="mt-3 font-semibold text-slate-900">{p}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 text-center">
        <Link
          href={registro}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-700/25 hover:bg-brand-900"
        >
          Empezar gratis →
        </Link>
        <p className="mt-3 text-sm text-slate-500">{PRUEBA_DIAS} días gratis con todo incluido · Sin tarjeta · 1 minuto · Si no te sirve, no pagás nada</p>
      </div>
    </Section>
  );
}

/** Barra fija con CTA en celular (aparece en toda la landing). */
export function MobileCta() {
  const registro = useRegistroLink();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <Link href={registro} className="flex items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 font-semibold text-white">
        Empezar gratis · {PRUEBA_DIAS} días
      </Link>
    </div>
  );
}
