/**
 * Contenido para SEO programático (mismo patrón que los líderes del rubro):
 *  - Ciudades → /turnos-online/<ciudad>
 *  - Glosario → /glosario/<termino>
 * Agregar una ciudad o un término acá crea la página, la suma al sitemap y la enlaza.
 */

export interface Ciudad {
  slug: string;
  nombre: string;
  provincia: string;
}

export const ciudades: Ciudad[] = [
  { slug: "buenos-aires", nombre: "Buenos Aires", provincia: "CABA" },
  { slug: "cordoba", nombre: "Córdoba", provincia: "Córdoba" },
  { slug: "rosario", nombre: "Rosario", provincia: "Santa Fe" },
  { slug: "mendoza", nombre: "Mendoza", provincia: "Mendoza" },
  { slug: "la-plata", nombre: "La Plata", provincia: "Buenos Aires" },
  { slug: "mar-del-plata", nombre: "Mar del Plata", provincia: "Buenos Aires" },
  { slug: "san-miguel-de-tucuman", nombre: "San Miguel de Tucumán", provincia: "Tucumán" },
  { slug: "salta", nombre: "Salta", provincia: "Salta" },
  { slug: "santa-fe", nombre: "Santa Fe", provincia: "Santa Fe" },
  { slug: "san-juan", nombre: "San Juan", provincia: "San Juan" },
  { slug: "catamarca", nombre: "San Fernando del Valle de Catamarca", provincia: "Catamarca" },
  { slug: "resistencia", nombre: "Resistencia", provincia: "Chaco" },
  { slug: "neuquen", nombre: "Neuquén", provincia: "Neuquén" },
  { slug: "santiago-del-estero", nombre: "Santiago del Estero", provincia: "Santiago del Estero" },
  { slug: "corrientes", nombre: "Corrientes", provincia: "Corrientes" },
  { slug: "posadas", nombre: "Posadas", provincia: "Misiones" },
  { slug: "bahia-blanca", nombre: "Bahía Blanca", provincia: "Buenos Aires" },
  { slug: "parana", nombre: "Paraná", provincia: "Entre Ríos" },
  { slug: "san-salvador-de-jujuy", nombre: "San Salvador de Jujuy", provincia: "Jujuy" },
  { slug: "la-rioja", nombre: "La Rioja", provincia: "La Rioja" },
  { slug: "rio-cuarto", nombre: "Río Cuarto", provincia: "Córdoba" },
];

export const getCiudad = (slug: string) => ciudades.find((c) => c.slug === slug);

export interface Termino {
  slug: string;
  termino: string;
  resumen: string; // 1 frase (meta description)
  cuerpo: string[]; // párrafos
  relacionados: string[];
}

export const glosario: Termino[] = [
  {
    slug: "turno-online",
    termino: "Turno online",
    resumen: "Un turno online es una reserva que el cliente saca solo, desde internet, eligiendo servicio, día y horario.",
    cuerpo: [
      "Un turno online es una reserva que el cliente hace por su cuenta desde el celular o la computadora, sin llamar ni escribir para coordinar. Elige el servicio, ve los horarios libres y confirma.",
      "Para el negocio, la ventaja es doble: se dejan de responder mensajes para dar turnos y la agenda se llena también fuera del horario de atención, porque el link está disponible las 24 horas.",
      "En Prestum Turnos, la reserva además le llega al negocio por WhatsApp con todos los datos: nombre, servicio, fecha, hora y medio de pago.",
    ],
    relacionados: ["agenda-online", "link-de-reservas"],
  },
  {
    slug: "agenda-online",
    termino: "Agenda online",
    resumen: "Una agenda online es el calendario de turnos de un negocio disponible en internet, que se actualiza sola con cada reserva.",
    cuerpo: [
      "Una agenda online reemplaza al cuaderno o a las notas del celular: muestra los días y horarios de atención y marca automáticamente los turnos que ya están tomados.",
      "Al estar en internet, el dueño la ve desde cualquier lugar y los clientes solo ven los horarios disponibles, lo que evita turnos superpuestos.",
      "Una buena agenda online respeta la duración de cada servicio: un trabajo de una hora bloquea una hora, no media.",
    ],
    relacionados: ["turno-online", "ocupacion"],
  },
  {
    slug: "link-de-reservas",
    termino: "Link de reservas",
    resumen: "El link de reservas es la dirección web propia de un negocio donde sus clientes sacan turno, por ejemplo prestum.com.ar/mi-negocio.",
    cuerpo: [
      "El link de reservas es una dirección única que cada negocio comparte con sus clientes. Al abrirlo, el cliente ve los servicios, los precios y los horarios libres, y reserva en pocos toques.",
      "Los lugares donde más reservas genera son la bio de Instagram, el estado y las respuestas rápidas de WhatsApp Business y la ficha de Google Maps.",
      "Con Prestum Turnos el link tiene la forma prestum.com.ar/nombre-del-negocio y queda activo apenas te registrás.",
    ],
    relacionados: ["turno-online", "agenda-online"],
  },
  {
    slug: "no-show",
    termino: "No-show (ausentismo)",
    resumen: "No-show es cuando un cliente reserva un turno y no se presenta ni avisa. Es una de las mayores pérdidas de los negocios con turnos.",
    cuerpo: [
      "Se llama no-show o ausentismo al cliente que tiene un turno reservado y no va, generalmente sin avisar. Ese horario queda vacío y no se puede ofrecer a otra persona.",
      "Las formas más comunes de reducirlo son confirmar el turno por WhatsApp, enviar un recordatorio antes y pedir una seña en servicios caros o largos.",
      "Saber cómo va a pagar el cliente antes de que llegue también ayuda: quien ya eligió transferencia o Mercado Pago suele tener más compromiso con el turno.",
    ],
    relacionados: ["sena", "recordatorio-de-turno"],
  },
  {
    slug: "sena",
    termino: "Seña",
    resumen: "La seña es un pago parcial por adelantado que asegura un turno y reduce las cancelaciones de último momento.",
    cuerpo: [
      "La seña es una parte del precio que el cliente paga antes del turno, normalmente por transferencia o Mercado Pago. Si no se presenta, el negocio no pierde todo el valor del horario.",
      "Es habitual en servicios largos o caros, como tratamientos estéticos, uñas esculpidas o trabajos de detailing.",
      "Lo importante es comunicarla claro antes de reservar: cuánto es, cómo se paga y qué pasa si se cancela.",
    ],
    relacionados: ["no-show", "ticket-promedio"],
  },
  {
    slug: "recordatorio-de-turno",
    termino: "Recordatorio de turno",
    resumen: "Un recordatorio de turno es un aviso que recibe el cliente antes de su reserva para que no se olvide.",
    cuerpo: [
      "El recordatorio es un mensaje, generalmente por WhatsApp, que se envía el día anterior o unas horas antes del turno con la fecha, la hora y la dirección.",
      "Es la herramienta más simple para bajar el ausentismo: muchos no-show son simples olvidos.",
      "Funciona mejor si permite responder para confirmar o reprogramar, así el horario se libera a tiempo si el cliente no puede ir.",
    ],
    relacionados: ["no-show", "turno-online"],
  },
  {
    slug: "ocupacion",
    termino: "Tasa de ocupación",
    resumen: "La tasa de ocupación es el porcentaje de horarios disponibles que efectivamente se reservan en un período.",
    cuerpo: [
      "La ocupación mide qué parte de la agenda se llena. Si atendés 40 horas por semana y tenés 30 horas reservadas, tu ocupación es del 75%.",
      "Mirarla por día y por franja horaria muestra dónde hay huecos: muchos negocios están llenos los sábados y vacíos los martes a la tarde.",
      "Con ese dato podés ajustar horarios, lanzar promociones en las horas flojas o sumar un profesional en los picos.",
    ],
    relacionados: ["agenda-online", "ticket-promedio"],
  },
  {
    slug: "ticket-promedio",
    termino: "Ticket promedio",
    resumen: "El ticket promedio es lo que gasta en promedio cada cliente por visita: ingresos divididos por cantidad de turnos.",
    cuerpo: [
      "El ticket promedio se calcula dividiendo lo facturado por la cantidad de turnos atendidos. Si en el mes facturaste $1.500.000 con 100 turnos, tu ticket promedio es de $15.000.",
      "Subirlo suele ser más fácil que conseguir clientes nuevos: combos, servicios adicionales o actualizar precios a tiempo.",
      "En el panel de Prestum Turnos ves los ingresos estimados y la cantidad de turnos, así que lo podés calcular de un vistazo.",
    ],
    relacionados: ["ocupacion", "sena"],
  },
];

export const getTermino = (slug: string) => glosario.find((t) => t.slug === slug);
