import type { Faq } from "./types";
import { site } from "./site";

/**
 * PRESTUM GESTIÓN → /sistema-de-gestion
 * Sistema de gestión para kioscos, almacenes y minimercados: stock, ventas y caja, proveedores y fiado.
 * Se presenta como software propio (header, footer y color propios); no enlaza a Prestum Turnos ni a Solvion.
 * Por ahora el botón principal es "Pedí una demo" por WhatsApp (el alta online se suma cuando esté el backend).
 * Regla: nada de cifras, clientes ni testimonios inventados.
 */
export const gestion = {
  marca: "Prestum Gestión",
  base: "/sistema-de-gestion",
  precio: 25000,
  whatsapp: site.whatsappVentas,
  definicion:
    "Prestum Gestión es un sistema de gestión para kioscos, almacenes y minimercados de Argentina: control de stock, ventas y caja, proveedores y compras, y la libreta del fiado en un solo lugar, desde la computadora o el celular. Cuesta $25.000 por mes.",
} as const;

export const precioGestion = `$${gestion.precio.toLocaleString("es-AR")}`;
export const waGestion = (mensaje: string) => `https://wa.me/${gestion.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export interface FuncionGestion {
  slug: string;
  nombre: string;
  emoji: string;
  /** Búsqueda principal a la que apunta. */
  busqueda: string;
  titulo: string;
  descripcion: string;
  h1: string;
  bajada: string;
  /** Qué resuelve, en una frase (tarjetas). */
  corto: string;
  /** Lo que hace, ítem por ítem. */
  incluye: string[];
  /** Problemas de todos los días que resuelve. */
  dolores: string[];
  /** Cómo se usa en un día normal. */
  dia: Array<{ t: string; d: string }>;
  faqs: Faq[];
  keywords: string[];
}

export const funcionesGestion: FuncionGestion[] = [
  {
    slug: "control-de-stock",
    nombre: "Control de stock",
    emoji: "📦",
    busqueda: "sistema de control de stock",
    titulo: "Sistema de control de stock para kioscos y almacenes",
    descripcion: `Control de stock simple para kioscos, almacenes y minimercados: productos, precios, faltantes y aumentos masivos, desde la compu o el celular. ${precioGestion} por mes.`,
    h1: "Control de stock para tu kiosco o almacén",
    bajada: "Sabé qué tenés, qué se está por terminar y a qué precio vendés cada cosa, sin contar estantes ni revisar cuadernos.",
    corto: "Productos, precios, faltantes y aumentos masivos.",
    incluye: [
      "Carga de productos con precio de costo, precio de venta y categoría",
      "El stock baja solo con cada venta y sube con cada compra",
      "Aviso de productos con poco stock antes de que se terminen",
      "Aumento de precios por porcentaje, por categoría o por proveedor",
      "Productos por unidad o por peso (fiambres, verdura, a granel)",
      "Búsqueda rápida por nombre o código",
    ],
    dolores: [
      "Te enterás de que algo se terminó cuando un cliente te lo pide.",
      "Cada aumento de un proveedor es una tarde cambiando precios a mano.",
      "No sabés cuánta plata tenés inmovilizada en mercadería.",
      "Se pierde mercadería y no hay forma de saber cuánta ni cuál.",
    ],
    dia: [
      { t: "A la mañana", d: "Mirás la lista de faltantes y armás el pedido con lo que de verdad hace falta." },
      { t: "Llega el proveedor", d: "Cargás la compra y el stock de cada producto se actualiza solo." },
      { t: "Hay aumento", d: "Subís un porcentaje a toda la categoría o a todo lo de ese proveedor, en un paso." },
      { t: "Al cierre", d: "Ves qué se vendió más y qué está quieto en el estante." },
    ],
    faqs: [
      { q: "¿Tengo que cargar todos los productos el primer día?", a: "No. Podés empezar con lo que más vendés e ir sumando el resto mientras atendés. En la demo te mostramos la forma más rápida de cargarlos." },
      { q: "¿Sirve para productos que se venden por peso?", a: "Sí. Los productos pueden ser por unidad o por kilo, así que sirve para fiambres, verdura, legumbres o productos sueltos." },
      { q: "¿Puedo aumentar muchos precios a la vez?", a: "Sí. Podés aplicar un aumento por porcentaje a una categoría, a un proveedor o a una selección de productos." },
    ],
    keywords: ["sistema de control de stock", "control de stock kiosco", "programa de stock para almacén", "control de inventario comercio", "aumento masivo de precios"],
  },
  {
    slug: "punto-de-venta-y-caja",
    nombre: "Ventas y caja",
    emoji: "🧾",
    busqueda: "sistema punto de venta",
    titulo: "Punto de venta y caja diaria para kioscos y almacenes",
    descripcion: `Sistema de punto de venta y caja diaria para kioscos, almacenes y minimercados: ventas rápidas, medios de pago, apertura y cierre de caja. ${precioGestion} por mes.`,
    h1: "Punto de venta y caja diaria",
    bajada: "Cobrá rápido, registrá cada venta con su medio de pago y cerrá la caja sabiendo exactamente cuánto tiene que haber.",
    corto: "Ventas rápidas, medios de pago, apertura y cierre de caja.",
    incluye: [
      "Pantalla de venta rápida: buscás, sumás y cobrás",
      "Medios de pago: efectivo, transferencia, débito, crédito y billeteras",
      "Apertura y cierre de caja con el efectivo esperado",
      "Ingresos y retiros de caja (pago a un proveedor, cambio, gastos)",
      "Ventas del día, de la semana y del mes",
      "Varios usuarios: cada empleado con su acceso",
    ],
    dolores: [
      "Al cerrar, la caja no coincide y no sabés por qué.",
      "No sabés cuánto entró por transferencia y cuánto en efectivo.",
      "Cuando atiende otra persona, no tenés control de lo que se vendió.",
      "Anotar en un cuaderno las ventas grandes y olvidarte de las chicas.",
    ],
    dia: [
      { t: "Abrís", d: "Cargás el efectivo inicial de la caja." },
      { t: "Atendés", d: "Cada venta queda registrada con sus productos y su medio de pago." },
      { t: "Pagás algo", d: "Registrás el retiro: queda explicado por qué falta esa plata." },
      { t: "Cerrás", d: "El sistema te dice cuánto efectivo tiene que haber y comparás con lo que contaste." },
    ],
    faqs: [
      { q: "¿Funciona desde el celular?", a: "Sí. Podés vender desde la computadora del mostrador o desde el celular, y ver la caja desde tu casa." },
      { q: "¿Puedo tener empleados con acceso limitado?", a: "Sí. Cada persona entra con su usuario y vos ves qué vendió cada uno en su turno." },
      { q: "¿Registra transferencias y billeteras virtuales?", a: "Sí. Cada venta se registra con su medio de pago, así al cierre sabés cuánto entró por cada uno." },
    ],
    keywords: ["sistema punto de venta", "punto de venta kiosco", "caja diaria comercio", "programa para cobrar en almacén", "sistema de caja para negocio"],
  },
  {
    slug: "proveedores-y-compras",
    nombre: "Proveedores y compras",
    emoji: "🚚",
    busqueda: "sistema de proveedores y compras",
    titulo: "Proveedores, pedidos y compras para kioscos y almacenes",
    descripcion: `Ordená proveedores, pedidos y compras de tu kiosco o almacén: qué pedir, cuánto le debés a cada uno y cómo cambiaron sus precios. ${precioGestion} por mes.`,
    h1: "Proveedores, pedidos y compras",
    bajada: "Armá el pedido con lo que falta, registrá cada compra y sabé cuánto le debés a cada proveedor sin buscar remitos.",
    corto: "Pedidos, compras y cuenta corriente con cada proveedor.",
    incluye: [
      "Ficha de cada proveedor con sus productos y datos de contacto",
      "Pedido sugerido según lo que tenés con poco stock",
      "Registro de compras que actualiza stock y precio de costo",
      "Cuenta corriente con cada proveedor: lo que compraste y lo que pagaste",
      "Historial de precios de costo para ver los aumentos",
    ],
    dolores: [
      "El preventista pasa y no sabés qué pedirle.",
      "No sabés cuánto le debés a cada distribuidor.",
      "Un costo subió y seguís vendiendo al precio viejo.",
      "Los remitos se pierden y después no hay cómo reclamar.",
    ],
    dia: [
      { t: "Antes de que pase el preventista", d: "Abrís el pedido sugerido de ese proveedor con lo que está bajo." },
      { t: "Llega la mercadería", d: "Cargás la compra: sube el stock y se actualiza el costo." },
      { t: "Pagás", d: "Registrás el pago y baja lo que le debés." },
      { t: "Fin de mes", d: "Ves cuánto le compraste a cada uno y cuánto queda pendiente." },
    ],
    faqs: [
      { q: "¿Me avisa si un proveedor me subió el precio?", a: "Cuando cargás una compra con un costo distinto, queda registrado y podés actualizar el precio de venta en el momento." },
      { q: "¿Puedo llevar la cuenta con cada distribuidor?", a: "Sí. Cada proveedor tiene su cuenta corriente con compras y pagos, así sabés cuánto le debés." },
      { q: "¿Sirve el pedido sugerido si tengo muchos proveedores?", a: "Sí. El pedido se arma por proveedor, con los productos que le comprás a cada uno y que están con poco stock." },
    ],
    keywords: ["sistema de proveedores", "control de compras comercio", "pedido a proveedores kiosco", "cuenta corriente proveedores", "programa de compras almacén"],
  },
  {
    slug: "fiado-y-cuentas-corrientes",
    nombre: "Clientes y fiado",
    emoji: "📒",
    busqueda: "app para anotar fiado",
    titulo: "Libreta del fiado digital y cuentas corrientes de clientes",
    descripcion: `La libreta del fiado, digital: cuenta corriente de cada cliente, lo que lleva, lo que paga y el saldo, con aviso por WhatsApp. Para kioscos y almacenes. ${precioGestion} por mes.`,
    h1: "La libreta del fiado, digital",
    bajada: "Anotá lo que lleva cada cliente, registrá lo que paga y mandale el saldo por WhatsApp. Sin cuadernos, sin hojas sueltas y sin discusiones.",
    corto: "Cuenta corriente de cada cliente y saldo por WhatsApp.",
    incluye: [
      "Cuenta corriente de cada cliente con lo que llevó y lo que pagó",
      "Fiado desde la misma venta, con los productos detallados",
      "Pagos parciales o totales",
      "Saldo de cada cliente y total que te deben entre todos",
      "Resumen de cuenta para mandar por WhatsApp",
      "Límite de fiado por cliente",
    ],
    dolores: [
      "El cuaderno del fiado se moja, se pierde o nadie entiende la letra.",
      "El cliente dice que ya pagó y no tenés cómo mostrar lo contrario.",
      "No sabés cuánta plata tenés en la calle entre todos los que deben.",
      "Te da vergüenza cobrar porque no tenés el detalle a mano.",
    ],
    dia: [
      { t: "Un vecino lleva sin pagar", d: "Hacés la venta como siempre y la pasás a su cuenta." },
      { t: "Paga una parte", d: "Registrás el pago y el saldo se actualiza." },
      { t: "Pregunta cuánto debe", d: "Le mandás el resumen con el detalle por WhatsApp." },
      { t: "Fin de mes", d: "Ves quién debe, cuánto y desde cuándo." },
    ],
    faqs: [
      { q: "¿Puedo mandarle al cliente lo que debe?", a: "Sí. Le mandás por WhatsApp el resumen con lo que llevó, lo que pagó y el saldo." },
      { q: "¿Puedo ponerle un límite a lo que fía cada cliente?", a: "Sí. Si un cliente llega a su límite, el sistema te avisa antes de anotarle más." },
      { q: "¿Se ven los productos que llevó, o solo el monto?", a: "Se ven los productos de cada compra, así no hay discusión sobre qué se llevó." },
    ],
    keywords: ["app para anotar fiado", "libreta de fiado digital", "cuenta corriente clientes", "programa para fiado almacén", "control de fiado kiosco"],
  },
];

export interface RubroGestion {
  slug: string;
  nombre: string;
  singular: string;
  emoji: string;
  titulo: string;
  descripcion: string;
  h1: string;
  bajada: string;
  /** Cómo es el día a día del rubro (párrafo propio). */
  contexto: string;
  dolores: string[];
  /** Qué función pesa más en este rubro y por qué. */
  claves: Array<{ funcion: string; d: string }>;
  faqs: Faq[];
  keywords: string[];
}

export const rubrosGestion: RubroGestion[] = [
  {
    slug: "kioscos",
    nombre: "Kioscos",
    singular: "kiosco",
    emoji: "🍫",
    titulo: "Sistema para kioscos: stock, caja y ventas",
    descripcion: `Sistema de gestión para kioscos: ventas rápidas, caja diaria, control de stock de golosinas, cigarrillos y bebidas, y proveedores. ${precioGestion} por mes. Pedí una demo.`,
    h1: "Sistema de gestión para kioscos",
    bajada: "Cientos de productos chicos, ventas de pocos segundos y muchos proveedores. Ordená stock, caja y pedidos de tu kiosco sin frenar la atención.",
    contexto:
      "En un kiosco se venden cientos de productos de poco valor, muy rápido y muchas veces por persona distinta en cada turno. Golosinas, cigarrillos, bebidas, cargas y artículos de librería llegan de proveedores distintos y cambian de precio seguido. Lo que más pesa es poder cobrar en segundos, saber qué falta antes de que pase el preventista y que la caja cierre cuando atiende otro.",
    dolores: [
      "Las golosinas y bebidas aumentan seguido y los precios quedan viejos.",
      "Atienden varias personas por turno y la caja no cierra.",
      "Te quedás sin el producto que más se vende justo el fin de semana.",
      "Distribuidores de golosinas, bebidas y cigarrillos: cada uno con su pedido y su cuenta.",
    ],
    claves: [
      { funcion: "punto-de-venta-y-caja", d: "Cobrar en segundos y cerrar la caja de cada turno, sepas o no quién atendió." },
      { funcion: "control-de-stock", d: "Aumentos por categoría (golosinas, bebidas) y aviso de faltantes antes del fin de semana." },
      { funcion: "proveedores-y-compras", d: "Un pedido sugerido para cada distribuidor cuando pasa el preventista." },
    ],
    faqs: [
      { q: "¿Sirve para un kiosco chico atendido por el dueño?", a: "Sí. Se usa desde la computadora o el celular y no hace falta saber de sistemas. Te lo mostramos en una demo por WhatsApp." },
      { q: "¿Y si el kiosco abre 24 horas con varios turnos?", a: "Cada empleado entra con su usuario y cada turno cierra su caja, así sabés qué pasó en cada uno." },
      { q: "¿Cuánto cuesta el sistema para kioscos?", a: `${precioGestion} por mes, con stock, ventas y caja, proveedores y fiado incluidos.` },
    ],
    keywords: ["sistema para kioscos", "programa para kiosco", "sistema de gestión para kioscos", "software para kiosco", "sistema de stock para kiosco", "app para kiosco"],
  },
  {
    slug: "almacenes",
    nombre: "Almacenes",
    singular: "almacén",
    emoji: "🧺",
    titulo: "Sistema para almacenes: stock, caja y fiado",
    descripcion: `Sistema de gestión para almacenes y despensas: ventas y caja, stock por unidad o por peso, proveedores y la libreta del fiado digital. ${precioGestion} por mes. Pedí una demo.`,
    h1: "Sistema de gestión para almacenes y despensas",
    bajada: "El almacén de barrio vive del cliente de siempre: el que fía, el que lleva fiambre por peso y el que paga a fin de mes. Llevá todo eso ordenado.",
    contexto:
      "Un almacén o despensa de barrio combina productos envasados con fiambres, quesos y productos sueltos que se venden por peso. Los clientes son casi siempre los mismos, muchos llevan fiado y pagan cuando cobran. Lo que más pesa es tener el fiado claro, vender por peso sin errores y que los aumentos de los proveedores no te coman el margen.",
    dolores: [
      "El cuaderno del fiado no alcanza y las cuentas se discuten.",
      "Fiambres y quesos por peso, con precios que cambian todas las semanas.",
      "No sabés cuánta plata tenés en la calle entre todos los que deben.",
      "Los aumentos llegan con la factura y los precios de góndola quedan atrás.",
    ],
    claves: [
      { funcion: "fiado-y-cuentas-corrientes", d: "Cada cliente con su cuenta, sus compras detalladas y el saldo por WhatsApp." },
      { funcion: "control-de-stock", d: "Productos por kilo y por unidad, con aumentos por proveedor en un paso." },
      { funcion: "punto-de-venta-y-caja", d: "Cobrar rápido y saber al cierre cuánto entró en efectivo y cuánto por transferencia." },
    ],
    faqs: [
      { q: "¿Puedo vender fiambre y queso por peso?", a: "Sí. Cargás el producto por kilo y en la venta ponés el peso; el sistema calcula el precio." },
      { q: "¿Reemplaza el cuaderno del fiado?", a: "Sí. Cada cliente tiene su cuenta con lo que llevó y lo que pagó, y le podés mandar el saldo por WhatsApp." },
      { q: "¿Cuánto cuesta el sistema para almacenes?", a: `${precioGestion} por mes, con stock, ventas y caja, proveedores y fiado incluidos.` },
    ],
    keywords: ["sistema para almacén", "programa para almacén", "sistema de gestión para almacenes", "software para despensa", "programa para despensa", "sistema para almacén con fiado"],
  },
  {
    slug: "minimercados",
    nombre: "Minimercados",
    singular: "minimercado",
    emoji: "🛒",
    titulo: "Sistema para minimercados y autoservicios",
    descripcion: `Sistema de gestión para minimercados y autoservicios: cajas, empleados, miles de productos, proveedores y control de stock. ${precioGestion} por mes. Pedí una demo.`,
    h1: "Sistema de gestión para minimercados y autoservicios",
    bajada: "Más productos, más proveedores y más gente atendiendo. Controlá stock, cajas y compras de tu minimercado desde un solo lugar.",
    contexto:
      "Un minimercado o autoservicio maneja miles de productos de almacén, limpieza, perfumería, bebidas y frescos, con varios proveedores por categoría y empleados en caja. Lo que más pesa es controlar el stock a esa escala, que cada caja cierre por empleado y que las compras a cada distribuidor queden registradas con su costo.",
    dolores: [
      "Miles de productos y ningún control real de lo que entra y sale.",
      "Varios empleados en caja y diferencias que nadie explica.",
      "Muchos distribuidores, cada uno con su lista de precios y su cuenta.",
      "Productos vencidos o que no rotan ocupando lugar en la góndola.",
    ],
    claves: [
      { funcion: "control-de-stock", d: "Miles de productos por categoría, con aumentos masivos y alertas de faltantes." },
      { funcion: "punto-de-venta-y-caja", d: "Usuarios por empleado y cierre de caja de cada turno." },
      { funcion: "proveedores-y-compras", d: "Compras con su costo, cuenta con cada distribuidor y pedido sugerido." },
    ],
    faqs: [
      { q: "¿Aguanta miles de productos?", a: "Sí. Los productos se organizan por categoría y proveedor, y se buscan por nombre o código." },
      { q: "¿Puedo ver qué vendió cada empleado?", a: "Sí. Cada uno entra con su usuario y ves las ventas y la caja de cada turno." },
      { q: "¿Cuánto cuesta el sistema para minimercados?", a: `${precioGestion} por mes, con stock, ventas y caja, proveedores y fiado incluidos.` },
    ],
    keywords: ["sistema para minimercado", "programa para autoservicio", "sistema de gestión para minimercados", "software para autoservicio", "sistema para supermercado chico"],
  },
];

export const faqsGestion: Faq[] = [
  { q: "¿Qué es Prestum Gestión?", a: gestion.definicion },
  { q: "¿Cuánto cuesta?", a: `${precioGestion} por mes. Incluye control de stock, ventas y caja, proveedores y compras, y clientes y fiado.` },
  { q: "¿Tengo que instalar algo?", a: "No. Se usa desde el navegador de la computadora o del celular, y se puede agregar a la pantalla de inicio como una app." },
  { q: "¿Puedo verlo antes de contratar?", a: "Sí. Pedí una demo por WhatsApp y te mostramos el sistema funcionando con productos de tu rubro." },
  { q: "¿Sirve si no sé de computación?", a: "Sí. Está pensado para el mostrador: pantallas simples, botones grandes y lo justo para vender, controlar el stock y cerrar la caja." },
  { q: "¿Pueden usarlo mis empleados?", a: "Sí. Cada persona tiene su usuario y vos ves qué vendió cada uno y cómo cerró su caja." },
];

export const getFuncionGestion = (slug: string) => funcionesGestion.find((f) => f.slug === slug);
export const getRubroGestion = (slug: string) => rubrosGestion.find((r) => r.slug === slug);
export const funcionGestionPath = (f: Pick<FuncionGestion, "slug">) => `${gestion.base}/funciones/${f.slug}`;
export const rubroGestionPath = (r: Pick<RubroGestion, "slug">) => `${gestion.base}/${r.slug}`;
