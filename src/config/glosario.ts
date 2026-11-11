import type { Faq } from "./types";
import type { Funcion } from "@/lib/funciones";

/**
 * GLOSARIO SEO → /glosario y /glosario/<slug>
 * Términos que buscan los dueños de negocios con turnos (dolores reales, no relleno).
 * Cada término: definición rápida arriba (para el fragmento destacado de Google y las IA),
 * análisis, cómo lo resuelve Prestum Turnos (solo funciones que existen), preguntas y relacionados.
 * Agregar un término acá crea la página, la suma al sitemap y la enlaza.
 */

export type CategoriaGlosario = "Turnos y agenda" | "Finanzas y métricas" | "Administración" | "Clientes y WhatsApp";

export const CATEGORIAS_GLOSARIO: CategoriaGlosario[] = ["Turnos y agenda", "Finanzas y métricas", "Administración", "Clientes y WhatsApp"];

export interface Termino {
  slug: string;
  termino: string;
  /** Artículo para el H1 "¿Qué es <artículo> <término>?" (ej: "la", "un"; vacío si no lleva). */
  articulo: string;
  categoria: CategoriaGlosario;
  /** Respuesta directa en 1–2 frases (caja "Definición rápida" y meta description). */
  definicion: string;
  /** <title> sin la marca. Si falta: "Qué es <término>". */
  titulo?: string;
  analisis: Array<{ titulo: string; texto: string[] }>;
  /** Cómo lo resuelve Prestum Turnos: solo funciones reales. */
  solucion: string[];
  /** Función del plan que lo resuelve (muestra "Incluido desde el plan …"). */
  funcion?: Funcion;
  faqs: Faq[];
  relacionados: string[];
}

export const glosario: Termino[] = [
  /* ---------------------------- Turnos y agenda ---------------------------- */
  {
    slug: "turno-online",
    articulo: "un",
    termino: "Turno online",
    categoria: "Turnos y agenda",
    definicion: "Un turno online es una reserva que el cliente saca solo, desde internet, eligiendo servicio, día y horario sin llamar ni escribir para coordinar.",
    titulo: "Qué es un turno online y cómo funciona",
    analisis: [
      {
        titulo: "Cómo funciona un turno online",
        texto: [
          "El cliente abre el link del negocio desde el celular, elige el servicio, ve solo los horarios libres y confirma. No hay idas y vueltas de mensajes preguntando “¿tenés lugar el jueves?”.",
          "La agenda se llena también fuera del horario de atención: el link está disponible las 24 horas, incluso mientras estás atendiendo o durmiendo.",
        ],
      },
      {
        titulo: "Por qué los clientes lo prefieren",
        texto: [
          "Para el cliente es más rápido: ve precios y horarios de un vistazo y reserva en menos de un minuto. Para el negocio, cada turno llega con los datos completos y sin errores de anotación.",
        ],
      },
    ],
    solucion: [
      "Cada negocio tiene su link propio (prestum.com.ar/tu-negocio), activo apenas te registrás.",
      "El cliente elige servicio, profesional, día, hora y medio de pago; la reserva te llega armada a WhatsApp.",
      "Los horarios ocupados desaparecen solos del link, así nadie reserva encima de otro.",
    ],
    faqs: [
      { q: "¿El cliente tiene que descargar una app?", a: "No. Reserva desde el navegador del celular abriendo el link del negocio." },
      { q: "¿Puedo seguir dando turnos por teléfono?", a: "Sí. Los turnos online conviven con los que das vos; lo importante es que todos queden en la misma agenda." },
    ],
    relacionados: ["agenda-online", "link-de-reservas", "confirmacion-de-turno"],
  },
  {
    slug: "agenda-online",
    articulo: "una",
    termino: "Agenda online",
    categoria: "Turnos y agenda",
    definicion: "Una agenda online es el calendario de turnos de un negocio disponible en internet, que se actualiza sola con cada reserva y muestra solo los horarios libres.",
    titulo: "Qué es una agenda online para negocios",
    analisis: [
      {
        titulo: "Qué reemplaza",
        texto: [
          "Reemplaza al cuaderno, al Excel o a las notas del celular. Muestra los días y horarios de atención y marca automáticamente los turnos tomados.",
          "Como está en internet, la ves desde cualquier lugar y la comparte todo el equipo: no hay dos versiones distintas de la agenda.",
        ],
      },
      {
        titulo: "La duración importa",
        texto: [
          "Una buena agenda online respeta la duración de cada servicio: un trabajo de una hora bloquea una hora, no media. Así se evitan los turnos pisados y las esperas.",
        ],
      },
    ],
    solucion: [
      "Cada servicio tiene su duración y su precio; la agenda calcula sola qué horarios quedan libres.",
      "Horarios por día de la semana, con hasta dos franjas por día (ideal para horario cortado).",
      "Elegís con cuántos días de anticipación se puede reservar.",
    ],
    faqs: [
      { q: "¿La agenda online sirve si tengo varios profesionales?", a: "Sí. Cada profesional puede tener su propia agenda, sus servicios y sus horarios." },
      { q: "¿Puedo bloquear un día?", a: "Sí, cerrás ese día en los horarios y deja de aparecer en el link." },
    ],
    relacionados: ["turno-online", "agenda-por-profesional", "horario-cortado"],
  },
  {
    slug: "link-de-reservas",
    articulo: "un",
    termino: "Link de reservas",
    categoria: "Turnos y agenda",
    definicion: "El link de reservas es la dirección web propia de un negocio donde sus clientes sacan turno solos, por ejemplo prestum.com.ar/mi-negocio.",
    titulo: "Qué es un link de reservas y dónde ponerlo",
    analisis: [
      {
        titulo: "Para qué sirve",
        texto: [
          "Es una dirección única que compartís con tus clientes. Al abrirla ven los servicios, los precios y los horarios libres, y reservan en pocos toques.",
        ],
      },
      {
        titulo: "Dónde genera más reservas",
        texto: [
          "En la bio de Instagram, en el estado y las respuestas rápidas de WhatsApp Business, en la ficha de Google Maps y en los mensajes automáticos de ausencia.",
          "Cuanto más visible está, menos mensajes de “¿tenés turno?” vas a tener que contestar.",
        ],
      },
    ],
    solucion: [
      "Tu link tiene la forma prestum.com.ar/nombre-del-negocio y lo elegís al registrarte.",
      "Si tenés varias sucursales, cada una tiene su propio link.",
      "Desde el panel lo copiás o lo compartís por WhatsApp con un toque.",
    ],
    faqs: [
      { q: "¿Puedo cambiar el nombre del link?", a: "El link se arma con el nombre del negocio al registrarte; si necesitás cambiarlo, escribinos." },
      { q: "¿Sirve para poner en Google Maps?", a: "Sí. En tu ficha de Google Maps podés cargarlo como sitio web o link de reservas." },
    ],
    relacionados: ["turno-online", "whatsapp-business", "agenda-online"],
  },
  {
    slug: "no-show",
    articulo: "el",
    termino: "No-show (ausentismo)",
    categoria: "Turnos y agenda",
    definicion: "No-show es cuando un cliente reserva un turno y no se presenta ni avisa. Ese horario queda vacío y no se puede ofrecer a otra persona.",
    titulo: "Qué es el no-show y cómo reducir el ausentismo",
    analisis: [
      {
        titulo: "Cuánto cuesta un no-show",
        texto: [
          "Cada ausencia es un horario que no se cobra y que ya no se puede vender. Si tu servicio sale $15.000 y tenés 4 ausencias por semana, perdés unos $240.000 por mes.",
        ],
      },
      {
        titulo: "Las 4 formas más efectivas de bajarlo",
        texto: [
          "1) Enviar un recordatorio el día anterior. 2) Pedir seña en servicios caros o largos. 3) Tener lista de espera para llenar el hueco si alguien cancela. 4) Medirlo: lo que no se mide no se mejora.",
        ],
      },
    ],
    solucion: [
      "Recordatorio por WhatsApp con un toque desde cada turno, con tu propio texto.",
      "Seña opcional: si no se marca como pagada en el plazo que elegís, el horario se libera solo.",
      "Marcás “No vino” en el turno y los reportes te muestran tu porcentaje de ausentismo.",
    ],
    funcion: "recordatorios",
    faqs: [
      { q: "¿Qué porcentaje de ausentismo es normal?", a: "Depende del rubro, pero si más de 1 de cada 10 turnos no se presenta, conviene sumar recordatorios y seña." },
      { q: "¿Conviene cobrar seña siempre?", a: "No necesariamente. Es más útil en servicios largos o caros; en servicios cortos suele alcanzar con el recordatorio." },
    ],
    relacionados: ["recordatorio-de-turno", "sena", "lista-de-espera"],
  },
  {
    slug: "recordatorio-de-turno",
    articulo: "un",
    termino: "Recordatorio de turno",
    categoria: "Turnos y agenda",
    definicion: "Un recordatorio de turno es un aviso que recibe el cliente antes de su reserva, generalmente por WhatsApp, para que no se olvide ni falte.",
    titulo: "Qué es un recordatorio de turno y cuándo enviarlo",
    analisis: [
      {
        titulo: "Cuándo enviarlo",
        texto: [
          "Lo más común es el día anterior, o unas horas antes si el turno es temprano a la mañana. Debe incluir fecha, hora, servicio y dirección.",
        ],
      },
      {
        titulo: "Por qué funciona",
        texto: [
          "Muchos no-show son simples olvidos. Un mensaje a tiempo también permite que el cliente avise si no puede ir y el horario se libere para otro.",
        ],
      },
    ],
    solucion: [
      "En cada turno tocás “Recordar” y se abre WhatsApp con el mensaje listo para enviar.",
      "Personalizás el texto con {nombre}, {negocio}, {fecha}, {hora} y {servicio}.",
      "El panel te avisa cuántos turnos de mañana todavía no recordaste.",
    ],
    funcion: "recordatorios",
    faqs: [
      { q: "¿Se envían solos?", a: "No usamos bots: el mensaje se arma solo y vos lo enviás con un toque desde tu WhatsApp, así sale con tu número." },
      { q: "¿Puedo cambiar el texto?", a: "Sí, desde Mi página → Recordatorios por WhatsApp." },
    ],
    relacionados: ["no-show", "confirmacion-de-turno", "whatsapp-business"],
  },
  {
    slug: "lista-de-espera",
    articulo: "una",
    termino: "Lista de espera",
    categoria: "Turnos y agenda",
    definicion: "La lista de espera es el registro de clientes que quieren un turno en un horario ya ocupado, para avisarles si se libera un lugar.",
    titulo: "Qué es una lista de espera de turnos",
    analisis: [
      {
        titulo: "Para qué sirve",
        texto: [
          "Cuando alguien cancela, ese horario suele quedar vacío porque no hay tiempo de conseguir otro cliente. Con una lista de espera, ya sabés a quién avisarle.",
          "Es especialmente útil los días más pedidos, como viernes y sábados.",
        ],
      },
    ],
    solucion: [
      "Si un día está lleno, el cliente se anota en la lista de espera desde tu link.",
      "Cuando se cancela un turno, el panel te avisa “hay lugar” y le escribís por WhatsApp con un toque.",
    ],
    funcion: "lista_espera",
    faqs: [
      { q: "¿Se le avisa automáticamente al cliente?", a: "El panel te muestra el aviso y el mensaje armado; vos lo enviás desde tu WhatsApp con un toque." },
    ],
    relacionados: ["no-show", "ocupacion", "sobreturno"],
  },
  {
    slug: "sobreturno",
    articulo: "un",
    termino: "Sobreturno (doble reserva)",
    categoria: "Turnos y agenda",
    definicion: "Un sobreturno o doble reserva es cuando dos clientes quedan citados en el mismo horario con el mismo profesional, por error o a propósito.",
    titulo: "Qué es un sobreturno y cómo evitar los turnos duplicados",
    analisis: [
      {
        titulo: "Por qué pasa",
        texto: [
          "Pasa cuando la agenda está en varios lugares (cuaderno, WhatsApp, la recepción) o cuando dos personas reservan el mismo horario al mismo tiempo.",
          "El resultado es un cliente esperando, otro enojado y un profesional apurado.",
        ],
      },
    ],
    solucion: [
      "Cada reserva se valida en el servidor: dos clientes no pueden quedarse con el mismo horario del mismo profesional, aunque reserven en el mismo segundo.",
      "Se tiene en cuenta la duración del servicio: un turno largo bloquea todo su tiempo.",
      "Con “Cualquiera”, el sistema asigna automáticamente un profesional libre.",
    ],
    faqs: [
      { q: "¿Puedo dar dos turnos a la misma hora si tengo dos profesionales?", a: "Sí. Cada profesional tiene su agenda: a la misma hora puede haber un turno por cada uno." },
    ],
    relacionados: ["agenda-por-profesional", "agenda-online", "lista-de-espera"],
  },
  {
    slug: "horario-cortado",
    articulo: "el",
    termino: "Horario cortado",
    categoria: "Turnos y agenda",
    definicion: "Horario cortado es atender en dos franjas por día —por ejemplo de 9 a 13 y de 17 a 21— con un corte al mediodía, muy común en el interior de Argentina.",
    analisis: [
      {
        titulo: "Cómo afecta a los turnos",
        texto: [
          "Si la agenda no lo contempla, el cliente ve horarios en la siesta que en realidad no existen, y hay que cancelarle o reprogramarle.",
        ],
      },
    ],
    solucion: [
      "Cargás hasta dos franjas por día de la semana, y el link solo ofrece turnos dentro de esas franjas.",
      "Cada profesional puede tener su propio horario, distinto del general del negocio.",
    ],
    faqs: [
      { q: "¿Puedo tener horario corrido unos días y cortado otros?", a: "Sí, cada día de la semana se configura por separado." },
    ],
    relacionados: ["agenda-online", "agenda-por-profesional", "ocupacion"],
  },
  {
    slug: "agenda-por-profesional",
    articulo: "la",
    termino: "Agenda por profesional",
    categoria: "Turnos y agenda",
    definicion: "La agenda por profesional es cuando cada miembro del equipo tiene su propio calendario de turnos, con sus servicios y horarios, dentro del mismo negocio.",
    analisis: [
      {
        titulo: "Cuándo la necesitás",
        texto: [
          "Apenas tenés más de una persona atendiendo: no todos hacen los mismos servicios ni trabajan los mismos días.",
          "Muchos clientes además quieren elegir con quién atenderse.",
        ],
      },
    ],
    solucion: [
      "Cada profesional (o sala, box o cancha) tiene sus servicios y, si querés, su propio horario.",
      "El cliente elige con quién atenderse o toca “Cualquiera” y se asigna uno libre.",
      "Con el rol profesional, cada uno ve solo sus propios turnos.",
    ],
    faqs: [
      { q: "¿Cuántos profesionales puedo cargar?", a: "1 en el plan Gratis, hasta 2 en el plan Básico e ilimitados en el plan Premium." },
    ],
    relacionados: ["comisiones-por-profesional", "roles-y-permisos", "sobreturno"],
  },
  {
    slug: "confirmacion-de-turno",
    articulo: "la",
    termino: "Confirmación de turno",
    categoria: "Clientes y WhatsApp",
    definicion: "La confirmación de turno es el mensaje que recibe el cliente cuando su reserva quedó registrada, con el día, la hora y el servicio.",
    analisis: [
      {
        titulo: "Por qué es importante",
        texto: [
          "Le da tranquilidad al cliente y deja todo por escrito: si hay un malentendido con el horario, se aclara en el momento y no el día del turno.",
        ],
      },
    ],
    solucion: [
      "Al reservar, el cliente ve la confirmación en pantalla y se abre WhatsApp con el resumen del turno para enviártelo.",
      "Vos recibís el mensaje con nombre, servicio, profesional, fecha, hora y medio de pago.",
    ],
    faqs: [{ q: "¿El cliente recibe un mail?", a: "No hace falta: todo queda en la conversación de WhatsApp con tu negocio." }],
    relacionados: ["recordatorio-de-turno", "turno-online", "whatsapp-business"],
  },

  /* ---------------------------- Finanzas y métricas ---------------------------- */
  {
    slug: "sena",
    articulo: "una",
    termino: "Seña",
    categoria: "Finanzas y métricas",
    definicion: "La seña es un pago parcial por adelantado que asegura un turno y reduce las ausencias y cancelaciones de último momento.",
    titulo: "Qué es una seña y cómo cobrarla por transferencia o Mercado Pago",
    analisis: [
      {
        titulo: "Cuándo conviene pedir seña",
        texto: [
          "En servicios largos o caros: tratamientos estéticos, uñas esculpidas, detailing de autos, sesiones de más de una hora. Ahí una ausencia duele mucho.",
          "Suele ser un porcentaje del precio (20% a 50%) o un monto fijo.",
        ],
      },
      {
        titulo: "Cómo comunicarla",
        texto: [
          "Antes de reservar, el cliente tiene que saber cuánto es, cómo se paga, en cuánto tiempo y qué pasa si cancela. La claridad evita discusiones.",
        ],
      },
    ],
    solucion: [
      "La seña es 100% opcional: elegís si tus clientes reservan sin pagar o con seña.",
      "Porcentaje o monto fijo, con tu alias o CBU y, si querés, tu link de pago de Mercado Pago.",
      "Si no la marcás como pagada en el plazo que elegís (30 minutos a 24 horas), el horario se libera solo.",
    ],
    funcion: "sena",
    faqs: [
      { q: "¿Prestum cobra comisión por la seña?", a: "No. El cliente te paga directo a tu cuenta; Prestum no toca el dinero." },
      { q: "¿Qué pasa si el cliente no paga la seña?", a: "Pasado el plazo que elegiste, el turno se cancela y el horario vuelve a estar disponible." },
    ],
    relacionados: ["no-show", "caja-diaria", "ticket-promedio"],
  },
  {
    slug: "caja-diaria",
    articulo: "la",
    termino: "Caja diaria (arqueo)",
    categoria: "Finanzas y métricas",
    definicion: "La caja diaria es el registro de todo lo que entra y sale de dinero en el día; el arqueo es contar lo que hay y compararlo con lo registrado.",
    titulo: "Qué es la caja diaria y cómo hacer el arqueo",
    analisis: [
      {
        titulo: "Cómo se hace",
        texto: [
          "Se anotan los ingresos (cada servicio cobrado) y los egresos (productos, insumos, gastos) separados por medio de pago: efectivo, transferencia y Mercado Pago.",
          "Al cierre, el efectivo contado tiene que coincidir con el saldo en efectivo registrado. Si no coincide, hay un cobro sin anotar o un gasto olvidado.",
        ],
      },
    ],
    solucion: [
      "Al marcar un turno como “Cobrado”, el ingreso entra solo a la caja con su medio de pago.",
      "Cargás egresos e ingresos extra en segundos.",
      "Ves ingresos, egresos y saldo de hoy, de los últimos 7 días o del mes.",
    ],
    funcion: "caja",
    faqs: [{ q: "¿La recepción puede usar la caja?", a: "Sí. Con roles, recepción carga movimientos y el dueño es el único que puede borrarlos y ver las comisiones." }],
    relacionados: ["comisiones-por-profesional", "ticket-promedio", "sena"],
  },
  {
    slug: "comisiones-por-profesional",
    articulo: "la",
    termino: "Comisiones por profesional",
    categoria: "Finanzas y métricas",
    definicion: "La comisión por profesional es el porcentaje de lo facturado que le corresponde a cada miembro del equipo por los servicios que atendió.",
    titulo: "Cómo calcular las comisiones de tu equipo",
    analisis: [
      {
        titulo: "Cómo se calcula",
        texto: [
          "Se suma lo que facturó cada profesional en el período y se multiplica por su porcentaje. Si alguien facturó $800.000 y cobra el 40%, le corresponden $320.000.",
          "El problema habitual es reconstruir a fin de mes quién atendió qué: si no queda registrado en cada turno, aparecen diferencias y discusiones.",
        ],
      },
    ],
    solucion: [
      "Cargás el % de comisión de cada profesional.",
      "La caja calcula cuánto facturó cada uno y cuánto le corresponde, en el período que elijas.",
      "Cada turno queda asociado al profesional que lo atendió.",
    ],
    funcion: "caja",
    faqs: [{ q: "¿Cada profesional puede tener un porcentaje distinto?", a: "Sí, el porcentaje se configura por profesional." }],
    relacionados: ["caja-diaria", "agenda-por-profesional", "roles-y-permisos"],
  },
  {
    slug: "ticket-promedio",
    articulo: "el",
    termino: "Ticket promedio",
    categoria: "Finanzas y métricas",
    definicion: "El ticket promedio es lo que gasta en promedio cada cliente por visita: lo facturado dividido por la cantidad de turnos atendidos.",
    titulo: "Qué es el ticket promedio y cómo subirlo",
    analisis: [
      {
        titulo: "Cómo se calcula",
        texto: [
          "Si en el mes facturaste $1.500.000 con 100 turnos, tu ticket promedio es de $15.000.",
        ],
      },
      {
        titulo: "Cómo subirlo",
        texto: [
          "Suele ser más fácil que conseguir clientes nuevos: combos, servicios adicionales, versiones premium y actualizar precios a tiempo.",
        ],
      },
    ],
    solucion: [
      "El panel muestra turnos e ingresos del período.",
      "Los reportes calculan el ticket promedio solo, mes a mes.",
    ],
    funcion: "reportes",
    faqs: [{ q: "¿Se cuentan los turnos cancelados?", a: "No, solo los turnos válidos del período." }],
    relacionados: ["ocupacion", "horarios-pico", "caja-diaria"],
  },
  {
    slug: "ocupacion",
    articulo: "la",
    termino: "Tasa de ocupación",
    categoria: "Finanzas y métricas",
    definicion: "La tasa de ocupación es el porcentaje de horarios disponibles que efectivamente se reservan en un período.",
    titulo: "Qué es la tasa de ocupación de la agenda",
    analisis: [
      {
        titulo: "Cómo se calcula",
        texto: [
          "Si atendés 40 horas por semana y tenés 30 horas reservadas, tu ocupación es del 75%.",
          "Mirarla por día y por franja muestra dónde hay huecos: muchos negocios están llenos los sábados y vacíos los martes a la tarde.",
        ],
      },
    ],
    solucion: [
      "Los reportes muestran los turnos por día de la semana y por hora.",
      "Con eso ajustás horarios, promociones en horas flojas o sumás un profesional en los picos.",
    ],
    funcion: "reportes",
    faqs: [{ q: "¿Qué ocupación es buena?", a: "Por encima del 70–80% la agenda está sana; si estás siempre al 100%, quizás conviene subir precios o sumar gente." }],
    relacionados: ["horarios-pico", "ticket-promedio", "lista-de-espera"],
  },
  {
    slug: "horarios-pico",
    articulo: "los",
    termino: "Horarios pico",
    categoria: "Finanzas y métricas",
    definicion: "Los horarios pico son las franjas del día y de la semana con más demanda de turnos, donde la agenda se llena primero.",
    analisis: [
      {
        titulo: "Para qué sirve conocerlos",
        texto: [
          "Te permite poner más gente en esos momentos, cobrar distinto, o mover clientes flexibles a horarios con menos demanda.",
        ],
      },
    ],
    solucion: [
      "El reporte de horarios pico muestra cuántos turnos hubo en cada hora y cuál fue la más pedida.",
      "También ves la distribución por día de la semana y por mes.",
    ],
    funcion: "reportes",
    faqs: [{ q: "¿Puedo ver los datos de todas las sucursales juntas?", a: "Sí, los reportes se pueden ver por sucursal o de todas juntas." }],
    relacionados: ["ocupacion", "ticket-promedio", "multi-sucursal"],
  },

  /* ---------------------------- Administración ---------------------------- */
  {
    slug: "multi-sucursal",
    articulo: "la",
    termino: "Administración multi-sucursal",
    categoria: "Administración",
    definicion: "La administración multi-sucursal es manejar varios locales de un mismo negocio desde un solo panel, con agendas, equipos y números separados por sede.",
    titulo: "Cómo administrar varias sucursales desde un solo panel",
    analisis: [
      {
        titulo: "El problema de tener varias sedes",
        texto: [
          "Cada sucursal termina con su propio cuaderno o su propia cuenta, y el dueño no tiene una foto completa del negocio.",
        ],
      },
    ],
    solucion: [
      "Cada sucursal tiene su link, sus servicios, sus horarios y su equipo.",
      "Desde el mismo panel cambiás de sucursal en un toque.",
      "Las métricas y reportes se ven por sucursal o todas juntas.",
    ],
    faqs: [{ q: "¿En qué plan están las sucursales?", a: "Las cuentas con varios locales se arman a medida: escribinos por WhatsApp y te pasamos el plan." }],
    relacionados: ["roles-y-permisos", "horarios-pico", "agenda-por-profesional"],
  },
  {
    slug: "roles-y-permisos",
    articulo: "los",
    termino: "Roles y permisos",
    categoria: "Administración",
    definicion: "Los roles y permisos definen qué puede ver y hacer cada persona del equipo en el sistema: por ejemplo, que un profesional vea su agenda pero no la caja del negocio.",
    titulo: "Roles y permisos para empleados: qué puede ver cada uno",
    analisis: [
      {
        titulo: "Por qué separar accesos",
        texto: [
          "Compartir una sola contraseña con todo el equipo expone la facturación y permite que cualquiera borre o cambie cosas sin dejar rastro.",
        ],
      },
    ],
    solucion: [
      "Dueño: ve y configura todo, incluidas caja, comisiones, reportes y plan.",
      "Recepción: maneja los turnos y la caja del día, sin acceso a la configuración.",
      "Profesional: ve solo sus propios turnos.",
    ],
    faqs: [{ q: "¿Cómo invito a alguien del equipo?", a: "Desde Equipo cargás su email y su rol; le pasás el link de invitación y se registra con su propia clave." }],
    relacionados: ["multi-sucursal", "comisiones-por-profesional", "caja-diaria"],
  },

  /* ---------------------------- Clientes y WhatsApp ---------------------------- */
  {
    slug: "fidelizacion-de-clientes",
    articulo: "la",
    termino: "Fidelización de clientes",
    categoria: "Clientes y WhatsApp",
    definicion: "La fidelización de clientes son las acciones para que un cliente vuelva y elija siempre tu negocio, como premiar cada cierta cantidad de visitas.",
    titulo: "Qué es la fidelización de clientes y cómo armar un programa simple",
    analisis: [
      {
        titulo: "Por qué conviene",
        texto: [
          "Conseguir un cliente nuevo cuesta más que retener a uno que ya conoce tu trabajo. Un premio simple y fácil de entender (“cada 5 visitas, la 6ª es gratis”) motiva a volver.",
        ],
      },
    ],
    solucion: [
      "Elegís cada cuántas visitas la siguiente es gratis.",
      "El cliente se identifica con su WhatsApp al reservar y ve cuánto le falta para el premio.",
      "El turno gratis se marca solo cuando corresponde.",
    ],
    funcion: "fidelizacion",
    faqs: [{ q: "¿El cliente necesita una tarjeta de puntos?", a: "No. Se cuenta solo con su número de WhatsApp." }],
    relacionados: ["whatsapp-business", "ticket-promedio", "confirmacion-de-turno"],
  },
  {
    slug: "whatsapp-business",
    articulo: "",
    termino: "WhatsApp Business",
    categoria: "Clientes y WhatsApp",
    definicion: "WhatsApp Business es la versión gratuita de WhatsApp para negocios: suma perfil de empresa, catálogo, respuestas rápidas, etiquetas y mensajes automáticos de bienvenida y ausencia.",
    titulo: "WhatsApp Business para dar turnos: cómo aprovecharlo",
    analisis: [
      {
        titulo: "Qué conviene configurar",
        texto: [
          "Perfil con dirección y horarios, mensaje de bienvenida y de ausencia con tu link de reservas, y respuestas rápidas para las preguntas frecuentes (precios, dirección, medios de pago).",
          "Así cada consulta de “¿tenés turno?” se responde con el link y el cliente reserva solo.",
        ],
      },
    ],
    solucion: [
      "Las reservas te llegan a tu WhatsApp, con tu mismo número de siempre.",
      "Recordatorios, avisos de lista de espera y mensajes al cliente se envían con un toque desde el panel.",
      "No usamos bots ni hace falta la API de WhatsApp.",
    ],
    faqs: [{ q: "¿Funciona con WhatsApp común o solo con Business?", a: "Con los dos. Business suma herramientas útiles, pero no es obligatorio." }],
    relacionados: ["link-de-reservas", "recordatorio-de-turno", "confirmacion-de-turno"],
  },
];

export const getTermino = (slug: string) => glosario.find((t) => t.slug === slug);
