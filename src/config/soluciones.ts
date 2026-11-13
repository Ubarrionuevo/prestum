import type { Faq } from "./types";
import type { Funcion } from "@/lib/funciones";

/**
 * SOLUCIONES → /funciones/<slug>
 * Páginas comerciales por FUNCIÓN (no por rubro): cada una apunta a una búsqueda de dueño
 * ("cobrar seña barbería", "recordatorio de turnos por WhatsApp"…) y tiene un bloque por cada
 * rubro foco. El blog y el glosario informan; estas páginas venden. Solo funciones reales.
 */

export interface Solucion {
  slug: string;
  funcion: Funcion;
  /** Nombre corto (menú, footer, tarjetas). */
  nombre: string;
  emoji: string;
  /** <title> sin la marca. */
  titulo: string;
  /** Meta description (140–160). */
  descripcion: string;
  eyebrow: string;
  h1: string;
  bajada: string;
  /** El problema, en el idioma del dueño. */
  problema: { titulo: string; texto: string[] };
  /** Cómo lo resuelve Prestum (pasos reales). */
  pasos: Array<{ titulo: string; texto: string }>;
  /** Un bloque por rubro foco (slug del rubro → texto). */
  porRubro: Record<"barberias" | "peluquerias" | "esteticistas", string>;
  faqs: Faq[];
  blog?: string;
  glosario: string[];
  keywords: string[];
}

export const soluciones: Solucion[] = [
  {
    slug: "sena",
    funcion: "sena",
    nombre: "Cobrar seña",
    emoji: "💸",
    titulo: "Cobrar seña en barberías, peluquerías y estética: sistema de turnos con seña",
    descripcion: "Pedí seña al reservar, por transferencia a tu alias o con tu link de Mercado Pago, sin comisión. Si no la pagan a tiempo, el horario se libera solo.",
    eyebrow: "Seña por transferencia o Mercado Pago",
    h1: "Cobrá la seña al reservar y dejá de perder turnos",
    bajada:
      "Tu cliente reserva desde tu link, ve cuánto es la seña y a dónde pagarla. Si no se marca como pagada en el plazo que elegiste, el horario vuelve a quedar libre para otro.",
    problema: {
      titulo: "El turno que no viene es plata que no vuelve",
      texto: [
        "Un color de dos horas, un esculpido o un tratamiento facial que no se presenta es una franja entera del día que ya no podés vender. Y en un sábado lleno, cada hueco duele el doble.",
        "Pedir seña por WhatsApp a mano funciona, pero es otra conversación más: pasar el alias, esperar el comprobante, acordarte de liberar el turno si no pagan.",
      ],
    },
    pasos: [
      { titulo: "Elegís cómo", texto: "Porcentaje del precio o monto fijo, con tu alias o CBU y, si querés, tu link de pago de Mercado Pago." },
      { titulo: "El cliente la ve antes de reservar", texto: "Sabe cuánto es, cómo pagarla y en cuánto tiempo, sin que tengas que explicarlo." },
      { titulo: "Se libera sola", texto: "Si no la marcás como pagada en el plazo que elegiste (de 30 minutos a 24 horas), el horario vuelve a estar disponible." },
      { titulo: "La plata va directo a tu cuenta", texto: "Prestum no toca el dinero ni cobra comisión por la seña." },
    ],
    porRubro: {
      barberias: "En un corte suele alcanzar con el recordatorio. La seña conviene en combos, servicios largos y en los horarios más pedidos de la semana, como el viernes a la tarde y el sábado.",
      peluquerias: "Es donde más rinde: color, mechas, balayage y alisados ocupan horas de agenda y producto. Una seña del 20% al 50% hace que el que reserva, venga.",
      esteticistas: "Uñas esculpidas o semipermanente, depilación láser, limpiezas faciales y tratamientos corporales: servicios largos o caros donde una ausencia sin aviso pesa mucho.",
    },
    faqs: [
      { q: "¿Es obligatorio pedir seña?", a: "No. Es 100% opcional: elegís si tus clientes reservan sin pagar o con seña, y lo podés cambiar cuando quieras." },
      { q: "¿Prestum cobra comisión por la seña?", a: "No. El cliente te paga directo a tu alias, CBU o link de Mercado Pago; Prestum no toca el dinero." },
      { q: "¿Qué pasa si el cliente no paga?", a: "Pasado el plazo que elegiste, el turno se cancela solo y el horario vuelve a quedar libre en tu link." },
      { q: "¿En qué plan está la seña?", a: "Desde el plan Básico. El plan Gratis incluye el link de reservas sin seña." },
    ],
    blog: "cobrar-sena-turnos",
    glosario: ["sena", "no-show"],
    keywords: ["cobrar seña barbería", "seña para turnos", "sistema de turnos con seña", "seña peluquería", "seña centro de estética", "turnos con seña mercado pago"],
  },
  {
    slug: "recordatorios-whatsapp",
    funcion: "recordatorios",
    nombre: "Recordatorios por WhatsApp",
    emoji: "🔔",
    titulo: "Recordatorios de turnos por WhatsApp para barberías, peluquerías y estética",
    descripcion: "Mandá el recordatorio del turno desde tu propio WhatsApp con un toque, con tu texto. Menos olvidos y menos ausencias, sin bots ni la API de WhatsApp.",
    eyebrow: "Recordatorios con un toque",
    h1: "Recordá cada turno por WhatsApp con un toque",
    bajada:
      "En cada turno tocás “Recordar” y se abre tu WhatsApp con el mensaje armado: nombre, día, hora y servicio. Sale desde tu número, el que tus clientes ya conocen.",
    problema: {
      titulo: "La mayoría de las ausencias son olvidos",
      texto: [
        "El cliente reservó hace dos semanas y se le pasó. Un mensaje a tiempo le recuerda el turno y, si no puede ir, te avisa y liberás el horario para otro.",
        "Escribir cada recordatorio a mano, buscando el número y el horario de cada uno, se termina dejando de hacer en los días de más trabajo.",
      ],
    },
    pasos: [
      { titulo: "Escribís tu mensaje una vez", texto: "Con {nombre}, {negocio}, {fecha}, {hora} y {servicio}, que se completan solos en cada turno." },
      { titulo: "Tocás “Recordar”", texto: "Se abre WhatsApp con el mensaje listo para ese cliente; lo enviás vos, desde tu número." },
      { titulo: "El panel te avisa", texto: "Ves cuántos turnos de mañana todavía no recordaste, para que no se escape ninguno." },
    ],
    porRubro: {
      barberias: "El cliente de barbería vuelve cada 2 o 3 semanas y reserva con tiempo: el recordatorio del día anterior es lo que hace que no se le pase el corte.",
      peluquerias: "En servicios largos, un olvido es medio día perdido. El recordatorio con el servicio (“color y corte, jueves 17 h”) además evita confusiones de horario.",
      esteticistas: "Ideal para sesiones y tratamientos con varios turnos seguidos: cada recordatorio confirma la próxima sesión y te deja reprogramar a tiempo.",
    },
    faqs: [
      { q: "¿Se envían solos?", a: "No usamos bots: el mensaje se arma solo y vos lo enviás con un toque desde tu WhatsApp, así sale con tu número y tu cliente lo reconoce." },
      { q: "¿Necesito WhatsApp Business?", a: "No. Funciona con WhatsApp común o Business." },
      { q: "¿Puedo cambiar el texto?", a: "Sí, escribís tu propio mensaje y usás los campos que se completan solos." },
      { q: "¿En qué plan están los recordatorios?", a: "Desde el plan Básico." },
    ],
    blog: "reducir-ausentismo-turnos",
    glosario: ["recordatorio-de-turno", "no-show", "confirmacion-de-turno"],
    keywords: ["recordatorio de turnos por whatsapp", "recordatorio turnos barbería", "recordar turnos clientes", "sistema de turnos con recordatorio", "evitar ausencias turnos"],
  },
  {
    slug: "caja-y-comisiones",
    funcion: "caja",
    nombre: "Caja y comisiones",
    emoji: "🧮",
    titulo: "Caja diaria y comisiones por profesional para barberías y peluquerías",
    descripcion: "Cada turno cobrado entra solo a la caja con su medio de pago, y la comisión de cada barbero, peluquera o esteticista se calcula sola. Sin planillas a fin de mes.",
    eyebrow: "Caja y comisiones",
    h1: "La caja del día y las comisiones de tu equipo, sin planillas",
    bajada:
      "Marcás el turno como cobrado y el ingreso entra a la caja con su medio de pago. Con el % de cada profesional cargado, ves cuánto facturó cada uno y cuánto le corresponde.",
    problema: {
      titulo: "Las peleas de fin de mes no vienen de la cuenta",
      texto: [
        "Vienen de no tener anotado quién atendió cada turno y cómo se cobró: efectivo, transferencia y Mercado Pago mezclados en un cuaderno o en la memoria.",
        "Cuando cada turno queda asociado al profesional y al medio de pago en el momento, la comisión es una multiplicación y el arqueo cierra solo.",
      ],
    },
    pasos: [
      { titulo: "Cobrás el turno", texto: "Lo marcás como “Cobrado” con su medio de pago y el ingreso entra solo a la caja." },
      { titulo: "Cargás gastos", texto: "Tinturas, insumos o cualquier egreso, en segundos." },
      { titulo: "Ves la caja", texto: "Ingresos, egresos y saldo de hoy, de los últimos 7 días o del mes, separados por medio de pago." },
      { titulo: "Comisiones solas", texto: "Cargás el % de cada profesional y ves lo que facturó cada uno y lo que le corresponde, en el período que elijas." },
    ],
    porRubro: {
      barberias: "El modelo más común es un porcentaje fijo por barbero. Cada corte queda asociado a quien lo hizo, así el cierre de mes es una cuenta y no una discusión.",
      peluquerias: "Con color y tratamientos se mezclan servicios caros y productos: registrar cada cobro en el momento evita diferencias entre lo que se hizo y lo que entró.",
      esteticistas: "Con varias esteticistas y servicios de precios muy distintos, ver lo facturado por profesional te muestra quién llena la agenda y cuánto le corresponde a cada una.",
    },
    faqs: [
      { q: "¿Cada profesional puede tener un porcentaje distinto?", a: "Sí, el porcentaje de comisión se configura por profesional." },
      { q: "¿Se calcula sobre el precio o sobre lo cobrado?", a: "Sobre los turnos marcados como cobrados: si un turno no se cobró, no suma a la caja ni a la comisión." },
      { q: "¿En qué plan están la caja y las comisiones?", a: "En el plan Premium, que además incluye profesionales ilimitados, lista de espera y fidelización." },
    ],
    blog: "calcular-comisiones-empleados",
    glosario: ["caja-diaria", "comisiones-por-profesional", "ticket-promedio"],
    keywords: ["comisiones barberos", "caja diaria barbería", "sistema de caja para peluquería", "calcular comisiones peluquería", "software de gestión para barberías"],
  },
  {
    slug: "lista-de-espera",
    funcion: "lista_espera",
    nombre: "Lista de espera",
    emoji: "⏳",
    titulo: "Lista de espera de turnos para barberías, peluquerías y estética",
    descripcion: "Si un día está lleno, tu cliente se anota en la lista de espera desde tu link. Cuando alguien cancela, el panel te avisa y le escribís con un toque.",
    eyebrow: "Lista de espera",
    h1: "Llená los huecos cuando alguien cancela",
    bajada:
      "Cuando un día está completo, el cliente se anota en la lista de espera desde tu link en vez de irse. Si se libera un turno, el panel te avisa “hay lugar” y le escribís por WhatsApp con un toque.",
    problema: {
      titulo: "Una cancelación a último momento es un hueco vacío",
      texto: [
        "Los días más pedidos se llenan rápido y los clientes que no consiguen lugar reservan en otro lado. Cuando alguien cancela, no hay tiempo de conseguir a otro.",
        "Con una lista de espera ya sabés a quién avisarle: el hueco se llena y el cliente que esperaba queda contento.",
      ],
    },
    pasos: [
      { titulo: "No hay horario que le sirva", texto: "En tu link, el cliente se anota en la lista de espera de ese día en vez de irse." },
      { titulo: "Alguien cancela", texto: "El panel te avisa que hay lugar para quien estaba esperando." },
      { titulo: "Le avisás con un toque", texto: "Se abre WhatsApp con el mensaje armado para ofrecerle el turno." },
    ],
    porRubro: {
      barberias: "Viernes a la tarde y sábados se llenan primero. La lista de espera convierte cada cancelación de último momento en un corte cobrado.",
      peluquerias: "Si cancela un color de dos horas, la lista de espera te deja ofrecer esa franja a quien ya quería venir ese día.",
      esteticistas: "Antes de fiestas, casamientos y vacaciones la agenda explota: la lista de espera junta a las clientas que no consiguieron lugar.",
    },
    faqs: [
      { q: "¿Se le avisa solo al cliente?", a: "El panel te muestra el aviso y el mensaje armado; vos lo enviás desde tu WhatsApp con un toque." },
      { q: "¿El cliente tiene que crear una cuenta para anotarse?", a: "No. Se anota desde tu link con su nombre y su WhatsApp." },
      { q: "¿En qué plan está la lista de espera?", a: "En el plan Premium." },
    ],
    blog: "reducir-ausentismo-turnos",
    glosario: ["lista-de-espera", "horarios-pico", "no-show"],
    keywords: ["lista de espera turnos", "lista de espera barbería", "cancelaciones de turnos", "llenar huecos agenda", "sistema de turnos con lista de espera"],
  },
];

export const getSolucion = (slug: string) => soluciones.find((s) => s.slug === slug);
export const solucionPath = (s: Pick<Solucion, "slug">) => `/funciones/${s.slug}`;
