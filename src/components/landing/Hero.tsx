"use client";

import { BookingPreview, Phone } from "./ui";
import Link from "next/link";
import { useLanding, useRegistroLink } from "./LandingState";
import { OFERTA_CORTA, TURNOS_GRATIS } from "@/config/planes";

/**
 * 01 · HERO: solo se entiende qué es (título grande = <h1>), con un botón y una vista previa.
 * Orden: etiqueta → título → bajada → 2 botones → garantías, y al lado el celular.
 * El "Probalo con tu negocio" vive en la sección 04 (Pagina): acá en celular el hero
 * entra en una pantalla y media en vez de dos y pico.
 */
export function Hero({
  titulo,
  lema,
  etiqueta,
  subtitle,
  showRubros,
  compacto,
}: {
  /** En celular: título más chico, sin bajada ni segundo botón, para que la app entre en la primera pantalla. */
  compacto?: boolean;
  titulo: string;
  /** Frase fuerte debajo del h1 (ej: "Automatizá los turnos de tu barbería en tu propio WhatsApp"). */
  lema?: string;
  etiqueta: string;
  subtitle: string;
  showRubros: boolean;
}) {
  const { demo, display, activos } = useLanding();
  const registro = useRegistroLink();
  const servicios = demo.servicios.filter((s) => activos.includes(s.nombre));

  return (
    <header id="inicio" className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-8 sm:pb-16 sm:pt-16 lg:gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
            <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden />
            {etiqueta}
          </p>
          <h1
            className={`font-extrabold leading-[1.05] tracking-tight text-slate-900 ${compacto ? "mt-4 text-[1.75rem] sm:mt-5 sm:text-5xl" : "mt-5 text-4xl sm:text-6xl"}`}
          >
            {titulo}
          </h1>
          {lema && <p className={`font-bold leading-snug text-brand-700 sm:mt-4 sm:text-2xl ${compacto ? "mt-3 text-lg" : "mt-4 text-xl"}`}>{lema}</p>}
          <p className={`mt-5 max-w-lg text-lg text-slate-600 ${compacto ? "hidden sm:block" : ""}`}>{subtitle}</p>

          <div className={`flex flex-col gap-3 sm:mt-7 sm:flex-row ${compacto ? "mt-5" : "mt-7"}`}>
            <Link
              href={registro}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-700/20 hover:bg-brand-900"
            >
              Empezar gratis
            </Link>
            <a
              href="#como-funciona"
              className={`items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700 ${compacto ? "hidden sm:inline-flex" : "inline-flex"}`}
            >
              Ver cómo funciona
            </a>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
            <li>✓ {OFERTA_CORTA}</li>
            <li>✓ Sin tarjeta</li>
            <li>✓ Listo en 1 minuto</li>
            {showRubros && <li>✓ Para barberías, peluquerías y estética</li>}
          </ul>
        </div>

        <div className="relative">
          <p className="mb-3 text-center text-xs font-bold tracking-widest text-brand-700">
            TU PÁGINA DE RESERVAS <span className="font-medium text-slate-400">· así la ven tus {demo.cliente}s</span>
          </p>
          {/* En celular se ve solo la parte de arriba del teléfono, como una captura: alcanza
              para entender qué es y no empuja el resto de la página dos pantallas más abajo. */}
          <div className="relative max-h-[380px] overflow-hidden sm:max-h-none">
            <Phone>
              <BookingPreview nombre={display} servicios={servicios} />
            </Phone>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent sm:hidden" aria-hidden />
          </div>
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
          <li>🎁 {TURNOS_GRATIS} turnos por mes gratis, sin tarjeta</li>
        </ul>
      </div>
    </header>
  );
}
