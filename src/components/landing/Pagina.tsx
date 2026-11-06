"use client";

import { useState } from "react";
import { formatPrecio } from "@/config/negocios";
import { BookingPreview, Check, Phone, Section, SectionHead } from "./ui";
import { useLanding } from "./LandingState";

/** 03 · "Armala a tu gusto": prendé/apagá servicios y cambiá el precio, la vista previa se actualiza. */
export function Pagina({ n }: { n: number }) {
  const { demo, display, slug, precio, setPrecio, activos, toggleServicio } = useLanding();
  const [copiado, setCopiado] = useState(false);
  const link = `prestum.com.ar/${slug}`;

  const extras = demo.extras.map((e, i) => ({ nombre: e, duracion: 30, precio: Math.round((demo.servicios[0].precio * (0.7 + i * 0.2)) / 500) * 500 }));
  const todos = [...demo.servicios, ...extras];
  const visibles = todos
    .filter((s) => activos.includes(s.nombre))
    .map((s, i) => (s.nombre === demo.servicios[0].nombre ? { ...s, precio } : s))
    .slice(0, 5);

  return (
    <Section id="pagina" className="bg-slate-50">
      <SectionHead
        n={n}
        eyebrow="Armala a tu gusto"
        title={
          <>
            Tu página de reservas.
            <br />
            Lista, en serio.
          </>
        }
        subtitle={`Tocá y cambiá. Esto es lo que ven tus ${demo.cliente}s cuando entran a tu link.`}
        center
      />
      <div className="mt-14 grid items-start gap-10 lg:grid-cols-2">
        <div className="grid gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <p className="text-xs font-bold tracking-widest text-slate-400">TUS SERVICIOS</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {todos.map((s) => {
                const on = activos.includes(s.nombre);
                return (
                  <button
                    key={s.nombre}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleServicio(s.nombre)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${on ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 text-slate-600 hover:border-brand-500"}`}
                  >
                    {on ? "✓ " : "+ "}
                    {s.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <p className="text-xs font-bold tracking-widest text-slate-400">PRECIO DE {demo.servicios[0].nombre.toUpperCase()}</p>
            <div className="mt-3 flex items-center gap-4">
              <button type="button" aria-label="Bajar precio" onClick={() => setPrecio(Math.max(1000, precio - 1000))} className="h-11 w-11 rounded-xl border border-slate-200 text-xl font-bold hover:border-brand-500">
                −
              </button>
              <span className="min-w-[8rem] text-center text-3xl font-extrabold text-slate-900">{formatPrecio(precio)}</span>
              <button type="button" aria-label="Subir precio" onClick={() => setPrecio(precio + 1000)} className="h-11 w-11 rounded-xl border border-slate-200 text-xl font-bold hover:border-brand-500">
                +
              </button>
            </div>
          </div>

          <ul className="grid gap-3 text-slate-700">
            <Check>Tus {demo.cliente}s reservan sin bajar ninguna app</Check>
            <Check>La reserva te llega armada a tu WhatsApp</Check>
            <Check>Ven el precio antes de reservar: menos preguntas</Check>
          </ul>
        </div>

        <div>
          <Phone>
            <BookingPreview nombre={display} servicios={visibles} />
          </Phone>
          <div className="mx-auto mt-6 flex max-w-[340px] items-center gap-2 rounded-xl bg-white p-2 pl-4 shadow-sm ring-1 ring-slate-100">
            <span className="min-w-0 flex-1 truncate font-mono text-sm text-brand-700">{link}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`https://www.${link}`).catch(() => {});
                setCopiado(true);
                setTimeout(() => setCopiado(false), 1500);
              }}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            >
              {copiado ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
