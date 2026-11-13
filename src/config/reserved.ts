import { products } from "./products";

/**
 * Links que un negocio NO puede usar (prestum.com.ar/<link>), porque son páginas del sitio.
 * Mantener sincronizado con public.slug_reservado() en supabase/schema.sql
 */
export const RESERVED_SLUGS = new Set<string>([
  ...products.map((p) => p.slug),
  "registro", "ingresar", "panel", "api", "precios", "glosario", "turnos-online", "demo", "reservar",
  "turnos", "turneros", "admin", "soporte", "legal", "blog", "login", "app", "www", "prestum", "ayuda",
  "contacto", "rubros", "funcionalidades", "como-funciona", "opengraph-image", "terminos", "privacidad",
  "cuenta", "configuracion", "comparar", "vs", "alternativas", "llms", "sitemap-pseo",
  "funciones", "calculadora-ausencias", "que-es-prestum", "calculadora", "soluciones",
]);

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;
