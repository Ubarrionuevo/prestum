import type { Niche } from "../types";
import { TURNOS_GRATIS } from "@/config/planes";

/**
 * SUBRUBROS → /turnero/<slug>
 * Páginas para búsquedas que las 3 páginas de rubro no cubrían: el profesional que trabaja solo
 * (barbero, peluquero, cosmetóloga) y especialidades de estética (uñas, cejas y pestañas, depilación, masajes).
 * Cada una usa la demo, los planes y el registro de su rubro `base`: no crean rubros nuevos en la base.
 * Sin páginas por ciudad (/turnero/<subrubro>/<ciudad> redirige a la ciudad del rubro base).
 * La lista de slugs vive en SUBRUBROS (config/aliases.ts): mantener las dos sincronizadas.
 * Contenido ÚNICO por página: dolores, servicios y preguntas propios de cada oficio.
 */
export const subrubrosTurnero: Niche[] = [
  {
    slug: "barberos",
    base: "barberias",
    name: "Barberos",
    business: "barbería",
    emoji: "💈",
    seoTitle: "Agenda de turnos para barberos independientes",
    seoDescription:
      "Agenda de turnos online para barberos que trabajan solos, alquilan sillón o cortan a domicilio: tus clientes reservan desde Instagram y te llega a WhatsApp.",
    keywords: [
      "agenda para barberos",
      "app para barberos",
      "turnos para barberos",
      "agenda de turnos para barbero",
      "app de turnos para barberos independientes",
      "barbero a domicilio turnos",
    ],
    heroTitle: "Turnos online para barberos",
    heroSubtitle:
      "Para el barbero que trabaja solo, alquila un sillón o corta a domicilio: tu propio link de reservas, tus horarios y tus clientes, sin depender de la agenda del local.",
    pains: [
      "Contestar “¿tenés lugar hoy?” con la máquina en la mano.",
      "Tus clientes anotados en el chat y no en una agenda.",
      "Si cambiás de barbería, tus clientes no saben dónde encontrarte.",
    ],
    benefits: [
      {
        title: "Tu link, tus clientes",
        text: "El link de reservas es tuyo: si alquilás sillón o cambiás de local, tus clientes te siguen reservando igual.",
      },
      {
        title: "Tus horarios, no los del local",
        text: "Cargás solo los días y horas que cortás. Si trabajás a domicilio, el cliente te deja la dirección al reservar.",
      },
      {
        title: "Plan Gratis para empezar",
        text: `El plan Gratis incluye hasta ${TURNOS_GRATIS} turnos por mes, sin tarjeta y sin comisión por turno.`,
      },
    ],
    examples: ["Corte", "Corte + barba", "Perfilado", "Corte a domicilio"],
    faqs: [
      {
        q: "¿Sirve si alquilo un sillón en una barbería?",
        a: "Sí. Tenés tu propio link y tu propia agenda, independiente de la del local. Tus clientes reservan con vos y el turno te llega a tu WhatsApp.",
      },
      {
        q: "¿Puedo dar turnos a domicilio?",
        a: "Sí. Cargás el servicio a domicilio con su precio y su duración (sumando el viaje) y el cliente te deja la dirección en la reserva.",
      },
      {
        q: "¿Qué pasa si después sumo otro barbero?",
        a: "Con un plan pago lo agregás desde el panel con sus propios horarios, y el cliente elige con quién cortarse sin que cambie tu link.",
      },
    ],
  },
  {
    slug: "peluqueros",
    base: "peluquerias",
    name: "Peluqueros",
    business: "peluquería",
    emoji: "✂️",
    seoTitle: "Agenda de turnos para peluqueros y peluqueras",
    seoDescription:
      "Agenda de turnos para peluqueros y peluqueras que trabajan solos, en casa o a domicilio: corte, color y peinados con su duración, y la reserva te llega a WhatsApp.",
    keywords: [
      "agenda para peluqueros",
      "app para peluqueros",
      "turnos para peluqueras",
      "agenda para peluquera independiente",
      "app de turnos para peluquera a domicilio",
      "agenda de turnos peluquería en casa",
    ],
    heroTitle: "Turnos online para peluqueros y peluqueras",
    heroSubtitle:
      "Si atendés sola, en tu casa o a domicilio: tu clienta elige corte, color o peinado, ve cuánto dura y cuánto sale, y reserva el horario que te queda libre.",
    pains: [
      "Coordinar un color de tres horas por mensaje, entre clienta y clienta.",
      "Peinados de fiesta que se juntan todos el mismo sábado.",
      "No saber a qué dirección vas si trabajás a domicilio.",
    ],
    benefits: [
      {
        title: "La duración justa de cada trabajo",
        text: "Un color, un alisado o un peinado ocupan su tiempo real: el link solo ofrece horarios donde entra completo.",
      },
      {
        title: "Atención en casa o a domicilio",
        text: "Si atendés en tu casa mandás la dirección al confirmar; si vas a domicilio, la clienta te deja la suya.",
      },
      {
        title: "Seña para los trabajos largos",
        text: "Opcional: asegurá color, alisado o peinados de evento con una seña.",
      },
    ],
    examples: ["Corte y brushing", "Color", "Alisado", "Peinado de fiesta"],
    faqs: [
      {
        q: "¿Sirve si trabajo sola desde mi casa?",
        a: "Sí, es justamente para eso: tenés tu link, tus horarios y tus servicios, y la dirección se la mandás a la clienta al confirmar el turno.",
      },
      {
        q: "¿Puedo pedir seña para peinados de fiesta?",
        a: "Sí. La seña es opcional y la podés pedir solo en los servicios largos o en fechas de mucha demanda.",
      },
      {
        q: "¿Mis clientas tienen que bajar una app?",
        a: "No. Reservan desde un link en el navegador del celular, sin crear cuenta.",
      },
    ],
  },
  {
    slug: "cosmetologas",
    base: "esteticistas",
    name: "Cosmetólogas y esteticistas",
    business: "gabinete de estética",
    emoji: "🧴",
    seoTitle: "Agenda de turnos para cosmetólogas y esteticistas",
    seoDescription:
      "Agenda de turnos para cosmetólogas y esteticistas independientes: limpiezas faciales, peelings y tratamientos por sesión, con la reserva directo a tu WhatsApp.",
    keywords: [
      "agenda para cosmetólogas",
      "turnos para esteticistas",
      "app para esteticistas",
      "agenda para esteticista independiente",
      "sistema de turnos para gabinete de estética",
      "turnos cosmetología",
    ],
    heroTitle: "Turnos online para cosmetólogas y esteticistas",
    heroSubtitle:
      "Para la que atiende en su gabinete o en un consultorio compartido: tus pacientas eligen el tratamiento, ven la duración y el precio, y reservan cada sesión desde tu link.",
    pains: [
      "Tratamientos de varias sesiones que hay que reagendar uno por uno.",
      "Consultas por Instagram que preguntan el precio y no reservan.",
      "Gabinete compartido con días y horarios que cambian.",
    ],
    benefits: [
      {
        title: "Tratamientos por sesión",
        text: "La pacienta reserva cada sesión desde el mismo link, cuando le queda cómodo.",
      },
      {
        title: "Tu catálogo con precios",
        text: "Limpieza facial, peeling, dermaplaning, masajes faciales: cada uno con su tiempo y su valor.",
      },
      {
        title: "Solo los días que tenés el gabinete",
        text: "Si compartís consultorio, cargás tus días y horarios y el link no ofrece nada fuera de eso.",
      },
    ],
    examples: ["Limpieza facial profunda", "Peeling", "Dermaplaning", "Tratamiento por sesiones"],
    faqs: [
      {
        q: "¿Sirve si alquilo un gabinete algunos días?",
        a: "Sí. Cargás solo los días y horarios en que atendés y el link ofrece únicamente esos turnos.",
      },
      {
        q: "¿Guarda historia clínica o fichas de tratamientos?",
        a: "No: Prestum Turnos maneja la agenda, las reservas, los recordatorios, la seña y la caja. No es un software de historia clínica.",
      },
      {
        q: "¿La pacienta puede reservar todas las sesiones?",
        a: "Sí, vuelve a usar el mismo link para cada sesión y elige el horario que le queda mejor.",
      },
    ],
  },
  {
    slug: "manicuras",
    base: "esteticistas",
    name: "Manicuras y uñas",
    business: "salón de uñas",
    emoji: "💅",
    seoTitle: "Agenda de turnos para manicuras y salones de uñas",
    seoDescription:
      "Agenda de turnos para manicuras y salones de uñas: semipermanente, esculpidas, kapping y service con su duración real, y la reserva te llega a WhatsApp.",
    keywords: [
      "agenda para manicuras",
      "turnos para uñas",
      "app para manicuras",
      "agenda para salón de uñas",
      "turnos uñas esculpidas",
      "sistema de turnos para manicura",
      "app de turnos para nail bar",
    ],
    heroTitle: "Turnos online para manicuras y salones de uñas",
    heroSubtitle:
      "Semipermanente, esculpidas, kapping o service: cada trabajo con su tiempo, para que una esculpida no se pise con la siguiente. Tu clienta reserva desde Instagram.",
    pains: [
      "Esculpidas que se estiran y te corren toda la tarde.",
      "Clientas que piden el service “cuando puedas” y nunca cierran día.",
      "Precios que cambian según el largo o el diseño y hay que explicarlos por chat.",
    ],
    benefits: [
      {
        title: "Cada técnica con su duración",
        text: "Semipermanente, esculpidas, kapping, retiro o service: el link solo ofrece horarios donde entra el trabajo.",
      },
      {
        title: "Recordatorio para el service",
        text: "Mandá el recordatorio por WhatsApp con un toque y que la clienta reserve el próximo service antes de irse.",
      },
      {
        title: "Precios claros antes de reservar",
        text: "Precio fijo o “desde” para los diseños, a la vista en tu link.",
      },
    ],
    examples: ["Semipermanente", "Esculpidas", "Kapping", "Service"],
    faqs: [
      {
        q: "¿Puedo cargar precios distintos según el largo o el diseño?",
        a: "Sí. Podés crear un servicio por variante o poner precio “desde” y aclarar en la descripción qué lo cambia.",
      },
      {
        q: "¿Sirve si hago uñas en mi casa?",
        a: "Sí. Tenés tu link y tus horarios, y le mandás la dirección a la clienta al confirmar.",
      },
      {
        q: "¿Puedo pedir seña para esculpidas?",
        a: "Sí, la seña es opcional y la activás solo en los servicios que quieras.",
      },
    ],
  },
  {
    slug: "cejas-y-pestanas",
    base: "esteticistas",
    name: "Cejas y pestañas",
    business: "estudio de cejas y pestañas",
    emoji: "👁️",
    seoTitle: "Agenda de turnos para lashistas, cejas y pestañas",
    seoDescription:
      "Agenda de turnos para lashistas y estudios de cejas y pestañas: extensiones, lifting, laminado y perfilado con su duración y la reserva a tu WhatsApp.",
    keywords: [
      "agenda para lashistas",
      "turnos extensiones de pestañas",
      "turnos lifting de pestañas",
      "agenda para cejas y pestañas",
      "app de turnos para lashista",
      "turnos perfilado de cejas",
    ],
    heroTitle: "Turnos online para cejas y pestañas",
    heroSubtitle:
      "Extensiones, service, lifting, laminado o perfilado: tu clienta elige el servicio, ve cuánto dura y reserva. Y el service de pestañas no se te pasa.",
    pains: [
      "Services de pestañas que la clienta se olvida de pedir a tiempo.",
      "Juegos completos de extensiones de dos horas que se superponen.",
      "Preguntas por Instagram sobre precios de cada técnica.",
    ],
    benefits: [
      {
        title: "Juego completo y service por separado",
        text: "Cada servicio con su duración: el juego completo bloquea su tiempo y el service el suyo.",
      },
      {
        title: "Recordale el próximo service",
        text: "Con el recordatorio por WhatsApp, la clienta vuelve antes de que se le caigan las extensiones.",
      },
      {
        title: "Técnicas y precios a la vista",
        text: "Clásicas, volumen, lifting, laminado o perfilado, con su precio en tu link.",
      },
    ],
    examples: ["Extensiones clásicas", "Service de pestañas", "Lifting", "Laminado de cejas"],
    faqs: [
      {
        q: "¿Puedo separar juego completo y service?",
        a: "Sí. Cada uno es un servicio con su precio y su duración, y la clienta elige el que corresponde.",
      },
      {
        q: "¿Me sirve si trabajo sola?",
        a: "Sí. Tenés tu propio link y tu agenda; si después sumás a alguien, cada una tiene sus horarios.",
      },
      {
        q: "¿Puedo pedir seña para el juego completo?",
        a: "Sí, la seña es opcional y la podés usar solo en los servicios largos.",
      },
    ],
  },
  {
    slug: "depilacion",
    base: "esteticistas",
    name: "Depilación",
    business: "centro de depilación",
    emoji: "🌿",
    seoTitle: "Agenda de turnos para centros de depilación",
    seoDescription:
      "Sistema de turnos para centros de depilación láser y con cera: cada zona con su duración y precio, sesiones programadas y la reserva directo a tu WhatsApp.",
    keywords: [
      "turnos depilación",
      "agenda para depilación láser",
      "sistema de turnos para centro de depilación",
      "turnos depilación definitiva",
      "app de turnos para depiladora",
    ],
    heroTitle: "Turnos online para tu centro de depilación",
    heroSubtitle:
      "Láser o cera, por zona o combo: cada servicio con su tiempo y su precio. Tu clienta reserva la próxima sesión desde el link y vos lo ves en WhatsApp.",
    pains: [
      "Sesiones de láser que hay que espaciar y la clienta se olvida.",
      "Combos de zonas con duraciones distintas que desordenan la agenda.",
      "Clientas que preguntan precio por zona antes de animarse.",
    ],
    benefits: [
      {
        title: "Precio y tiempo por zona",
        text: "Axilas, piernas, cavado o combos: cada uno con su duración y su valor.",
      },
      {
        title: "La próxima sesión, reservada",
        text: "Al terminar, la clienta saca el turno de la próxima sesión desde tu link.",
      },
      {
        title: "Varias cabinas o profesionales",
        text: "Cada profesional con su agenda, para que el láser y la cera no se pisen.",
      },
    ],
    examples: ["Depilación láser por zona", "Combo piernas + cavado", "Cera axilas", "Rostro"],
    faqs: [
      {
        q: "¿Puedo cargar precios por zona?",
        a: "Sí. Cada zona o combo es un servicio con su precio y su duración.",
      },
      {
        q: "¿Sirve para láser y cera a la vez?",
        a: "Sí. Podés separar los servicios y asignarlos a distintas profesionales, cada una con sus horarios.",
      },
      {
        q: "¿Le puedo recordar la próxima sesión?",
        a: "Sí. El recordatorio por WhatsApp está desde el plan Básico y lo mandás con un toque.",
      },
    ],
  },
  {
    slug: "masajistas",
    base: "esteticistas",
    name: "Masajistas",
    business: "espacio de masajes",
    emoji: "💆",
    seoTitle: "Agenda de turnos para masajistas y spa",
    seoDescription:
      "Agenda de turnos para masajistas y spa: descontracturantes, relajantes, drenaje y reflexología con su duración, y la reserva te llega a WhatsApp.",
    keywords: [
      "agenda para masajistas",
      "turnos para masajes",
      "app de turnos para masajista",
      "sistema de turnos para spa",
      "turnos masajes descontracturantes",
    ],
    heroTitle: "Turnos online para masajistas y spa",
    heroSubtitle:
      "Masajes de 30, 60 o 90 minutos, drenaje o reflexología: tu cliente elige el servicio y el horario, y vos no cortás una sesión para contestar el celular.",
    pains: [
      "No poder contestar el teléfono en medio de una sesión.",
      "Masajes de distinta duración que dejan huecos en la agenda.",
      "Gift cards y regalos que llegan sin turno asignado.",
    ],
    benefits: [
      {
        title: "Una duración por servicio",
        text: "30, 60 o 90 minutos: el link ofrece solo los horarios donde entra la sesión completa.",
      },
      {
        title: "Sin cortar la sesión",
        text: "El cliente reserva solo, a cualquier hora, y vos lo ves cuando terminás.",
      },
      {
        title: "Varias salas o masajistas",
        text: "Cada masajista con su agenda y sus horarios.",
      },
    ],
    examples: ["Masaje descontracturante 60 min", "Masaje relajante", "Drenaje linfático", "Reflexología"],
    faqs: [
      {
        q: "¿Puedo tener el mismo masaje en 30 y 60 minutos?",
        a: "Sí. Cargás cada duración como un servicio con su precio.",
      },
      {
        q: "¿Sirve si trabajo a domicilio?",
        a: "Sí. El cliente te deja la dirección al reservar y podés sumar el tiempo de viaje en la duración del servicio.",
      },
      {
        q: "¿Mis clientes tienen que descargar algo?",
        a: "No. Reservan desde tu link en el navegador del celular.",
      },
    ],
  },
];
