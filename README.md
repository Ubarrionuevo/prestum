# Prestum — www.prestum.com.ar

Varios softwares dentro de un solo dominio, pero **cada uno se presenta como un producto propio** con la marca Prestum
(ej: *Prestum Turnos*, *Prestum Gestión*). Ningún producto muestra a los otros.

Next.js 16 (App Router) + TypeScript + Tailwind 4 + Supabase (auth y base de datos).

## Rutas

| URL | Qué es | Cómo se sirve |
|---|---|---|
| `/` | Home de Prestum Turnos (landing en 10 secciones) | Estática (CDN) |
| `/turnero/<rubro>` | Landing por rubro (odontólogos, barberías…) | Estática |
| `/registro` · `/ingresar` | Alta en 1 paso (30 días gratis) e ingreso | Estática + Supabase desde el navegador |
| `/panel` | Panel del negocio: link, métricas, turnos, configuración | Estática + Supabase desde el navegador |
| `/<negocio>` | **Link público de reservas** del negocio (ej: `/barberia-don-ramon`) | ISR (CDN, se regenera al guardar) |
| `/demo` | Negocio de prueba | Estática |
| `/precios`, `/glosario/*`, `/turnos-online/<ciudad>`, `/legal/*` | Páginas SEO | Estáticas |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | SEO e IA | Estáticas (sitemap 1 vez/día) |
| `/api/revalidar` | Regenera la página del negocio cuando guarda cambios | Única función de Vercel |

Las rutas del sitio que un negocio no puede usar como link están en `src/config/reserved.ts` y en `slug_reservado()` (schema.sql).

## Conectar Supabase (10 minutos)

1. Crear proyecto en [supabase.com](https://supabase.com). **Región: São Paulo (sa-east-1)**, la más cercana a Argentina y a Vercel `gru1`.
2. **SQL Editor** → pegar y correr `supabase/schema.sql`. Después correr `supabase/cron.sql` (limpieza automática).
3. **Authentication → Sign In / Providers → Email**:
   - Dejar habilitado Email.
   - **Desactivar "Confirm email"**: el usuario entra directo a su panel y no gastás el cupo de emails del plan gratis (el SMTP incluido manda muy pocos por hora).
4. **Authentication → URL Configuration**: Site URL = `https://www.prestum.com.ar`; agregar `https://www.prestum.com.ar/panel` en Redirect URLs (para "olvidé mi contraseña").
5. **Project Settings → API**: copiar `Project URL` y la clave `anon` / `publishable`.
6. En **Vercel → Settings → Environment Variables** (y en `.env.local` para desarrollo):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
7. Redeploy.

### Ver los registrados (email + WhatsApp)
SQL Editor → `select * from privado.registros;` (esa vista no está expuesta a internet).

### Funciones de los planes (todas propias, sin servicios externos)
Qué incluye cada plan: columna `planes.funciones` (editable). En la prueba están todas.

| Función | Cómo funciona |
|---|---|
| `recordatorios` | En Turnos, “Recordar por WhatsApp” abre el chat del cliente con el mensaje armado (plantilla en Mi página). Queda marcado como recordado. |
| `sena` | Configurable en Mi página (% o fijo, alias, link de pago propio, plazo). El turno queda “seña pendiente”; el negocio la marca pagada. Si vence el plazo, el horario se libera solo (cron cada 15 min). |
| `lista_espera` | El cliente se anota desde la reserva. Al cancelarse un turno, un trigger marca “hay lugar” a quien le sirve; Inicio muestra el aviso con botón para escribirle. |
| `caja` | “Cobrado” en un turno registra el ingreso; egresos/ingresos manuales; resumen por medio de pago y comisiones por profesional (`recursos.comision_pct`). |
| `fidelizacion` | El cliente se identifica por WhatsApp. Cada X visitas, la siguiente es gratis (lo calcula la base al reservar). |
| `reportes` | Horarios pico, días, ausentismo, ticket promedio, mejores clientes, por mes; por sucursal o todas. Exportación a Excel (CSV generado en el navegador). |

### Organización, sucursales y equipo
- **Organización** = la cuenta: tiene el plan, la prueba y las suscripciones. El plan se copia solo a sus sucursales (trigger).
- **Sucursales** = negocios (cada una con su link, servicios, horarios, recursos y turnos). Más de una: plan Empresa (o prueba). Panel → Equipo → "Agregar sucursal".
- **Miembros** con rol: `dueno` (todo), `recepcion` (ve y cancela turnos), `profesional` (ve solo los turnos de su recurso). Pueden tener acceso a todas las sucursales o a una.
- **Invitaciones sin emails:** el dueño invita en Panel → Equipo y comparte el link `/registro?invitacion=<email>`. Al registrarse con ese email, la persona queda en el equipo (si ya tenía cuenta, queda activa al instante).
- Las reglas de seguridad (RLS) se aplican por rol en la base: aunque alguien manipule el navegador, solo ve lo que su rol permite.
- Si un plan no incluye roles, los miembros que no son dueños pierden el acceso (sus datos quedan).

### Recursos (profesionales, canchas, salas)
- Cada negocio tiene uno o más recursos (tabla `recursos`); cada turno ocupa uno. Dos turnos pueden ser a la misma hora en recursos distintos.
- Cada recurso puede hacer todos los servicios o algunos, y usar el horario del negocio o uno propio.
- En la reserva, si hay más de uno, el cliente elige "¿Con quién?" o "Cualquiera" (la base asigna el primero libre).
- Límite por plan (`planes.recursos_max`, ej. Inicial = 2) controlado en la base. En la prueba, sin límite.

### Cambiar precios (sin tocar código)
1. Supabase → **Table Editor → `planes`**: editar `precio_mensual`, `precio_anual`, `items` (funciones; `"pronto": true` muestra "Próximamente") o `destacado`.
2. **`ajustes`**: días de prueba, precio fundador (mensual/anual), cupo (50) y meses (12).
3. La web lo toma sola en hasta 24 h. Para que sea **al instante**: Supabase → Database → Webhooks → nuevo webhook en `planes` y `ajustes` (insert/update) → POST a `https://www.prestum.com.ar/api/revalidar?secret=TU_REVALIDATE_SECRET`. (Agregar `REVALIDATE_SECRET` en Vercel.)

### Suscripciones (estructura, sin pasarela integrada)
1. El negocio elige plan y ciclo en **Panel → Plan** → queda una solicitud **pendiente** con el precio congelado (y precio fundador si hay cupo).
2. Coordinás el cobro (hoy por WhatsApp; `src/lib/pagos.ts`, proveedor `manual`).
3. Ver pendientes y activar:
```sql
select * from privado.solicitudes;
select public.activar_suscripcion(<id>);          -- 1 mes o 1 año según el ciclo
select public.renovar_suscripcion(<id>);          -- suma un período más, mismo precio
```
- **Precio fundador:** cupo controlado en la base (`cupo_fundador()`), se revalida al activar (si se agotó, pasa a precio normal). Guarda `fundador_hasta` (12 meses); qué pasa después todavía no está definido.
- Un cron diario marca vencidas las suscripciones (`cron.sql`). El acceso se corta por `negocios.pago_hasta`.
- **Integrar una pasarela más adelante:** implementar un `ProveedorPagos` en `src/lib/pagos.ts` y un webhook que llame a `activar_suscripcion` / `renovar_suscripcion`. Las tablas y el panel no cambian.
Al vencer la prueba (30 días) sin plan, el panel se bloquea (solo deja elegir plan), la página pública muestra "agenda no disponible" y la base rechaza reservas nuevas. No se borra ningún dato. En los días 7, 20 y 27 el panel muestra un aviso con los días que quedan y los turnos gestionados.

## Ahorro de recursos

**Vercel**
- Todo el marketing es estático (CDN): 0 funciones por visita.
- Panel, registro y reservas hablan **directo con Supabase desde el navegador** (RLS + funciones RPC): 0 funciones de Vercel.
- La página de cada negocio es ISR: se genera una vez y se sirve desde la CDN; solo se regenera cuando el dueño guarda cambios (`/api/revalidar`) o una vez por día.
- Sin optimización de imágenes (`images.unoptimized`, todo SVG), sin middleware, región única `gru1` (`vercel.json`).
- Imágenes Open Graph generadas en el build.

**Supabase**
- Servicios, horarios y pagos dentro de la fila del negocio (jsonb): la página pública lee 1 fila.
- Turno ≈ 120 bytes; hora en minutos (smallint), pago como número. Un solo índice (parcial).
- Límites de tamaño en todos los textos y en el jsonb (nadie puede inflar la base).
- Métricas calculadas en la base (`metricas()`): viaja un JSON chico, no la lista de turnos.
- Anti-spam: máx. 40 reservas por hora por negocio; precio y duración se toman de la base.
- Limpieza semanal (pg_cron): borra turnos de +6 meses y cancelados de +30 días, y recorta el historial del cron.
- Sin Realtime ni Storage.
- Ojo: en el plan gratis, Supabase pausa el proyecto tras 7 días sin actividad.

## Estructura

```
supabase/schema.sql            Tablas, RLS, alta automática, RPC (reservas, métricas), vista privada
supabase/cron.sql              Limpieza automática
src/config/
  site.ts                      Marca, dominio, WhatsApp de ventas
  products/                    Registro de productos, turnero + rubros, contenido de la landing
  seo-content.ts               Ciudades y glosario (SEO programático)
  reserved.ts                  Links que los negocios no pueden usar
  negocios.ts                  Negocio demo (/demo)
src/lib/supabase.ts            Cliente Supabase + tipos + helpers
src/lib/seo.ts                 Metadata + JSON-LD (@graph Organization/WebSite/SoftwareApplication+offers, FAQ, Breadcrumb)
src/components/landing/        Las 10 secciones de la landing
src/components/auth/           Registro e ingreso
src/components/panel/          Panel (Inicio con métricas, Turnos, Mi página)
src/components/turnero/        Página de reservas
```

## Cómo crecer
- **Nuevo rubro:** agregar en `niches` de `products/turnero.ts` (+ su demo en `turnero-landing.ts`).
- **Nueva ciudad / término del glosario:** agregar en `seo-content.ts`.
- **Nuevo producto:** completar su archivo con `brandName` y pasar `status` a `"activo"`.

## Comandos
```
npm run dev
npm run build
```

## Pendiente
- Conectar Supabase (arriba).
- Google Search Console: verificar dominio, pegar código en `verification` (layout.tsx) y enviar `/sitemap.xml`.
- Cargar reseñas y números reales en `turnero-landing.ts` cuando existan.
- Revisar los textos legales con un abogado.

## SEO programático (rubro × ciudad)

- Cada rubro del turnero tiene una página por ciudad: `/turnero/<rubro>/<ciudad>` (10 × 21 = 210 páginas estáticas).
  El texto combina datos reales del rubro (`src/config/products/turnero.ts`) y de la ciudad (`src/config/seo-content.ts`:
  zonas, horario cortado, temporada, región). Lógica en `src/lib/pseo.ts`.
- Dos sitemaps, declarados en `robots.txt`:
  - `/sitemap.xml`: lo principal (home, rubros, precios, glosario, negocios pagos).
  - `/sitemap-pseo.xml`: páginas por ciudad y combinaciones rubro × ciudad.
- Para sumar un rubro sin generar sus 21 páginas por ciudad todavía, agregalo a `NO_PSEO_RUBROS` en `seo-content.ts`.
- URLs cortas (`/turnero/dentistas`, `/turnos-online/caba`) redirigen con 308 al slug canónico: se editan en `src/config/aliases.ts`.

## Glosario

- Los términos están en `src/config/glosario.ts`, cada uno con su categoría, una definición rápida (la caja de arriba, pensada para el fragmento destacado de Google), análisis, cómo lo resuelve Prestum (solo funciones reales), preguntas frecuentes y términos relacionados.
- Si el término tiene `funcion`, la página muestra "Incluido desde el plan …" según los planes.
- El índice `/glosario` tiene buscador y filtro por categoría, y lista todos los términos en el HTML para que Google los rastree.

## WhatsApp flotante y atribución

- Todas las páginas públicas del producto tienen un botón flotante de WhatsApp de ventas con un mensaje según la página (rubro, ciudad, término del glosario o precios). Está en `src/components/WhatsAppFlotante.tsx`.
- Las páginas de reserva de cada negocio muestran el sello "⚡ Hecho con Prestum Turnos", que lleva a la home con `?ref=agenda`.
- El primer `?ref=` de cada visitante se guarda en su navegador y se envía al registrarse. Queda en `organizaciones.origen` (si ya tenías la base creada, volvé a correr `schema.sql`). Para ver cuántas cuentas trajo cada canal:
  `select origen, count(*) from privado.registros group by 1 order by 2 desc;`
- Podés usar tus propios `ref` en links de Instagram, Google, etc.: `https://www.prestum.com.ar/?ref=instagram`.
