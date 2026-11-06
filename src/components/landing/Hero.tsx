"use client";

import { heroRubros } from "@/config/products/turnero-landing";
import { BookingPreview, Phone } from "./ui";
import Link from "next/link";
import { useLanding, useRegistroLink } from "./LandingState";
import { PRUEBA_DIAS } from "@/config/planes";

/**
 * 01 · HERO interactivo: el visitante escribe el nombre de su negocio y ve su página
 * de reservas armarse en vivo. El <h1> lleva la keyword (SEO); la pregunta grande es visual.
 */
export function Hero({ h1, subtitle, showRubros }: { h1: string; subtitle: string; showRubros: boolean }) {
  const { nombre, setNombre, demo, display, slug, rubro, setRubro, activos } = useLanding();
  const registro = useRegistroLink();
  const servicios = demo.servicios.filter((s) => activos.includes(s.nombre));
  const pregunta = showRubros ? "tu negocio" : `tu ${demo.negocio}`;

  return (
    <header id="inicio" className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
            <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden />
            {h1}
          </h1>
          <p className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            ¿Cómo se llama
            <br />
            <span className="text-brand-700">{pregunta}?</span>
          </p>
          <p className="mt-5 max-w-lg text-lg text-slate-600">{subtitle}</p>

          {showRubros && (
            <div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Tu rubro">
              {heroRubros.map((r) => (
                <button
                  key={r.slug}
                  type="button"
                  role="radio"
                  aria-checked={r.slug === rubro}
                  onClick={() => setRubro(r.slug)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    r.slug === rubro ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand-500"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          <form
            className="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("pagina")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <label className="sr-only" htmlFor="hero-nombre">
              Nombre de tu negocio
            </label>
            <input
              id="hero-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.slice(0, 40))}
              placeholder={`Ej: ${demo.ejemplos[0]}`}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10"
            />
            <button type="submit" className="rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white hover:bg-slate-700">
              Ver cómo queda
            </button>
          </form>
          <p className="mt-2 text-sm text-slate-500">
            Tu link: <span className="font-mono text-brand-700">prestum.com.ar/{slug}</span>
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            Probá con:
            {demo.ejemplos.map((e) => (
              <button key={e} type="button" onClick={() => setNombre(e)} className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 hover:bg-brand-50 hover:text-brand-700">
                {e}
              </button>
            ))}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={registro}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-700/20 hover:bg-brand-900"
            >
              Empezar gratis →
            </Link>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <li>✓ {PRUEBA_DIAS} días gratis</li>
              <li>✓ Sin tarjeta</li>
              <li>✓ Listo en 1 minuto</li>
            </ul>
          </div>
        </div>

        <div className="relative">
          <p className="mb-3 text-center text-xs font-bold tracking-widest text-brand-700">
            TU PÁGINA · EN VIVO <span className="font-medium text-slate-400">· cambia mientras escribís</span>
          </p>
          <Phone>
            <BookingPreview nombre={display} servicios={servicios} />
          </Phone>
          <div className="absolute -left-2 top-1/3 hidden rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-100 sm:block">
            <p className="text-[10px] font-bold tracking-widest text-brand-700">RESERVAS 24/7</p>
            <p className="mt-1 max-w-[150px] text-xs text-slate-600">Tus {demo.cliente}s reservan solos, vos seguís trabajando</p>
          </div>
        </div>
      </div>

      {/* Barra de confianza */}
      <div className="border-y border-slate-100 bg-white">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-sm text-slate-600">
          <li>🇦🇷 Hecho en Argentina · precios en pesos</li>
          <li>💬 Soporte por WhatsApp, de persona a persona</li>
          <li>🎁 {PRUEBA_DIAS} días gratis, sin tarjeta</li>
        </ul>
      </div>
    </header>
  );
}
