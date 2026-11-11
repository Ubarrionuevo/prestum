import { cache } from "react";
import { PLANES_TODOS_DEFAULT, ofertaPublica, type Plan } from "@/config/planes";
import { getServerSupabase } from "./supabase";

export interface Precios {
  planes: Plan[];
}

export const PLANES_COLS =
  "id, nombre, bajada, precio_mensual, precio_anual, recursos_max, sucursales_max, roles, funciones, items, destacado, orden, rubro, anual";

/** Todos los planes activos (generales y por rubro), leídos de Supabase. */
const getTodo = cache(async (): Promise<Plan[]> => {
  const sb = getServerSupabase();
  if (!sb) return PLANES_TODOS_DEFAULT;
  const { data } = await sb.from("planes").select(PLANES_COLS).eq("activo", true).order("orden");
  return (data as Plan[] | null)?.length ? (data as Plan[]) : PLANES_TODOS_DEFAULT;
});

/**
 * Precios de la web pública: la misma oferta en todas las páginas (Gratis + Básico + Premium),
 * con los precios de Supabase. Las páginas que los muestran son ISR (se regeneran 1 vez por día
 * o al instante con /api/revalidar?secret=…), así que Supabase se consulta muy pocas veces.
 * Si la base no está conectada o falla, se usan los valores de src/config/planes.ts.
 */
export async function getPrecios(): Promise<Precios> {
  return { planes: ofertaPublica(await getTodo()) };
}
