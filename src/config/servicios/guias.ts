import type { Faq } from "../types";

/**
 * GUÍAS "CÓMO CONSEGUIR CLIENTES" → /servicios/conseguir-clientes/<slug>
 * Cada guía apunta a una búsqueda real de Google ("cómo conseguir clientes como abogado"…).
 * Son guías útiles de verdad (pasos concretos, errores comunes, preguntas), no páginas de venta
 * disfrazadas: Google premia que respondan la pregunta. Al final, cómo ayuda Solvion (web + SEO local).
 * Regla: nada de cifras inventadas ni promesas de resultados.
 */
export interface Guia {
  slug: string;
  /** Búsqueda a la que apunta (tal cual la escribe la gente). */
  busqueda: string;
  /** Nombre corto para tarjetas y menús. */
  corto: string;
  emoji: string;
  /** <title> sin la marca. */
  titulo: string;
  descripcion: string;
  h1: string;
  bajada: string;
  /** Respuesta directa en 2–3 párrafos (lo que Google y las IA citan). */
  intro: string[];
  pasos: Array<{ t: string; d: string }>;
  errores: string[];
  /** Cómo encaja Solvion, sin exagerar. */
  solvion: string;
  /** Links a páginas de servicios relacionadas (rutas dentro de /servicios). */
  links: Array<{ href: string; texto: string }>;
  faqs: Faq[];
}

export const guias: Guia[] = [
  {
    slug: "para-mi-negocio",
    busqueda: "cómo conseguir clientes para mi negocio",
    corto: "Para tu negocio",
    emoji: "🏪",
    titulo: "Cómo conseguir clientes para mi negocio: guía práctica",
    descripcion: "Cómo conseguir clientes para tu negocio local en Argentina: Google, tu ficha de Maps, Instagram, WhatsApp y una web que convierta. Pasos concretos, sin humo.",
    h1: "Cómo conseguir clientes para tu negocio",
    bajada: "Los clientes de un negocio local te buscan en Google y en Maps, te miran en Instagram y te escriben por WhatsApp. Si estás bien parado en esos cuatro lugares, te encuentran a vos y no a la competencia.",
    intro: [
      "Para conseguir clientes para un negocio local hay que estar donde la gente ya está buscando: en Google (\"cerca de mí\", \"en mi barrio\"), en Google Maps, en Instagram y en WhatsApp. No hace falta estar en todos lados, hace falta estar bien en esos.",
      "La forma más estable de traer clientes nuevos todos los meses es que te encuentren cuando buscan lo que vendés. La publicidad paga sirve para empujar, pero cuando dejás de pagar se corta; el posicionamiento en Google sigue trabajando.",
    ],
    pasos: [
      { t: "Completá tu ficha de Google (Google Business Profile)", d: "Es gratis y es lo primero que ve alguien que busca tu rubro en tu zona: horarios, fotos, teléfono, cómo llegar y reseñas. Una ficha completa y activa aparece más arriba en Maps." },
      { t: "Pedí reseñas a cada cliente conforme", d: "Las reseñas pesan para aparecer en Maps y para que te elijan. Mandá el link directo para dejar la reseña por WhatsApp después de cada venta o servicio, y respondé todas, también las malas." },
      { t: "Tené una web propia, aunque sea de una página", d: "Instagram no aparece bien en Google. Una web con lo que hacés, dónde estás, precios o rangos y un botón de WhatsApp te hace aparecer en búsquedas que hoy se lleva otro." },
      { t: "Hacé que escribirte sea inmediato", d: "Botón de WhatsApp en la web, en la ficha de Google y en la bio de Instagram. Cada paso extra (un formulario largo, un mail) hace que se pierdan consultas." },
      { t: "Mostrá precios o desde cuánto", d: "Mucha gente no consulta si no tiene una idea del precio. Un \"desde $\" filtra a los curiosos y trae consultas más listas para comprar." },
      { t: "Publicá en Instagram lo que la gente quiere ver", d: "Trabajos reales, antes y después, el local, el equipo. Constancia antes que producción: es mejor algo simple todas las semanas que un video perfecto una vez al mes." },
      { t: "Aprovechá a los clientes que ya tenés", d: "Un cliente que vuelve o que te recomienda cuesta mucho menos que uno nuevo. Guardá sus contactos, avisales novedades y pedí que te recomienden." },
    ],
    errores: [
      "Depender solo de Instagram: no te encuentra quien todavía no te conoce.",
      "No tener la ficha de Google o tenerla con horarios viejos.",
      "Contestar tarde: en el rubro local, el que responde primero suele quedarse con el cliente.",
      "No mostrar nada de precios y perder consultas por eso.",
    ],
    solvion: "En Solvion armamos la web de tu negocio con botón de WhatsApp y la dejamos lista para aparecer en Google en tu ciudad, con la ficha de Google bien configurada. Si ya tenés web, trabajamos el posicionamiento para que te encuentren en las búsquedas locales.",
    links: [
      { href: "/diseno-web", texto: "Diseño de páginas web" },
      { href: "/posicionamiento-seo", texto: "Posicionamiento SEO y SEO local" },
      { href: "/rubros", texto: "Servicios por rubro" },
    ],
    faqs: [
      { q: "¿Cuál es la forma más rápida de conseguir clientes?", a: "La publicidad paga en Google o Instagram trae consultas desde el primer día, pero se corta cuando dejás de pagar. Lo más estable a mediano plazo es aparecer en Google y Maps cuando te buscan." },
      { q: "¿Necesito una web si ya tengo Instagram?", a: "Si querés clientes que todavía no te conocen, sí: Instagram casi no aparece en las búsquedas de Google, y una web con tu rubro y tu zona sí." },
      { q: "¿Cuánto tarda en funcionar el SEO local?", a: "Depende del rubro y la competencia de tu zona. La ficha de Google puede empezar a traer consultas en semanas; el posicionamiento de la web suele tardar algunos meses." },
    ],
  },
  {
    slug: "para-mi-empresa",
    busqueda: "cómo conseguir clientes para mi empresa",
    corto: "Para tu empresa",
    emoji: "🏢",
    titulo: "Cómo conseguir clientes para mi empresa (pymes y servicios B2B)",
    descripcion: "Cómo conseguir clientes para una empresa o pyme que vende a otras empresas: web que genere confianza, SEO, LinkedIn, contenido y seguimiento comercial.",
    h1: "Cómo conseguir clientes para tu empresa",
    bajada: "Cuando le vendés a otras empresas, el cliente compara, pide referencias y decide entre varias personas. Ganás si te encuentran cuando buscan y si tu empresa transmite confianza antes de la primera reunión.",
    intro: [
      "Para conseguir clientes para una empresa que vende a otras empresas (B2B) hay que combinar tres cosas: que te encuentren cuando buscan tu servicio, que tu web y tus perfiles generen confianza, y un seguimiento comercial ordenado de cada contacto.",
      "La venta entre empresas es más lenta y se apoya en la reputación. Por eso funcionan mejor los canales que acumulan: el SEO, el contenido útil, LinkedIn y las recomendaciones de clientes actuales.",
    ],
    pasos: [
      { t: "Definí bien a quién le vendés", d: "Rubro, tamaño de empresa, zona y quién decide la compra. Cuanto más claro, más fácil es escribir una web y mensajes que le hablen a esa persona." },
      { t: "Tené una web que responda lo que pregunta un comprador", d: "Qué hacés, para quién, cómo trabajás, casos o clientes, y cómo pedir una cotización. Una web vieja o genérica hace que te descarten sin llamarte." },
      { t: "Aparecé en las búsquedas de tu servicio", d: "Los compradores buscan \"proveedor de…\", \"servicio de… para empresas\", \"empresa de… en Córdoba\". Una página por servicio y por zona te pone en esas búsquedas." },
      { t: "Usá LinkedIn con tu perfil personal, no solo el de la empresa", d: "Las personas responden a personas. Publicá lo que aprendés trabajando y contactá a quienes deciden con un mensaje concreto, no un catálogo." },
      { t: "Mostrá casos reales", d: "Qué problema tenía el cliente y qué resolviste. Es lo que más convence a otra empresa, mucho más que una lista de servicios." },
      { t: "Ordená el seguimiento", d: "Anotá cada contacto, cuándo hablaste y qué sigue. Muchas ventas B2B se cierran en el tercer o cuarto contacto, y se pierden por no hacer ese seguimiento." },
    ],
    errores: [
      "Una web que habla de la empresa y no del problema del cliente.",
      "No tener casos ni clientes a la vista.",
      "Mandar mensajes masivos idénticos por LinkedIn o mail.",
      "Abandonar a los contactos que no compraron en la primera charla.",
    ],
    solvion: "En Solvion hacemos webs para empresas que explican bien el servicio y llevan a pedir cotización, con páginas por servicio y por zona para aparecer en Google. Si necesitás ordenar contactos y presupuestos, también armamos sistemas a medida.",
    links: [
      { href: "/diseno-web", texto: "Diseño de páginas web" },
      { href: "/posicionamiento-seo", texto: "Posicionamiento SEO" },
      { href: "/sistemas-a-medida", texto: "Sistemas a medida" },
    ],
    faqs: [
      { q: "¿Qué canal funciona mejor para vender a empresas?", a: "Depende del rubro, pero los que más acumulan son el SEO (te encuentran cuando buscan), LinkedIn y las recomendaciones de clientes actuales. Lo ideal es combinarlos." },
      { q: "¿Sirve el SEO si vendo a empresas?", a: "Sí. Los compradores también buscan en Google antes de pedir presupuestos, y suelen comparar dos o tres proveedores que encontraron ahí." },
      { q: "¿Conviene poner precios en la web?", a: "En B2B no siempre se puede, pero sí conviene explicar cómo se cotiza y qué incluye el servicio, para que el contacto llegue mejor informado." },
    ],
  },
  {
    slug: "contadores",
    busqueda: "cómo conseguir clientes como contador independiente",
    corto: "Contadores y estudios contables",
    emoji: "📊",
    titulo: "Cómo conseguir clientes como contador independiente o estudio contable",
    descripcion: "Cómo conseguir clientes siendo contador independiente o con tu estudio contable: nicho, web, Google, contenido sobre monotributo y recomendaciones.",
    h1: "Cómo conseguir clientes como contador o estudio contable",
    bajada: "La gente busca un contador cuando tiene una urgencia (darse de alta, recategorizarse, una intimación) o cuando su negocio crece. Si en ese momento te encuentra y entiende qué hacés y cuánto cobrás, te escribe.",
    intro: [
      "Para conseguir clientes como contador independiente o estudio contable conviene elegir un tipo de cliente (monotributistas, comercios, pymes, profesionales), tener una web que explique tus servicios y abonos, y aparecer en Google cuando buscan soluciones a sus trámites.",
      "Las búsquedas contables se repiten todo el año: alta y recategorización de monotributo, liquidación de sueldos, sociedades, Ganancias. Si respondés esas dudas en tu web, te encuentran personas que necesitan un contador justo en ese momento. Y si atendés online, podés tomar clientes de todo el país.",
    ],
    pasos: [
      { t: "Elegí un nicho", d: "\"Contador para monotributistas\", \"contador para gastronómicos\", \"estudio contable para pymes de construcción\". Un nicho claro te hace más fácil de recomendar y de encontrar." },
      { t: "Publicá tus servicios y abonos", d: "Qué incluye el abono mensual y desde cuánto. Es lo primero que pregunta un monotributista, y si no está, te compara con quien sí lo muestra." },
      { t: "Respondé las dudas que se buscan en Google", d: "Una página por tema (alta de monotributo, recategorización, sueldos, sociedades) con la explicación y cómo lo resolvés vos. Son búsquedas con intención real." },
      { t: "Activá tu ficha de Google", d: "Si atendés en una oficina, la ficha de Google te hace aparecer en \"contador cerca de mí\" y en Maps, con reseñas de tus clientes." },
      { t: "Pedí recomendaciones de forma activa", d: "En contabilidad casi todo llega por recomendación. Pedila explícitamente a los clientes conformes y facilitales tu link o tu WhatsApp para compartir." },
      { t: "Hacé que la primera consulta sea simple", d: "WhatsApp a la vista y una explicación de cómo es la primera charla. Quien tiene una urgencia no completa formularios largos." },
    ],
    errores: [
      "Querer atender a todos y no destacarse para nadie.",
      "No mostrar ningún rango de honorarios.",
      "Depender solo del boca a boca y no tener nada en Google.",
      "Una web sin contenido: Google no tiene de dónde mostrarte.",
    ],
    solvion: "En Solvion armamos la web de tu estudio contable con tus servicios, abonos y WhatsApp, y trabajamos el SEO para que aparezcas en las búsquedas de tu ciudad o de todo el país si atendés online.",
    links: [
      { href: "/diseno-web/contadores", texto: "Página web para contadores" },
      { href: "/posicionamiento-seo/contadores", texto: "SEO para contadores" },
      { href: "/posicionamiento-seo", texto: "Posicionamiento SEO" },
    ],
    faqs: [
      { q: "¿Cómo consigo mis primeros clientes como contador recién recibido?", a: "Elegí un nicho que conozcas, armá una web simple con tus servicios y abonos, activá tu ficha de Google y avisale a tu red. Los primeros suelen llegar por recomendación; la web y Google hacen que esa recomendación te encuentre." },
      { q: "¿Puedo conseguir clientes de otras provincias?", a: "Sí, si atendés online. La web y el contenido se orientan a búsquedas de todo el país, no solo de tu ciudad." },
      { q: "¿Sirve un estudio contable en Instagram?", a: "Sirve para mostrar cercanía y explicar novedades, pero la mayoría busca contador en Google. Lo ideal es tener ambas cosas." },
    ],
  },
  {
    slug: "abogados",
    busqueda: "cómo conseguir clientes como abogado",
    corto: "Abogados",
    emoji: "⚖️",
    titulo: "Cómo conseguir clientes como abogado: guía para estudios jurídicos",
    descripcion: "Cómo conseguir clientes como abogado o estudio jurídico: una página por área de práctica, Google, reseñas, primera consulta clara y WhatsApp.",
    h1: "Cómo conseguir clientes como abogado",
    bajada: "Quien busca un abogado tiene un problema concreto: un despido, una sucesión, un accidente, un divorcio. Lo que hace que te elija es encontrarte rápido y entender que sabés de ese tema.",
    intro: [
      "Para conseguir clientes como abogado lo más efectivo es especializarte en áreas concretas, tener una página web por cada área de práctica que responda las preguntas reales del cliente, y aparecer en Google cuando busca \"abogado laboral\", \"abogado de sucesiones\" o \"abogado por despido\" en tu ciudad.",
      "Cada problema legal es una búsqueda distinta. Un estudio con una sola página genérica compite mal contra otro que tiene una página clara para cada tema. Y como la consulta suele ser urgente, poder escribir por WhatsApp en el momento marca la diferencia.",
    ],
    pasos: [
      { t: "Definí tus áreas de práctica", d: "Laboral, familia, sucesiones, accidentes, previsional. Es mejor ser claramente bueno en pocas que listar todas." },
      { t: "Una página por área, con las preguntas del cliente", d: "\"¿Qué me corresponde si me despiden?\", \"¿Cuánto tarda una sucesión?\". Respondé en lenguaje simple y explicá cómo lo trabaja tu estudio." },
      { t: "Explicá cómo es la primera consulta", d: "Si es presencial u online, cuánto dura, si tiene costo y qué hay que llevar. Baja la ansiedad y aumenta los contactos." },
      { t: "Activá y cuidá tu ficha de Google", d: "Para \"abogado cerca de mí\" pesa mucho Maps. Ficha completa, horarios reales y reseñas de clientes." },
      { t: "Mostrá quiénes son y su matrícula", d: "La confianza es todo en este rubro. Fotos reales, trayectoria y matrícula a la vista." },
      { t: "WhatsApp a un toque", d: "El cliente con un problema urgente escribe al primero que le responde. Un botón visible en cada página." },
    ],
    errores: [
      "Una web genérica que dice \"todas las ramas del derecho\".",
      "Lenguaje técnico que el cliente no entiende.",
      "No explicar cómo es la primera consulta.",
      "Prometer resultados en la publicidad: además de no convencer, puede violar normas éticas del colegio.",
    ],
    solvion: "En Solvion armamos la web de tu estudio jurídico con una página por área de práctica, pensada para responder las dudas del cliente y aparecer en Google en tu ciudad, con contacto directo por WhatsApp.",
    links: [
      { href: "/diseno-web/abogados", texto: "Página web para abogados" },
      { href: "/posicionamiento-seo/abogados", texto: "SEO para abogados" },
      { href: "/posicionamiento-seo", texto: "Posicionamiento SEO" },
    ],
    faqs: [
      { q: "¿Los abogados pueden hacer publicidad?", a: "Sí, con límites que fija cada colegio profesional (por ejemplo, no prometer resultados). Una web informativa sobre tus áreas de práctica es la forma más segura y efectiva." },
      { q: "¿Conviene tener una página por cada especialidad?", a: "Sí. Cada problema se busca distinto en Google, y una página específica posiciona y convence mucho más que una genérica." },
      { q: "¿Sirve si atiendo en una ciudad chica?", a: "Sí, incluso más: en ciudades medianas y chicas hay menos competencia en Google y es más fácil aparecer primero en las búsquedas locales." },
    ],
  },
  {
    slug: "empresas-de-limpieza",
    busqueda: "cómo conseguir clientes para una empresa de limpieza",
    corto: "Empresas de limpieza",
    emoji: "🧽",
    titulo: "Cómo conseguir clientes para una empresa de limpieza",
    descripcion: "Cómo conseguir clientes para tu empresa de limpieza: hogares, oficinas y consorcios. Google y Maps, web con presupuesto por WhatsApp, reseñas y contratos fijos.",
    h1: "Cómo conseguir clientes para una empresa de limpieza",
    bajada: "Los clientes de limpieza buscan en Google por zona y por tipo de trabajo (oficinas, final de obra, consorcios). Quieren saber si llegás a su barrio, qué incluye el servicio y cuánto sale, y pedir presupuesto rápido.",
    intro: [
      "Para conseguir clientes para una empresa de limpieza conviene separar dos mercados: hogares (trabajos puntuales o semanales) y empresas, oficinas y consorcios (contratos fijos). Los contratos fijos son los que dan estabilidad, y se consiguen sobre todo con una web profesional y apareciendo en Google cuando buscan el servicio en tu zona.",
      "La confianza es clave: van a entrar a la casa o la oficina de alguien. Fotos reales del equipo, seguro, referencias y reseñas pesan tanto como el precio.",
    ],
    pasos: [
      { t: "Definí servicios y zonas", d: "Limpieza de oficinas, final de obra, consorcios, hogares, vidrios. Y los barrios o ciudades que cubrís. Cada combinación es una búsqueda distinta." },
      { t: "Una web con presupuesto por WhatsApp", d: "Que el cliente pueda contar qué necesita (metros, frecuencia, tipo de lugar) y recibir el presupuesto rápido. Cuanto más fácil, más pedidos." },
      { t: "Ficha de Google con zona de servicio", d: "Configurá las áreas que cubrís aunque no tengas local a la calle. Así aparecés en \"empresa de limpieza cerca de mí\"." },
      { t: "Mostrá confianza", d: "Equipo con uniforme, seguro de responsabilidad civil si lo tenés, empresas que ya atendés (con permiso) y reseñas." },
      { t: "Buscá contratos fijos", d: "Consorcios, oficinas, locales y gimnasios necesitan limpieza todas las semanas. Una página específica para empresas y un contacto directo a administradores de consorcios funciona muy bien." },
      { t: "Pedí reseñas después de cada trabajo", d: "Un mensaje con el link directo a tu ficha de Google, el mismo día que terminaste." },
    ],
    errores: [
      "Competir solo por precio, sin mostrar por qué sos confiable.",
      "No decir qué zonas cubrís.",
      "Tardar en pasar el presupuesto.",
      "Depender de trabajos sueltos sin buscar contratos fijos.",
    ],
    solvion: "En Solvion armamos la web de tu empresa de limpieza con tus servicios, zonas y pedido de presupuesto por WhatsApp, y trabajamos el SEO local para que te encuentren hogares, oficinas y consorcios de tu zona.",
    links: [
      { href: "/diseno-web", texto: "Diseño de páginas web" },
      { href: "/posicionamiento-seo", texto: "Posicionamiento SEO y SEO local" },
    ],
    faqs: [
      { q: "¿Cómo consigo contratos de limpieza con empresas?", a: "Con una web profesional que muestre servicios para empresas y referencias, apareciendo en Google cuando buscan \"limpieza de oficinas\" en tu zona, y contactando a administradores de consorcios y oficinas con una propuesta concreta." },
      { q: "¿Necesito local para aparecer en Google Maps?", a: "No. Podés configurar tu ficha de Google como negocio que atiende a domicilio, con las zonas que cubrís." },
      { q: "¿Conviene publicar precios?", a: "Al menos un \"desde\" o cómo se calcula (por metro, por hora, por frecuencia). Ayuda a que pidan presupuesto clientes que ya saben más o menos cuánto sale." },
    ],
  },
  {
    slug: "en-instagram",
    busqueda: "cómo conseguir clientes en Instagram",
    corto: "En Instagram",
    emoji: "📸",
    titulo: "Cómo conseguir clientes en Instagram (y llevarlos a comprar)",
    descripcion: "Cómo conseguir clientes en Instagram para tu negocio: perfil que convierte, contenido, historias, respuestas rápidas y una web con WhatsApp para cerrar la venta.",
    h1: "Cómo conseguir clientes en Instagram",
    bajada: "Instagram es ideal para que te conozcan y te tengan presente. Para que eso se convierta en clientes, el perfil tiene que explicar qué hacés en segundos y llevar a un lugar donde sea fácil comprar o consultar.",
    intro: [
      "Para conseguir clientes en Instagram necesitás un perfil que diga claro qué hacés y para quién, contenido constante que muestre tu trabajo real, y un camino corto para comprar o consultar: un link en la bio a tu web o a WhatsApp.",
      "Instagram tiene un límite: casi no aparece en Google, así que llega sobre todo a quien ya te sigue o a quien te muestra el algoritmo. Por eso funciona mejor combinado con una web que sí aparezca cuando la gente busca lo que vendés.",
    ],
    pasos: [
      { t: "Bio que se entienda en 3 segundos", d: "Qué hacés, para quién y dónde. Ejemplo: \"Uñas esculpidas y semipermanente · Nueva Córdoba · Turnos por WhatsApp\"." },
      { t: "Un link que lleve a comprar o consultar", d: "A tu web, tu tienda o directo a WhatsApp con un mensaje armado. No a una lista de diez links." },
      { t: "Mostrá trabajos reales", d: "Antes y después, productos en uso, el detrás de escena. Lo real convence más que las imágenes de stock." },
      { t: "Historias todos los días", d: "Las historias mantienen a tus seguidores al tanto: disponibilidad, novedades, preguntas. Guardá las importantes en destacadas (precios, cómo comprar, opiniones)." },
      { t: "Respondé rápido y con respuestas guardadas", d: "Precios, envíos, horarios: tenelos como respuestas rápidas. Tardar un día en contestar es perder la venta." },
      { t: "Pedí que te etiqueten y compartí a tus clientes", d: "Lo que dicen tus clientes de vos es la mejor publicidad, y te muestra a sus seguidores." },
    ],
    errores: [
      "Una bio que no dice qué vendés ni dónde.",
      "\"Precio por privado\" sin dar ninguna referencia: mucha gente no consulta.",
      "Publicar solo promociones y nada de trabajo real.",
      "Depender solo de Instagram: si cambia el algoritmo o te bloquean la cuenta, te quedás sin canal.",
    ],
    solvion: "En Solvion armamos la web o la tienda que va en el link de tu bio, con WhatsApp y catálogo, para que lo que generás en Instagram termine en ventas. Y la dejamos lista para aparecer en Google, que es el canal que Instagram no cubre.",
    links: [
      { href: "/vs/solo-instagram", texto: "Web propia vs. solo Instagram" },
      { href: "/diseno-web", texto: "Diseño de páginas web" },
      { href: "/tiendanube", texto: "Tiendas Tiendanube" },
    ],
    faqs: [
      { q: "¿Se pueden conseguir clientes solo con Instagram?", a: "Sí, pero dependés del algoritmo y llegás sobre todo a quien ya te sigue. Con una web que aparezca en Google sumás a quienes te buscan sin conocerte." },
      { q: "¿Cada cuánto tengo que publicar?", a: "Más importante que la cantidad es la constancia. Mejor algo simple todas las semanas, y historias seguido, que mucho contenido un mes y nada el siguiente." },
      { q: "¿Qué pongo en el link de la bio?", a: "Un solo destino que lleve a la acción: tu web, tu tienda o tu WhatsApp con un mensaje armado." },
    ],
  },
  {
    slug: "en-linkedin",
    busqueda: "cómo conseguir clientes en LinkedIn",
    corto: "En LinkedIn",
    emoji: "💼",
    titulo: "Cómo conseguir clientes en LinkedIn: guía para profesionales y empresas",
    descripcion: "Cómo conseguir clientes en LinkedIn: perfil orientado al cliente, contenido útil, mensajes que no parecen spam y una web que respalde lo que decís.",
    h1: "Cómo conseguir clientes en LinkedIn",
    bajada: "LinkedIn sirve sobre todo si le vendés a empresas o a profesionales. Funciona cuando tu perfil le habla al cliente, publicás cosas útiles y contactás a la gente correcta con un mensaje personal.",
    intro: [
      "Para conseguir clientes en LinkedIn hay que convertir tu perfil en una página que le hable a tu cliente (no un currículum), publicar contenido útil sobre los problemas que resolvés y contactar a quienes deciden la compra con mensajes personales, sin vender en el primer mensaje.",
      "Antes de contratarte, la persona que te conoció en LinkedIn va a buscarte en Google y entrar a tu web. Si no encuentra nada, o encuentra algo desactualizado, se enfría. Por eso LinkedIn rinde mucho más con una web profesional detrás.",
    ],
    pasos: [
      { t: "Titular orientado al cliente", d: "En vez de tu cargo, a quién ayudás y cómo: \"Ayudo a pymes industriales a ordenar su facturación\"." },
      { t: "Perfil como página de servicios", d: "En el \"Acerca de\" contá qué problema resolvés, para quién y cómo contactarte. Sumá tu web y casos." },
      { t: "Publicá lo que aprendés trabajando", d: "Errores comunes de tus clientes, cómo resolviste un caso, una opinión sobre tu rubro. Lo útil y concreto es lo que más circula." },
      { t: "Conectá con quien decide", d: "Dueños, gerentes, responsables de área de las empresas que querés como clientes. Calidad antes que cantidad." },
      { t: "Mensajes personales, sin vender de entrada", d: "Mencioná algo concreto de su empresa o su publicación y ofrecé algo útil. El \"te presento mis servicios\" en el primer mensaje casi nunca funciona." },
      { t: "Llevá la conversación a una llamada", d: "Cuando hay interés, proponé una charla corta. La venta se cierra fuera de LinkedIn." },
    ],
    errores: [
      "Un perfil que parece un currículum para buscar trabajo.",
      "Mandar el mismo mensaje de venta a cientos de personas.",
      "Publicar solo logros propios sin aportar nada al lector.",
      "No tener una web que respalde lo que contás.",
    ],
    solvion: "En Solvion hacemos la web profesional que respalda tu perfil de LinkedIn: tus servicios, casos y contacto, lista para que quien te conoció ahí te encuentre en Google y confíe antes de la primera llamada.",
    links: [
      { href: "/diseno-web", texto: "Diseño de páginas web" },
      { href: "/posicionamiento-seo", texto: "Posicionamiento SEO" },
    ],
    faqs: [
      { q: "¿LinkedIn sirve para cualquier negocio?", a: "Sirve sobre todo para servicios profesionales y para vender a empresas. Para un negocio que le vende al público (un local, una tienda), Google, Maps e Instagram suelen rendir más." },
      { q: "¿Conviene pagar LinkedIn Premium o Sales Navigator?", a: "Puede ayudar a buscar contactos con más filtros, pero no reemplaza un buen perfil, contenido útil y mensajes personales. Conviene empezar con la versión gratis." },
      { q: "¿Necesito una web si ya tengo LinkedIn?", a: "Muy recomendable: la mayoría te va a buscar en Google antes de contratarte, y una web profesional con casos cierra esa confianza." },
    ],
  },
];

export const getGuia = (slug: string) => guias.find((g) => g.slug === slug);
export const guiaPath = (g: Pick<Guia, "slug">) => `/servicios/conseguir-clientes/${g.slug}`;
