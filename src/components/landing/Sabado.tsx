"use client";

import { useState } from "react";
import { Phone, Section, SectionHead } from "./ui";
import { useLanding } from "./LandingState";

/** 02 · Antes/después: el celular lleno de mensajes vs. el resumen con Prestum Turnos. */
export function Sabado({ n }: { n: number }) {
  const { demo, display } = useLanding();
  const [con, setCon] = useState(false);
  const chats = demo.chats;

  return (
    <Section id="sabado">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHead
            n={n}
            eyebrow="Un día cualquiera"
            title={
              <>
                Vos, con las manos ocupadas.
                <br />
                El celular, sonando.
              </>
            }
            subtitle={`“¿Tenés lugar hoy?”, “¿cuánto sale?”, “¿me pasás un horario?”. Y vos con un ${demo.cliente} adelante, sin poder contestar.`}
          />
          <div className="mt-8 inline-flex rounded-xl bg-slate-100 p-1" role="tablist">
            {[
              ["Sin Prestum", false],
              ["Con Prestum", true],
            ].map(([label, v]) => (
              <button
                key={String(label)}
                role="tab"
                aria-selected={con === v}
                onClick={() => setCon(v as boolean)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${con === v ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
              >
                {label as string}
              </button>
            ))}
          </div>
          <dl className="mt-6 grid max-w-sm grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <dt className="text-sm text-slate-500">mensajes para dar turnos, hoy</dt>
              <dd className={`text-3xl font-extrabold ${con ? "text-brand-700" : "text-rose-600"}`}>{con ? 0 : chats.length}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <dt className="text-sm text-slate-500">perdidos contestando</dt>
              <dd className={`text-3xl font-extrabold ${con ? "text-brand-700" : "text-rose-600"}`}>{con ? "0 min" : `${chats.length * 2} min`}</dd>
            </div>
          </dl>
        </div>

        <Phone>
          {!con ? (
            <div className="bg-[#efeae2]">
              <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">{display.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{display}</p>
                  <p className="text-[11px] opacity-80">WhatsApp Business</p>
                </div>
                <span className="rounded-full bg-[#25D366] px-2 text-xs font-bold">{chats.length}</span>
              </div>
              <ul className="divide-y divide-black/5 bg-white">
                {chats.map((c, i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">{c.de.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="flex justify-between text-sm font-semibold text-slate-900">
                        {c.de}
                        <span className="text-[11px] font-normal text-[#25D366]">10:{String(7 + i * 7).padStart(2, "0")}</span>
                      </p>
                      <p className="truncate text-xs text-slate-500">{c.msg}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-5">
              <p className="text-[10px] font-bold tracking-widest text-brand-700">HOY EN {display.toUpperCase()}</p>
              <p className="text-sm text-slate-500">Resumen de Prestum · sábado</p>
              <ul className="mt-5 grid gap-3">
                {[
                  ["Turnos que llegaron armados", "12"],
                  ["Preguntas de precio u horario", "0"],
                  ["Turnos confirmados con un mensaje", "12"],
                  ["Llamadas atendidas trabajando", "0"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-700">{k}</span>
                    <span className="text-xl font-extrabold text-brand-700">{v}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl bg-brand-700 py-4 text-center font-semibold text-white">Vos, trabajando tranquilo. 😌</p>
              <p className="mt-3 text-center text-[11px] text-slate-400">Ejemplo ilustrativo</p>
            </div>
          )}
        </Phone>
      </div>
    </Section>
  );
}
