import type { Faq } from "../types";

/**
 * Contenido PROPIO de cada guía "cómo conseguir clientes" por rubro (ver lib/guias.ts).
 * Las tácticas, errores y la pregunta son específicos del rubro: es lo que hace que cada
 * página diga algo distinto y no sea una copia con otro nombre (Google castiga las "páginas puerta").
 * Abogados y contadores tienen guía escrita a mano en guias.ts, por eso no están acá.
 */
export interface ExtraRubro {
  /** Final del título: "Cómo conseguir clientes" + frase. */
  frase: string;
  tacticas: Array<{ t: string; d: string }>;
  errores: string[];
  faq: Faq;
}

export const extrasRubro: Record<string, ExtraRubro> = {
  barberias: {
    frase: "para tu barbería",
    tacticas: [
      { t: "Mostrá cortes reales, no fotos de internet", d: "Degradés, perfilados y barbas de tus clientes, con buena luz. Es lo que el cliente mira para decidir si le gusta tu estilo." },
      { t: "Que reservar sea inmediato", d: "Link de turnos o WhatsApp en la bio, en Google y en la web. El cliente de barbería decide rápido y reserva con quien le responde primero." },
      { t: "Hacé que vuelvan", d: "El corte se repite cada 2 o 3 semanas. Un mensaje recordando que \"ya toca\" trae de vuelta a muchos clientes que se iban a otro lado por comodidad." },
      { t: "Pedí la reseña en el sillón", d: "Al terminar, con el cliente conforme mirándose al espejo, es el mejor momento para pedirle que deje su reseña en Google." },
    ],
    errores: ["Precios solo \"por privado\": el cliente nuevo quiere saber cuánto sale el corte.", "No mostrar con qué barbero se atiende cada uno."],
    faq: { q: "¿Qué funciona mejor para una barbería: Instagram o Google?", a: "Instagram para mostrar el estilo y fidelizar; Google y Maps para el cliente nuevo que busca \"barbería cerca\". Las dos cosas se complementan." },
  },
  peluquerias: {
    frase: "para tu peluquería",
    tacticas: [
      { t: "Mostrá antes y después de color", d: "Mechas, balayage, alisados: los trabajos de color son los que más se comparten y los que más clientas nuevas traen." },
      { t: "Publicá precios desde", d: "Color y alisado varían mucho de precio. Un \"desde\" por servicio evita la pregunta eterna por mensaje y trae clientas decididas." },
      { t: "Presentá a cada estilista", d: "Muchas clientas eligen a la persona, no el salón. Una foto y la especialidad de cada una ayuda a que reserven." },
      { t: "Sumá paquetes para eventos", d: "Novias, quinceañeras, egresadas: son búsquedas concretas en Google y trabajos de ticket alto." },
    ],
    errores: ["No explicar cuánto dura cada servicio y pisar turnos largos.", "Mostrar solo cortes cuando el fuerte del salón es el color."],
    faq: { q: "¿Cómo consigo clientas nuevas para mi peluquería?", a: "Ficha de Google completa con fotos y reseñas, trabajos de color en Instagram y una web con servicios y precios desde, para aparecer cuando buscan \"peluquería en\" tu barrio." },
  },
  "centros-de-estetica": {
    frase: "para tu centro de estética",
    tacticas: [
      { t: "Explicá cada tratamiento", d: "Qué es, para quién sirve, cuántas sesiones y qué cuidados. La clienta investiga antes de reservar y elige a quien le explica." },
      { t: "Ofrecé una primera evaluación", d: "Una consulta o diagnóstico inicial baja la desconfianza y es la puerta para vender packs de sesiones." },
      { t: "Mostrá habilitación y aparatología", d: "Matrícula, marcas de los equipos y el lugar real. En estética la confianza pesa tanto como el precio." },
      { t: "Vendé packs, no sesiones sueltas", d: "Los tratamientos funcionan en serie. Un pack con precio claro asegura que la clienta vuelva." },
    ],
    errores: ["Fotos de stock en lugar del centro real.", "Prometer resultados que no se pueden garantizar."],
    faq: { q: "¿Qué busca la gente antes de ir a un centro de estética?", a: "Busca el tratamiento puntual (\"depilación definitiva\", \"limpieza facial\") en su zona. Una página por tratamiento con precio desde y fotos reales te pone en esas búsquedas." },
  },
  "unas-y-pestanas": {
    frase: "para tu estudio de uñas y pestañas",
    tacticas: [
      { t: "Publicá cada diseño terminado", d: "Uñas y pestañas se eligen por foto. Un buen primer plano de cada trabajo es tu mejor catálogo." },
      { t: "Ordená tus destacadas", d: "Precios, diseños, cuidados y cómo reservar, cada uno en una historia destacada de Instagram." },
      { t: "Ofrecé turnos de service", d: "El service cada 2 o 3 semanas es lo que llena la agenda. Recordale a cada clienta cuándo le toca." },
      { t: "Aparecé en Google Maps", d: "Mucha gente busca \"uñas esculpidas cerca de mí\". Aunque atiendas en tu casa, podés tener ficha con zona de atención." },
    ],
    errores: ["No aclarar cuánto dura el turno y llegar tarde a los siguientes.", "Cambiar precios sin avisar en las destacadas."],
    faq: { q: "¿Puedo conseguir clientas si atiendo en mi casa?", a: "Sí. Con ficha de Google configurada por zona (sin mostrar tu dirección exacta), Instagram ordenado y una web simple con precios y WhatsApp." },
  },
  odontologos: {
    frase: "como odontólogo",
    tacticas: [
      { t: "Una página por tratamiento", d: "Implantes, ortodoncia, blanqueamiento, urgencias: cada uno se busca por separado y tiene dudas propias." },
      { t: "Dejá claro qué obras sociales tomás", d: "Es la primera pregunta de muchos pacientes. Si está en la web y en Google, te ahorrás consultas y ganás pacientes." },
      { t: "Destacá la atención de urgencias", d: "\"Dentista de urgencia\" es una búsqueda con decisión inmediata. Si atendés urgencias, que se vea en todos lados." },
      { t: "Pedí reseñas después del tratamiento", d: "El miedo al dentista es real; leer que otros salieron conformes decide a muchos pacientes." },
    ],
    errores: ["No mostrar obras sociales ni formas de pago.", "Fotos clínicas impactantes que asustan en lugar de tranquilizar."],
    faq: { q: "¿Cómo consigo pacientes particulares?", a: "Con páginas de tratamientos específicos (implantes, ortodoncia, estética dental) que expliquen el proceso y las formas de pago, y apareciendo en Google en tu zona." },
  },
  "medicos-y-clinicas": {
    frase: "para tu consultorio médico o clínica",
    tacticas: [
      { t: "Presentá a cada profesional", d: "Especialidad, matrícula y días de atención de cada médico. El paciente busca por especialista." },
      { t: "Turnos y obras sociales a la vista", d: "Cómo pedir turno y qué coberturas tomás, en la web y en la ficha de Google." },
      { t: "Respondé dudas frecuentes de cada especialidad", d: "Qué estudios hacen, cómo prepararse, cuánto tarda el resultado. Son búsquedas reales que traen pacientes." },
      { t: "Mantené horarios actualizados en Google", d: "Un horario viejo en Maps es un paciente que llega y encuentra cerrado, y una mala reseña." },
    ],
    errores: ["Una sola página genérica para todas las especialidades.", "No responder reseñas negativas de forma profesional."],
    faq: { q: "¿Puedo publicitar mi consultorio en internet?", a: "Sí, con información veraz y respetando las normas de tu colegio o ministerio. Una web informativa con especialidades, profesionales y turnos es lo más efectivo." },
  },
  psicologos: {
    frase: "como psicólogo",
    tacticas: [
      { t: "Contá tu enfoque en lenguaje simple", d: "Cognitivo conductual, sistémico, psicoanálisis: explicá cómo trabajás sin tecnicismos. La persona busca sentirse entendida." },
      { t: "Aclará con quién trabajás", d: "Adultos, adolescentes, parejas, ansiedad, duelo. Un perfil claro te hace más fácil de encontrar y de recomendar." },
      { t: "Aprovechá la atención online", d: "Si hacés sesiones online, tu web puede apuntar a búsquedas de todo el país, no solo de tu ciudad." },
      { t: "Explicá cómo es la primera sesión", d: "Duración, modalidad y honorarios u obras sociales. Reducir la incertidumbre es clave para que alguien se anime a escribir." },
    ],
    errores: ["Un perfil que parece un currículum académico.", "Pedir que completen formularios largos antes del primer contacto."],
    faq: { q: "¿Sirve el SEO para psicólogos?", a: "Sí: mucha gente busca \"psicólogo online\" o \"terapia para ansiedad\" en Google. Una web con tu enfoque y páginas por tema te pone en esas búsquedas." },
  },
  inmobiliarias: {
    frase: "para tu inmobiliaria",
    tacticas: [
      { t: "Captá propietarios con tasaciones", d: "\"Tasación de propiedades en\" tu ciudad es una búsqueda de alguien que va a vender. Una página de tasación con formulario simple trae captaciones." },
      { t: "Páginas por barrio y tipo de propiedad", d: "\"Departamentos en alquiler en\" tal barrio: así competís con los portales en las búsquedas locales." },
      { t: "WhatsApp en cada propiedad", d: "El interesado quiere preguntar por esa propiedad puntual, ya. Un botón con el mensaje armado multiplica las consultas." },
      { t: "Fotos y datos completos", d: "Ambientes, metros, expensas y ubicación aproximada. Las publicaciones incompletas reciben consultas que no llevan a nada." },
    ],
    errores: ["Depender solo de los portales, donde competís con todos.", "Dejar publicadas propiedades que ya se vendieron o alquilaron."],
    faq: { q: "¿Cómo consigo propiedades para vender?", a: "Con una página de tasación que aparezca en Google en tu ciudad, reseñas de propietarios conformes y presencia en tu zona. La captación es tan importante como la venta." },
  },
  gimnasios: {
    frase: "para tu gimnasio",
    tacticas: [
      { t: "Ofrecé una clase o semana de prueba", d: "Es la forma más simple de que alguien que duda se acerque y conozca el lugar." },
      { t: "Publicá horarios de clases y precios", d: "Grilla de actividades, cuota mensual y planes. Es lo primero que buscan y lo que más se pregunta." },
      { t: "Aprovechá enero y marzo", d: "Son los meses en que más gente busca empezar. Preparar promociones y contenido antes te pone adelante." },
      { t: "Mostrá a la comunidad", d: "Profes, alumnos, eventos, retos. La gente elige un gimnasio donde se siente cómoda, no solo por las máquinas." },
    ],
    errores: ["No publicar la cuota y obligar a preguntar.", "Fotos del gimnasio vacío o viejas."],
    faq: { q: "¿Cómo retengo a los socios que consigo?", a: "Con seguimiento: avisos de vencimiento de cuota, contacto cuando alguien deja de venir y actividades que generen grupo. Retener cuesta menos que conseguir uno nuevo." },
  },
  "restaurantes-y-bares": {
    frase: "para tu restaurante o bar",
    tacticas: [
      { t: "La carta online siempre actualizada", d: "Con precios. Es lo que más se busca antes de ir, y una carta vieja genera malas experiencias." },
      { t: "Ficha de Google impecable", d: "Fotos de platos reales, horarios, reservas y menú. Para \"dónde comer cerca\", Maps es el canal principal." },
      { t: "Reservas por WhatsApp", d: "Un botón para reservar mesa, sobre todo para fines de semana y grupos." },
      { t: "Respondé todas las reseñas", d: "En gastronomía las reseñas deciden. Responder con buena onda, también a las críticas, suma confianza." },
    ],
    errores: ["La carta solo en una foto de Instagram que no se lee.", "Horarios de Google desactualizados en feriados."],
    faq: { q: "¿Conviene tener web propia si estoy en apps de delivery?", a: "Sí: las apps se quedan con una comisión y con el cliente. Una web con tu carta y pedidos por WhatsApp te deja vender directo." },
  },
  "hoteles-y-cabanas": {
    frase: "para tus cabañas u hotel",
    tacticas: [
      { t: "Reservas directas sin comisión", d: "Una web con fotos, tarifas y consulta por WhatsApp te permite recibir reservas sin pagarle comisión a las plataformas." },
      { t: "Fotos que vendan la experiencia", d: "El paisaje, la pileta, el desayuno, las vistas. Se decide por las fotos." },
      { t: "Aparecé en las búsquedas de la zona", d: "\"Cabañas en\" el destino, \"con pileta\", \"para parejas\": cada búsqueda es una página posible." },
      { t: "Pedí reseña al hacer el check-out", d: "Las reseñas recientes son lo que más mira un viajero, en Google y en las plataformas." },
    ],
    errores: ["Depender 100% de las plataformas de reservas.", "No mostrar tarifas ni disponibilidad por temporada."],
    faq: { q: "¿Cómo consigo reservas directas?", a: "Con una web propia que aparezca en Google para las búsquedas de tu destino, fotos de calidad, tarifas claras y consulta por WhatsApp. Muchos viajeros prefieren reservar directo si encuentran cómo." },
  },
  "tiendas-de-ropa": {
    frase: "para tu tienda de ropa",
    tacticas: [
      { t: "Vendé online además del local", d: "Una tienda con talles, stock y envíos te permite vender fuera de tu barrio y a cualquier hora." },
      { t: "Mostrá la ropa puesta", d: "Fotos con modelo o en maniquí, con medidas. Reduce dudas y cambios." },
      { t: "Lanzamientos por temporada", d: "Avisar a tus clientas por WhatsApp o Instagram cuando entra la colección nueva genera ventas en los primeros días." },
      { t: "Tabla de talles clara", d: "Es la principal duda al comprar ropa online. Con medidas reales vendés más y cambiás menos." },
    ],
    errores: ["Vender solo por mensaje directo, sin catálogo.", "No mostrar el stock real y vender lo que no hay."],
    faq: { q: "¿Conviene Tiendanube o vender solo por Instagram?", a: "Instagram atrae; la tienda cierra la venta con pagos, envíos y stock automáticos. Lo ideal es usar Instagram para mostrar y la tienda para vender." },
  },
  "cosmetica-y-skincare": {
    frase: "para tu tienda de cosmética",
    tacticas: [
      { t: "Contenido que enseñe", d: "Rutinas, cómo aplicar, qué producto para qué tipo de piel. Educar es lo que más vende en skincare." },
      { t: "Fichas de producto completas", d: "Ingredientes, para qué piel, modo de uso. La clienta compara mucho antes de comprar." },
      { t: "Kits y combos", d: "Una rutina armada sube el ticket y facilita la decisión a quien empieza." },
      { t: "Reseñas de clientas en cada producto", d: "Ver que a otra persona le funcionó es lo que decide la compra." },
    ],
    errores: ["Fotos de catálogo de la marca sin contenido propio.", "No aclarar autenticidad de los productos y vencimientos."],
    faq: { q: "¿Cómo compito con las tiendas grandes de cosmética?", a: "Con asesoramiento y cercanía: contenido que enseñe, atención por WhatsApp y una tienda clara. La gente vuelve a donde la ayudaron a elegir." },
  },
  "regalerias-y-desayunos": {
    frase: "para tu regalería o emprendimiento de desayunos",
    tacticas: [
      { t: "Preparate para las fechas clave", d: "Día de la Madre, del Padre, San Valentín, Día del Amigo: publicá los productos y aparecé en Google semanas antes." },
      { t: "Catálogo con precios y zonas de envío", d: "Quien regala decide rápido. Opciones claras, precio y si llegás a la zona del destinatario." },
      { t: "Pedidos con anticipación", d: "Un sistema simple para reservar fecha y hora de entrega evita perder pedidos en los días pico." },
      { t: "Fotos del producto entregado", d: "Con permiso, mostrá cómo llegó cada regalo. Es la mejor prueba de calidad." },
    ],
    errores: ["Tomar pedidos solo por mensaje y perder el orden en fechas pico.", "No aclarar hasta qué hora se toman pedidos para el día."],
    faq: { q: "¿Qué se busca en Google para desayunos y regalos?", a: "\"Desayunos a domicilio en\" tu ciudad, \"regalo para el Día de la Madre\", \"box de regalo\". Una tienda con esas páginas te pone delante cuando la gente está por comprar." },
  },
  "kioscos-y-almacenes": {
    frase: "para tu almacén o kiosco",
    tacticas: [
      { t: "Pedidos por WhatsApp con delivery", d: "Un catálogo simple con los productos más pedidos y envío en el barrio trae ventas que antes se iban al súper." },
      { t: "Ficha de Google con horarios reales", d: "\"Almacén abierto ahora\" y \"kiosco 24 hs\" son búsquedas constantes. Horarios correctos te mandan clientes." },
      { t: "Lista de difusión de ofertas", d: "Ofertas de la semana a tus vecinos por WhatsApp. Cercano, gratis y efectivo." },
      { t: "Medios de pago a la vista", d: "Transferencia, QR, tarjeta. Mucha gente elige dónde comprar según cómo puede pagar." },
    ],
    errores: ["No figurar en Google Maps.", "Catálogo desactualizado con productos que no hay."],
    faq: { q: "¿Un almacén necesita web?", a: "Una web simple o tienda con delivery y WhatsApp sirve para recibir pedidos del barrio y aparecer en Google cuando buscan almacén con delivery." },
  },
  "ferreterias-y-corralones": {
    frase: "para tu ferretería o corralón",
    tacticas: [
      { t: "Presupuestos rápidos por WhatsApp", d: "El cliente manda la lista de materiales y recibe el presupuesto. El que responde primero se queda con la venta." },
      { t: "Atendé al profesional", d: "Plomeros, electricistas y albañiles compran seguido. Una cuenta o lista de precios para ellos asegura clientes fijos." },
      { t: "Mostrá stock de lo más buscado", d: "Productos y marcas que tenés, con precio cuando se pueda. Evita la vuelta de \"¿tenés tal cosa?\"." },
      { t: "Envíos de materiales", d: "Si hacés entregas a obra, que esté claro hasta dónde y cuánto cuesta." },
    ],
    errores: ["No contestar consultas de precio por mensaje.", "No aparecer en Maps con horario de sábados."],
    faq: { q: "¿Sirve vender online en una ferretería?", a: "Sí, sobre todo para presupuestos y productos de alta rotación. Un catálogo con pedido por WhatsApp acelera la venta sin cambiar cómo trabajás." },
  },
  dieteticas: {
    frase: "para tu dietética",
    tacticas: [
      { t: "Catálogo con precios por kilo o unidad", d: "Frutos secos, harinas, sin TACC: la gente compara precios y quiere ver todo antes de ir." },
      { t: "Sección sin TACC y veganos", d: "Son búsquedas específicas en Google y clientes muy fieles cuando encuentran dónde comprar." },
      { t: "Envíos en tu zona", d: "Pedidos por WhatsApp con envío te abren clientes que no pasan por la puerta." },
      { t: "Recetas y usos", d: "Contenido simple sobre cómo usar los productos ayuda a vender y a aparecer en búsquedas." },
    ],
    errores: ["No aclarar qué productos son aptos celíacos.", "Precios desactualizados con inflación."],
    faq: { q: "¿Cómo atraigo clientes celíacos?", a: "Con una sección clara de productos sin TACC, aparecer en Google en \"dietética sin TACC en\" tu ciudad y mantener el stock confiable." },
  },
  mueblerias: {
    frase: "para tu mueblería",
    tacticas: [
      { t: "Fotos en ambientes reales", d: "El mueble en un living o dormitorio ayuda a imaginarlo en casa y vende más que una foto con fondo blanco." },
      { t: "Medidas y materiales completos", d: "Es lo que define la compra. Sin medidas, la consulta muere en el primer mensaje." },
      { t: "Muebles a medida", d: "Si fabricás a medida, mostralo con trabajos hechos: es una búsqueda de ticket alto." },
      { t: "Financiación clara", d: "Cuotas y medios de pago a la vista. En muebles, la financiación decide muchas compras." },
    ],
    errores: ["No publicar medidas ni tiempos de entrega.", "Catálogo sin precios ni referencia."],
    faq: { q: "¿Se pueden vender muebles online?", a: "Sí, con fotos reales, medidas, tiempos de entrega y costos de envío claros. Muchos clientes compran online y otros usan la web para decidir antes de ir al local." },
  },
  veterinarias: {
    frase: "para tu veterinaria",
    tacticas: [
      { t: "Destacá urgencias y horarios", d: "\"Veterinaria de guardia\" o \"abierta ahora\" son búsquedas urgentes. Si atendés urgencias, que se vea en todos lados." },
      { t: "Recordatorios de vacunas", d: "Avisar cuando toca la vacuna o la desparasitación trae al cliente de vuelta y lo fideliza." },
      { t: "Pet shop y peluquería", d: "Si tenés alimento, accesorios o baño y corte, mostralo: son motivos extra para elegirte." },
      { t: "Presentá al equipo", d: "Los dueños de mascotas quieren saber quién va a atender a su animal." },
    ],
    errores: ["No aclarar si hacen urgencias ni sus horarios.", "Ficha de Google sin teléfono visible."],
    faq: { q: "¿Cómo fidelizo a los clientes de la veterinaria?", a: "Con recordatorios de vacunas y controles, buena atención y un canal directo por WhatsApp. El cliente que confía vuelve durante toda la vida de su mascota." },
  },
  "talleres-mecanicos": {
    frase: "para tu taller mecánico",
    tacticas: [
      { t: "Explicá tus especialidades", d: "Frenos, tren delantero, inyección, aire acondicionado, marcas. Cada servicio es una búsqueda distinta." },
      { t: "Presupuesto antes de trabajar", d: "Mostrar que pasás presupuesto y explicás el arreglo genera confianza, que en este rubro es todo." },
      { t: "Reseñas de clientes", d: "La desconfianza con los talleres es alta. Reseñas reales en Google son tu mejor argumento." },
      { t: "Turnos para service", d: "El service programado llena la agenda. Recordale a cada cliente cuándo le toca por kilometraje o fecha." },
    ],
    errores: ["No dar presupuesto claro y perder la confianza del cliente.", "No figurar en Maps con horarios reales."],
    faq: { q: "¿Qué busca la gente antes de llevar el auto a un taller?", a: "Busca el problema o el servicio (\"cambio de embrague\", \"service\") cerca suyo, y mira las reseñas. Una web con especialidades y reseñas te pone en esas búsquedas." },
  },
  "plomeros-gasistas-y-electricistas": {
    frase: "siendo plomero, gasista o electricista",
    tacticas: [
      { t: "Dejá claro que atendés urgencias", d: "Pérdidas, cortes de luz, olor a gas: son llamados urgentes. Si atendés, que se vea en Google y en la web." },
      { t: "Mostrá tu matrícula", d: "Sobre todo en gas y electricidad, la matrícula da confianza y en muchos trabajos es obligatoria." },
      { t: "Zonas que cubrís", d: "Configurá tu ficha de Google como servicio a domicilio con los barrios que atendés." },
      { t: "Fotos de trabajos terminados", d: "Tableros prolijos, instalaciones nuevas. Demuestran calidad mejor que cualquier texto." },
    ],
    errores: ["No atender el teléfono ni responder rápido en urgencias.", "No aclarar costo de visita o diagnóstico."],
    faq: { q: "¿Necesito web si trabajo por recomendación?", a: "La recomendación sigue funcionando, pero quien te recomienda pasa tu nombre y la persona te busca en Google. Una web y una ficha con reseñas cierran esa confianza." },
  },
  "constructoras-y-arquitectos": {
    frase: "para tu constructora o estudio de arquitectura",
    tacticas: [
      { t: "Portfolio de obras terminadas", d: "Fotos de obras reales, con antes y después y datos (metros, plazo). Es lo que más convence." },
      { t: "Explicá cómo trabajás", d: "Etapas, presupuesto, plazos, seguimiento. Quien va a construir tiene miedo a los imprevistos." },
      { t: "Páginas por tipo de obra", d: "Viviendas, ampliaciones, steel framing, reformas: cada una se busca distinto." },
      { t: "Primer contacto con información útil", d: "Pedí metros, ubicación y tipo de obra en el primer mensaje para responder con una estimación seria." },
    ],
    errores: ["Mostrar renders en lugar de obras reales terminadas.", "No explicar cómo se arma el presupuesto."],
    faq: { q: "¿Cómo conseguir obras como constructora?", a: "Con un portfolio de obras reales, una web que explique el proceso y presencia en Google para las búsquedas de tu zona y tipo de obra, más las recomendaciones de clientes anteriores." },
  },
  "academias-y-cursos": {
    frase: "para tu academia o tus cursos",
    tacticas: [
      { t: "Una página por curso", d: "Temario, duración, modalidad, precio y certificado. Cada curso es una búsqueda propia." },
      { t: "Clase de prueba o contenido gratis", d: "Una clase abierta o material gratis permite que conozcan cómo enseñás antes de inscribirse." },
      { t: "Testimonios de alumnos", d: "Qué lograron después del curso: trabajo, nuevos clientes, un título. Es lo que más convence." },
      { t: "Fechas de inicio a la vista", d: "Una fecha concreta genera urgencia y ordena las inscripciones." },
    ],
    errores: ["No publicar precio ni fecha de inicio.", "Temarios vagos que no explican qué se aprende."],
    faq: { q: "¿Puedo vender cursos online a todo el país?", a: "Sí. Si tus cursos son online, la web y el SEO apuntan a búsquedas nacionales, y podés cobrar e inscribir desde la misma página." },
  },
};
