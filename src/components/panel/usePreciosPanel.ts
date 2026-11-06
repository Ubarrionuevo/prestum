"use client";

import { useEffect, useState } from "react";
import { FUNDADOR_DEFAULT, PLANES_DEFAULT, PRUEBA_DIAS, type Fundador, type Plan } from "@/config/planes";
import { getSupabase } from "@/lib/supabase";

/** Precios, cupo fundador y duración de la prueba leídos de Supabase (con respaldo en código). */
export function usePreciosPanel() {
  const [data, setData] = useState<{ planes: Plan[]; fundador: Fundador; pruebaDias: number }>({
    planes: PLANES_DEFAULT,
    fundador: FUNDADOR_DEFAULT,
    pruebaDias: PRUEBA_DIAS,
  });
  useEffect(() => {
    const sb = getSupabase();
    Promise.all([
      sb.from("planes").select("id, nombre, bajada, precio_mensual, precio_anual, recursos_max, sucursales_max, roles, funciones, items, destacado, orden").eq("activo", true).order("orden"),
      sb.from("ajustes").select("*").eq("id", 1).maybeSingle(),
      sb.rpc("cupo_fundador"),
    ]).then(([p, a, c]) => {
      const aj = a.data as Record<string, number | string | boolean> | null;
      const restantes = typeof c.data === "number" ? c.data : null;
      setData({
        planes: (p.data as Plan[] | null)?.length ? (p.data as Plan[]) : PLANES_DEFAULT,
        fundador: aj
          ? {
              plan: aj.fundador_plan as Fundador["plan"],
              precio_mensual: aj.fundador_precio_mensual as number,
              precio_anual: aj.fundador_precio_anual as number,
              cupo: aj.fundador_cupo as number,
              meses: aj.fundador_meses as number,
              activo: (aj.fundador_activo as boolean) && restantes !== 0,
              restantes,
            }
          : FUNDADOR_DEFAULT,
        pruebaDias: (aj?.prueba_dias as number) ?? PRUEBA_DIAS,
      });
    });
  }, []);
  return data;
}
