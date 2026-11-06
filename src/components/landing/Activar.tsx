"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Section, SectionHead } from "./ui";
import { useLanding, useRegistroLink } from "./LandingState";
import { PRUEBA_DIAS } from "@/config/planes";

/**
 * 10 · ÚLTIMO PASO: cierre con el nombre que escribió el visitante + 3 pasos + CTA.
 * Bloque de color fuerte: corta el ritmo de fondos blancos y marca el final.
 */
export function Activar({ n }: { n: number }) {
  const { slug } = useLanding();
  const registro = useRegistroLink();

  return (
    <Section id="activar" className="bg-brand-900">
      <SectionHead
        n={n}
        center
        dark
        eyebrow="Un minuto y listo"
        title={
          <>
            Tu agenda ya está lista.
            <br />
            <span className="text-brand-100">Vos atendé, los turnos se dan solos.</span>
          </>
        }
        subtitle={
          <>
            Creás tu cuenta gratis y tu link queda andando hoy mismo: <span className="font-mono text-white">prestum.com.ar/{slug}</span>
          </>
        }
      />
      <ol className="mx-auto mt-10 grid max-w-3xl gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
        {["Creás tu cuenta", "Pegás tu link en Instagram y WhatsApp", "Los turnos entran solos"].map((p, i) => (
          <li key={p} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 sm:block sm:p-5 sm:text-center">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-lg font-bold text-brand-900 sm:mx-auto">{i + 1}</span>
            <p className="font-semibold text-white sm:mt-3">{p}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 text-center">
        <Link
          href={registro}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-brand-900 shadow-lg hover:bg-brand-50"
        >
          Empezar gratis →
        </Link>
        <p className="mt-3 text-sm text-brand-100">{PRUEBA_DIAS} días gratis con todo incluido · Sin tarjeta · 1 minuto · Si no te sirve, no pagás nada</p>
      </div>
    </Section>
  );
}

/**
 * Barra fija con CTA en celular. Aparece recién cuando el hero (que ya tiene su botón)
 * sale de pantalla, y se esconde al llegar al cierre (que también lo tiene): nunca hay
 * dos botones de "Empezar" a la vista a la vez.
 */
export function MobileCta() {
  const registro = useRegistroLink();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const cierre = document.getElementById("activar");
    if (!hero || !cierre) return;
    let pasoHero = false;
    let enCierre = false;
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pasoHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === cierre) enCierre = e.isIntersecting || e.boundingClientRect.top < 0;
      }
      setVisible(pasoHero && !enCierre);
    });
    obs.observe(hero);
    obs.observe(cierre);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <Link href={registro} tabIndex={visible ? 0 : -1} className="flex items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 font-semibold text-white">
        Empezar gratis · {PRUEBA_DIAS} días
      </Link>
    </div>
  );
}
