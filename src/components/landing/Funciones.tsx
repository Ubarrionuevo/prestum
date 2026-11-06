"use client";

import Link from "next/link";
import type { Benefit } from "@/config/types";
import { formatPrecio } from "@/config/negocios";
import { Section, SectionHead, WaIcon } from "./ui";
import { useLanding } from "./LandingState";

/**
 * En celular cada función es una fila corta (título + una línea) y la maqueta se oculta,
 * salvo en la principal (`mockEnCelular`). En escritorio se ve la grilla completa.
 */
function Card({
  title,
  text,
  children,
  className = "",
  tag,
  mockEnCelular = false,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
  className?: string;
  tag?: string;
  mockEnCelular?: boolean;
}) {
  return (
    <article className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-5 md:rounded-3xl md:p-6 ${className}`}>
      {tag && <p className="mb-3 w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">{tag}</p>}
      <div className={`mb-5 flex-1 ${mockEnCelular ? "" : "hidden md:block"}`}>{children}</div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </article>
  );
}

/** 05 · FUNCIONES en grilla tipo "bento". Solo lo que el producto hace HOY. */
export function Funciones({
  n,
  rubros,
  extra,
}: {
  n: number;
  rubros: Array<{ href: string; label: string }>;
  /** Beneficios propios del rubro (en páginas de nicho: contenido único para SEO). */
  extra?: { title: string; items: Benefit[] };
}) {
  const { demo, display, slug } = useLanding();
  const s = demo.servicios;

  return (
    <Section id="funciones">
      <SectionHead
        n={n}
        eyebrow="Funciones"
        title={
          <>
            Hecho para el que atiende
            <br />
            con las manos ocupadas.
          </>
        }
        subtitle="Sirve igual para un consultorio, un taller o una peluquería. Cada función hace una cosa: menos explicaciones, más turnos. Todo desde el celular."
      />

      <div className="mt-10 grid gap-3 sm:mt-12 md:grid-cols-3 md:gap-5">
        <Card
          className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-brand-50 to-white"
          mockEnCelular
          tag="La que más tiempo te ahorra"
          title="Reservas que llegan armadas a tu WhatsApp"
          text={`Nombre, servicio, día, hora y medio de pago en un solo mensaje. No preguntás nada: confirmás y listo.`}
        >
          <div className="max-w-sm space-y-2 rounded-2xl bg-[#efeae2] p-4">
            <div className="rounded-xl rounded-tl-none bg-white p-3 text-sm shadow-sm">
              <p>¡Hola {display}! Quiero reservar:</p>
              <p>💼 {s[0].nombre} · 📅 mañana · 🕒 10:30</p>
              <p>💳 Transferencia</p>
            </div>
            <div className="ml-auto w-fit rounded-xl rounded-tr-none bg-[#d9fdd3] px-3 py-2 text-sm shadow-sm">✅ ¡Confirmado! ✓✓</div>
          </div>
        </Card>

        <Card title="Tu página de reservas propia" text={`Con tu nombre y tus servicios. Tus ${demo.cliente}s reservan en dos toques, sin bajar ninguna app.`}>
          <p className="truncate rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-brand-700">prestum.com.ar/{slug}</p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
            {["Bio de Instagram", "Estado de WhatsApp", "Google Maps"].map((x) => (
              <span key={x} className="rounded-full border border-slate-200 px-2 py-1 text-slate-600">
                {x}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Servicios y precios a la vista" text="Cada servicio con su duración y su precio. Menos “¿cuánto sale?”.">
          <ul className="space-y-1.5 text-sm">
            {s.map((x) => (
              <li key={x.nombre} className="flex justify-between rounded-lg bg-slate-50 px-3 py-1.5">
                <span className="truncate">{x.nombre}</span>
                <span className="font-semibold text-brand-700">{formatPrecio(x.precio)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Horarios que se arman solos" text="Cargás tus días y horarios; el turnero muestra solo lo disponible según lo que dura cada servicio.">
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "15:00", "15:30"].map((h, i) => (
              <span key={h} className={`rounded-md py-1 ${i === 2 || i === 5 ? "bg-slate-100 text-slate-300 line-through" : "bg-brand-50 text-brand-900"}`}>
                {h}
              </span>
            ))}
          </div>
        </Card>

        <Card title="El cliente elige cómo paga" text="Efectivo, transferencia o Mercado Pago. Lo sabés antes de que llegue.">
          <div className="flex gap-2 text-sm">
            {["💵 Efectivo", "🏦 Transferencia", "📱 Mercado Pago"].map((x) => (
              <span key={x} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs">
                {x}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Equipo, canchas o salas" text="Cada profesional, cancha o sala con su agenda y sus horarios. El cliente elige con quién, o toma el primero libre.">
          <div className="flex -space-x-2">
            {["F", "J", "E", "+"].map((x, i) => (
              <span key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-brand-700 font-bold text-white">
                {x}
              </span>
            ))}
          </div>
        </Card>

        <Card className="md:col-span-3" mockEnCelular title="Adaptado a tu rubro" text="Textos, servicios y ejemplos pensados para cómo trabaja cada tipo de negocio.">
          <ul className="flex flex-wrap gap-2">
            {rubros.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-brand-500 hover:text-brand-700">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {extra && extra.items.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-slate-900">{extra.title}</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {extra.items.map((b) => (
              <div key={b.title} className="rounded-2xl bg-slate-50 p-5">
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="text-brand-600">✓</span> {b.title}
                </p>
                <p className="mt-2 text-sm text-slate-600">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
