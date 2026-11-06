import type { Plan } from "@/config/planes";

/** Funciones de los planes (mismos nombres que planes.funciones en la base). */
export type Funcion = "recordatorios" | "sena" | "lista_espera" | "caja" | "fidelizacion" | "reportes";

export const FUNCION_LABEL: Record<Funcion, string> = {
  recordatorios: "Recordatorios por WhatsApp",
  sena: "Seña",
  lista_espera: "Lista de espera",
  caja: "Caja y comisiones",
  fidelizacion: "Fidelización",
  reportes: "Reportes y exportación",
};

/** ¿La cuenta tiene esta función? En la prueba: todas. */
export function tieneFuncion(planes: Plan[], plan: string, pagoVigente: boolean, f: Funcion) {
  if (!pagoVigente) return true;
  return (planes.find((p) => p.id === plan)?.funciones ?? []).includes(f);
}

/** Nombre del plan más barato que incluye la función (para el mensaje "Disponible en…"). */
export function planMinimo(planes: Plan[], f: Funcion) {
  return [...planes].sort((a, b) => a.precio_mensual - b.precio_mensual).find((p) => (p.funciones ?? []).includes(f))?.nombre;
}

/** Arma el texto del recordatorio a partir de la plantilla del negocio. */
export const PLANTILLA_RECORDATORIO =
  "¡Hola {nombre}! Te recordamos tu turno en {negocio} el {fecha} a las {hora} hs. ¿Nos confirmás? ¡Gracias!";

export function textoRecordatorio(plantilla: string | null | undefined, datos: { nombre: string; negocio: string; fecha: string; hora: string; servicio: string }) {
  return (plantilla || PLANTILLA_RECORDATORIO)
    .replaceAll("{nombre}", datos.nombre)
    .replaceAll("{negocio}", datos.negocio)
    .replaceAll("{fecha}", datos.fecha)
    .replaceAll("{hora}", datos.hora)
    .replaceAll("{servicio}", datos.servicio);
}

/** Link de WhatsApp "con un toque" (abre el chat con el mensaje armado; no envía nada solo). */
export const waLink = (tel: string, texto: string) => `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
