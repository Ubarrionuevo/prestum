"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRegistroLink } from "./LandingState";

/**
 * Barra fija con CTA en celular. Aparece recién cuando el hero (que ya tiene su botón)
 * sale de pantalla, y se esconde al llegar al pie de página: nunca hay
 * dos botones de "Empezar" a la vista a la vez.
 */
export function MobileCta() {
  const registro = useRegistroLink();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    // Se esconde al llegar al pie de página.
    const cierre = document.querySelector("footer");
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
        Empezar gratis
      </Link>
    </div>
  );
}
