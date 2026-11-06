"use client";

import { useEffect, useState } from "react";
import { formatPrecio, mediosDePagoLabels, type MedioDePago } from "@/config/negocios";
import { Phone, Section, SectionHead, WaIcon } from "./ui";
import { useLanding } from "./LandingState";

const HORAS = ["10:00", "10:30", "11:00", "11:30", "12:00", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
const PAGOS: MedioDePago[] = ["efectivo", "transferencia", "mercadopago"];

interface Turno {
  hora: string;
  quien: string;
  servicio: string;
  fecha: string;
  pago: MedioDePago;
  estado: "nuevo" | "confirmado";
}

/**
 * 04 · DEMO EN VIVO: a la izquierda el visitante reserva como cliente; a la derecha ve
 * cómo le cae la reserva al negocio en WhatsApp y la confirma con un toque.
 */
export function Demo({ n }: { n: number }) {
  const { demo, display } = useLanding();
  const [dias, setDias] = useState<Date[]>([]);
  useEffect(() => {
    const hoy = new Date();
    setDias(Array.from({ length: 5 }, (_, i) => new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i)));
  }, []);

  const [svc, setSvc] = useState(0);
  const [dia, setDia] = useState(0);
  const [hora, setHora] = useState<string | null>(null);
  const [pago, setPago] = useState<MedioDePago>("transferencia");
  const [quien, setQuien] = useState("");
  const [turnos, setTurnos] = useState<Turno[]>([]);

  useEffect(() => {
    setTurnos([]);
    setSvc(0);
    setHora(null);
  }, [demo]);

  const servicio = demo.servicios[svc] ?? demo.servicios[0];
  const listo = hora && quien.trim().length >= 2;
  const fechaTxtFor = (i: number) =>
    dias[i] ? (i === 0 ? "hoy" : dias[i].toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })) : "";
  const fechaTxt = fechaTxtFor(dia);
  const ocupadas = new Set(["11:00", "15:30", ...turnos.filter((t) => t.fecha === fechaTxtFor(dia)).map((t) => t.hora)]);

  function reservar() {
    if (!listo) return;
    setTurnos((t) => [...t, { hora: hora!, quien: quien.trim(), servicio: servicio.nombre, fecha: fechaTxt, pago, estado: "nuevo" }]);
    setHora(null);
    setQuien("");
  }

  const ultimo = turnos[turnos.length - 1];

  return (
    <Section id="demo">
      <SectionHead
        n={n}
        eyebrow="Probalo ahora · es el sistema real"
        title={
          <>
            Sacá un turno como tu {demo.cliente}.
            <br />
            Fijate qué te llega a vos.
          </>
        }
        subtitle="Elegí un servicio, un horario y reservá. Del otro lado vas a ver el mensaje que te llega al WhatsApp, listo para confirmar."
        center
      />

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setTurnos([]);
            setHora(null);
          }}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand-500"
        >
          ↺ Reiniciar demo
        </button>
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
        {/* Cliente */}
        <Phone label={`TU ${demo.cliente.toUpperCase()} · PRESTUM.COM.AR/…`}>
          <div className="max-h-[540px] overflow-y-auto p-4">
            <p className="font-bold text-slate-900">{display}</p>
            <p className="text-xs text-emerald-600">● Abierto hoy · 9 a 19 h</p>

            <p className="mt-4 text-[10px] font-bold tracking-widest text-slate-400">1 · ELEGÍ EL SERVICIO</p>
            <div className="mt-2 grid gap-1.5">
              {demo.servicios.map((s, i) => (
                <button
                  key={s.nombre}
                  type="button"
                  onClick={() => setSvc(i)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${i === svc ? "border-brand-700 bg-brand-50" : "border-slate-200"}`}
                >
                  <span>
                    <span className="font-semibold">{s.nombre}</span>
                    <span className="block text-xs text-slate-500">{s.duracion} min</span>
                  </span>
                  <span className="font-bold text-brand-700">{formatPrecio(s.precio)}</span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-[10px] font-bold tracking-widest text-slate-400">2 · DÍA Y HORARIO</p>
            <div className="mt-2 flex gap-1.5">
              {dias.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDia(i)}
                  className={`flex-1 rounded-lg border py-1.5 text-center text-xs ${i === dia ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200"}`}
                >
                  <span className="block">{i === 0 ? "Hoy" : d.toLocaleDateString("es-AR", { weekday: "short" })}</span>
                  <span className="font-bold">{d.getDate()}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {HORAS.map((h) => {
                const oc = ocupadas.has(h);
                return (
                  <button
                    key={h}
                    type="button"
                    disabled={oc}
                    onClick={() => setHora(h)}
                    className={`rounded-lg border py-1.5 text-xs font-medium ${
                      h === hora ? "border-brand-700 bg-brand-700 text-white" : oc ? "border-slate-100 text-slate-300 line-through" : "border-slate-200"
                    }`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-[10px] font-bold tracking-widest text-slate-400">3 · PAGO Y TUS DATOS</p>
            <div className="mt-2 flex gap-1.5">
              {PAGOS.map((p) => (
                <button key={p} type="button" onClick={() => setPago(p)} className={`flex-1 rounded-lg border px-1 py-1.5 text-[11px] ${p === pago ? "border-brand-700 bg-brand-50 font-semibold" : "border-slate-200"}`}>
                  {mediosDePagoLabels[p].replace(" bancaria", "")}
                </button>
              ))}
            </div>
            <input
              value={quien}
              onChange={(e) => setQuien(e.target.value.slice(0, 30))}
              placeholder="Tu nombre"
              aria-label="Nombre del cliente"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-700"
            />
            <button
              type="button"
              onClick={reservar}
              disabled={!listo}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white disabled:bg-slate-300"
            >
              <WaIcon className="h-4 w-4" />
              {listo ? "Reservar por WhatsApp" : "Elegí horario y poné tu nombre"}
            </button>
          </div>
        </Phone>

        {/* Negocio */}
        <Phone label={`VOS · TU WHATSAPP (${display.toUpperCase()})`}>
          <div className="flex h-[540px] flex-col bg-[#efeae2]">
            <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
              <WaIcon />
              <div>
                <p className="text-sm font-semibold">{display}</p>
                <p className="text-[11px] opacity-80">{turnos.length ? `${turnos.length} turno(s) nuevo(s)` : "Esperando reservas…"}</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {turnos.length === 0 && (
                <p className="mx-auto mt-20 max-w-[220px] rounded-xl bg-white/80 p-3 text-center text-xs text-slate-500">
                  Reservá un turno del lado izquierdo y mirá cómo te llega acá 👈
                </p>
              )}
              {turnos.map((t, i) => (
                <div key={i} className="space-y-2">
                  <div className="max-w-[88%] rounded-xl rounded-tl-none bg-white p-3 text-[13px] leading-relaxed text-slate-800 shadow-sm">
                    <p>¡Hola {display}! Quiero reservar un turno:</p>
                    <p className="mt-1">👤 {t.quien}</p>
                    <p>💼 {t.servicio}</p>
                    <p>📅 {t.fecha} · 🕒 {t.hora} hs</p>
                    <p>💳 {mediosDePagoLabels[t.pago]}</p>
                    <p className="text-right text-[10px] text-slate-400">ahora</p>
                  </div>
                  {t.estado === "confirmado" ? (
                    <div className="ml-auto max-w-[80%] rounded-xl rounded-tr-none bg-[#d9fdd3] p-3 text-[13px] text-slate-800 shadow-sm">
                      ✅ ¡Listo {t.quien}! Te espero {t.fecha} a las {t.hora}.<p className="text-right text-[10px] text-slate-400">✓✓</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTurnos((ts) => ts.map((x, j) => (j === i ? { ...x, estado: "confirmado" } : x)))}
                      className="ml-auto block rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow"
                    >
                      Confirmar con un toque
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-black/5 bg-white px-4 py-2 text-[11px] text-slate-500">
              {ultimo ? `Último: ${ultimo.quien} · ${ultimo.hora} hs` : "Agenda de hoy · 2 turnos ya tomados"}
            </div>
          </div>
        </Phone>
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">Simulación con datos de ejemplo. El mensaje es igual al que te llega en la vida real.</p>
    </Section>
  );
}
