import { cache } from "react";
import { FUNDADOR_DEFAULT, PLANES_TODOS_DEFAULT, planesPara, type Fundador, type Plan } from "@/config/planes";
import { getServerSupabase } from "./supabase";

export interface Precios {
  planes: Plan[];
  fundador: Fundador;
}

export const PLANES_COLS =
  "id, nombre, bajada, precio_mensual, precio_anual, recursos_max, sucursales_max, roles, funciones, items, destacado, orden, rubro, anual";

/** Todos los planes activos (generales y por rubro) + precio fundador, leídos de Supabase. */
const getTodo = cache(async (): Promise<{ todos: Plan[]; fundador: Fundador }> => {
  const sb = getServerSupabase();
  if (!sb) return { todos: PLANES_TODOS_DEFAULT, fundador: FUNDADOR_DEFAULT };
  const [p, a, c] = await Promise.all([
    sb.from("planes").select(PLANES_COLS).eq("activo", true).order("orden"),
    sb.from("ajustes").select("*").eq("id", 1).maybeSingle(),
    sb.rpc("cupo_fundador"),
  ]);
  const todos = (p.data as Plan[] | null)?.length ? (p.data as Plan[]) : PLANES_TODOS_DEFAULT;
  const aj = a.data as Record<string, unknown> | null;
  const fundador: Fundador = aj
    ? {
        plan: aj.fundador_plan as Fundador["plan"],
        precio_mensual: aj.fundador_precio_mensual as number,
        precio_anual: aj.fundador_precio_anual as number,
        cupo: aj.fundador_cupo as number,
        meses: aj.fundador_meses as number,
        activo: (aj.fundador_activo as boolean) && c.data !== 0,
        restantes: typeof c.data === "number" ? c.data : null,
      }
    : FUNDADOR_DEFAULT;
  return { todos, fundador };
});

/**
 * Precios vigentes para un rubro (sin rubro = planes generales). Barberías tiene planes propios.
 * Las páginas que los muestran son ISR (se regeneran 1 vez por día o al instante con
 * /api/revalidar?secret=…), así que Supabase se consulta muy pocas veces.
 * Si la base no está conectada o falla, se usan los valores de src/config/planes.ts.
 */
export async function getPrecios(rubro?: string | null): Promise<Precios> {
  const { todos, fundador } = await getTodo();
  return { planes: planesPara(todos, rubro), fundador };
}
