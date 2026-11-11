"use client";

import { useEffect, useState } from "react";
import { PLANES_TODOS_DEFAULT, PRUEBA_DIAS, planesPara, type Plan } from "@/config/planes";
import { getSupabase } from "@/lib/supabase";

/**
 * Precios y duración de la prueba leídos de Supabase (con respaldo en código).
 * `planes` = todos (para saber qué incluye el plan de la cuenta); `ofrecidos` = los que puede
 * elegir este rubro (barberías tiene los suyos).
 */
export function usePreciosPanel(rubro?: string | null) {
  const [data, setData] = useState<{ planes: Plan[]; pruebaDias: number }>({
    planes: PLANES_TODOS_DEFAULT,
    pruebaDias: PRUEBA_DIAS,
  });
  useEffect(() => {
    const sb = getSupabase();
    Promise.all([
      sb.from("planes").select("id, nombre, bajada, precio_mensual, precio_anual, recursos_max, sucursales_max, roles, funciones, items, destacado, orden, rubro, anual").eq("activo", true).order("orden"),
      sb.from("ajustes").select("prueba_dias").eq("id", 1).maybeSingle(),
    ]).then(([p, a]) => {
      setData({
        planes: (p.data as Plan[] | null)?.length ? (p.data as Plan[]) : PLANES_TODOS_DEFAULT,
        pruebaDias: (a.data?.prueba_dias as number | undefined) ?? PRUEBA_DIAS,
      });
    });
  }, []);
  return { ...data, ofrecidos: planesPara(data.planes, rubro) };
}
