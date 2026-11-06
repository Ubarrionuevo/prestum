import type { Horarios, MedioDePago, Negocio, Servicio } from "@/config/negocios";
import { formatPrecio, mediosDePagoLabels } from "@/config/negocios";

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Días con atención dentro de la ventana de reserva. */
export function diasDisponibles(horarios: Horarios, diasAnticipacion: number, hoy = new Date()): Date[] {
  const out: Date[] = [];
  for (let i = 0; i <= diasAnticipacion; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    const rangos = horarios[d.getDay() as keyof Horarios];
    if (rangos && rangos.length) out.push(d);
  }
  return out;
}

/** Horarios de inicio posibles para un día y un servicio (según su duración). */
export function horariosDelDia(horarios: Horarios, dia: Date, duracion: number, ahora = new Date()): string[] {
  const rangos = horarios[dia.getDay() as keyof Horarios] ?? [];
  const esHoy = dia.toDateString() === ahora.toDateString();
  const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const paso = Math.min(duracion, 30); // grilla cada 30 min (o menos si el servicio es más corto)
  const slots: string[] = [];
  for (const [desde, hasta] of rangos) {
    for (let t = toMin(desde); t + duracion <= toMin(hasta); t += paso) {
      if (!esHoy || t > minAhora + 30) slots.push(toHHMM(t));
    }
  }
  return slots;
}

export function formatFechaLarga(d: Date) {
  const s = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Arma el link de WhatsApp con la reserva lista para enviar. */
export function linkWhatsAppReserva(args: {
  negocio: Pick<Negocio, "nombre" | "whatsapp">;
  servicio: Servicio;
  dia: Date;
  hora: string;
  pago: MedioDePago;
  nombreCliente: string;
  nota?: string;
  /** Profesional / cancha / sala asignado. */
  recurso?: string;
  etiqueta?: string;
  /** Líneas extra (seña, turno gratis…). */
  extras?: string[];
}) {
  const lineas = [
    `¡Hola ${args.negocio.nombre}! Quiero reservar un turno:`,
    ``,
    `👤 Nombre: ${args.nombreCliente}`,
    `💼 Servicio: ${args.servicio.nombre} (${formatPrecio(args.servicio.precio)})`,
    ...(args.recurso ? [`🧑 ${args.etiqueta ?? "Con"}: ${args.recurso}`] : []),
    `📅 Día: ${formatFechaLarga(args.dia)}`,
    `🕒 Hora: ${args.hora} hs`,
    `💳 Pago: ${mediosDePagoLabels[args.pago]}`,
  ];
  if (args.nota?.trim()) lineas.push(`📝 Nota: ${args.nota.trim()}`);
  if (args.extras?.length) lineas.push(...args.extras);
  lineas.push(``, `¿Me lo confirmás? ¡Gracias!`);
  return `https://wa.me/${args.negocio.whatsapp}?text=${encodeURIComponent(lineas.join("\n"))}`;
}
