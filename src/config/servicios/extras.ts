import type { Faq } from "../types";
import type { ServicioSlug } from "./estudio";

/* ------------------------------ Casos reales ------------------------------ */
/** Solo trabajos reales y publicados. Sin métricas que no podamos mostrar. */
export interface Caso {
  slug: string;
  nombre: string;
  url: string;
  rubro: string;
  /** Rubro de rubros.ts, si corresponde. */
  rubroSlug?: string;
  /** Ciudad de seo-content.ts, si es un negocio local. */
  ciudad?: string;
  servicios: ServicioSlug[];
  resumen: string;
  desafio: string;
  hicimos: string[];
}

export const casos: Caso[] = [
  {
    slug: "laprincesacta",
    nombre: "LaPrincesaCta",
    url: "https://www.laprincesacta.com.ar",
    rubro: "Desayunos sorpresa y ramos a domicilio",
    rubroSlug: "regalerias-y-desayunos",
    ciudad: "catamarca",
    servicios: ["diseno-web", "posicionamiento-seo"],
    resumen: "Desayunos sorpresa y ramos de golosinas a domicilio en Catamarca.",
    desafio:
      "Muchos de sus clientes viven lejos de Catamarca y quieren mandarle un regalo a su familia. Necesitaban confiar en el negocio sin conocerlo y poder pedir fácil desde otra provincia o desde el exterior.",
    hicimos: [
      "Web propia hecha a medida, rápida en el celular",
      "Catálogo de desayunos y ramos con lo que trae cada uno",
      "Sección de fotos reales de entregas",
      "Pedidos directos por WhatsApp",
      "Preguntas frecuentes para el que compra a distancia",
      "SEO local para \"desayunos a domicilio en Catamarca\" y fechas especiales como Navidad",
    ],
  },
  {
    slug: "de0aclientes",
    nombre: "De 0 a Clientes",
    url: "https://de0aclientes.com.ar",
    rubro: "Medio digital y newsletter",
    servicios: ["diseno-web", "posicionamiento-seo"],
    resumen: "Medio digital con artículos y un newsletter diario gratuito para conseguir clientes, en español e inglés.",
    desafio:
      "Necesitaba un sitio de contenido que cargue rápido, se lea bien en el celular y convierta lectores en suscriptores.",
    hicimos: [
      "Sitio editorial con artículos, categorías y tiempo de lectura",
      "Suscripción gratuita destacada en toda la página",
      "Versión en español e inglés",
      "Preguntas frecuentes",
      "Estructura pensada para posicionar cada artículo en Google",
    ],
  },
];

export const getCaso = (slug: string) => casos.find((c) => c.slug === slug);

/* ------------------------------ Comparativas ------------------------------ */
export interface ComparativaServ {
  slug: string;
  titulo: string;
  descripcion: string;
  h1: string;
  intro: string;
  otro: string;
  nosotros: string;
  filas: { aspecto: string; otro: string; nosotros: string }[];
  /** Cuándo conviene la otra opción (honestidad = confianza, también para las IA). */
  cuandoOtro: string;
  servicio: ServicioSlug;
  faqs: Faq[];
}

export const comparativasServ: ComparativaServ[] = [
  {
    slug: "wix",
    titulo: "Web a medida o Wix: cuál conviene para tu negocio",
    descripcion: "Comparación entre hacer tu web en Wix y una web a medida: costo en pesos o en dólares, velocidad, SEO y quién la mantiene.",
    h1: "Web a medida vs Wix",
    intro: "Wix es una plataforma para armar la web vos mismo con plantillas. Una web a medida la hace un equipo pensando en tu negocio. Las dos sirven; la diferencia está en el tiempo que le dedicás y en lo que pagás cada mes.",
    otro: "Wix",
    nosotros: "Web a medida",
    filas: [
      { aspecto: "Quién la arma", otro: "Vos, con plantillas", nosotros: "Nosotros, a partir de tu negocio" },
      { aspecto: "Costo", otro: "Suscripción mensual o anual, generalmente en dólares", nosotros: "Precio fijo en pesos (landing desde $150.000)" },
      { aspecto: "Velocidad en el celular", otro: "Depende de la plantilla y las apps que sumes", nosotros: "Código liviano, pensado para cargar rápido" },
      { aspecto: "SEO", otro: "Herramientas básicas que configurás vos", nosotros: "SEO técnico y datos estructurados incluidos" },
      { aspecto: "Cambios", otro: "Los hacés vos cuando quieras", nosotros: "Los pedís por WhatsApp" },
    ],
    cuandoOtro: "Si te gusta diseñar, tenés tiempo y no te molesta pagar una suscripción, Wix es una buena opción para empezar.",
    servicio: "diseno-web",
    faqs: [
      { q: "¿Puedo pasar mi web de Wix a una web a medida?", a: "Sí. Rehacemos la web con tu contenido y conectamos tu dominio a la nueva, sin perder la dirección." },
      { q: "¿Una web a medida aparece mejor en Google?", a: "No por ser a medida, sino porque se arma con buena velocidad, estructura y contenido pensado para lo que busca tu cliente." },
    ],
  },
  {
    slug: "wordpress",
    titulo: "Web a medida o WordPress: diferencias para un negocio",
    descripcion: "WordPress o web a medida: plugins, mantenimiento, seguridad, velocidad y costo para negocios de Argentina.",
    h1: "Web a medida vs WordPress",
    intro: "WordPress es el sistema más usado para hacer webs y tiene miles de plugins. Una web a medida tiene solo lo que tu negocio necesita. La diferencia aparece con el tiempo: actualizaciones, seguridad y velocidad.",
    otro: "WordPress",
    nosotros: "Web a medida",
    filas: [
      { aspecto: "Funciones", otro: "Plugins para casi todo", nosotros: "Solo lo que tu negocio usa" },
      { aspecto: "Mantenimiento", otro: "Actualizar núcleo, tema y plugins seguido", nosotros: "Sin plugins que actualizar" },
      { aspecto: "Seguridad", otro: "Es el blanco más atacado si no se actualiza", nosotros: "Menos piezas expuestas" },
      { aspecto: "Velocidad", otro: "Baja a medida que se suman plugins", nosotros: "Pensada para cargar rápido en el celular" },
      { aspecto: "Edición", otro: "Panel propio para editar todo", nosotros: "Cambios por WhatsApp o panel a medida si lo necesitás" },
    ],
    cuandoOtro: "Si necesitás publicar contenido todos los días con un equipo propio, o querés editar cada detalle vos, WordPress puede convenir.",
    servicio: "diseno-web",
    faqs: [
      { q: "¿Mi web de WordPress está lenta, se puede arreglar?", a: "Muchas veces sí, sacando plugins y optimizando imágenes. Si no alcanza, conviene rehacerla." },
      { q: "¿Pierdo el posicionamiento si dejo WordPress?", a: "No, si se mantienen las direcciones de las páginas o se redirigen bien. Eso es parte de la migración." },
    ],
  },
  {
    slug: "solo-instagram",
    titulo: "¿Alcanza con Instagram o necesito una página web?",
    descripcion: "Instagram o página web para tu negocio: qué hace cada una, por qué Instagram no aparece en Google y cuándo conviene tener las dos.",
    h1: "Página web vs solo Instagram",
    intro: "Instagram es ideal para mostrar lo que hacés a quien ya te sigue. Pero cuando alguien que no te conoce busca en Google lo que vendés, Instagram casi no aparece. Ahí es donde trabaja la web.",
    otro: "Solo Instagram",
    nosotros: "Web + Instagram",
    filas: [
      { aspecto: "Aparece en Google", otro: "Casi nunca para búsquedas de servicios", nosotros: "Sí, para tu rubro y tu zona" },
      { aspecto: "Lo recomiendan las IA", otro: "Difícilmente", nosotros: "Sí, si está bien estructurada" },
      { aspecto: "Precios y servicios", otro: "Perdidos entre publicaciones", nosotros: "Ordenados y siempre a mano" },
      { aspecto: "Depende de", otro: "El algoritmo y tu cuenta", nosotros: "Tu dominio, que es tuyo" },
      { aspecto: "Costo", otro: "Gratis", nosotros: "Landing desde $150.000" },
    ],
    cuandoOtro: "Si todos tus clientes llegan por recomendación o ya te siguen, Instagram solo puede alcanzar por un tiempo.",
    servicio: "diseno-web",
    faqs: [
      { q: "¿La web reemplaza a Instagram?", a: "No: se complementan. La web capta a los que buscan en Google y les muestra tu Instagram; Instagram mantiene el vínculo con los que ya te conocen." },
      { q: "¿Qué pasa si me suspenden la cuenta de Instagram?", a: "Si tu negocio vive solo ahí, perdés el canal. Con web propia, tus clientes te siguen encontrando." },
    ],
  },
  {
    slug: "mercadolibre",
    titulo: "Tienda propia en Tiendanube o MercadoLibre: cuál conviene",
    descripcion: "Vender en MercadoLibre o tener tu tienda en Tiendanube: comisiones, marca, clientes propios y cuándo conviene tener las dos.",
    h1: "Tienda propia (Tiendanube) vs MercadoLibre",
    intro: "MercadoLibre te da un público enorme desde el primer día. Tu tienda propia te da marca, clientes que son tuyos y menos comisión por venta. Muchos negocios usan las dos.",
    otro: "MercadoLibre",
    nosotros: "Tiendanube",
    filas: [
      { aspecto: "Tráfico", otro: "Millones de compradores desde el día uno", nosotros: "Lo generás vos (SEO, redes, clientes)" },
      { aspecto: "Comisión por venta", otro: "Cobra un porcentaje en cada venta", nosotros: "Menor o nula según el plan de Tiendanube" },
      { aspecto: "Tus clientes", otro: "Son de la plataforma", nosotros: "Son tuyos: podés volver a venderles" },
      { aspecto: "Marca", otro: "Competís al lado de otros vendedores", nosotros: "Tu tienda, tu diseño, sin competencia al lado" },
      { aspecto: "Armado", otro: "Publicaciones", nosotros: "Desde $250.000 con nosotros" },
    ],
    cuandoOtro: "Si vendés productos de marca que se buscan por precio, MercadoLibre suele vender más rápido. La tienda propia gana cuando tenés marca o clientes que vuelven.",
    servicio: "tiendanube",
    faqs: [
      { q: "¿Puedo tener las dos?", a: "Sí, y es lo más común: MercadoLibre para captar y la tienda propia para que los clientes vuelvan a comprarte sin comisión." },
      { q: "¿Tiendanube se conecta con MercadoLibre?", a: "Sí, existen integraciones para sincronizar productos y stock entre las dos." },
    ],
  },
];

export const getComparativaServ = (slug: string) => comparativasServ.find((c) => c.slug === slug);
