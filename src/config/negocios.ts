/**
 * NEGOCIOS (clientes de Prestum que usan el turnero)
 * Cada uno tiene su link: https://www.prestum.com.ar/<slug>
 *
 * Más adelante esto puede pasar a una base de datos; la forma de los datos se mantiene.
 */

export type MedioDePago = "efectivo" | "transferencia" | "mercadopago";

export const mediosDePagoLabels: Record<MedioDePago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia bancaria",
  mercadopago: "Mercado Pago",
};

export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  /** Precio en pesos argentinos. */
  precio: number;
  /** Duración en minutos (define el largo de cada turno). */
  duracion: number;
}

/** Horario por día de la semana. 0 = domingo … 6 = sábado. Rangos "HH:MM". */
export type Horarios = Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, Array<[string, string]>>>;

export interface Negocio {
  slug: string;
  nombre: string;
  rubro: string; // slug del nicho del turnero (ej: "barberias")
  descripcion: string;
  direccion?: string;
  /** WhatsApp del negocio, formato internacional sin "+" ni espacios. Ej: 5491123456789 */
  whatsapp: string;
  servicios: Servicio[];
  mediosDePago: MedioDePago[];
  horarios: Horarios;
  /** Cuántos días hacia adelante se puede reservar. */
  diasAnticipacion: number;
  /** Profesionales / canchas / salas (opcional). */
  recursos?: Array<{ id: string; nombre: string; servicios: string[]; horarios: null }>;
  recursoEtiqueta?: string;
  /** Si false, la página lleva noindex (recomendado para negocios que no quieren aparecer en Google). */
  indexable: boolean;
}

export const negocios: Negocio[] = [
  {
    slug: "demo",
    nombre: "Negocio Demo",
    rubro: "barberias",
    descripcion: "Así ven tus clientes el turnero. Elegí un servicio y probá el flujo completo.",
    direccion: "Buenos Aires, Argentina",
    whatsapp: "5491100000000", // ← reemplazar por el WhatsApp real
    servicios: [
      {
        id: "basico",
        nombre: "Servicio básico",
        descripcion: "Turno estándar.",
        precio: 15000,
        duracion: 30,
      },
      {
        id: "premium",
        nombre: "Servicio premium",
        descripcion: "Turno completo con todos los extras.",
        precio: 30000,
        duracion: 60,
      },
    ],
    mediosDePago: ["efectivo", "transferencia", "mercadopago"],
    horarios: {
      1: [["09:00", "13:00"], ["15:00", "19:00"]],
      2: [["09:00", "13:00"], ["15:00", "19:00"]],
      3: [["09:00", "13:00"], ["15:00", "19:00"]],
      4: [["09:00", "13:00"], ["15:00", "19:00"]],
      5: [["09:00", "13:00"], ["15:00", "19:00"]],
      6: [["09:00", "13:00"]],
    },
    diasAnticipacion: 21,
    recursoEtiqueta: "Profesional",
    recursos: [
      { id: "fede", nombre: "Fede", servicios: [], horarios: null },
      { id: "juan", nombre: "Juan", servicios: [], horarios: null },
      { id: "emi", nombre: "Emi", servicios: ["basico"], horarios: null },
    ],
    indexable: false,
  },
];

export function getNegocio(slug: string) {
  return negocios.find((n) => n.slug === slug);
}

export function formatPrecio(precio: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(precio);
}
