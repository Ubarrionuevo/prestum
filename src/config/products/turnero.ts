import type { Product } from "../types";
import { TURNOS_GRATIS } from "@/config/planes";

/**
 * TURNERO ONLINE
 * Para sumar un rubro nuevo: agregar un objeto a `niches`.
 * Se genera solo: página /turnero/<slug>, entrada en sitemap, links internos y JSON-LD.
 * Escribí contenido ÚNICO por rubro (Google penaliza páginas casi iguales).
 */
export const turnero: Product = {
  slug: "turnero",
  name: "Turnero online",
  brandName: "Prestum Turnos",
  demoPath: "/demo",
  status: "activo",
  emoji: "📅",
  seoTitle: "Sistema de turnos para barberías, peluquerías y estética",
  seoDescription:
    "Sistema de turnos online para barberías, peluquerías y centros de estética de Argentina. Tus clientes reservan solos desde Instagram y el turno te llega directo a WhatsApp.",
  keywords: [
    "sistema de turnos para barberías",
    "sistema de turnos para peluquerías",
    "sistema de turnos para centros de estética",
    "sistema de turnos gratis",
    "turnero gratis",
    "turnero online",
    "sistema de turnos online",
    "agenda de turnos",
    "reservar turnos por WhatsApp",
    "app de turnos",
    "turnos online Argentina",
  ],
  heroTitle: "Tu agenda de turnos online para barbería, peluquería o estética",
  heroSubtitle:
    "Compartís tu link, tu cliente elige servicio, día y horario, y el turno te llega armado a WhatsApp. Sin apps, sin registros y sin comisiones.",
  applicationCategory: "BusinessApplication",
  benefits: [
    {
      title: "Un link y listo",
      text: "Lo pegás en tu bio de Instagram, Google Maps o estado de WhatsApp. Funciona en cualquier celular.",
    },
    {
      title: "La reserva llega a tu WhatsApp",
      text: "Con nombre, servicio, fecha, hora y medio de pago. Confirmás con un mensaje.",
    },
    {
      title: "Servicios y precios claros",
      text: "Tu cliente ve qué ofrecés y cuánto sale antes de reservar. Menos preguntas, menos idas y vueltas.",
    },
    {
      title: "Elegí cómo cobrar",
      text: "Efectivo, transferencia o Mercado Pago. El cliente indica cómo va a pagar al reservar.",
    },
  ],
  faqs: [
    {
      q: "¿Mis clientes tienen que descargar una app?",
      a: "No. Entran desde un link en el navegador del celular, eligen el turno y se abre WhatsApp con el mensaje armado.",
    },
    {
      q: "¿Cómo me llega la reserva?",
      a: "Por WhatsApp, a tu número. El mensaje incluye el servicio, la fecha, el horario, el medio de pago y el nombre del cliente.",
    },
    {
      q: "¿Puedo cargar mis propios servicios y precios?",
      a: "Sí. Desde tu panel cargás tus servicios, duraciones, precios, días y horarios. Los cambios se ven al instante en tu link.",
    },
    {
      q: "¿Es gratis?",
      a: `Sí. El plan Gratis incluye hasta ${TURNOS_GRATIS} turnos por mes, sin tarjeta y sin vencimiento. Te registrás con tu email y tu WhatsApp y tu link queda andando en un minuto. Si necesitás más turnos o más profesionales, pasás a un plan pago.`,
    },
    {
      q: "¿Cuánto cuesta?",
      a: `Es gratis hasta ${TURNOS_GRATIS} turnos por mes. Si necesitás más, hay dos planes con precio fijo en pesos y pago mensual: Básico y Premium. Sin contrato y sin comisión por turno. Mirá los valores en la página de precios.`,
    },
    {
      q: "¿Para qué negocios está pensado?",
      a: "Para barberías, peluquerías y centros de estética (incluye uñas y pestañas). También funciona para consultorios, peluquerías caninas, talleres y otros negocios que trabajan con turnos.",
    },
  ],
  niches: [
    // ---------------- RUBROS FOCO (ver RUBROS_FOCO en config/aliases.ts) ----------------
    {
      slug: "barberias",
      name: "Barberías",
      business: "barbería",
      emoji: "💈",
      seoTitle: "Sistema de turnos para barberías con reservas por WhatsApp",
      seoDescription:
        "Software de turnos para dueños de barberías: tus clientes reservan corte o barba desde Instagram, cada barbero tiene su agenda y el turno te llega a WhatsApp.",
      keywords: [
        "sistema de turnos para barberías",
        "app de turnos para barbería",
        "agenda para barberos",
        "software para barberías",
        "turnero barbería",
      ],
      heroTitle: "Turnos online para tu barbería",
      heroSubtitle:
        "Corte, barba o combo: tu cliente reserva en 30 segundos desde Instagram, elige con qué barbero y vos lo ves en WhatsApp. Sin contestar mensajes con la máquina en la mano.",
      pains: [
        "El sillón vacío a las 15 y desbordado a las 19.",
        "Responder mensajes con las manos ocupadas.",
        "Cada barbero anotando en su cuaderno y turnos pisados.",
        "Clientes que caen sin turno y se van.",
      ],
      benefits: [
        {
          title: "Una agenda por barbero",
          text: "Cada barbero con sus días y horarios. El cliente elige con quién se corta o toma el primero libre.",
        },
        {
          title: "Combos y precios a la vista",
          text: "Corte + barba, degradé, color, perfilado: cada uno con su precio y su duración.",
        },
        {
          title: "Llená las horas flojas",
          text: "Tus clientes ven los horarios libres y eligen solos, también a la noche o el domingo.",
        },
      ],
      examples: ["Corte clásico", "Corte + barba", "Perfilado de barba", "Color"],
      faqs: [
        {
          q: "¿Puedo tener una agenda por barbero?",
          a: "Sí. Cada barbero tiene sus propios días y horarios, y el cliente elige con quién atenderse o toma el primer turno libre.",
        },
        {
          q: "¿Puedo ver la caja y las comisiones de cada barbero?",
          a: "Sí, en el plan Premium tenés la caja del día y las comisiones de cada barbero.",
        },
        {
          q: "¿Funciona con mi Instagram?",
          a: "Sí, es un link que va en tu bio, en tus historias o en las respuestas rápidas.",
        },
      ],
    },
    {
      slug: "peluquerias",
      name: "Peluquerías",
      business: "peluquería",
      emoji: "✂️",
      seoTitle: "Sistema de turnos para peluquerías y salones de belleza",
      seoDescription:
        "Software de turnos para dueños de peluquerías: tus clientas reservan corte, color o alisado con la duración justa de cada servicio y el turno te llega a WhatsApp.",
      keywords: [
        "sistema de turnos para peluquerías",
        "agenda para peluquería",
        "app de turnos para peluquería",
        "software para peluquerías",
        "turnero salón de belleza",
      ],
      heroTitle: "Turnos online para tu peluquería",
      heroSubtitle:
        "Corte, color, mechas o alisado: cada servicio con su duración, para que un color de tres horas no se pise con un brushing. Tu clienta reserva desde Instagram y vos lo ves en WhatsApp.",
      pains: [
        "Un color largo que se pisa con los turnos de la tarde.",
        "Clientas que preguntan el precio por mensaje y nunca reservan.",
        "La agenda en un cuaderno que solo entiende una persona.",
      ],
      benefits: [
        {
          title: "Cada servicio con su duración",
          text: "Un alisado no dura lo mismo que un corte: el link solo ofrece los horarios donde el trabajo entra completo.",
        },
        {
          title: "Una agenda por estilista",
          text: "Cada peluquera o peluquero con sus horarios. La clienta elige con quién atenderse.",
        },
        {
          title: "Seña para trabajos largos",
          text: "Si querés, pedí una seña para asegurar los turnos de color o alisado. Si no se paga a tiempo, el horario se libera solo.",
        },
      ],
      examples: ["Corte y brushing", "Color", "Mechas o balayage", "Alisado"],
      faqs: [
        {
          q: "¿Cada peluquera puede tener su propia agenda?",
          a: "Sí. Cada profesional tiene sus días y horarios, y la clienta elige con quién atenderse o toma el primer turno libre.",
        },
        {
          q: "¿Puedo pedir seña para color o alisado?",
          a: "Sí. La seña es opcional: podés pedirla para asegurar los turnos largos y, si no se paga en el plazo que elegís, el horario se libera solo.",
        },
      ],
    },
    {
      slug: "esteticistas",
      name: "Centros de estética",
      business: "centro de estética",
      emoji: "✨",
      seoTitle: "Sistema de turnos para centros de estética y uñas",
      seoDescription:
        "Software de turnos para centros de estética, cosmetólogas y manicuras: tus clientas reservan facial, depilación o semipermanente desde Instagram y te llega a WhatsApp.",
      keywords: [
        "sistema de turnos para centros de estética",
        "agenda para estética",
        "app de turnos para cosmetólogas",
        "turnero para manicuras",
        "agenda para salón de uñas",
      ],
      heroTitle: "Reservas online para tu centro de estética",
      heroSubtitle:
        "Faciales, depilación, pestañas o uñas: poné el link en tu Instagram y tus clientas eligen el tratamiento, ven el precio y reservan el horario. Vos lo recibís en WhatsApp.",
      pains: [
        "Mensajes de Instagram preguntando precios todo el día.",
        "Clientas que preguntan y nunca concretan.",
        "Trabajos largos (esculpidas, láser) que se superponen.",
        "Agenda en papel o en notas del celular.",
      ],
      benefits: [
        {
          title: "Link para la bio de Instagram",
          text: "Convertí seguidoras en turnos sin responder cada mensaje.",
        },
        {
          title: "Catálogo de tratamientos",
          text: "Faciales, corporales, depilación, pestañas y uñas, cada uno con su precio y su duración.",
        },
        {
          title: "Pago informado al reservar",
          text: "Sabés si viene a pagar en efectivo o si te transfiere.",
        },
      ],
      examples: ["Limpieza facial", "Depilación láser", "Lifting de pestañas", "Semipermanente", "Esculpidas"],
      faqs: [
        {
          q: "¿Sirve también para manicuras y salones de uñas?",
          a: "Sí. Cargás semipermanente, esculpidas, kapping o service, cada uno con su tiempo y su precio, y tus clientas reservan igual que un facial.",
        },
        {
          q: "¿Lo puedo poner en Instagram?",
          a: "Sí, es un link común: va en la bio, en historias destacadas o en respuestas rápidas.",
        },
        {
          q: "¿Sirve si trabajo desde mi casa?",
          a: "Sí, mandás la dirección por WhatsApp al confirmar el turno.",
        },
      ],
    },
    // ---------------- RUBROS SECUNDARIOS ("también sirve para…", sin páginas por ciudad) ----------------
    {
      slug: "odontologos",
      name: "Odontólogos",
      business: "consultorio odontológico",
      emoji: "🦷",
      seoTitle: "Sistema de turnos para odontólogos y consultorios dentales",
      seoDescription:
        "Agenda de turnos online para odontólogos. Tus pacientes reservan limpieza, control o urgencia desde un link y el turno te llega por WhatsApp.",
      keywords: [
        "turnero para odontólogos",
        "agenda odontológica online",
        "sistema de turnos consultorio dental",
        "turnos dentista online",
      ],
      heroTitle: "Turnos online para tu consultorio odontológico",
      heroSubtitle:
        "Tus pacientes eligen control, limpieza o consulta, el día y el horario. La reserva te llega por WhatsApp lista para confirmar.",
      pains: [
        "La secretaria pasa la mañana contestando “¿tenés turno?”.",
        "Pacientes que no saben cuánto sale una consulta y no reservan.",
        "Huecos en la agenda que nadie aprovecha.",
      ],
      benefits: [
        {
          title: "Consultas y tratamientos separados",
          text: "Control, limpieza, blanqueamiento o urgencia, cada uno con su duración y precio.",
        },
        {
          title: "Menos tiempo en el teléfono",
          text: "El paciente reserva solo, a cualquier hora, y vos confirmás con un mensaje.",
        },
        {
          title: "Medio de pago informado",
          text: "Sabés de antemano si el paciente paga en efectivo, transferencia o Mercado Pago.",
        },
      ],
      examples: ["Consulta y control", "Limpieza dental", "Blanqueamiento", "Urgencia odontológica"],
      faqs: [
        {
          q: "¿Puedo tener distintos precios para consulta y tratamientos?",
          a: "Sí, cada servicio tiene su propio precio y duración, y el paciente lo ve antes de reservar.",
        },
        {
          q: "¿Sirve si atiendo en más de un consultorio?",
          a: "Sí, podés tener un link por consultorio con sus propios días y horarios.",
        },
      ],
    },
    {
      slug: "kinesiologos",
      name: "Kinesiólogos",
      business: "consultorio de kinesiología",
      emoji: "💪",
      seoTitle: "Sistema de turnos para kinesiólogos y fisioterapeutas",
      seoDescription:
        "Sistema de turnos para kinesiólogos: tus pacientes reservan sesiones de rehabilitación o masajes desde un link y te llega la reserva a WhatsApp.",
      keywords: [
        "turnero para kinesiólogos",
        "agenda kinesiología online",
        "turnos fisioterapia",
        "sistema de turnos kinesiología",
      ],
      heroTitle: "Agenda online para kinesiología y rehabilitación",
      heroSubtitle:
        "Ideal para tratamientos de varias sesiones: el paciente elige el día y horario de cada sesión y vos recibís todo por WhatsApp.",
      pains: [
        "Pacientes con 10 sesiones que reprograman todo el tiempo.",
        "Coordinar horarios por chat uno por uno.",
        "Turnos libres que quedan vacíos por cancelaciones.",
      ],
      benefits: [
        {
          title: "Pensado para series de sesiones",
          text: "El paciente reserva cada sesión en segundos desde el mismo link.",
        },
        {
          title: "Servicios por tipo de tratamiento",
          text: "Rehabilitación, drenaje linfático, masaje descontracturante, RPG.",
        },
        {
          title: "Todo en tu WhatsApp",
          text: "Sin plataformas nuevas que aprender: confirmás desde el chat que ya usás.",
        },
      ],
      examples: ["Sesión de rehabilitación", "Masaje descontracturante", "Drenaje linfático", "RPG"],
      faqs: [
        {
          q: "¿El paciente puede reservar varias sesiones?",
          a: "Sí, puede volver a usar el link para cada sesión y elegir el horario que le quede cómodo.",
        },
        {
          q: "¿Puedo indicar si atiendo por obra social?",
          a: "Sí, podés sumar “obra social” como opción de pago o aclararlo en la descripción del servicio.",
        },
      ],
    },
    {
      slug: "peluqueria-canina",
      name: "Peluquerías caninas",
      business: "peluquería canina",
      emoji: "🐶",
      seoTitle: "Sistema de turnos para peluquería canina y grooming",
      seoDescription:
        "Agenda de turnos para peluquería canina: el dueño elige baño, corte o deslanado según el tamaño del perro y te llega la reserva por WhatsApp.",
      keywords: [
        "turnero peluquería canina",
        "turnos grooming online",
        "agenda peluquería de mascotas",
        "reservar baño perro",
      ],
      heroTitle: "Turnos online para tu peluquería canina",
      heroSubtitle:
        "Baño, corte o deslanado por tamaño de perro, con precios claros. El dueño reserva y vos recibís el turno con todos los datos.",
      pains: [
        "Cada cliente pregunta “¿cuánto sale para un perro grande?”.",
        "Turnos que se pisan porque un corte tarda más que un baño.",
        "Coordinar retiro y entrega por chat.",
      ],
      benefits: [
        {
          title: "Precios por tamaño",
          text: "Cargá servicios por raza o tamaño: chico, mediano, grande.",
        },
        {
          title: "Duraciones reales",
          text: "Un deslanado no ocupa lo mismo que un baño; la agenda lo respeta.",
        },
        {
          title: "Datos de la mascota en el mensaje",
          text: "El dueño puede dejar el nombre y la raza del perro al reservar.",
        },
      ],
      examples: ["Baño perro chico", "Baño y corte perro grande", "Deslanado", "Corte de uñas"],
      faqs: [
        {
          q: "¿Puedo cobrar distinto según el tamaño del perro?",
          a: "Sí, cada combinación de servicio y tamaño puede tener su precio.",
        },
        {
          q: "¿Sirve si hago grooming a domicilio?",
          a: "Sí, podés aclararlo en el servicio y el cliente te deja la dirección en el mensaje.",
        },
      ],
    },
    {
      slug: "talleres-mecanicos",
      name: "Talleres mecánicos",
      business: "taller mecánico",
      emoji: "🚗",
      seoTitle: "Sistema de turnos para talleres mecánicos y service del auto",
      seoDescription:
        "Sistema de turnos para talleres mecánicos: tus clientes reservan service, cambio de aceite o alineación desde un link y te llega el turno a WhatsApp.",
      keywords: [
        "turnero taller mecánico",
        "turnos service auto online",
        "agenda taller automotor",
        "reservar cambio de aceite",
      ],
      heroTitle: "Turnos online para tu taller mecánico",
      heroSubtitle:
        "Service, cambio de aceite, alineación y balanceo: el cliente elige el trabajo y el horario de ingreso, y vos lo recibís por WhatsApp.",
      pains: [
        "Autos que llegan todos juntos a primera hora.",
        "Llamadas mientras estás debajo de un auto.",
        "No saber qué trabajo viene a hacer cada cliente.",
      ],
      benefits: [
        {
          title: "Ingresos ordenados",
          text: "Distribuí los autos a lo largo del día según el trabajo.",
        },
        {
          title: "Trabajo definido de antemano",
          text: "Sabés si viene por service, frenos o alineación antes de que llegue.",
        },
        {
          title: "Atendé sin soltar la llave",
          text: "El cliente reserva solo; vos confirmás cuando tenés un minuto.",
        },
      ],
      examples: ["Cambio de aceite y filtros", "Service completo", "Alineación y balanceo", "Revisión de frenos"],
      faqs: [
        {
          q: "¿Sirve también para lavaderos o gomerías?",
          a: "Sí, cualquier servicio automotor que trabaje con horario de ingreso puede usarlo.",
        },
        {
          q: "¿El cliente puede indicar el modelo del auto?",
          a: "Sí, puede dejarlo en el mensaje de la reserva junto con su nombre.",
        },
      ],
    },
    {
      slug: "psicologos",
      name: "Psicólogos",
      business: "consultorio de psicología",
      emoji: "🧠",
      seoTitle: "Sistema de turnos para psicólogos: sesiones presenciales y virtuales",
      seoDescription:
        "Agenda de turnos para psicólogos. Tus pacientes reservan sesiones presenciales u online desde un link discreto y te llega la reserva a WhatsApp.",
      keywords: [
        "turnero para psicólogos",
        "agenda psicología online",
        "turnos terapia online",
        "sistema de turnos psicólogo",
      ],
      heroTitle: "Agenda de sesiones para psicólogos",
      heroSubtitle:
        "Presencial u online: tu paciente elige modalidad y horario, y te llega por WhatsApp. Simple, discreto y sin intermediarios.",
      pains: [
        "Coordinar primeras entrevistas por mensajes interminables.",
        "Mezclar la agenda personal con la profesional.",
        "Pacientes que no saben el valor de la sesión.",
      ],
      benefits: [
        {
          title: "Presencial u online",
          text: "Cargá ambas modalidades como servicios distintos.",
        },
        {
          title: "Primera entrevista simple",
          text: "El paciente nuevo reserva sin tener que explicar nada por chat.",
        },
        {
          title: "Sin datos sensibles",
          text: "Solo se envía nombre, fecha y horario a tu WhatsApp.",
        },
      ],
      examples: ["Primera entrevista", "Sesión individual presencial", "Sesión online", "Terapia de pareja"],
      faqs: [
        {
          q: "¿Se guardan datos clínicos?",
          a: "No. El turnero solo arma el mensaje con nombre, servicio, fecha, hora y medio de pago.",
        },
        {
          q: "¿Puedo atender pacientes de otros países?",
          a: "Sí, para sesiones online el paciente reserva igual y coordinan por WhatsApp.",
        },
      ],
    },
    {
      slug: "nutricionistas",
      name: "Nutricionistas",
      business: "consultorio de nutrición",
      emoji: "🥗",
      seoTitle: "Sistema de turnos para nutricionistas",
      seoDescription:
        "Sistema de turnos para nutricionistas: primera consulta, controles y planes, presenciales u online. Tus pacientes reservan y te llega a WhatsApp.",
      keywords: [
        "turnero nutricionista",
        "agenda nutrición online",
        "turnos nutricionista",
        "reservar consulta nutricional",
      ],
      heroTitle: "Turnos online para tu consultorio de nutrición",
      heroSubtitle:
        "Primera consulta, controles mensuales y seguimiento online. El paciente reserva solo y vos confirmás por WhatsApp.",
      pains: [
        "Controles mensuales que el paciente se olvida de pedir.",
        "Precios distintos para primera vez y seguimiento.",
        "Agenda dividida entre consultorio y online.",
      ],
      benefits: [
        {
          title: "Primera vez vs. control",
          text: "Cada tipo de consulta con su duración y precio.",
        },
        {
          title: "Facilitá la continuidad",
          text: "Mandá el link al terminar la consulta para que reserve el próximo control.",
        },
        {
          title: "Modalidad online",
          text: "El paciente elige si viene al consultorio o es por videollamada.",
        },
      ],
      examples: ["Primera consulta", "Control mensual", "Consulta online", "Plan deportivo"],
      faqs: [
        {
          q: "¿Sirve para consultas online?",
          a: "Sí, cargás la consulta online como servicio aparte y coordinás el link de la videollamada por WhatsApp.",
        },
        {
          q: "¿Puedo cobrar distinto la primera consulta?",
          a: "Sí, cada servicio tiene su propio precio.",
        },
      ],
    },
    {
      slug: "lavaderos-de-autos",
      name: "Lavaderos de autos",
      business: "lavadero de autos",
      emoji: "🧽",
      seoTitle: "Sistema de turnos para lavaderos de autos y detailing",
      seoDescription:
        "Agenda de turnos para lavaderos y detailing: lavado exterior, completo o pulido. El cliente reserva el horario y te llega la reserva a WhatsApp.",
      keywords: [
        "turnero lavadero de autos",
        "turnos lavado de autos online",
        "agenda detailing",
        "reservar lavado auto",
      ],
      heroTitle: "Turnos online para tu lavadero de autos",
      heroSubtitle:
        "Lavado exterior, completo, tapizados o pulido: el cliente elige y reserva el horario. Se terminó la fila de los sábados.",
      pains: [
        "Fila de autos el sábado a la mañana y vacío el martes.",
        "Clientes que se van porque hay mucha espera.",
        "Trabajos de detailing que ocupan media jornada.",
      ],
      benefits: [
        {
          title: "Distribuí la demanda",
          text: "Mostrá los horarios libres de la semana y llená los días flojos.",
        },
        {
          title: "Servicios por tipo de vehículo",
          text: "Auto, SUV o camioneta, cada uno con su precio.",
        },
        {
          title: "Detailing bien agendado",
          text: "Los trabajos largos bloquean el tiempo que realmente necesitan.",
        },
      ],
      examples: ["Lavado exterior", "Lavado completo", "Limpieza de tapizados", "Pulido y encerado"],
      faqs: [
        {
          q: "¿Puedo cobrar distinto auto y camioneta?",
          a: "Sí, cargás un servicio por tipo de vehículo con su precio.",
        },
        {
          q: "¿Sirve para lavado a domicilio?",
          a: "Sí, el cliente deja la dirección en el mensaje de reserva.",
        },
      ],
    },
  ],
};
