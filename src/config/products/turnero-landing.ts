import { OFERTA_CORTA } from "@/config/planes";

/**
 * CONTENIDO DE LA LANDING DEL TURNERO (home y páginas por rubro).
 *
 * - `demos`: cómo se ve la demo interactiva en cada rubro (servicios, precios, mensajes).
 *   La clave es el slug del nicho en turnero.ts. "default" se usa si un rubro no tiene demo.
 * - `testimonios` / `numeros`: la sección de reseñas. Dejalas VACÍAS hasta tener datos reales
 *   (publicar reseñas inventadas es engañoso y Google lo penaliza). Vacías → la sección muestra
 *   solo las garantías.
 */

export interface DemoServicio {
  nombre: string;
  duracion: number; // minutos
  precio: number; // ARS
  top?: boolean; // "Más pedido"
}

export interface RubroDemo {
  /** Cómo se nombra al negocio: "barbería", "consultorio". */
  negocio: string;
  /** Género gramatical de `negocio` (para "tu barbería está lista" / "tu consultorio está listo"). */
  genero: "f" | "m";
  /** Cómo se llama a quien reserva: "cliente", "paciente". */
  cliente: string;
  /** Nombres de ejemplo para probar en el hero. */
  ejemplos: string[];
  servicios: DemoServicio[];
  /** Servicios extra para prender/apagar en la sección "Armala a tu gusto". */
  extras: string[];
  /** Mensajes típicos que le llegan un día cargado (sección "Un día cualquiera"). */
  chats: Array<{ de: string; msg: string }>;
}

const chatsGenericos = (servicio: string) => [
  { de: "Lucas", msg: "Hola! tenés turno hoy?" },
  { de: "Mica", msg: "A qué hora cerrás?" },
  { de: "Juan", msg: `Cuánto sale ${servicio}?` },
  { de: "Flor", msg: "Me pasás lo de las 17 para mañana? 🙏" },
  { de: "Nico", msg: "Hay lugar el sábado a la mañana?" },
  { de: "Sofi", msg: "Aceptás transferencia?" },
  { de: "Tomi", msg: "Llego 10 min tarde perdón" },
  { de: "Caro", msg: "Sigue en pie lo de las 15?" },
];

export const demos: Record<string, RubroDemo> = {
  default: {
    negocio: "negocio",
    genero: "m",
    cliente: "cliente",
    ejemplos: ["Estudio Norte", "Espacio Lumen", "Punto Centro"],
    servicios: [
      { nombre: "Servicio básico", duracion: 30, precio: 15000, top: true },
      { nombre: "Servicio premium", duracion: 60, precio: 30000 },
    ],
    extras: ["Consulta", "Seguimiento", "Express"],
    chats: chatsGenericos("el turno"),
  },
  barberias: {
    negocio: "barbería",
    genero: "f",
    cliente: "cliente",
    ejemplos: ["Barbería Don Ramón", "Fade House", "La Navaja"],
    servicios: [
      { nombre: "Corte", duracion: 30, precio: 10000, top: true },
      { nombre: "Corte + barba", duracion: 45, precio: 14000 },
      { nombre: "Barba", duracion: 20, precio: 7000 },
    ],
    extras: ["Degradé", "Cejas", "Color", "Perfilado"],
    chats: chatsGenericos("el corte"),
  },
  peluquerias: {
    negocio: "peluquería",
    genero: "f",
    cliente: "clienta",
    ejemplos: ["Peluquería Valentina", "Studio Tijeras", "Salón Malva"],
    servicios: [
      { nombre: "Corte y brushing", duracion: 45, precio: 14000, top: true },
      { nombre: "Color", duracion: 120, precio: 35000 },
      { nombre: "Mechas / balayage", duracion: 180, precio: 60000 },
    ],
    extras: ["Alisado", "Nutrición", "Peinado", "Lavado"],
    chats: chatsGenericos("el color"),
  },
  odontologos: {
    negocio: "consultorio",
    genero: "m",
    cliente: "paciente",
    ejemplos: ["Dental Sonríe", "Consultorio Dra. Paz", "OdontoSur"],
    servicios: [
      { nombre: "Consulta y control", duracion: 30, precio: 25000, top: true },
      { nombre: "Limpieza dental", duracion: 45, precio: 35000 },
      { nombre: "Blanqueamiento", duracion: 60, precio: 90000 },
    ],
    extras: ["Urgencia", "Ortodoncia", "Extracción", "Arreglo"],
    chats: [
      { de: "Laura", msg: "Hola! tienen turno esta semana?" },
      { de: "Martín", msg: "Cuánto sale una limpieza?" },
      { de: "Ana", msg: "Me duele una muela, me atienden hoy?" },
      { de: "Pablo", msg: "Atienden por obra social?" },
      { de: "Vero", msg: "Puedo pasar el control al jueves?" },
      { de: "Diego", msg: "A qué hora abren el sábado?" },
      { de: "Sol", msg: "Cuánto sale el blanqueamiento?" },
      { de: "Gabi", msg: "Sigue en pie lo de las 11?" },
    ],
  },
  kinesiologos: {
    negocio: "consultorio",
    genero: "m",
    cliente: "paciente",
    ejemplos: ["Kine Movimiento", "Centro Rehabilitar", "Lic. Gómez Kinesio"],
    servicios: [
      { nombre: "Sesión de rehabilitación", duracion: 45, precio: 18000, top: true },
      { nombre: "Masaje descontracturante", duracion: 60, precio: 22000 },
      { nombre: "Drenaje linfático", duracion: 60, precio: 24000 },
    ],
    extras: ["RPG", "Evaluación inicial", "Punción seca", "Vendaje"],
    chats: [
      { de: "Carlos", msg: "Hola, tengo orden por 10 sesiones" },
      { de: "Lu", msg: "Tenés lugar mañana temprano?" },
      { de: "Marcos", msg: "Cuánto sale el masaje?" },
      { de: "Rocío", msg: "Puedo mover la del martes?" },
      { de: "Javi", msg: "Atendés por OSDE?" },
      { de: "Pili", msg: "Hacés drenaje linfático?" },
      { de: "Fer", msg: "Llego 5 min tarde" },
      { de: "Agus", msg: "Sigue lo del jueves a las 18?" },
    ],
  },
  esteticistas: {
    negocio: "centro de estética",
    genero: "m",
    cliente: "clienta",
    ejemplos: ["Bella Piel", "Estética Aura", "Glow Studio"],
    servicios: [
      { nombre: "Limpieza facial", duracion: 60, precio: 25000, top: true },
      { nombre: "Depilación láser", duracion: 30, precio: 20000 },
      { nombre: "Lifting de pestañas", duracion: 45, precio: 18000 },
    ],
    extras: ["Semipermanente", "Esculpidas", "Peeling", "Cejas"],
    chats: chatsGenericos("la limpieza facial"),
  },
  "peluqueria-canina": {
    negocio: "peluquería canina",
    genero: "f",
    cliente: "cliente",
    ejemplos: ["Patitas Felices", "Guau Spa", "Pelos & Huesos"],
    servicios: [
      { nombre: "Baño perro chico", duracion: 45, precio: 14000, top: true },
      { nombre: "Baño y corte grande", duracion: 90, precio: 26000 },
      { nombre: "Deslanado", duracion: 60, precio: 20000 },
    ],
    extras: ["Corte de uñas", "Limpieza de oídos", "Perfume", "Antipulgas"],
    chats: [
      { de: "Lucas", msg: "Hola! tenés lugar para un golden?" },
      { de: "Mica", msg: "Cuánto sale baño para un caniche?" },
      { de: "Juan", msg: "Lo pasan a buscar?" },
      { de: "Flor", msg: "Me pasás el turno de Toby para mañana?" },
      { de: "Nico", msg: "Hacés deslanado?" },
      { de: "Sofi", msg: "Aceptás transferencia?" },
      { de: "Tomi", msg: "A qué hora lo retiro?" },
      { de: "Caro", msg: "Sigue en pie lo de las 15?" },
    ],
  },
  "talleres-mecanicos": {
    negocio: "taller",
    genero: "m",
    cliente: "cliente",
    ejemplos: ["Taller El Pistón", "Mecánica Rivera", "Full Service Norte"],
    servicios: [
      { nombre: "Cambio de aceite y filtros", duracion: 60, precio: 45000, top: true },
      { nombre: "Alineación y balanceo", duracion: 60, precio: 30000 },
      { nombre: "Service completo", duracion: 180, precio: 120000 },
    ],
    extras: ["Frenos", "Diagnóstico", "Tren delantero", "Batería"],
    chats: [
      { de: "Raúl", msg: "Buenas, cuándo puedo llevar el auto?" },
      { de: "Mati", msg: "Cuánto sale el cambio de aceite?" },
      { de: "Jorge", msg: "Me hace ruido el freno, lo ven hoy?" },
      { de: "Sergio", msg: "Hacen alineación?" },
      { de: "Pato", msg: "Lo puedo dejar a las 8?" },
      { de: "Ale", msg: "Aceptan Mercado Pago?" },
      { de: "Dani", msg: "A qué hora lo retiro?" },
      { de: "Hugo", msg: "Sigue en pie lo del viernes?" },
    ],
  },
  psicologos: {
    negocio: "consultorio",
    genero: "m",
    cliente: "paciente",
    ejemplos: ["Lic. Martina Ruiz", "Espacio Terapéutico", "Consultorio Alma"],
    servicios: [
      { nombre: "Primera entrevista", duracion: 50, precio: 30000, top: true },
      { nombre: "Sesión presencial", duracion: 50, precio: 30000 },
      { nombre: "Sesión online", duracion: 50, precio: 28000 },
    ],
    extras: ["Terapia de pareja", "Orientación vocacional", "Adolescentes"],
    chats: [
      { de: "Paula", msg: "Hola, quería consultar por terapia" },
      { de: "Martín", msg: "Cuánto sale la sesión?" },
      { de: "Juli", msg: "Atendés online?" },
      { de: "Lean", msg: "Puedo pasar la del miércoles?" },
      { de: "Mora", msg: "Tenés horarios a la noche?" },
      { de: "Santi", msg: "Aceptás transferencia?" },
      { de: "Luz", msg: "Llego unos minutos tarde" },
      { de: "Fran", msg: "Sigue lo del jueves?" },
    ],
  },
  nutricionistas: {
    negocio: "consultorio",
    genero: "m",
    cliente: "paciente",
    ejemplos: ["Nutrí Vida", "Lic. Sosa Nutrición", "Plato Sano"],
    servicios: [
      { nombre: "Primera consulta", duracion: 60, precio: 30000, top: true },
      { nombre: "Control mensual", duracion: 30, precio: 20000 },
      { nombre: "Consulta online", duracion: 45, precio: 22000 },
    ],
    extras: ["Plan deportivo", "Antropometría", "Plan vegetariano"],
    chats: chatsGenericos("la primera consulta"),
  },
  // Uñas quedó dentro de Estética: se mantiene para las cuentas viejas con rubro "manicuria".
  manicuria: {
    negocio: "salón de uñas",
    genero: "m",
    cliente: "clienta",
    ejemplos: ["Nails by Cami", "Esmalte Studio", "Uñas Glam"],
    servicios: [
      { nombre: "Semipermanente", duracion: 60, precio: 15000, top: true },
      { nombre: "Esculpidas", duracion: 120, precio: 28000 },
      { nombre: "Kapping", duracion: 90, precio: 20000 },
    ],
    extras: ["Pedicuría", "Nail art", "Service", "Retiro"],
    chats: chatsGenericos("el semi"),
  },
  "lavaderos-de-autos": {
    negocio: "lavadero",
    genero: "m",
    cliente: "cliente",
    ejemplos: ["Lavadero Brillo", "Detailing Pro", "Auto Spa"],
    servicios: [
      { nombre: "Lavado exterior", duracion: 30, precio: 12000, top: true },
      { nombre: "Lavado completo", duracion: 60, precio: 22000 },
      { nombre: "Pulido y encerado", duracion: 180, precio: 80000 },
    ],
    extras: ["Tapizados", "Motor", "Ozono", "Ópticas"],
    chats: chatsGenericos("el lavado completo"),
  },
};

export const getDemo = (slug?: string) => (slug && demos[slug]) || demos.default;

/** Rubros que aparecen como "chips" en el hero de la home (slug del nicho + etiqueta corta). */
export const heroRubros: Array<{ slug: string; label: string }> = [
  { slug: "barberias", label: "Barbería" },
  { slug: "peluquerias", label: "Peluquería" },
  { slug: "esteticistas", label: "Estética" },
];

/* ------------------------------- PRECIOS ------------------------------- */
// Los planes y precios viven en Supabase (tablas `planes` y `ajustes`), con respaldo en src/config/planes.ts

/* ------------------------------- RESEÑAS ------------------------------- */
// Completar con datos REALES. Mientras estén vacías, la sección muestra solo las garantías.
export const numeros: Array<{ valor: string; label: string }> = [];
export const testimonios: Array<{ texto: string; autor: string; detalle: string }> = [];

export const garantias = [
  `${OFERTA_CORTA}, sin tarjeta`,
  "Sin comisión por turno",
  "Tus clientes no bajan ninguna app",
  "Hecho en Argentina · precios en pesos",
  "Soporte por WhatsApp, de persona a persona",
];
