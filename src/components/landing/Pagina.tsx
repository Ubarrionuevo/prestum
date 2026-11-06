"use client";

import { useState } from "react";
import { formatPrecio } from "@/config/negocios";
import { heroRubros } from "@/config/products/turnero-landing";
import { BookingPreview, Check, Phone, Section, SectionHead } from "./ui";
import { useLanding } from "./LandingState";

/**
 * 04 · "Probalo con tu negocio": el visitante escribe el nombre (y en la home elige el rubro),
 * prende/apaga servicios y cambia el precio; la vista previa se actualiza al lado.
 * Antes el nombre se escribía en el hero; se juntó acá para que haya una sola demo de la página.
 */
export function Pagina({ n, showRubros = false }: { n: number; showRubros?: boolean }) {
  const { nombre, setNombre, rubro, setRubro, demo, display, slug, precio, setPrecio, activos, toggleServicio } = useLanding();
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
        eyebrow="Probalo con tu negocio"
        title={
          <>
            Tus clientes ven todo.
            <br />
            Vos no explicás nada.
          </>
        }
        subtitle={`Escribí el nombre de tu negocio y mirá cómo queda tu página: servicios, precios y horarios libres a la vista, como la ven tus ${demo.cliente}s.`}
        center
      />
      <div className="mt-10 grid items-start gap-8 sm:mt-14 lg:grid-cols-2 lg:gap-10">
        <div className="grid gap-4 sm:gap-6">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <label htmlFor="pagina-nombre" className="text-xs font-bold tracking-widest text-slate-400">
              NOMBRE DE TU NEGOCIO
            </label>
            {showRubros && (
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Tu rubro">
                {heroRubros.map((r) => (
                  <button
                    key={r.slug}
                    type="button"
                    role="radio"
                    aria-checked={r.slug === rubro}
                    onClick={() => setRubro(r.slug)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                      r.slug === rubro ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand-500"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
            <input
              id="pagina-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.slice(0, 40))}
              placeholder={`Ej: ${demo.ejemplos[0]}`}
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10"
            />
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              Probá con:
              {demo.ejemplos.map((e) => (
                <button key={e} type="button" onClick={() => setNombre(e)} className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 hover:bg-brand-50 hover:text-brand-700">
                  {e}
                </button>
              ))}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
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

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
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
