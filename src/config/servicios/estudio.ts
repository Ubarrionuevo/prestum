import type { Faq } from "../types";
import { site } from "../site";

/**
 * SERVICIOS (diseño web, Tiendanube, SEO y sistemas a medida).
 * Viven en prestum.com.ar/servicios pero con MARCA PROPIA: no se mezclan con Prestum Turnos
 * (ni el header, ni el footer, ni los datos estructurados, ni el llms.txt los nombran entre sí).
 * Para cambiar el nombre de la marca, se cambia `nombre` acá y se replica en todo.
 */
export const estudio = {
  nombre: "Solvion Estudio",
  base: "/servicios",
  whatsapp: site.whatsappVentas,
  telefono: "+54 9 383 403-5119",
  region: "Catamarca",
  /** Definición canónica (GEO): la misma frase en meta, JSON-LD y llms.txt. */
  definicion:
    "Solvion Estudio es un estudio argentino de diseño de páginas web, tiendas Tiendanube, posicionamiento SEO y sistemas a medida para negocios, comercios y profesionales de todo el país. Landing page desde $150.000, tienda Tiendanube desde $250.000 y SEO desde $150.000, con precios fijos en pesos argentinos y contacto directo por WhatsApp.",
  bajada:
    "Diseñamos páginas web, armamos tiendas Tiendanube, posicionamos negocios en Google y en las IA, y desarrollamos sistemas a medida. Precios fijos en pesos y todo por WhatsApp.",
} as const;

export type ServicioSlug = "diseno-web" | "tiendanube" | "posicionamiento-seo" | "sistemas-a-medida";

export interface Servicio {
  slug: ServicioSlug;
  nombre: string;
  /** Para títulos: "Diseño de páginas web", "Posicionamiento SEO"… */
  titulo: string;
  emoji: string;
  plan: string;
  /** En pesos. Sin precio = a consultar. */
  precio?: number;
  desde: boolean;
  descripcion: string;
  bajada: string;
  incluye: string[];
  proceso: { t: string; d: string }[];
  faqs: Faq[];
  keywords: string[];
}

export const formatoPesos = (n: number) => `$${n.toLocaleString("es-AR")}`;
export const precioTexto = (s: Pick<Servicio, "precio" | "desde">) =>
  s.precio ? `${s.desde ? "desde " : ""}${formatoPesos(s.precio)}` : "a consultar";

export const servicios: Servicio[] = [
  {
    slug: "diseno-web",
    nombre: "Diseño web",
    titulo: "Diseño de páginas web",
    emoji: "🖥️",
    plan: "Landing page",
    precio: 150000,
    desde: true,
    descripcion:
      "Diseño de páginas web para negocios, comercios y profesionales de Argentina: rápidas, pensadas para el celular y con WhatsApp directo. Landing page desde $150.000.",
    bajada:
      "Una página pensada para un solo objetivo: que el que entra te escriba. Rápida en el celular, con tus servicios y precios claros, y un botón que lleva a tu WhatsApp con el mensaje armado.",
    incluye: [
      "Diseño a medida, adaptado a celular primero",
      "Botón de WhatsApp con mensaje armado según la sección",
      "Servicios, precios y preguntas frecuentes",
      "Ubicación con mapa y horarios",
      "SEO técnico base: títulos, descripción y datos estructurados",
      "Carga rápida (sin plantillas pesadas)",
      "Conexión con tu dominio propio",
    ],
    proceso: [
      { t: "Charla por WhatsApp", d: "Nos contás qué hace tu negocio y a quién le vendés. Te pasamos el plazo y el precio cerrado." },
      { t: "Contenido", d: "Nos mandás logo, fotos y datos. Si no tenés textos, los escribimos nosotros." },
      { t: "Diseño y armado", d: "Armamos la página y te la mostramos funcionando. Incluye una ronda de ajustes." },
      { t: "Publicación", d: "La publicamos con tu dominio y te dejamos todo listo para recibir consultas." },
    ],
    faqs: [
      { q: "¿Qué es una landing page?", a: "Es una página web de una sola sección larga, armada para que el visitante haga una cosa: escribirte, reservar o comprar. Es la forma más rápida y barata de tener presencia profesional." },
      { q: "¿La web queda a mi nombre?", a: "Sí. El dominio se registra a tu nombre y la web es tuya." },
      { q: "¿Puedo sumar más secciones después?", a: "Sí. Se puede ampliar con más páginas, un blog, una tienda o un sistema cuando lo necesites." },
    ],
    keywords: ["diseño de páginas web", "diseño web argentina", "landing page", "página web para negocios", "cuánto cuesta una página web"],
  },
  {
    slug: "tiendanube",
    nombre: "Tiendanube",
    titulo: "Tiendas Tiendanube",
    emoji: "🛍️",
    plan: "Tienda Tiendanube",
    precio: 250000,
    desde: true,
    descripcion:
      "Armado y rediseño de tiendas Tiendanube en Argentina: catálogo cargado, Mercado Pago, cuotas y envíos listos para vender. Desde $250.000.",
    bajada:
      "Te armamos la tienda desde cero o rediseñamos la que tenés si no está vendiendo. Catálogo ordenado, fotos que se ven bien en el celular, pagos en cuotas y envíos configurados.",
    incluye: [
      "Armado desde cero o rediseño de tu tienda actual",
      "Diseño pensado para comprar desde el celular",
      "Carga y orden del catálogo por categorías",
      "Mercado Pago, cuotas y transferencia",
      "Envíos configurados (Andreani, Correo Argentino o propios)",
      "Banners y portada para cada temporada",
      "SEO de categorías y productos",
    ],
    proceso: [
      { t: "Diagnóstico", d: "Si ya tenés tienda, la revisamos y te decimos qué le falta para vender. Si no, definimos categorías y medios de pago." },
      { t: "Diseño", d: "Armamos la portada, las categorías y la ficha de producto pensadas para el celular." },
      { t: "Catálogo y configuración", d: "Cargamos productos, variantes, pagos y envíos." },
      { t: "Lanzamiento", d: "Probamos una compra completa y te dejamos la tienda vendiendo." },
    ],
    faqs: [
      { q: "¿El plan de Tiendanube está incluido?", a: "No. El plan de Tiendanube lo pagás vos directamente a Tiendanube; nuestro precio es por el armado o el rediseño de la tienda." },
      { q: "¿Pueden rediseñar mi tienda sin perder ventas?", a: "Sí. Los cambios se preparan y se publican de una vez, sin cerrar la tienda." },
      { q: "¿Cargan todos los productos?", a: "Sí. Si tenés un catálogo muy grande, lo cargamos por planilla para que sea rápido." },
    ],
    keywords: ["tiendanube", "diseño tiendanube", "rediseño tiendanube", "armar tienda online", "tienda online argentina"],
  },
  {
    slug: "posicionamiento-seo",
    nombre: "Posicionamiento SEO",
    titulo: "Posicionamiento SEO",
    emoji: "📈",
    plan: "SEO y GEO",
    precio: 150000,
    desde: true,
    descripcion:
      "Posicionamiento SEO para negocios de Argentina: aparecé en Google, en Google Maps y en las respuestas de ChatGPT y Gemini. Desde $150.000.",
    bajada:
      "Hacemos que tu negocio aparezca cuando alguien de tu zona busca lo que vendés: en Google, en Google Maps y en las respuestas de ChatGPT y Gemini. Sin pagar anuncios todos los meses.",
    incluye: [
      "Auditoría técnica: velocidad, indexación y errores",
      "Páginas por servicio, rubro y zona",
      "Datos estructurados para Google",
      "Ficha de Google Maps optimizada",
      "Preparación para IA (ChatGPT, Gemini): llms.txt y definición de marca",
      "Alta en Search Console y aviso de cambios (IndexNow)",
      "Artículos que responden lo que pregunta tu cliente",
    ],
    proceso: [
      { t: "Diagnóstico gratis", d: "Nos pasás tu web por WhatsApp y te decimos qué le falta para aparecer en tu zona." },
      { t: "Base técnica", d: "Corregimos velocidad, indexación, títulos y datos estructurados." },
      { t: "Contenido", d: "Creamos las páginas por servicio, rubro y zona que tu cliente busca." },
      { t: "Medición", d: "Seguimos impresiones, clics y consultas en Search Console y ajustamos." },
    ],
    faqs: [
      { q: "¿En cuánto tiempo se ven resultados?", a: "Las primeras impresiones suelen aparecer en semanas; las consultas constantes, en unos meses. Depende del rubro, la zona y la competencia." },
      { q: "¿Qué es el GEO?", a: "Es preparar tu web para que las IA como ChatGPT, Gemini o Claude te entiendan y te recomienden: una definición clara de tu negocio, datos estructurados y un archivo llms.txt." },
      { q: "¿Necesito tener web para hacer SEO?", a: "Para el SEO en Google sí conviene. Si no tenés, lo combinamos con una landing page." },
    ],
    keywords: ["posicionamiento seo", "seo local", "aparecer en google", "seo argentina", "aparecer en chatgpt"],
  },
  {
    slug: "sistemas-a-medida",
    nombre: "Sistemas a medida",
    titulo: "Sistemas y apps a medida",
    emoji: "⚙️",
    plan: "Sistema a medida",
    desde: false,
    descripcion:
      "Desarrollo de sistemas y apps a medida para negocios de Argentina: stock, ventas, turnos, pedidos, clientes y automatizaciones con WhatsApp. Presupuesto sin cargo.",
    bajada:
      "Si tu negocio todavía se maneja con planillas, cuadernos y mensajes sueltos, te armamos un sistema propio: stock, ventas, caja, pedidos, clientes o lo que necesites, accesible desde el celular.",
    incluye: [
      "Relevamiento de cómo trabaja tu negocio",
      "Panel web accesible desde la compu y el celular",
      "Usuarios con permisos (dueño, empleados)",
      "Integración con WhatsApp y Mercado Pago",
      "Reportes de ventas, caja y clientes",
      "Capacitación y soporte",
    ],
    proceso: [
      { t: "Relevamiento", d: "Vemos cómo trabajás hoy y qué querés dejar de hacer a mano." },
      { t: "Propuesta", d: "Te pasamos qué incluye el sistema, el plazo y el precio cerrado." },
      { t: "Desarrollo por etapas", d: "Te mostramos avances funcionando para que los pruebes con tu equipo." },
      { t: "Puesta en marcha", d: "Cargamos los datos iniciales y capacitamos al equipo." },
    ],
    faqs: [
      { q: "¿Cuánto cuesta un sistema a medida?", a: "Depende de lo que necesites. El presupuesto es sin cargo: nos contás cómo trabajás y te pasamos un precio cerrado." },
      { q: "¿Funciona desde el celular?", a: "Sí. Es un sistema web: se usa desde la compu, la tablet o el celular, sin instalar nada." },
      { q: "¿Puedo empezar con algo chico?", a: "Sí, y es lo que recomendamos: arrancar con lo que más tiempo te hace perder y sumar funciones después." },
    ],
    keywords: ["sistema a medida", "software a medida", "desarrollo de sistemas", "sistema de gestión a medida", "app para negocios"],
  },
];

export const getServicio = (slug: string) => servicios.find((s) => s.slug === slug);
export const servicioPath = (s: Pick<Servicio, "slug">) => `${estudio.base}/${s.slug}`;
export const waLink = (mensaje: string) => `https://wa.me/${estudio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
