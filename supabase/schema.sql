-- =============================================================================
--  PRESTUM TURNOS · Esquema de Supabase
--  Pegar completo en Supabase → SQL Editor → Run. Se puede volver a correr.
--
--  Pensado para el plan gratuito (500 MB de base):
--   · Servicios, horarios y medios de pago viven DENTRO de la fila del negocio (jsonb):
--     la página pública lee UNA sola fila.
--   · Turnos: fila chica (~120 bytes), hora en minutos (smallint), pago como número.
--   · Índices parciales (solo turnos activos).
--   · Límites de tamaño en cada campo de texto (nadie puede inflar la base).
--   · Limpieza automática de turnos viejos (ver cron.sql).
--   · Las reservas entran por una función que valida todo del lado del servidor.
-- =============================================================================

-- ---------------------------------------------------------------- utilidades
create or replace function public.slugify(t text) returns text
language sql immutable as $$
  select trim(both '-' from regexp_replace(
    translate(lower(coalesce(t, '')), 'áàäâãéèëêíìïîóòöôõúùüûñç', 'aaaaaeeeeiiiiooooouuuunc'),
    '[^a-z0-9]+', '-', 'g'))
$$;

-- Rutas del sitio que un negocio NO puede usar como link.
-- Mantener sincronizado con src/config/reserved.ts
create or replace function public.slug_reservado(s text) returns boolean
language sql immutable as $$
  select s = any (array[
    'turnero','sistema-de-gestion','registro','ingresar','panel','api','precios','glosario',
    'turnos-online','demo','reservar','turnos','turneros','admin','soporte','legal','blog',
    'login','app','www','prestum','ayuda','contacto','rubros','funcionalidades','como-funciona',
    'opengraph-image','terminos','privacidad','cuenta','configuracion'
  ])
$$;

create or replace function public.hhmm_a_min(t text) returns int
language sql immutable as $$
  select split_part(t, ':', 1)::int * 60 + split_part(t, ':', 2)::int
$$;

create or replace function public.hoy_ar() returns date
language sql stable as $$
  select (now() at time zone 'America/Argentina/Buenos_Aires')::date
$$;

-- ---------------------------------------------------------------- organizaciones (cuenta y facturación)
-- Una organización = una cuenta. Tiene el plan y la prueba, y puede tener varias sucursales
-- (negocios) y un equipo (miembros con rol). El plan se copia a sus sucursales por trigger.
create table if not exists public.organizaciones (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null check (char_length(nombre) between 2 and 60),
  plan         text not null default 'prueba' check (plan in ('prueba','inicial','profesional','empresa')),
  prueba_hasta date not null default (public.hoy_ar() + 30),
  pago_hasta   date,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------- negocios (= sucursales)
create table if not exists public.negocios (
  id                uuid primary key default gen_random_uuid(),
  owner             uuid references auth.users(id) on delete set null,   -- quién la creó (el acceso lo dan los miembros)
  organizacion_id   uuid references public.organizaciones(id) on delete cascade,
  slug              text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'),
  nombre            text not null check (char_length(nombre) between 2 and 60),
  rubro             text check (char_length(rubro) <= 40),
  whatsapp          text not null check (whatsapp ~ '^[0-9]{10,15}$'),
  descripcion       text check (char_length(descripcion) <= 200),
  direccion         text check (char_length(direccion) <= 120),
  -- [{ "id": "corte", "nombre": "Corte", "precio": 10000, "duracion": 30 }]
  servicios         jsonb not null default '[]'
                    check (jsonb_typeof(servicios) = 'array' and jsonb_array_length(servicios) <= 30
                           and pg_column_size(servicios) < 6000),
  -- { "1": [["09:00","13:00"],["15:00","19:00"]], ... }  (0 = domingo … 6 = sábado)
  horarios          jsonb not null default '{}'
                    check (jsonb_typeof(horarios) = 'object' and pg_column_size(horarios) < 2000),
  medios_pago       text[] not null default '{efectivo,transferencia,mercadopago}'
                    check (medios_pago <@ array['efectivo','transferencia','mercadopago']::text[]),
  dias_anticipacion smallint not null default 21 check (dias_anticipacion between 1 and 90),
  plan              text not null default 'prueba',
  prueba_hasta      date not null default (public.hoy_ar() + 30),   -- 30 días gratis (ver ajustes.prueba_dias)
  pago_hasta        date,                                           -- hasta cuándo está pago
  created_at        timestamptz not null default now()
);

-- Planes válidos (si el esquema ya se había corrido con los planes viejos, esto lo actualiza).
alter table public.negocios drop constraint if exists negocios_plan_check;
update public.negocios set plan = 'inicial' where plan = 'basico';
update public.negocios set plan = 'profesional' where plan = 'pro';
alter table public.negocios add constraint negocios_plan_check
  check (plan in ('prueba','inicial','profesional','empresa'));
alter table public.negocios alter column prueba_hasta set default (public.hoy_ar() + 30);

-- Migración a organizaciones (instalaciones que ya tenían negocios).
alter table public.negocios add column if not exists organizacion_id uuid references public.organizaciones(id) on delete cascade;
alter table public.negocios drop constraint if exists negocios_owner_key;
alter table public.negocios alter column owner drop not null;
do $$
declare r record; oid uuid;
begin
  for r in select * from public.negocios where organizacion_id is null loop
    insert into public.organizaciones (nombre, plan, prueba_hasta, pago_hasta)
    values (r.nombre, r.plan, r.prueba_hasta, r.pago_hasta) returning id into oid;
    update public.negocios set organizacion_id = oid where id = r.id;
  end loop;
end $$;
alter table public.negocios alter column organizacion_id set not null;
create index if not exists negocios_org_idx on public.negocios (organizacion_id);

-- ---------------------------------------------------------------- PRECIOS (editables sin tocar código)
-- Para cambiar un precio: Table Editor → planes → editar la celda. La web lo toma sola
-- (en hasta 24 h, o al instante con el webhook de README → "Cambiar precios").
create table if not exists public.planes (
  id               text primary key check (id in ('inicial','profesional','empresa')),
  nombre           text not null,
  bajada           text not null default '',
  precio_mensual   integer not null check (precio_mensual >= 0),   -- ARS
  precio_anual     integer not null check (precio_anual >= 0),     -- ARS (equivale a 2 meses gratis)
  recursos_max     smallint,                                       -- null = ilimitados
  -- [{ "texto": "Lista de espera automática", "pronto": true }]  pronto = todavía no disponible
  items            jsonb not null default '[]' check (jsonb_typeof(items) = 'array'),
  destacado        boolean not null default false,
  orden            smallint not null default 0,
  activo           boolean not null default true
);

-- Ajustes generales (una sola fila).
create table if not exists public.ajustes (
  id                       smallint primary key default 1 check (id = 1),
  prueba_dias              smallint not null default 30 check (prueba_dias between 1 and 90),
  fundador_plan            text not null default 'profesional' references public.planes(id) deferrable initially deferred,
  fundador_precio_mensual  integer not null default 14900,
  fundador_precio_anual    integer not null default 149000,
  fundador_cupo            smallint not null default 50,
  fundador_meses           smallint not null default 12,
  fundador_activo          boolean not null default true
);

insert into public.planes (id, nombre, bajada, precio_mensual, precio_anual, recursos_max, destacado, orden, items) values
  ('inicial', 'Inicial', 'Para arrancar con hasta 2 profesionales, canchas o salas.', 14900, 149000, 2, false, 1,
   '[{"texto":"Hasta 2 recursos (profesionales, canchas o salas)"},
     {"texto":"Link de reservas propio"},
     {"texto":"Recordatorios por WhatsApp"},
     {"texto":"Seña con Mercado Pago"}]'),
  ('profesional', 'Profesional', 'Para equipos que quieren llenar la agenda y ordenar la caja.', 22900, 229000, null, true, 2,
   '[{"texto":"Todo lo del Inicial"},
     {"texto":"Recursos ilimitados"},
     {"texto":"Lista de espera automática"},
     {"texto":"Comisiones y caja por profesional"},
     {"texto":"Fidelización (cada X visitas, 1 gratis)"}]'),
  ('empresa', 'Empresa', 'Para negocios con varias sucursales y equipo grande.', 44900, 449000, null, false, 3,
   '[{"texto":"Todo lo del Profesional"},
     {"texto":"Varias sucursales en un mismo panel"},
     {"texto":"Roles y permisos (dueño, recepción, profesional)"},
     {"texto":"Reportes avanzados y exportación a Excel"},
     {"texto":"Soporte prioritario por WhatsApp"}]')
on conflict (id) do nothing;

insert into public.ajustes (id) values (1) on conflict (id) do nothing;

-- Funciones por plan: cuántas sucursales (null = ilimitadas) y si permite equipo con roles.
alter table public.planes add column if not exists sucursales_max smallint;
alter table public.planes add column if not exists roles boolean not null default false;
update public.planes set sucursales_max = 1 where id in ('inicial','profesional') and sucursales_max is null;
update public.planes set roles = true where id = 'empresa';

alter table public.planes  enable row level security;
alter table public.ajustes enable row level security;
drop policy if exists planes_lectura on public.planes;
create policy planes_lectura on public.planes for select to anon, authenticated using (true);
drop policy if exists ajustes_lectura on public.ajustes;
create policy ajustes_lectura on public.ajustes for select to anon, authenticated using (true);
revoke all on public.planes, public.ajustes from anon, authenticated;
grant select on public.planes, public.ajustes to anon, authenticated;

-- ---------------------------------------------------------------- recursos
-- Profesionales, canchas, salas, consultorios… Cada turno ocupa UN recurso:
-- dos turnos pueden ser a la misma hora si son en recursos distintos.
alter table public.negocios add column if not exists recurso_etiqueta text not null default 'Profesional'
  check (char_length(recurso_etiqueta) between 2 and 20);   -- cómo se llaman: "Profesional", "Cancha", "Sala"…

create table if not exists public.recursos (
  id          uuid primary key default gen_random_uuid(),
  negocio_id  uuid not null references public.negocios(id) on delete cascade,
  nombre      text not null check (char_length(nombre) between 1 and 40),
  servicios   text[] not null default '{}' check (cardinality(servicios) <= 30),  -- ids que hace; vacío = todos
  horarios    jsonb check (horarios is null or (jsonb_typeof(horarios) = 'object' and pg_column_size(horarios) < 2000)), -- null = los del negocio
  activo      boolean not null default true,
  orden       smallint not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists recursos_negocio_idx on public.recursos (negocio_id, orden);

-- ---------------------------------------------------------------- turnos
create table if not exists public.turnos (
  id          bigint generated always as identity primary key,
  negocio_id  uuid not null references public.negocios(id) on delete cascade,
  recurso_id  uuid references public.recursos(id) on delete set null,
  fecha       date not null,
  hora        smallint not null check (hora between 0 and 1439),     -- minutos desde 00:00
  duracion    smallint not null check (duracion between 5 and 600),
  servicio    text not null check (char_length(servicio) <= 60),
  precio      integer not null check (precio >= 0),
  pago        smallint not null check (pago between 0 and 2),         -- 0 efectivo · 1 transf. · 2 MP
  cliente     text not null check (char_length(cliente) between 2 and 60),
  nota        text check (char_length(nota) <= 200),
  cancelado   boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table public.turnos add column if not exists recurso_id uuid references public.recursos(id) on delete set null;

-- Índices (solo turnos activos): uno para la agenda/métricas del negocio y otro que
-- impide dos turnos en el mismo recurso a la misma hora.
drop index if exists public.turnos_activos_idx;
create index if not exists turnos_negocio_fecha_idx on public.turnos (negocio_id, fecha) where not cancelado;
create unique index if not exists turnos_recurso_slot_idx
  on public.turnos (recurso_id, fecha, hora) where not cancelado and recurso_id is not null;

-- Migración: todo negocio tiene al menos un recurso y los turnos viejos quedan asignados.
insert into public.recursos (negocio_id, nombre)
  select n.id, 'Principal' from public.negocios n
  where not exists (select 1 from public.recursos r where r.negocio_id = n.id);
update public.turnos t
  set recurso_id = (select r.id from public.recursos r where r.negocio_id = t.negocio_id order by r.orden, r.created_at limit 1)
  where t.recurso_id is null;

-- Límite de recursos según el plan. Durante la prueba: sin límite (todas las funciones).
create or replace function public.limite_recursos(p_negocio uuid) returns int
language sql stable security definer set search_path = public as $$
  select case when n.pago_hasta is not null and n.pago_hasta >= public.hoy_ar()
              then (select p.recursos_max from public.planes p where p.id = n.plan)
              else null end
  from public.negocios n where n.id = p_negocio
$$;

-- Recursos que pueden recibir turnos (activos y dentro del límite del plan, en orden).
create or replace function public.recursos_habilitados(p_negocio uuid)
returns setof public.recursos
language sql stable security definer set search_path = public as $$
  select r.* from public.recursos r
  where r.negocio_id = p_negocio and r.activo
  order by r.orden, r.created_at
  limit coalesce(public.limite_recursos(p_negocio), 50)
$$;

-- No se pueden activar más recursos que los del plan (y nunca más de 50).
create or replace function public.validar_limite_recursos() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  lim int := public.limite_recursos(new.negocio_id);
begin
  if tg_op = 'INSERT' and (select count(*) from public.recursos where negocio_id = new.negocio_id) >= 50 then
    raise exception 'limite_recursos';
  end if;
  if new.activo and (tg_op = 'INSERT' or old.activo is distinct from new.activo) and lim is not null
     and (select count(*) from public.recursos r join public.negocios n on n.id = r.negocio_id
          where n.organizacion_id = (select organizacion_id from public.negocios where id = new.negocio_id)
            and r.activo and r.id <> new.id) >= lim then
    raise exception 'limite_recursos';
  end if;
  return new;
end $$;
drop trigger if exists recursos_limite on public.recursos;
create trigger recursos_limite before insert or update of activo on public.recursos
  for each row execute function public.validar_limite_recursos();

-- ---------------------------------------------------------------- equipo: miembros y roles
-- dueno: todo · recepcion: ve y cancela turnos · profesional: ve solo sus turnos.
-- negocio_id null = acceso a todas las sucursales. Las invitaciones no mandan emails:
-- el dueño comparte un link y, al registrarse con ese email, la persona queda en el equipo.
create table if not exists public.miembros (
  id               bigint generated always as identity primary key,
  organizacion_id  uuid not null references public.organizaciones(id) on delete cascade,
  user_id          uuid references auth.users(id) on delete cascade,
  email            text not null check (char_length(email) <= 120 and email = lower(email)),
  rol              text not null check (rol in ('dueno','recepcion','profesional')),
  negocio_id       uuid references public.negocios(id) on delete cascade,
  recurso_id       uuid references public.recursos(id) on delete set null,
  estado           text not null default 'invitado' check (estado in ('invitado','activo')),
  created_at       timestamptz not null default now(),
  unique (organizacion_id, email)
);
create index if not exists miembros_user_idx on public.miembros (user_id) where estado = 'activo';
create index if not exists miembros_invitado_idx on public.miembros (email) where estado = 'invitado';

-- Migración: el creador de cada negocio existente queda como dueño.
insert into public.miembros (organizacion_id, user_id, email, rol, estado)
  select n.organizacion_id, n.owner, lower(u.email), 'dueno', 'activo'
  from public.negocios n join auth.users u on u.id = n.owner
  on conflict (organizacion_id, email) do nothing;

-- ¿La organización puede tener equipo con roles? (en la prueba, sí: todas las funciones)
create or replace function public.org_permite_roles(p_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select case when o.pago_hasta is not null and o.pago_hasta >= public.hoy_ar()
              then coalesce((select p.roles from public.planes p where p.id = o.plan), false)
              else true end
  from public.organizaciones o where o.id = p_org
$$;

-- Rol del usuario actual en una sucursal (null = sin acceso). Si el plan no permite roles,
-- solo el dueño conserva acceso.
create or replace function public.rol_en_negocio(p_negocio uuid) returns text
language sql stable security definer set search_path = public as $$
  select m.rol
  from public.miembros m join public.negocios n on n.organizacion_id = m.organizacion_id
  where n.id = p_negocio and m.user_id = auth.uid() and m.estado = 'activo'
    and (m.negocio_id is null or m.negocio_id = n.id)
    and (m.rol = 'dueno' or public.org_permite_roles(m.organizacion_id))
  order by case m.rol when 'dueno' then 1 when 'recepcion' then 2 else 3 end
  limit 1
$$;

-- Recurso (agenda) del profesional actual en una sucursal.
create or replace function public.mi_recurso(p_negocio uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select m.recurso_id
  from public.miembros m join public.negocios n on n.organizacion_id = m.organizacion_id
  where n.id = p_negocio and m.user_id = auth.uid() and m.estado = 'activo' and m.rol = 'profesional'
  limit 1
$$;

create or replace function public.es_dueno_org(p_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.miembros
                 where organizacion_id = p_org and user_id = auth.uid() and rol = 'dueno' and estado = 'activo')
$$;

create or replace function public.es_miembro_org(p_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.miembros
                 where organizacion_id = p_org and user_id = auth.uid() and estado = 'activo')
$$;

-- Organización de la que el usuario actual es dueño.
create or replace function public.org_de_dueno() returns uuid
language sql stable security definer set search_path = public as $$
  select organizacion_id from public.miembros
  where user_id = auth.uid() and rol = 'dueno' and estado = 'activo'
  order by created_at limit 1
$$;

-- El plan vive en la organización y se copia a sus sucursales (todo lo demás lee la sucursal).
create or replace function public.sincronizar_plan_org() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.negocios
  set plan = new.plan, prueba_hasta = new.prueba_hasta, pago_hasta = new.pago_hasta
  where organizacion_id = new.id;
  return new;
end $$;
drop trigger if exists organizaciones_sync on public.organizaciones;
create trigger organizaciones_sync after update of plan, prueba_hasta, pago_hasta on public.organizaciones
  for each row execute function public.sincronizar_plan_org();

-- Link único a partir de un texto.
create or replace function public.slug_unico(p_texto text) returns text
language plpgsql stable security definer set search_path = public as $$
declare
  base text;
  cand text;
  n int := 1;
begin
  base := trim(both '-' from left(public.slugify(p_texto), 36));
  if char_length(base) < 3 then base := trim(both '-' from base || '-turnos'); end if;
  cand := base;
  while public.slug_reservado(cand) or exists (select 1 from public.negocios where slug = cand) loop
    n := n + 1;
    cand := base || '-' || n;
  end loop;
  return cand;
end $$;

-- ---------------------------------------------------------------- seguridad (RLS)
alter table public.organizaciones enable row level security;
alter table public.miembros enable row level security;
alter table public.negocios enable row level security;
alter table public.recursos enable row level security;
alter table public.turnos   enable row level security;

drop policy if exists negocios_lectura_publica on public.negocios;
create policy negocios_lectura_publica on public.negocios
  for select to anon, authenticated using (true);

drop policy if exists negocios_dueno_edita on public.negocios;
create policy negocios_dueno_edita on public.negocios
  for update to authenticated
  using (public.rol_en_negocio(id) = 'dueno') with check (public.rol_en_negocio(id) = 'dueno');

drop policy if exists recursos_lectura on public.recursos;
create policy recursos_lectura on public.recursos
  for select to anon, authenticated using (true);

drop policy if exists recursos_dueno on public.recursos;
create policy recursos_dueno on public.recursos
  for all to authenticated
  using (public.rol_en_negocio(negocio_id) = 'dueno')
  with check (public.rol_en_negocio(negocio_id) = 'dueno');

drop policy if exists turnos_dueno_lee on public.turnos;
drop policy if exists turnos_equipo_lee on public.turnos;
create policy turnos_equipo_lee on public.turnos
  for select to authenticated
  using (public.rol_en_negocio(negocio_id) in ('dueno','recepcion')
         or (public.rol_en_negocio(negocio_id) = 'profesional' and recurso_id = public.mi_recurso(negocio_id)));

drop policy if exists turnos_dueno_cancela on public.turnos;
drop policy if exists turnos_equipo_cancela on public.turnos;
create policy turnos_equipo_cancela on public.turnos
  for update to authenticated
  using (public.rol_en_negocio(negocio_id) in ('dueno','recepcion'));

drop policy if exists organizaciones_miembros_leen on public.organizaciones;
create policy organizaciones_miembros_leen on public.organizaciones
  for select to authenticated using (public.es_miembro_org(id));
drop policy if exists organizaciones_dueno_edita on public.organizaciones;
create policy organizaciones_dueno_edita on public.organizaciones
  for update to authenticated using (public.es_dueno_org(id)) with check (public.es_dueno_org(id));

drop policy if exists miembros_leen on public.miembros;
create policy miembros_leen on public.miembros
  for select to authenticated
  using (user_id = (select auth.uid()) or public.es_dueno_org(organizacion_id));

-- Permisos por columna: el público solo ve lo necesario para reservar;
-- el dueño no puede tocar plan, fechas de pago ni su link.
revoke all on public.negocios from anon, authenticated;
grant select (id, slug, nombre, rubro, whatsapp, descripcion, direccion, servicios, horarios,
              medios_pago, dias_anticipacion, plan, prueba_hasta, pago_hasta, recurso_etiqueta)
  on public.negocios to anon;
grant select on public.negocios to authenticated;
grant update (nombre, rubro, whatsapp, descripcion, direccion, servicios, horarios,
              medios_pago, dias_anticipacion, recurso_etiqueta)
  on public.negocios to authenticated;

revoke all on public.organizaciones from anon, authenticated;
grant select on public.organizaciones to authenticated;
grant update (nombre) on public.organizaciones to authenticated;   -- plan y fechas: solo por funciones

revoke all on public.miembros from anon, authenticated;
grant select on public.miembros to authenticated;                  -- altas/bajas: solo por funciones

revoke all on public.recursos from anon, authenticated;
grant select on public.recursos to anon, authenticated;
grant insert, update, delete on public.recursos to authenticated;

revoke all on public.turnos from anon, authenticated;
grant select on public.turnos to authenticated;
grant update (cancelado) on public.turnos to authenticated;

-- ---------------------------------------------------------------- alta automática
-- Al registrarse, se crea el negocio con los datos del formulario (nombre, whatsapp,
-- rubro, servicios y horarios por defecto) y un primer recurso. El link se genera único.
create or replace function public.crear_negocio_al_registrarse() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  nombre_neg text := left(coalesce(nullif(trim(m->>'nombre'), ''), 'Mi negocio'), 60);
  oid uuid;
  nid uuid;
begin
  -- ¿Lo invitaron a un equipo? → queda como miembro y no se crea una cuenta nueva.
  update public.miembros set user_id = new.id, estado = 'activo'
  where email = lower(new.email) and estado = 'invitado';
  if found then return new; end if;

  insert into public.organizaciones (nombre, prueba_hasta)
  values (nombre_neg, public.hoy_ar() + coalesce((select prueba_dias from public.ajustes where id = 1), 30))
  returning id into oid;

  insert into public.negocios (owner, organizacion_id, slug, nombre, rubro, whatsapp, servicios, horarios, prueba_hasta)
  values (
    new.id,
    oid,
    public.slug_unico(coalesce(nullif(m->>'nombre', ''), split_part(new.email, '@', 1))),
    nombre_neg,
    left(m->>'rubro', 40),
    regexp_replace(coalesce(m->>'whatsapp', ''), '\D', '', 'g'),
    coalesce(m->'servicios', '[]'::jsonb),
    coalesce(m->'horarios', '{"1":[["09:00","13:00"],["15:00","19:00"]],"2":[["09:00","13:00"],["15:00","19:00"]],"3":[["09:00","13:00"],["15:00","19:00"]],"4":[["09:00","13:00"],["15:00","19:00"]],"5":[["09:00","13:00"],["15:00","19:00"]],"6":[["09:00","13:00"]]}'::jsonb),
    (select prueba_hasta from public.organizaciones where id = oid)
  )
  returning id into nid;

  insert into public.recursos (negocio_id, nombre) values (nid, 'Principal');
  insert into public.miembros (organizacion_id, user_id, email, rol, estado) values (oid, new.id, lower(new.email), 'dueno', 'activo');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.crear_negocio_al_registrarse();

-- ---------------------------------------------------------------- funciones públicas (RPC)

-- ¿Está libre este link? (para el formulario de registro)
create or replace function public.slug_disponible(p_slug text) returns boolean
language sql stable security definer set search_path = public as $$
  select not public.slug_reservado(p_slug)
     and not exists (select 1 from public.negocios where slug = p_slug)
$$;

-- Horarios ocupados de un día, por recurso (sin datos personales).
drop function if exists public.ocupados(uuid, date);
create function public.ocupados(p_negocio uuid, p_fecha date)
returns table (recurso_id uuid, hora smallint, duracion smallint)
language sql stable security definer set search_path = public as $$
  select t.recurso_id, t.hora, t.duracion from public.turnos t
  where t.negocio_id = p_negocio and t.fecha = p_fecha and not t.cancelado
$$;

-- Crear una reserva. El precio y la duración se toman de la base (no del navegador).
-- p_recurso = null → "cualquiera": se asigna el primer recurso libre que haga el servicio.
-- Devuelve { id, recurso } (recurso = nombre asignado, para el mensaje de WhatsApp).
drop function if exists public.crear_turno(uuid, date, smallint, text, smallint, text, text);
drop function if exists public.crear_turno(uuid, date, smallint, text, smallint, text, text, uuid);
-- Crear una reserva. El precio y la duración se toman de la base (no del navegador).
-- p_recurso = null → "cualquiera": se asigna el primer recurso libre que haga el servicio.
-- p_tel (opcional) → recordatorios, fidelización (turno gratis) y lista de espera.
-- Devuelve { id, recurso, gratis, sena, alias, link, minutos } para la pantalla de confirmación.
create or replace function public.crear_turno(
  p_negocio uuid, p_fecha date, p_hora smallint, p_servicio text,
  p_pago smallint, p_cliente text, p_nota text default null, p_recurso uuid default null, p_tel text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  neg public.negocios%rowtype;
  rec public.recursos%rowtype;
  s jsonb;
  dur smallint;
  v_precio int;
  rango jsonb;
  dentro boolean;
  hubo_candidato boolean := false;
  hubo_en_horario boolean := false;
  elegido public.recursos%rowtype;
  hoy date := public.hoy_ar();
  ahora int := extract(hour from now() at time zone 'America/Argentina/Buenos_Aires')::int * 60
             + extract(minute from now() at time zone 'America/Argentina/Buenos_Aires')::int;
  dow text := (extract(dow from p_fecha)::int)::text;
  tel text := nullif(regexp_replace(coalesce(p_tel, ''), '\D', '', 'g'), '');
  es_gratis boolean := false;
  v_sena int := 0;
  cada int;
  nuevo bigint;
begin
  select * into neg from public.negocios where id = p_negocio;
  if not found then raise exception 'negocio_inexistente'; end if;
  if greatest(neg.prueba_hasta, coalesce(neg.pago_hasta, neg.prueba_hasta)) < hoy then raise exception 'agenda_pausada'; end if;
  if p_fecha < hoy or p_fecha > hoy + neg.dias_anticipacion then raise exception 'fecha_invalida'; end if;
  if p_fecha = hoy and p_hora <= ahora then raise exception 'horario_pasado'; end if;
  if p_pago not between 0 and 2
     or not ((array['efectivo','transferencia','mercadopago'])[p_pago + 1] = any (neg.medios_pago)) then
    raise exception 'pago_invalido';
  end if;
  if char_length(trim(coalesce(p_cliente, ''))) < 2 then raise exception 'nombre_invalido'; end if;
  if tel is not null and tel !~ '^[0-9]{8,15}$' then raise exception 'telefono_invalido'; end if;

  select x into s from jsonb_array_elements(neg.servicios) x where x->>'id' = p_servicio limit 1;
  if s is null then raise exception 'servicio_invalido'; end if;
  dur := (s->>'duracion')::smallint;
  v_precio := (s->>'precio')::int;

  -- Anti-spam: tope de reservas por hora por negocio.
  if (select count(*) from public.turnos
      where negocio_id = p_negocio and not cancelado and created_at > now() - interval '1 hour') >= 40 then
    raise exception 'demasiadas_reservas';
  end if;

  -- Evita que dos personas reserven el mismo horario al mismo tiempo.
  perform pg_advisory_xact_lock(hashtext(p_negocio::text || p_fecha::text));

  for rec in
    select * from public.recursos_habilitados(p_negocio) r
    where (p_recurso is null or r.id = p_recurso)
      and (cardinality(r.servicios) = 0 or p_servicio = any (r.servicios))
  loop
    hubo_candidato := true;
    dentro := false;
    for rango in select * from jsonb_array_elements(coalesce(coalesce(rec.horarios, neg.horarios) -> dow, '[]'::jsonb)) loop
      if p_hora >= public.hhmm_a_min(rango->>0) and p_hora + dur <= public.hhmm_a_min(rango->>1) then
        dentro := true;
      end if;
    end loop;
    continue when not dentro;
    hubo_en_horario := true;
    if not exists (select 1 from public.turnos
                   where recurso_id = rec.id and fecha = p_fecha and not cancelado
                     and hora < p_hora + dur and hora + duracion > p_hora) then
      elegido := rec;
      exit;
    end if;
  end loop;

  if elegido.id is null then
    if not hubo_candidato then raise exception 'recurso_invalido'; end if;
    if not hubo_en_horario then raise exception 'fuera_de_horario'; end if;
    raise exception 'horario_ocupado';
  end if;

  -- Fidelización: cada X visitas, la siguiente es gratis.
  if tel is not null and coalesce((neg.fidelizacion->>'activa')::boolean, false) and public.negocio_tiene(p_negocio, 'fidelizacion') then
    cada := greatest(coalesce((neg.fidelizacion->>'cada')::int, 5), 1);
    es_gratis := (public.visitas_cliente(p_negocio, tel) + 1) % (cada + 1) = 0;
  end if;

  -- Seña (si está activa y el turno no es gratis).
  if not es_gratis and coalesce((neg.sena->>'activa')::boolean, false) and public.negocio_tiene(p_negocio, 'sena') then
    v_sena := least(v_precio, greatest(0,
      case when neg.sena->>'tipo' = 'fijo' then coalesce((neg.sena->>'valor')::int, 0)
           else round(v_precio * coalesce((neg.sena->>'valor')::numeric, 0) / 100)::int end));
  end if;

  insert into public.turnos (negocio_id, recurso_id, fecha, hora, duracion, servicio, precio, pago, cliente, nota,
                             cliente_tel, gratis, sena_monto, sena_estado)
  values (p_negocio, elegido.id, p_fecha, p_hora, dur, left(s->>'nombre', 60), v_precio, p_pago,
          left(trim(p_cliente), 60), nullif(left(trim(coalesce(p_nota, '')), 200), ''),
          tel, es_gratis, v_sena, case when v_sena > 0 then 'pendiente' else 'no_aplica' end)
  returning id into nuevo;

  return jsonb_build_object(
    'id', nuevo, 'recurso', elegido.nombre, 'gratis', es_gratis, 'sena', v_sena,
    'alias', neg.sena->>'alias', 'link', neg.sena->>'link', 'minutos', (neg.sena->>'minutos')::int);
end $$;

-- Métricas del panel, ya agregadas (viaja un JSON chico, no todos los turnos).
drop function if exists public.metricas(int);
-- p_negocio = null → todas las sucursales de la organización (solo dueño).
create or replace function public.metricas(p_negocio uuid default null, p_dias int default 30) returns jsonb
language sql stable security definer set search_path = public as $$
  with negs as (
    select n.id from public.negocios n
    where (p_negocio is null and n.organizacion_id = public.org_de_dueno())
       or (p_negocio is not null and n.id = p_negocio and public.rol_en_negocio(p_negocio) = 'dueno')
  ),
  t as (
    select * from public.turnos
    where negocio_id in (select id from negs) and not cancelado
      and fecha between public.hoy_ar() - least(greatest(p_dias, 1), 365) and public.hoy_ar() + 90
  ),
  periodo as (select * from t where fecha <= public.hoy_ar())
  select jsonb_build_object(
    'total',     (select count(*) from periodo),
    'ingresos',  (select coalesce(sum(precio), 0) from periodo),
    'proximos',  (select count(*) from t where fecha >= public.hoy_ar()),
    'hoy',       (select count(*) from t where fecha = public.hoy_ar()),
    'por_pago',  (select coalesce(jsonb_object_agg(pago, n), '{}'::jsonb)
                  from (select pago, count(*) n from periodo group by pago) x),
    'por_servicio', (select coalesce(jsonb_agg(jsonb_build_object('nombre', servicio, 'n', n) order by n desc), '[]'::jsonb)
                  from (select servicio, count(*) n from periodo group by servicio order by n desc limit 5) x),
    'por_recurso', (select coalesce(jsonb_agg(jsonb_build_object('nombre', nombre, 'n', n, 'ingresos', ing) order by n desc), '[]'::jsonb)
                  from (select r.nombre, count(*) n, sum(p.precio) ing
                        from periodo p join public.recursos r on r.id = p.recurso_id
                        group by r.nombre order by n desc limit 10) x),
    'por_sucursal', (select coalesce(jsonb_agg(jsonb_build_object('nombre', nombre, 'n', n, 'ingresos', ing) order by n desc), '[]'::jsonb)
                  from (select ng.nombre, count(*) n, sum(p.precio) ing
                        from periodo p join public.negocios ng on ng.id = p.negocio_id
                        group by ng.nombre order by n desc limit 20) x),
    'por_dia',   (select coalesce(jsonb_object_agg(d, n), '{}'::jsonb)
                  from (select extract(dow from fecha)::int d, count(*) n from periodo group by 1) x)
  )
$$;

-- ---------------------------------------------------------------- suscripciones
-- ESTRUCTURA de cobro, sin pasarela integrada. Flujo actual:
--   1) El dueño elige plan + ciclo en su panel → solicitar_plan() crea una suscripción 'pendiente'
--      con el precio calculado (y congelado) en ese momento.
--   2) Vos cobrás por fuera y la activás: select public.activar_suscripcion(<id>);
--   3) Un cron diario marca 'vencida' lo que pasó su fecha (vencer_suscripciones()).
-- Para integrar una pasarela más adelante: completar `proveedor` / `proveedor_ref` y llamar
-- a activar_suscripcion() / renovar_suscripcion() desde su webhook. No hay que cambiar tablas.
create table if not exists public.suscripciones (
  id              bigint generated always as identity primary key,
  organizacion_id uuid references public.organizaciones(id) on delete cascade,
  plan            text not null references public.planes(id),
  ciclo           text not null check (ciclo in ('mensual','anual')),
  precio          integer not null check (precio >= 0),          -- ARS, congelado al solicitar/activar
  fundador        boolean not null default false,
  fundador_hasta  date,                                          -- fin del precio fundador (qué pasa después: a definir)
  estado          text not null default 'pendiente' check (estado in ('pendiente','activa','vencida','cancelada')),
  inicio          date,
  vence           date,                                          -- fin del período pago actual
  proveedor       text not null default 'manual' check (proveedor in ('manual','mercadopago')),
  proveedor_ref   text check (char_length(proveedor_ref) <= 120), -- id externo (suscripción/pago) cuando se integre
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
-- Migración: instalaciones que tenían suscripciones por negocio → por organización.
alter table public.suscripciones add column if not exists organizacion_id uuid references public.organizaciones(id) on delete cascade;
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'suscripciones' and column_name = 'negocio_id') then
    execute 'update public.suscripciones s set organizacion_id = n.organizacion_id
             from public.negocios n where n.id = s.negocio_id and s.organizacion_id is null';
    drop index if exists public.suscripciones_pendiente_idx;
    drop index if exists public.suscripciones_activa_idx;
    alter table public.suscripciones drop column negocio_id;
  end if;
end $$;
alter table public.suscripciones alter column organizacion_id set not null;

-- Como máximo una pendiente y una activa por organización.
create unique index if not exists suscripciones_pendiente_org_idx on public.suscripciones (organizacion_id) where estado = 'pendiente';
create unique index if not exists suscripciones_activa_org_idx on public.suscripciones (organizacion_id) where estado = 'activa';

alter table public.suscripciones enable row level security;
drop policy if exists suscripciones_dueno_lee on public.suscripciones;
create policy suscripciones_dueno_lee on public.suscripciones
  for select to authenticated
  using (public.es_dueno_org(organizacion_id));
revoke all on public.suscripciones from anon, authenticated;
grant select on public.suscripciones to authenticated;   -- nadie escribe directo: solo por funciones

-- Lugares de precio fundador que quedan (cuentan las suscripciones fundador ya activadas alguna vez).
create or replace function public.cupo_fundador() returns int
language sql stable security definer set search_path = public as $$
  select case when a.fundador_activo
              then greatest(a.fundador_cupo - (select count(distinct s.organizacion_id)::int from public.suscripciones s
                                               where s.fundador and s.estado <> 'pendiente'), 0)
              else 0 end
  from public.ajustes a where a.id = 1
$$;

-- Precio de un plan para un ciclo (normal o fundador), leído de las tablas de precios.
create or replace function public.precio_plan(p_plan text, p_ciclo text, p_fundador boolean) returns integer
language sql stable security definer set search_path = public as $$
  select case
           when p_fundador then case when p_ciclo = 'anual' then a.fundador_precio_anual else a.fundador_precio_mensual end
           else case when p_ciclo = 'anual' then p.precio_anual else p.precio_mensual end
         end
  from public.planes p cross join public.ajustes a
  where p.id = p_plan and a.id = 1
$$;

-- El dueño elige plan y ciclo → queda una solicitud pendiente (reemplaza la anterior pendiente).
create or replace function public.solicitar_plan(p_plan text, p_ciclo text) returns public.suscripciones
language plpgsql security definer set search_path = public as $$
declare
  org uuid := public.org_de_dueno();
  aj public.ajustes%rowtype;
  es_fundador boolean;
  fila public.suscripciones%rowtype;
begin
  if org is null then raise exception 'sin_permiso'; end if;
  if p_ciclo not in ('mensual','anual') then raise exception 'ciclo_invalido'; end if;
  if not exists (select 1 from public.planes where id = p_plan and activo) then raise exception 'plan_invalido'; end if;

  select * into aj from public.ajustes where id = 1;
  es_fundador := aj.fundador_activo and p_plan = aj.fundador_plan and public.cupo_fundador() > 0;

  delete from public.suscripciones where organizacion_id = org and estado = 'pendiente';
  insert into public.suscripciones (organizacion_id, plan, ciclo, precio, fundador)
  values (org, p_plan, p_ciclo, public.precio_plan(p_plan, p_ciclo, es_fundador), es_fundador)
  returning * into fila;
  return fila;
end $$;

-- El dueño descarta su solicitud pendiente.
create or replace function public.cancelar_solicitud() returns void
language sql security definer set search_path = public as $$
  delete from public.suscripciones
  where estado = 'pendiente' and organizacion_id = public.org_de_dueno()
$$;

-- ADMIN: activar una suscripción pendiente (después de cobrar). Revalida el cupo fundador.
--   select public.activar_suscripcion(123);                 -- período según el ciclo
--   select public.activar_suscripcion(123, '2027-12-31');   -- fecha de vencimiento manual
create or replace function public.activar_suscripcion(p_id bigint, p_hasta date default null) returns public.suscripciones
language plpgsql security definer set search_path = public as $$
declare
  s public.suscripciones%rowtype;
  aj public.ajustes%rowtype;
  hoy date := public.hoy_ar();
  v_fundador boolean;
  v_precio integer;
begin
  select * into aj from public.ajustes where id = 1 for update;   -- serializa el cupo fundador
  select * into s from public.suscripciones where id = p_id for update;
  if not found then raise exception 'suscripcion_inexistente'; end if;
  if s.estado <> 'pendiente' then raise exception 'no_esta_pendiente'; end if;

  -- Si se agotó el cupo entre la solicitud y el pago, pasa a precio normal.
  v_fundador := s.fundador;
  v_precio := s.precio;
  if v_fundador and public.cupo_fundador() <= 0 then
    v_fundador := false;
    v_precio := public.precio_plan(s.plan, s.ciclo, false);
  end if;

  update public.suscripciones set estado = 'cancelada', updated_at = now()
  where organizacion_id = s.organizacion_id and estado = 'activa';

  update public.suscripciones set
    estado = 'activa',
    fundador = v_fundador,
    precio = v_precio,
    inicio = hoy,
    vence = coalesce(p_hasta, (hoy + case when s.ciclo = 'anual' then interval '1 year' else interval '1 month' end)::date),
    fundador_hasta = case when v_fundador then (hoy + make_interval(months => aj.fundador_meses))::date end,
    updated_at = now()
  where id = p_id
  returning * into s;

  -- El trigger organizaciones_sync copia el plan a todas las sucursales.
  update public.organizaciones set plan = s.plan, pago_hasta = s.vence where id = s.organizacion_id;
  return s;
end $$;

-- ADMIN: renovar un período más (mismo precio congelado).
create or replace function public.renovar_suscripcion(p_id bigint) returns public.suscripciones
language plpgsql security definer set search_path = public as $$
declare
  s public.suscripciones%rowtype;
begin
  select * into s from public.suscripciones where id = p_id for update;
  if not found or s.estado not in ('activa','vencida') then raise exception 'no_renovable'; end if;
  update public.suscripciones set
    estado = 'activa',
    vence = (greatest(coalesce(s.vence, public.hoy_ar()), public.hoy_ar())
             + case when s.ciclo = 'anual' then interval '1 year' else interval '1 month' end)::date,
    updated_at = now()
  where id = p_id
  returning * into s;
  update public.organizaciones set plan = s.plan, pago_hasta = s.vence where id = s.organizacion_id;
  return s;
end $$;

-- CRON diario: marca vencidas las suscripciones cuyo período terminó.
-- (El acceso ya se corta solo por negocios.pago_hasta; esto mantiene prolijo el estado.)
create or replace function public.vencer_suscripciones() returns void
language sql security definer set search_path = public as $$
  update public.suscripciones set estado = 'vencida', updated_at = now()
  where estado = 'activa' and vence < public.hoy_ar()
$$;

-- ---------------------------------------------------------------- sucursales y equipo (solo dueño)

-- Nueva sucursal: copia servicios, horarios y pagos de la primera. Respeta el límite del plan.
create or replace function public.crear_sucursal(p_nombre text) returns public.negocios
language plpgsql security definer set search_path = public as $$
declare
  org public.organizaciones%rowtype;
  base public.negocios%rowtype;
  lim int;
  cant int;
  fila public.negocios%rowtype;
begin
  select * into org from public.organizaciones where id = public.org_de_dueno();
  if not found then raise exception 'sin_permiso'; end if;
  if char_length(trim(coalesce(p_nombre, ''))) < 2 then raise exception 'nombre_invalido'; end if;
  lim := case when org.pago_hasta is not null and org.pago_hasta >= public.hoy_ar()
              then (select sucursales_max from public.planes where id = org.plan) end;
  cant := (select count(*) from public.negocios where organizacion_id = org.id);
  if (lim is not null and cant >= lim) or cant >= 20 then raise exception 'limite_sucursales'; end if;

  select * into base from public.negocios where organizacion_id = org.id order by created_at limit 1;
  insert into public.negocios (owner, organizacion_id, slug, nombre, rubro, whatsapp, servicios, horarios,
                               medios_pago, dias_anticipacion, recurso_etiqueta, plan, prueba_hasta, pago_hasta)
  values (auth.uid(), org.id, public.slug_unico(p_nombre), left(trim(p_nombre), 60), base.rubro, base.whatsapp,
          base.servicios, base.horarios, base.medios_pago, base.dias_anticipacion, base.recurso_etiqueta,
          org.plan, org.prueba_hasta, org.pago_hasta)
  returning * into fila;
  insert into public.recursos (negocio_id, nombre) values (fila.id, 'Principal');
  return fila;
end $$;

-- Borrar una sucursal (y sus turnos). No se puede borrar la última.
create or replace function public.eliminar_sucursal(p_negocio uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  org uuid := public.org_de_dueno();
begin
  if org is null or not exists (select 1 from public.negocios where id = p_negocio and organizacion_id = org) then
    raise exception 'sin_permiso';
  end if;
  if (select count(*) from public.negocios where organizacion_id = org) <= 1 then raise exception 'ultima_sucursal'; end if;
  delete from public.negocios where id = p_negocio;
end $$;

-- Invitar (o actualizar) un miembro. Si ya tiene cuenta con ese email, queda activo al instante.
create or replace function public.invitar_miembro(p_email text, p_rol text, p_negocio uuid default null, p_recurso uuid default null)
returns public.miembros
language plpgsql security definer set search_path = public as $$
declare
  org uuid := public.org_de_dueno();
  e text := lower(trim(coalesce(p_email, '')));
  uid uuid;
  fila public.miembros%rowtype;
begin
  if org is null then raise exception 'sin_permiso'; end if;
  if not public.org_permite_roles(org) then raise exception 'plan_sin_roles'; end if;
  if p_rol not in ('recepcion','profesional') then raise exception 'rol_invalido'; end if;
  if e !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'email_invalido'; end if;
  if (select count(*) from public.miembros where organizacion_id = org) >= 50 then raise exception 'limite_miembros'; end if;
  if p_negocio is not null and not exists (select 1 from public.negocios where id = p_negocio and organizacion_id = org) then
    raise exception 'sucursal_invalida';
  end if;
  if p_recurso is not null and not exists (select 1 from public.recursos r join public.negocios n on n.id = r.negocio_id
                                           where r.id = p_recurso and n.organizacion_id = org) then
    raise exception 'recurso_invalido';
  end if;

  select id into uid from auth.users where lower(email) = e;
  insert into public.miembros (organizacion_id, user_id, email, rol, negocio_id, recurso_id, estado)
  values (org, uid, e, p_rol, p_negocio, p_recurso, case when uid is null then 'invitado' else 'activo' end)
  on conflict (organizacion_id, email) do update
    set rol = excluded.rol, negocio_id = excluded.negocio_id, recurso_id = excluded.recurso_id
    where public.miembros.rol <> 'dueno'
  returning * into fila;
  if fila.id is null then raise exception 'es_dueno'; end if;
  return fila;
end $$;

-- Quitar un miembro (no al dueño).
create or replace function public.quitar_miembro(p_id bigint) returns void
language sql security definer set search_path = public as $$
  delete from public.miembros
  where id = p_id and rol <> 'dueno' and organizacion_id = public.org_de_dueno()
$$;

-- Al entrar al panel: si alguien lo invitó con su email (y ya tenía cuenta), queda activo.
create or replace function public.aceptar_invitaciones() returns int
language plpgsql security definer set search_path = public as $$
declare
  n int;
begin
  update public.miembros set user_id = auth.uid(), estado = 'activo'
  where email = lower(auth.email()) and estado = 'invitado';
  get diagnostics n = row_count;
  return n;
end $$;

revoke execute on function public.crear_sucursal(text) from public, anon;
revoke execute on function public.eliminar_sucursal(uuid) from public, anon;
revoke execute on function public.invitar_miembro(text, text, uuid, uuid) from public, anon;
revoke execute on function public.quitar_miembro(bigint) from public, anon;
revoke execute on function public.aceptar_invitaciones() from public, anon;
grant execute on function public.crear_sucursal(text), public.eliminar_sucursal(uuid),
  public.invitar_miembro(text, text, uuid, uuid), public.quitar_miembro(bigint), public.aceptar_invitaciones()
  to authenticated;
revoke execute on function public.sincronizar_plan_org() from public, anon, authenticated;

revoke execute on function public.solicitar_plan(text, text) from public, anon;
revoke execute on function public.cancelar_solicitud() from public, anon;
revoke execute on function public.activar_suscripcion(bigint, date) from public, anon, authenticated;
revoke execute on function public.renovar_suscripcion(bigint) from public, anon, authenticated;
revoke execute on function public.vencer_suscripciones() from public, anon, authenticated;
grant execute on function public.solicitar_plan(text, text) to authenticated;
grant execute on function public.cancelar_solicitud() to authenticated;

-- ================================================================ FUNCIONES DE LOS PLANES
-- Todo como estructura propia, sin servicios externos:
--   recordatorios · seña · lista_espera · caja (y comisiones) · fidelizacion · reportes
-- Qué incluye cada plan se edita en planes.funciones. En la prueba: todas.
alter table public.planes add column if not exists funciones text[] not null default '{}';
update public.planes set funciones = '{recordatorios,sena}' where id = 'inicial' and funciones = '{}';
update public.planes set funciones = '{recordatorios,sena,lista_espera,caja,fidelizacion}' where id = 'profesional' and funciones = '{}';
update public.planes set funciones = '{recordatorios,sena,lista_espera,caja,fidelizacion,reportes}' where id = 'empresa' and funciones = '{}';

create or replace function public.negocio_tiene(p_negocio uuid, p_funcion text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((
    select case when n.pago_hasta is not null and n.pago_hasta >= public.hoy_ar()
                then p_funcion = any (coalesce((select p.funciones from public.planes p where p.id = n.plan), '{}'))
                else n.prueba_hasta >= public.hoy_ar() end
    from public.negocios n where n.id = p_negocio), false)
$$;

-- Lista de funciones activas de un negocio (la página pública la lee una vez por regeneración).
create or replace function public.funciones_negocio(p_negocio uuid) returns text[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(f), '{}') from unnest(array['recordatorios','sena','lista_espera','caja','fidelizacion','reportes']) f
  where public.negocio_tiene(p_negocio, f)
$$;

-- ---------------------------------------------------------------- configuración por sucursal
alter table public.negocios add column if not exists sena jsonb not null
  default '{"activa":false,"tipo":"porcentaje","valor":30,"alias":"","link":"","minutos":60}'
  check (jsonb_typeof(sena) = 'object' and pg_column_size(sena) < 1000);
alter table public.negocios add column if not exists fidelizacion jsonb not null
  default '{"activa":false,"cada":5}'
  check (jsonb_typeof(fidelizacion) = 'object' and pg_column_size(fidelizacion) < 300);
alter table public.negocios add column if not exists recordatorio_plantilla text
  check (char_length(recordatorio_plantilla) <= 400);
alter table public.recursos add column if not exists comision_pct smallint not null default 0
  check (comision_pct between 0 and 100);

-- ---------------------------------------------------------------- datos extra del turno
alter table public.turnos add column if not exists cliente_tel text check (cliente_tel ~ '^[0-9]{8,15}$');
alter table public.turnos add column if not exists sena_monto  integer not null default 0 check (sena_monto >= 0);
alter table public.turnos add column if not exists sena_estado text not null default 'no_aplica'
  check (sena_estado in ('no_aplica','pendiente','pagada'));
alter table public.turnos add column if not exists gratis      boolean not null default false;  -- premio de fidelización
alter table public.turnos add column if not exists asistio     boolean;                         -- null = sin marcar
alter table public.turnos add column if not exists cobrado     boolean not null default false;
alter table public.turnos add column if not exists recordado   boolean not null default false;
create index if not exists turnos_cliente_idx on public.turnos (negocio_id, cliente_tel)
  where cliente_tel is not null and not cancelado;

grant select (sena, fidelizacion) on public.negocios to anon;
grant update (sena, fidelizacion, recordatorio_plantilla) on public.negocios to authenticated;
grant update (asistio, recordado) on public.turnos to authenticated;   -- seña y cobro: por funciones

-- ---------------------------------------------------------------- fidelización
-- Cada X visitas, la siguiente es gratis. Cuentan las visitas pasadas no canceladas y no ausentes.
create or replace function public.visitas_cliente(p_negocio uuid, p_tel text) returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from public.turnos
  where negocio_id = p_negocio and cliente_tel = p_tel and not cancelado
    and asistio is not false and fecha < public.hoy_ar()
$$;

-- Para la página de reserva: cuánto le falta al cliente para su turno gratis.
create or replace function public.progreso_fidelidad(p_negocio uuid, p_tel text) returns jsonb
language sql stable security definer set search_path = public as $$
  select case
    when not public.negocio_tiene(p_negocio, 'fidelizacion') or not coalesce((n.fidelizacion->>'activa')::boolean, false)
      or regexp_replace(coalesce(p_tel, ''), '\D', '', 'g') !~ '^[0-9]{8,15}$'
    then jsonb_build_object('activa', false)
    else (select jsonb_build_object(
            'activa', true, 'cada', c, 'visitas', v,
            'proximo_gratis', (v + 1) % (c + 1) = 0,
            'faltan', c - (v % (c + 1)))
          from (select greatest(coalesce((n.fidelizacion->>'cada')::int, 5), 1) c,
                       public.visitas_cliente(p_negocio, regexp_replace(p_tel, '\D', '', 'g')) v) x)
  end
  from public.negocios n where n.id = p_negocio
$$;

-- ---------------------------------------------------------------- lista de espera
create table if not exists public.lista_espera (
  id           bigint generated always as identity primary key,
  negocio_id   uuid not null references public.negocios(id) on delete cascade,
  recurso_id   uuid references public.recursos(id) on delete set null,   -- null = con cualquiera
  servicio_id  text not null check (char_length(servicio_id) <= 40),
  fecha        date not null,
  desde        smallint check (desde between 0 and 1439),                -- franja preferida (opcional)
  hasta        smallint check (hasta between 0 and 1440),
  cliente      text not null check (char_length(cliente) between 2 and 60),
  cliente_tel  text not null check (cliente_tel ~ '^[0-9]{8,15}$'),
  estado       text not null default 'esperando' check (estado in ('esperando','hay_lugar','avisado','descartado')),
  hora_libre   smallint,                                               -- horario que se liberó
  created_at   timestamptz not null default now()
);
create index if not exists lista_espera_idx on public.lista_espera (negocio_id, fecha)
  where estado in ('esperando','hay_lugar');

alter table public.lista_espera enable row level security;
drop policy if exists lista_espera_equipo on public.lista_espera;
create policy lista_espera_equipo on public.lista_espera
  for select to authenticated using (public.rol_en_negocio(negocio_id) in ('dueno','recepcion'));
drop policy if exists lista_espera_equipo_edita on public.lista_espera;
create policy lista_espera_equipo_edita on public.lista_espera
  for update to authenticated using (public.rol_en_negocio(negocio_id) in ('dueno','recepcion'));
revoke all on public.lista_espera from anon, authenticated;
grant select, update (estado) on public.lista_espera to authenticated;

-- El cliente se anota desde la página de reservas.
create or replace function public.anotar_lista_espera(
  p_negocio uuid, p_servicio text, p_fecha date, p_cliente text, p_tel text,
  p_recurso uuid default null, p_desde smallint default null, p_hasta smallint default null
) returns bigint
language plpgsql security definer set search_path = public as $$
declare
  neg public.negocios%rowtype;
  tel text := regexp_replace(coalesce(p_tel, ''), '\D', '', 'g');
  nuevo bigint;
begin
  select * into neg from public.negocios where id = p_negocio;
  if not found or not public.negocio_tiene(p_negocio, 'lista_espera') then raise exception 'funcion_no_disponible'; end if;
  if p_fecha < public.hoy_ar() or p_fecha > public.hoy_ar() + neg.dias_anticipacion then raise exception 'fecha_invalida'; end if;
  if not exists (select 1 from jsonb_array_elements(neg.servicios) x where x->>'id' = p_servicio) then raise exception 'servicio_invalido'; end if;
  if tel !~ '^[0-9]{8,15}$' then raise exception 'telefono_invalido'; end if;
  if char_length(trim(coalesce(p_cliente, ''))) < 2 then raise exception 'nombre_invalido'; end if;
  -- Anti-spam: tope por día y por teléfono.
  if (select count(*) from public.lista_espera where negocio_id = p_negocio and fecha = p_fecha and estado = 'esperando') >= 30
     or (select count(*) from public.lista_espera where negocio_id = p_negocio and cliente_tel = tel and estado = 'esperando') >= 3 then
    raise exception 'lista_completa';
  end if;
  insert into public.lista_espera (negocio_id, recurso_id, servicio_id, fecha, desde, hasta, cliente, cliente_tel)
  values (p_negocio, p_recurso, p_servicio, p_fecha, p_desde, p_hasta, left(trim(p_cliente), 60), tel)
  returning id into nuevo;
  return nuevo;
end $$;

-- Automático: al cancelarse un turno, se marca "hay lugar" a quienes esperaban ese día/franja/recurso.
-- El panel muestra el aviso y el negocio le escribe con un toque.
create or replace function public.avisar_lista_espera() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.cancelado and not old.cancelado and public.negocio_tiene(new.negocio_id, 'lista_espera') then
    update public.lista_espera le set estado = 'hay_lugar', hora_libre = new.hora
    where le.negocio_id = new.negocio_id and le.fecha = new.fecha and le.estado = 'esperando'
      and (le.recurso_id is null or le.recurso_id = new.recurso_id)
      and (le.desde is null or new.hora >= le.desde)
      and (le.hasta is null or new.hora < le.hasta);
  end if;
  return new;
end $$;
drop trigger if exists turnos_cancelado_lista on public.turnos;
create trigger turnos_cancelado_lista after update of cancelado on public.turnos
  for each row execute function public.avisar_lista_espera();

-- ---------------------------------------------------------------- caja y comisiones
create table if not exists public.movimientos (
  id          bigint generated always as identity primary key,
  negocio_id  uuid not null references public.negocios(id) on delete cascade,
  recurso_id  uuid references public.recursos(id) on delete set null,
  turno_id    bigint references public.turnos(id) on delete set null,
  fecha       date not null default public.hoy_ar(),
  tipo        text not null check (tipo in ('ingreso','egreso')),
  concepto    text not null check (char_length(concepto) between 1 and 80),
  monto       integer not null check (monto > 0),
  medio       smallint not null check (medio between 0 and 2),   -- 0 efectivo · 1 transf. · 2 MP
  creado_por  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists movimientos_idx on public.movimientos (negocio_id, fecha);

alter table public.movimientos enable row level security;
drop policy if exists movimientos_equipo on public.movimientos;
create policy movimientos_equipo on public.movimientos
  for select to authenticated using (public.rol_en_negocio(negocio_id) in ('dueno','recepcion'));
revoke all on public.movimientos from anon, authenticated;
grant select on public.movimientos to authenticated;   -- escrituras: solo por funciones

-- Marcar un turno como cobrado (asistió). Con caja, registra el ingreso.
create or replace function public.cobrar_turno(p_turno bigint, p_medio smallint default null, p_monto integer default null)
returns void
language plpgsql security definer set search_path = public as $$
declare
  t public.turnos%rowtype;
  monto int;
begin
  select * into t from public.turnos where id = p_turno for update;
  if not found or public.rol_en_negocio(t.negocio_id) not in ('dueno','recepcion') then raise exception 'sin_permiso'; end if;
  if t.cobrado then return; end if;
  update public.turnos set cobrado = true, asistio = true where id = p_turno;
  monto := coalesce(p_monto, case when t.gratis then 0
                                  else t.precio - case when t.sena_estado = 'pagada' then t.sena_monto else 0 end end);
  if monto > 0 and public.negocio_tiene(t.negocio_id, 'caja') then
    insert into public.movimientos (negocio_id, recurso_id, turno_id, tipo, concepto, monto, medio, creado_por, fecha)
    values (t.negocio_id, t.recurso_id, t.id, 'ingreso', left(t.servicio || ' · ' || t.cliente, 80), monto,
            coalesce(p_medio, t.pago), auth.uid(), public.hoy_ar());
  end if;
end $$;

-- Marcar la seña como pagada. Con caja, registra el ingreso de la seña.
create or replace function public.marcar_sena(p_turno bigint, p_medio smallint default 1) returns void
language plpgsql security definer set search_path = public as $$
declare
  t public.turnos%rowtype;
begin
  select * into t from public.turnos where id = p_turno for update;
  if not found or public.rol_en_negocio(t.negocio_id) not in ('dueno','recepcion') then raise exception 'sin_permiso'; end if;
  if t.sena_estado <> 'pendiente' then return; end if;
  update public.turnos set sena_estado = 'pagada' where id = p_turno;
  if t.sena_monto > 0 and public.negocio_tiene(t.negocio_id, 'caja') then
    insert into public.movimientos (negocio_id, recurso_id, turno_id, tipo, concepto, monto, medio, creado_por)
    values (t.negocio_id, t.recurso_id, t.id, 'ingreso', left('Seña · ' || t.cliente, 80), t.sena_monto, p_medio, auth.uid());
  end if;
end $$;

-- Ingreso o egreso manual (ej: venta de producto, pago a proveedor).
create or replace function public.registrar_movimiento(
  p_negocio uuid, p_tipo text, p_concepto text, p_monto integer, p_medio smallint, p_recurso uuid default null
) returns bigint
language plpgsql security definer set search_path = public as $$
declare
  nuevo bigint;
begin
  if public.rol_en_negocio(p_negocio) not in ('dueno','recepcion') then raise exception 'sin_permiso'; end if;
  if not public.negocio_tiene(p_negocio, 'caja') then raise exception 'funcion_no_disponible'; end if;
  insert into public.movimientos (negocio_id, recurso_id, tipo, concepto, monto, medio, creado_por)
  values (p_negocio, p_recurso, p_tipo, left(trim(p_concepto), 80), p_monto, p_medio, auth.uid())
  returning id into nuevo;
  return nuevo;
end $$;

create or replace function public.eliminar_movimiento(p_id bigint) returns void
language sql security definer set search_path = public as $$
  delete from public.movimientos m where m.id = p_id and public.rol_en_negocio(m.negocio_id) = 'dueno'
$$;

-- Resumen de caja con comisiones por profesional.
create or replace function public.caja_resumen(p_negocio uuid, p_desde date, p_hasta date) returns jsonb
language sql stable security definer set search_path = public as $$
  with m as (
    select * from public.movimientos
    where negocio_id = p_negocio and fecha between p_desde and p_hasta
      and public.rol_en_negocio(p_negocio) in ('dueno','recepcion')
  )
  select jsonb_build_object(
    'ingresos', (select coalesce(sum(monto), 0) from m where tipo = 'ingreso'),
    'egresos',  (select coalesce(sum(monto), 0) from m where tipo = 'egreso'),
    'por_medio', (select coalesce(jsonb_object_agg(medio, total), '{}'::jsonb)
                  from (select medio, sum(monto) total from m where tipo = 'ingreso' group by medio) x),
    'por_recurso', (select coalesce(jsonb_agg(jsonb_build_object(
                      'nombre', r.nombre, 'ingresos', x.total, 'comision_pct', r.comision_pct,
                      'comision', round(x.total * r.comision_pct / 100.0)) order by x.total desc), '[]'::jsonb)
                    from (select recurso_id, sum(monto) total from m where tipo = 'ingreso' and recurso_id is not null group by recurso_id) x
                    join public.recursos r on r.id = x.recurso_id)
  )
$$;

-- ---------------------------------------------------------------- reportes avanzados
-- p_negocio = null → todas las sucursales de la organización.
create or replace function public.reporte(p_negocio uuid, p_desde date, p_hasta date) returns jsonb
language sql stable security definer set search_path = public as $$
  with negs as (
    select n.id from public.negocios n
    where ((p_negocio is null and n.organizacion_id = public.org_de_dueno())
        or (p_negocio is not null and n.id = p_negocio and public.rol_en_negocio(p_negocio) = 'dueno'))
      and public.negocio_tiene(n.id, 'reportes')
  ),
  t as (
    select * from public.turnos
    where negocio_id in (select id from negs) and not cancelado and fecha between p_desde and p_hasta
  )
  select jsonb_build_object(
    'turnos', (select count(*) from t),
    'ingresos', (select coalesce(sum(case when gratis then 0 else precio end), 0) from t),
    'ticket_promedio', (select coalesce(round(avg(precio) filter (where not gratis)), 0) from t),
    'ausentes', (select count(*) from t where asistio = false),
    'marcados', (select count(*) from t where asistio is not null),
    'por_hora', (select coalesce(jsonb_agg(jsonb_build_object('hora', h, 'n', n) order by h), '[]'::jsonb)
                 from (select hora / 60 h, count(*) n from t group by 1) x),
    'por_dia', (select coalesce(jsonb_agg(jsonb_build_object('dia', d, 'n', n) order by d), '[]'::jsonb)
                from (select extract(dow from fecha)::int d, count(*) n from t group by 1) x),
    'por_mes', (select coalesce(jsonb_agg(jsonb_build_object('mes', mes, 'n', n, 'ingresos', ing) order by mes), '[]'::jsonb)
                from (select to_char(fecha, 'YYYY-MM') mes, count(*) n, sum(case when gratis then 0 else precio end) ing
                      from t group by 1) x),
    'top_clientes', (select coalesce(jsonb_agg(jsonb_build_object('cliente', cliente, 'tel', tel, 'n', n, 'monto', monto) order by n desc, monto desc), '[]'::jsonb)
                     from (select min(cliente) cliente, coalesce(cliente_tel, lower(cliente)) tel, count(*) n,
                                  sum(case when gratis then 0 else precio end) monto
                           from t group by coalesce(cliente_tel, lower(cliente)) order by n desc limit 10) x)
  )
$$;

-- ---------------------------------------------------------------- señas vencidas (cron cada 15 min)
-- Libera el horario si la seña no se marcó como pagada dentro del plazo configurado.
create or replace function public.liberar_senas_vencidas() returns void
language sql security definer set search_path = public as $$
  update public.turnos t set cancelado = true
  from public.negocios n
  where n.id = t.negocio_id and t.sena_estado = 'pendiente' and not t.cancelado
    and t.created_at < now() - make_interval(mins => greatest(coalesce((n.sena->>'minutos')::int, 60), 10))
$$;

revoke execute on function public.avisar_lista_espera() from public, anon, authenticated;
revoke execute on function public.liberar_senas_vencidas() from public, anon, authenticated;
revoke execute on function public.cobrar_turno(bigint, smallint, integer) from public, anon;
revoke execute on function public.marcar_sena(bigint, smallint) from public, anon;
revoke execute on function public.registrar_movimiento(uuid, text, text, integer, smallint, uuid) from public, anon;
revoke execute on function public.eliminar_movimiento(bigint) from public, anon;
revoke execute on function public.caja_resumen(uuid, date, date) from public, anon;
revoke execute on function public.reporte(uuid, date, date) from public, anon;
grant execute on function public.cobrar_turno(bigint, smallint, integer), public.marcar_sena(bigint, smallint),
  public.registrar_movimiento(uuid, text, text, integer, smallint, uuid), public.eliminar_movimiento(bigint),
  public.caja_resumen(uuid, date, date), public.reporte(uuid, date, date)
  to authenticated;

-- Funciones internas: nadie las llama desde la API.
revoke execute on function public.crear_negocio_al_registrarse() from public, anon, authenticated;
revoke execute on function public.validar_limite_recursos() from public, anon, authenticated;

-- ---------------------------------------------------------------- vista privada para vos
-- Lista de registrados con email y teléfono. Vive en un esquema NO expuesto por la API:
-- se consulta solo desde el panel de Supabase (Table Editor / SQL Editor).
create schema if not exists privado;
revoke all on schema privado from anon, authenticated;
drop view if exists privado.registros;
create view privado.registros as
  select o.created_at, o.nombre as cuenta, u.email, n.whatsapp, n.rubro, o.plan, o.prueba_hasta, o.pago_hasta,
         (select count(*) from public.negocios x where x.organizacion_id = o.id) as sucursales,
         n.slug as primer_link
  from public.organizaciones o
  join lateral (select * from public.negocios x where x.organizacion_id = o.id order by x.created_at limit 1) n on true
  left join public.miembros m on m.organizacion_id = o.id and m.rol = 'dueno'
  left join auth.users u on u.id = m.user_id
  order by o.created_at desc;

-- Solicitudes de plan pendientes de cobro (para activarlas con activar_suscripcion).
drop view if exists privado.solicitudes;
create view privado.solicitudes as
  select s.id, s.created_at, o.nombre as cuenta, u.email,
         (select x.whatsapp from public.negocios x where x.organizacion_id = o.id order by x.created_at limit 1) as whatsapp,
         s.plan, s.ciclo, s.precio, s.fundador
  from public.suscripciones s
  join public.organizaciones o on o.id = s.organizacion_id
  left join public.miembros m on m.organizacion_id = o.id and m.rol = 'dueno'
  left join auth.users u on u.id = m.user_id
  where s.estado = 'pendiente'
  order by s.created_at;

-- ---------------------------------------------------------------- limpieza
-- Borra turnos de hace más de 6 meses y cancelados de hace más de 30 días.
create or replace function public.limpiar_datos_viejos() returns void
language sql security definer set search_path = public as $$
  delete from public.turnos where fecha < public.hoy_ar() - 180;
  delete from public.turnos where cancelado and created_at < now() - interval '30 days';
  delete from public.lista_espera where fecha < public.hoy_ar() - 7;
  delete from public.movimientos where fecha < public.hoy_ar() - 400;
$$;
revoke execute on function public.limpiar_datos_viejos() from public, anon, authenticated;

-- ---------------------------------------------------------------- activar un plan pago (manual)
-- 1) Ver solicitudes:   select * from privado.solicitudes;
-- 2) Activar una:       select public.activar_suscripcion(<id>);
-- 3) Renovar:           select public.renovar_suscripcion(<id>);
