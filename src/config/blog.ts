import type { Faq } from "./types";

/**
 * BLOG → /blog y /blog/<slug>
 * Artículos sobre dolores reales del dueño de un negocio con turnos (no relleno).
 * Cada artículo: portada 16:9 generada sola (opengraph-image), FAQ propias (FAQPage + BlogPosting),
 * enlaces a glosario y rubros. Después de publicar uno nuevo: pedir indexación en Search Console.
 */

export interface Bloque {
  h2: string;
  p?: string[];
  lista?: string[];
  /** Texto para copiar y pegar (mensajes de ejemplo). */
  copiar?: string[];
}

export interface Articulo {
  slug: string;
  titulo: string;
  /** Meta description (140–160 caracteres). */
  descripcion: string;
  /** Texto corto para la portada. */
  portada: string;
  emoji: string;
  categoria: "Agenda y turnos" | "Plata y equipo" | "Clientes";
  publicado: string;
  actualizado?: string;
  minutos: number;
  /** Respuesta directa arriba del artículo. */
  resumen: string;
  bloques: Bloque[];
  faqs: Faq[];
  /** Slugs del glosario relacionados. */
  glosario: string[];
}

export const articulos: Articulo[] = [
  {
    slug: "dejar-de-dar-turnos-por-whatsapp",
    titulo: "Cómo dejar de contestar “¿tenés turno?” por WhatsApp todo el día",
    descripcion: "Si pasás horas respondiendo mensajes para dar turnos, esta guía te muestra cómo pasar a un link de reservas sin perder clientes ni la atención por WhatsApp.",
    portada: "Dejá de contestar “¿tenés turno?”",
    emoji: "💬",
    categoria: "Agenda y turnos",
    publicado: "2026-11-06",
    minutos: 5,
    resumen:
      "La forma más simple es tener un link de reservas que muestre tus horarios libres y responder cada consulta con ese link. El cliente elige solo y la reserva te llega armada a WhatsApp: seguís atendiendo por WhatsApp, pero sin la ida y vuelta.",
    bloques: [
      {
        h2: "Cuánto tiempo se va en dar turnos a mano",
        p: [
          "Un turno dado por WhatsApp suele llevar entre 4 y 8 mensajes: saludo, servicio, día, horario que no está, otro horario, precio, confirmación. Si das 15 turnos por día, son más de 100 mensajes, muchos mientras estás atendiendo a otro cliente.",
          "El problema no es WhatsApp: es usarlo como agenda. El cliente no ve tus horarios y vos tenés que dictárselos uno por uno.",
        ],
      },
      {
        h2: "El cambio: que el cliente vea los horarios libres",
        p: ["Con un link de reservas, el cliente ve servicios, precios y horarios disponibles, elige y confirma. A vos te llega un mensaje con todo: nombre, servicio, día, hora y cómo va a pagar."],
        lista: [
          "No hay turnos pisados: un horario tomado desaparece del link.",
          "Se reserva también de noche y los domingos, cuando vos no contestás.",
          "Seguís hablando con tu cliente por WhatsApp, pero para confirmar, no para coordinar.",
        ],
      },
      {
        h2: "Dónde poner el link para que se use",
        lista: [
          "En la bio de Instagram (es lo primero que mira un cliente nuevo).",
          "En el mensaje de bienvenida y en el de ausencia de WhatsApp Business.",
          "En una respuesta rápida de WhatsApp Business para contestar “¿tenés turno?” con un toque.",
          "En tu ficha de Google Maps, como sitio web o link de reservas.",
        ],
      },
      {
        h2: "Qué contestar cuando igual te escriben",
        p: ["Muchos clientes van a seguir escribiendo al principio. Respondé siempre con el link, con buena onda:"],
        copiar: ["¡Hola! Sí, tengo lugar 😊 Mirá los horarios libres y reservá acá en un minuto: prestum.com.ar/tu-negocio . Te llega la confirmación al toque."],
      },
    ],
    faqs: [
      { q: "¿No voy a perder clientes que prefieren hablar?", a: "No: el cliente igual te escribe por WhatsApp, y el que prefiere hablar puede hacerlo. El link solo le ahorra la coordinación." },
      { q: "¿Mis clientes tienen que bajar una app?", a: "No. El link se abre en el navegador del celular y no pide crear cuenta." },
    ],
    glosario: ["link-de-reservas", "whatsapp-business", "turno-online"],
  },
  {
    slug: "reducir-ausentismo-turnos",
    titulo: "Cómo reducir el ausentismo de turnos: 6 pasos que funcionan",
    descripcion: "Los clientes que reservan y no vienen te cuestan plata todos los meses. Seis pasos concretos para bajar el no-show con recordatorios, seña y lista de espera.",
    portada: "Menos clientes que no vienen",
    emoji: "📉",
    categoria: "Agenda y turnos",
    publicado: "2026-11-06",
    minutos: 6,
    resumen:
      "El ausentismo baja combinando cuatro cosas: confirmar al reservar, recordar el día anterior, pedir seña en los servicios largos o caros y tener lista de espera para llenar el hueco. Y medirlo, para saber si mejora.",
    bloques: [
      {
        h2: "Primero, hacé la cuenta",
        p: [
          "Multiplicá tus ausencias por semana por el precio promedio de tu servicio y por 4. Con 4 faltas por semana y un servicio de $15.000, son $240.000 por mes que no entran. Ese número es el que vas a bajar.",
        ],
      },
      {
        h2: "Los 6 pasos",
        lista: [
          "1. Confirmá cada turno al reservar, por escrito: día, hora, servicio y dirección.",
          "2. Mandá un recordatorio el día anterior (o a la mañana si el turno es a la tarde).",
          "3. Pedí que respondan para confirmar: el que no puede ir te avisa y liberás el horario.",
          "4. Pedí seña solo en servicios largos o caros; en los cortos suele alcanzar el recordatorio.",
          "5. Tené lista de espera: si alguien cancela, ya sabés a quién avisarle.",
          "6. Marcá quién no vino y mirá tu porcentaje cada mes.",
        ],
      },
      {
        h2: "Un recordatorio que funciona",
        copiar: ["¡Hola Juli! Te recuerdo tu turno de mañana jueves a las 17:00 para corte y color. ¿Me confirmás? Si no podés, avisame y te busco otro horario 🙌"],
      },
      {
        h2: "Qué no hacer",
        lista: [
          "Retar al cliente en público o en el grupo: se va y no vuelve.",
          "Pedir seña en todo: espanta a los clientes nuevos en servicios baratos.",
          "Dejar el hueco vacío sin avisar a nadie: la lista de espera lo llena.",
        ],
      },
    ],
    faqs: [
      { q: "¿Cuánto ausentismo es normal?", a: "Depende del rubro, pero si más de 1 de cada 10 turnos no se presenta, conviene sumar recordatorio y seña." },
      { q: "¿El recordatorio tiene que ser automático?", a: "No necesariamente. Un mensaje armado que mandás con un toque desde tu WhatsApp funciona igual y sale con tu número." },
    ],
    glosario: ["no-show", "recordatorio-de-turno", "lista-de-espera"],
  },
  {
    slug: "cobrar-sena-turnos",
    titulo: "Cobrar seña para un turno: cuánto pedir, cómo cobrarla y qué decirle al cliente",
    descripcion: "Guía práctica para cobrar seña en tu negocio: cuándo conviene, qué porcentaje pedir, cómo cobrarla por transferencia o Mercado Pago y cómo comunicarla sin perder clientes.",
    portada: "Cómo cobrar seña sin espantar clientes",
    emoji: "💸",
    categoria: "Plata y equipo",
    publicado: "2026-11-06",
    minutos: 5,
    resumen:
      "Conviene pedir seña en servicios largos o caros, entre el 20% y el 50% del precio, por transferencia o link de pago, con un plazo corto para pagarla. Lo clave es comunicarla antes de reservar: cuánto es, cómo se paga y qué pasa si cancela.",
    bloques: [
      {
        h2: "Cuándo conviene pedir seña",
        lista: [
          "Servicios de más de una hora o de precio alto (tratamientos, uñas esculpidas, color, detailing).",
          "Días muy pedidos, como viernes y sábados.",
          "Clientes nuevos en servicios caros.",
        ],
        p: ["En servicios cortos y baratos, la seña suele espantar más de lo que protege: ahí alcanza con el recordatorio."],
      },
      {
        h2: "Cuánto pedir",
        p: ["Lo habitual es entre el 20% y el 50% del precio, o un monto fijo redondo. Tiene que doler perderlo, pero no tanto como para que el cliente dude en reservar."],
      },
      {
        h2: "Cómo cobrarla",
        lista: [
          "Transferencia a tu alias o CBU: sin comisión, el cliente te manda el comprobante.",
          "Link de pago de Mercado Pago: más cómodo para el cliente, con la comisión de Mercado Pago.",
          "Poné un plazo para pagarla (por ejemplo 1 hora); si no llega, liberá el horario.",
        ],
      },
      {
        h2: "Cómo comunicarla",
        copiar: [
          "Para confirmar tu turno te pido una seña de $5.000 (se descuenta del total). Podés transferir al alias mi.negocio y mandarme el comprobante. Si cancelás con 24 h de anticipación, te la guardo para otro turno 😊",
        ],
      },
    ],
    faqs: [
      { q: "¿Qué hago con la seña si el cliente cancela?", a: "Lo más común: si avisa con anticipación (por ejemplo 24 h), se la guardás para otro turno; si no avisa, la seña cubre el horario perdido. Lo importante es decirlo antes." },
      { q: "¿Es obligatorio cobrar seña en Prestum Turnos?", a: "No, es 100% opcional y la podés activar solo cuando te convenga." },
    ],
    glosario: ["sena", "no-show", "caja-diaria"],
  },
  {
    slug: "calcular-comisiones-empleados",
    titulo: "Cómo calcular las comisiones de tu equipo sin pelearte a fin de mes",
    descripcion: "Cómo calcular comisiones por profesional en peluquerías, barberías, centros de estética y consultorios: fórmulas, ejemplos en pesos y cómo evitar discusiones.",
    portada: "Comisiones claras, equipo tranquilo",
    emoji: "🧮",
    categoria: "Plata y equipo",
    publicado: "2026-11-06",
    minutos: 5,
    resumen:
      "La comisión se calcula sumando lo que facturó cada profesional en el período y multiplicándolo por su porcentaje. Las peleas no vienen de la cuenta, sino de no tener registrado quién atendió cada turno y qué se cobró: si eso queda anotado en cada turno, el cálculo sale solo.",
    bloques: [
      {
        h2: "La fórmula",
        p: ["Comisión = lo facturado por el profesional × su porcentaje. Si alguien facturó $800.000 en el mes y cobra el 40%, le corresponden $320.000."],
      },
      {
        h2: "Los 3 modelos más comunes",
        lista: [
          "Porcentaje fijo sobre todo lo facturado (el más simple).",
          "Porcentaje distinto según el servicio (por ejemplo, más en tratamientos que en cortes).",
          "Sueldo base más un porcentaje a partir de cierto monto.",
        ],
      },
      {
        h2: "Por qué aparecen las discusiones",
        lista: [
          "No queda registrado qué profesional atendió cada turno.",
          "Se mezclan cobros en efectivo, transferencia y Mercado Pago sin anotar.",
          "Se descuentan productos o gastos sin acordarlo antes.",
        ],
        p: ["La solución es que cada turno quede asociado al profesional que lo atendió y que se marque como cobrado con su medio de pago, en el momento."],
      },
      {
        h2: "Cada uno, su número",
        p: ["Funciona mejor cuando cada profesional ve sus propios turnos y lo que facturó, sin acceso a la caja general del negocio. Así no hay sorpresas a fin de mes y el dueño mantiene la privacidad de los números."],
      },
    ],
    faqs: [
      { q: "¿Se calcula sobre el precio o sobre lo cobrado?", a: "Conviene sobre lo efectivamente cobrado: si un turno no se cobró, no genera comisión." },
      { q: "¿Prestum calcula las comisiones?", a: "Sí, en el plan Premium: cargás el % de cada profesional y la caja muestra cuánto facturó cada uno y cuánto le corresponde." },
    ],
    glosario: ["comisiones-por-profesional", "caja-diaria", "roles-y-permisos"],
  },
  {
    slug: "anunciar-turnos-online-a-clientes",
    titulo: "Cómo avisarles a tus clientes que ahora reservan online (con mensajes listos)",
    descripcion: "Mensajes listos para copiar y una guía paso a paso para anunciar tu nuevo link de turnos en Instagram, estados de WhatsApp y en el local, sin confundir a nadie.",
    portada: "Contales que ya pueden reservar solos",
    emoji: "📣",
    categoria: "Clientes",
    publicado: "2026-11-06",
    minutos: 4,
    resumen:
      "Anunciá el link en tres lugares a la vez (estado de WhatsApp, historia de Instagram y en el local), explicá el beneficio para el cliente (“reservá cuando quieras, sin esperar respuesta”) y durante las primeras semanas respondé cada consulta con el link.",
    bloques: [
      {
        h2: "El mensaje: hablá del beneficio para el cliente",
        p: ["No digas “tenemos un sistema nuevo”: decí qué gana el cliente. Que puede reservar a cualquier hora, ver los horarios libres y no esperar respuesta."],
      },
      {
        h2: "Mensajes para copiar",
        copiar: [
          "📅 ¡Novedad! Ahora podés sacar tu turno cuando quieras, sin esperar que te contestemos. Elegís el servicio, el día y el horario acá: prestum.com.ar/tu-negocio",
          "Historia de Instagram: “Reservá tu turno en 1 minuto 👇” + sticker de enlace con tu link.",
          "Cartel en el local: “¿Tu próximo turno? Escaneá y reservá” + un código QR de tu link.",
        ],
      },
      {
        h2: "La primera semana",
        lista: [
          "Publicá el estado de WhatsApp 2 o 3 días seguidos (no todos lo ven el primer día).",
          "Fijá la historia en tus destacados de Instagram.",
          "Respondé cada “¿tenés turno?” con el link y un mensaje amable.",
          "Al cliente que viene al local, mostrale el link en el celular: es la forma más rápida de que lo use.",
        ],
      },
    ],
    faqs: [
      { q: "¿Qué hago con los clientes mayores que no lo van a usar?", a: "Nada: pueden seguir escribiéndote o llamando, y vos les cargás el turno. El link es una opción más, no una obligación." },
      { q: "¿Cuánto tarda la gente en acostumbrarse?", a: "Normalmente unas semanas. Lo que más ayuda es responder siempre con el link durante ese tiempo." },
    ],
    glosario: ["link-de-reservas", "whatsapp-business", "confirmacion-de-turno"],
  },
];

export const getArticulo = (slug: string) => articulos.find((a) => a.slug === slug);
