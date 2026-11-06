import { formatPrecio } from "@/config/negocios";

export const PAGO_LABEL = ["Efectivo", "Transferencia", "Mercado Pago"];
export const PAGO_ICON = ["💵", "🏦", "📱"];
export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const minAHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function fechaCorta(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number);
  const f = new Date(y, mo - 1, d);
  const hoy = new Date();
  const man = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  if (f.toDateString() === hoy.toDateString()) return "Hoy";
  if (f.toDateString() === man.toDateString()) return "Mañana";
  const s = f.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export { formatPrecio };
