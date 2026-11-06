-- Limpieza semanal automática (domingos 4 AM UTC). Correr DESPUÉS de schema.sql.
-- Requiere la extensión pg_cron (Database → Extensions → pg_cron, o la línea de abajo).
create extension if not exists pg_cron with schema pg_catalog;

select cron.unschedule('prestum-limpieza') where exists (select 1 from cron.job where jobname = 'prestum-limpieza');
select cron.schedule('prestum-limpieza', '0 4 * * 0', $$select public.limpiar_datos_viejos()$$);

-- pg_cron guarda un historial de ejecuciones: lo recortamos para que no ocupe espacio.
select cron.unschedule('prestum-limpieza-historial') where exists (select 1 from cron.job where jobname = 'prestum-limpieza-historial');
select cron.schedule('prestum-limpieza-historial', '30 4 * * 0',
  $$delete from cron.job_run_details where end_time < now() - interval '7 days'$$);

-- Vencimiento diario de suscripciones (3 AM UTC).
select cron.unschedule('prestum-vencimientos') where exists (select 1 from cron.job where jobname = 'prestum-vencimientos');
select cron.schedule('prestum-vencimientos', '0 3 * * *', $$select public.vencer_suscripciones()$$);

-- Señas no pagadas a tiempo: libera el horario (cada 15 minutos).
select cron.unschedule('prestum-senas') where exists (select 1 from cron.job where jobname = 'prestum-senas');
select cron.schedule('prestum-senas', '*/15 * * * *', $$select public.liberar_senas_vencidas()$$);
