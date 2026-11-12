import type { Faq } from "./types";

/**
 * BLOG → /blog y /blog/<slug>
 * Artículos para DUEÑOS de barberías, peluquerías y centros de estética (dolores reales, no relleno).
 * Ejemplos, servicios y mensajes de esos tres rubros. Solo se nombran funciones que existen.
 * Cada artículo: portada 16:9 generada sola (opengraph-image), FAQ propias (FAQPage + BlogPosting),
 * enlaces a glosario y a las páginas de rubro. Después de publicar o reescribir: pedir indexación en Search Console.
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
    titulo: "Cómo dejar de dar turnos por WhatsApp en tu barbería o peluquería",
    descripcion: "Si cortás, peinás o atendés con el celular sonando, esta guía te muestra cómo pasar a un link de reservas sin perder clientes ni dejar de usar WhatsApp.",
    portada: "Dejá de contestar “¿tenés turno?”",
    emoji: "💬",
    categoria: "Agenda y turnos",
    publicado: "2026-11-06",
    actualizado: "2026-11-11",
    minutos: 5,
    resumen:
      "La forma más simple es tener un link de reservas con tus horarios libres y contestar cada “¿tenés turno?” con ese link. El cliente elige servicio, día y hora, y la reserva te llega armada a tu WhatsApp: seguís atendiendo por WhatsApp, pero sin cortar a mitad de un fade o de un color para coordinar.",
    bloques: [
      {
        h2: "Cuánto tiempo se va en dar turnos a mano",
        p: [
          "En una barbería, peluquería o centro de estética, un turno por WhatsApp lleva entre 4 y 8 mensajes: saludo, servicio, día, el horario que no está, otro horario, precio, confirmación. Con 15 turnos por día son más de 100 mensajes, y casi todos llegan mientras tenés a alguien en el sillón o en la camilla.",
          "El problema no es WhatsApp: es usarlo como agenda. El cliente no ve tus horarios y vos tenés que dictárselos uno por uno, con las manos ocupadas.",
        ],
      },
      {
        h2: "El cambio: que el cliente vea los horarios libres",
        p: ["Con un link de reservas el cliente ve tus servicios (corte, corte y barba, color, uñas, depilación, limpieza facial), los precios y los horarios disponibles. Elige, confirma y a vos te llega un mensaje con todo: nombre, servicio, con quién, día y hora."],
        lista: [
          "No hay turnos pisados: un horario tomado desaparece del link.",
          "Cada servicio ocupa lo que dura: un color de dos horas no se superpone con un corte.",
          "Se reserva también de noche y los domingos, cuando vos no contestás.",
          "Seguís hablando con tu cliente por WhatsApp, pero para confirmar, no para coordinar.",
        ],
      },
      {
        h2: "Dónde poner el link para que se use",
        lista: [
          "En la bio de Instagram: es lo primero que mira un cliente nuevo después de ver tus trabajos.",
          "En el mensaje de bienvenida y en el de ausencia de WhatsApp Business.",
          "En una respuesta rápida de WhatsApp Business para contestar “¿tenés turno?” con un toque.",
          "En tu ficha de Google Maps, como sitio web o link de reservas.",
          "En un QR en el espejo o en la caja, para que el cliente saque el próximo turno antes de irse.",
        ],
      },
      {
        h2: "Qué contestar cuando igual te escriben",
        p: ["Los primeros días muchos clientes van a seguir escribiendo. Respondé siempre con el link, con buena onda:"],
        copiar: [
          "¡Hola! Sí, tengo lugar 💈 Mirá los horarios libres y reservá acá en un minuto: prestum.com.ar/tu-barberia . Te llega la confirmación al toque.",
          "¡Hola! Para color y tratamientos te conviene elegir el horario desde acá, así te reservo el tiempo justo: prestum.com.ar/tu-peluqueria 💇‍♀️",
        ],
      },
    ],
    faqs: [
      { q: "¿No voy a perder clientes que prefieren hablar?", a: "No: el cliente igual te puede escribir por WhatsApp, y vos le cargás el turno. El link solo le ahorra la coordinación al que quiere reservar solo." },
      { q: "¿Mis clientes tienen que bajar una app?", a: "No. El link se abre en el navegador del celular y no pide crear cuenta." },
      { q: "¿Sirve si trabajo solo?", a: "Sí, es justamente cuando más sirve: no podés contestar mientras atendés. Con Prestum Turnos tenés el link gratis hasta 45 turnos por mes." },
    ],
    glosario: ["link-de-reservas", "whatsapp-business", "turno-online"],
  },
  {
    slug: "reducir-ausentismo-turnos",
    titulo: "Cómo reducir las ausencias en tu barbería, peluquería o centro de estética",
    descripcion: "Los clientes que reservan y no vienen te cuestan plata todos los meses. Seis pasos concretos para bajar el no-show con recordatorios, seña y lista de espera.",
    portada: "Menos clientes que no vienen",
    emoji: "📉",
    categoria: "Agenda y turnos",
    publicado: "2026-11-06",
    actualizado: "2026-11-11",
    minutos: 6,
    resumen:
      "Las ausencias bajan combinando cuatro cosas: confirmar al reservar, recordar el día anterior, pedir seña en los servicios largos o caros (color, alisado, uñas esculpidas, tratamientos) y tener lista de espera para llenar el hueco. Y marcar quién no vino, para saber si mejora.",
    bloques: [
      {
        h2: "Primero, hacé la cuenta",
        p: [
          "Multiplicá tus ausencias por semana por el precio promedio de tu servicio y por 4. Con 4 faltas por semana y un servicio de $15.000, son $240.000 por mes que no entran. En estética o color, donde un turno dura dos horas, la cuenta es todavía peor.",
        ],
      },
      {
        h2: "Los 6 pasos",
        lista: [
          "1. Confirmá cada turno al reservar, por escrito: día, hora, servicio y dirección.",
          "2. Mandá un recordatorio el día anterior (o a la mañana si el turno es a la tarde).",
          "3. Pedí que respondan para confirmar: el que no puede ir te avisa y liberás el horario.",
          "4. Pedí seña en servicios largos o caros (color, mechas, alisado, esculpidas, tratamientos faciales); en un corte suele alcanzar el recordatorio.",
          "5. Tené lista de espera para los viernes y sábados: si alguien cancela, ya sabés a quién avisarle.",
          "6. Marcá quién no vino y fijate cada mes si baja.",
        ],
      },
      {
        h2: "Recordatorios que funcionan",
        copiar: [
          "¡Hola Juli! Te recuerdo tu turno de mañana jueves a las 17:00 para color y corte. ¿Me confirmás? Si no podés, avisame y te busco otro horario 🙌",
          "¡Buenas Nico! Mañana a las 19:30 te espero para corte y barba 💈 ¿Venís? Si no llegás, avisame así le doy el lugar a otro.",
        ],
      },
      {
        h2: "Qué no hacer",
        lista: [
          "Retar al cliente en público o en una historia: se va y no vuelve.",
          "Pedir seña en todo: en un corte o una perfilada de cejas espanta a los clientes nuevos.",
          "Dejar el hueco vacío sin avisar a nadie: la lista de espera lo llena.",
        ],
      },
    ],
    faqs: [
      { q: "¿Cuántas ausencias son normales?", a: "Varía según el servicio, pero si más de 1 de cada 10 turnos no se presenta, conviene sumar recordatorio y seña." },
      { q: "¿El recordatorio tiene que ser automático?", a: "No necesariamente. Un mensaje armado que mandás con un toque desde tu WhatsApp funciona igual y sale con tu número, que el cliente ya conoce." },
      { q: "¿Prestum Turnos tiene recordatorios y lista de espera?", a: "Sí: los recordatorios por WhatsApp y la seña están desde el plan Básico, y la lista de espera en el plan Premium." },
    ],
    glosario: ["no-show", "recordatorio-de-turno", "lista-de-espera"],
  },
  {
    slug: "cobrar-sena-turnos",
    titulo: "Cobrar seña en peluquería y estética: cuánto pedir y cómo cobrarla",
    descripcion: "Cuándo conviene pedir seña en una peluquería, barbería o centro de estética, qué porcentaje cobrar, cómo cobrarla por transferencia o Mercado Pago y qué decirle al cliente.",
    portada: "Cómo cobrar seña sin espantar clientes",
    emoji: "💸",
    categoria: "Plata y equipo",
    publicado: "2026-11-06",
    actualizado: "2026-11-11",
    minutos: 5,
    resumen:
      "Conviene pedir seña en los servicios largos o caros (color, mechas, alisado, uñas esculpidas, tratamientos faciales o corporales), entre el 20% y el 50% del precio, por transferencia o link de pago y con un plazo corto para pagarla. Lo clave es avisarlo antes de reservar: cuánto es, cómo se paga y qué pasa si cancela.",
    bloques: [
      {
        h2: "Cuándo conviene pedir seña",
        lista: [
          "Peluquería: color, mechas, balayage, alisados y tratamientos de más de una hora.",
          "Estética: uñas esculpidas o semipermanente, depilación láser, limpiezas faciales y tratamientos corporales.",
          "Barbería: casi nunca en un corte; sí en servicios largos, combos o días de mucha demanda.",
          "Viernes, sábados y fechas como fiestas o fin de año, cuando cada hueco cuesta.",
        ],
        p: ["En servicios cortos y baratos, la seña suele espantar más de lo que protege: ahí alcanza con el recordatorio."],
      },
      {
        h2: "Cuánto pedir",
        p: ["Lo habitual es entre el 20% y el 50% del precio, o un monto fijo redondo. Tiene que doler perderlo, pero no tanto como para que el cliente dude en reservar. En un color de $40.000, una seña de $10.000 suele andar bien."],
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
          "Para confirmar tu turno de color te pido una seña de $10.000 (se descuenta del total). Podés transferir al alias tu.peluqueria y mandarme el comprobante. Si cancelás con 24 h de anticipación, te la guardo para otro turno 😊",
        ],
      },
    ],
    faqs: [
      { q: "¿Qué hago con la seña si el cliente cancela?", a: "Lo más común: si avisa con anticipación (por ejemplo 24 h), se la guardás para otro turno; si no avisa, la seña cubre el horario perdido. Lo importante es decirlo antes." },
      { q: "¿Es obligatorio cobrar seña en Prestum Turnos?", a: "No, es 100% opcional, está desde el plan Básico y la podés pedir solo cuando te convenga." },
    ],
    glosario: ["sena", "no-show", "caja-diaria"],
  },
  {
    slug: "calcular-comisiones-empleados",
    titulo: "Comisiones en barberías y peluquerías: cómo calcularlas sin pelear",
    descripcion: "Cómo calcular la comisión de cada barbero, peluquera o esteticista: fórmula, ejemplos en pesos, los modelos más usados y cómo evitar discusiones a fin de mes.",
    portada: "Comisiones claras, equipo tranquilo",
    emoji: "🧮",
    categoria: "Plata y equipo",
    publicado: "2026-11-06",
    actualizado: "2026-11-11",
    minutos: 5,
    resumen:
      "La comisión se calcula sumando lo que facturó cada barbero, peluquera o esteticista en el período y multiplicándolo por su porcentaje. Las peleas no vienen de la cuenta, sino de no tener anotado quién atendió cada turno y qué se cobró: si eso queda registrado en cada turno, el cálculo sale solo.",
    bloques: [
      {
        h2: "La fórmula",
        p: ["Comisión = lo facturado por el profesional × su porcentaje. Si un barbero facturó $800.000 en el mes y cobra el 40%, le corresponden $320.000."],
      },
      {
        h2: "Los 3 modelos más comunes",
        lista: [
          "Porcentaje fijo sobre todo lo facturado: el más simple y el más usado en barberías.",
          "Porcentaje distinto según el servicio: en peluquería, por ejemplo, uno para cortes y otro para color, donde se gastan productos.",
          "Alquiler de sillón o de box: el profesional paga un fijo y se queda con lo que factura.",
        ],
      },
      {
        h2: "Por qué aparecen las discusiones",
        lista: [
          "No queda registrado qué profesional atendió cada turno.",
          "Se mezclan cobros en efectivo, transferencia y Mercado Pago sin anotar.",
          "Se descuentan tinturas, productos o insumos sin haberlo acordado antes.",
        ],
        p: ["La solución es que cada turno quede asociado al profesional que lo atendió y que se marque como cobrado con su medio de pago, en el momento, no a fin de mes."],
      },
      {
        h2: "Acordalo por escrito",
        p: ["Antes de empezar, dejá por escrito el porcentaje, sobre qué se calcula (lo cobrado, no el precio de lista) y qué se descuenta. Con eso y un registro por turno, el cierre de mes es una cuenta, no una discusión."],
      },
    ],
    faqs: [
      { q: "¿Se calcula sobre el precio o sobre lo cobrado?", a: "Conviene sobre lo efectivamente cobrado: si un turno no se cobró, no genera comisión." },
      { q: "¿Prestum calcula las comisiones?", a: "Sí, en el plan Premium: cargás el % de cada profesional y la caja muestra cuánto facturó cada uno y cuánto le corresponde." },
    ],
    glosario: ["comisiones-por-profesional", "caja-diaria", "agenda-por-profesional"],
  },
  {
    slug: "anunciar-turnos-online-a-clientes",
    titulo: "Cómo avisarles a tus clientes que ya reservan online (mensajes listos)",
    descripcion: "Mensajes listos para copiar y una guía paso a paso para anunciar el link de turnos de tu barbería, peluquería o centro de estética en Instagram, WhatsApp y el local.",
    portada: "Contales que ya pueden reservar solos",
    emoji: "📣",
    categoria: "Clientes",
    publicado: "2026-11-06",
    actualizado: "2026-11-11",
    minutos: 4,
    resumen:
      "Anunciá el link en tres lugares a la vez (estado de WhatsApp, historia de Instagram y en el local), contá el beneficio para el cliente (“reservá cuando quieras, sin esperar respuesta”) y durante las primeras semanas contestá cada consulta con el link.",
    bloques: [
      {
        h2: "El mensaje: hablá del beneficio para el cliente",
        p: ["No digas “tenemos un sistema nuevo”: decí qué gana el cliente. Que puede sacar turno a cualquier hora, ver los horarios libres y elegir con quién atenderse, sin esperar a que le contestes entre un corte y otro."],
      },
      {
        h2: "Mensajes para copiar",
        copiar: [
          "💈 ¡Novedad! Ahora sacás tu turno cuando quieras, sin esperar que te contestemos. Elegís servicio, barbero, día y horario acá: prestum.com.ar/tu-barberia",
          "💅 ¡Ya podés reservar online! Elegí tu servicio (uñas, cejas, depilación, faciales) y el horario que te quede cómodo: prestum.com.ar/tu-centro",
          "Historia de Instagram: “Reservá tu turno en 1 minuto 👇” + sticker de enlace con tu link.",
          "Cartel en el espejo o en la caja: “¿Tu próximo turno? Escaneá y reservá” + un código QR de tu link.",
        ],
      },
      {
        h2: "La primera semana",
        lista: [
          "Publicá el estado de WhatsApp 2 o 3 días seguidos (no todos lo ven el primer día).",
          "Fijá la historia en tus destacados de Instagram, al lado de los trabajos.",
          "Respondé cada “¿tenés turno?” con el link y un mensaje amable.",
          "Al cliente que está en el sillón, mostrale el link y que saque el próximo turno antes de irse: es la forma más rápida de que lo use.",
        ],
      },
    ],
    faqs: [
      { q: "¿Qué hago con los clientes que no lo van a usar?", a: "Nada: pueden seguir escribiéndote o llamando, y vos les cargás el turno. El link es una opción más, no una obligación." },
      { q: "¿Cuánto tarda la gente en acostumbrarse?", a: "Normalmente unas semanas. Lo que más ayuda es responder siempre con el link durante ese tiempo." },
    ],
    glosario: ["link-de-reservas", "whatsapp-business", "confirmacion-de-turno"],
  },
];

export const getArticulo = (slug: string) => articulos.find((a) => a.slug === slug);
