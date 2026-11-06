import { FILAS, type FilaId } from "@/config/comparativas";

/**
 * Tabla comparativa. En el celular cada fila se apila (etiqueta arriba, valores abajo)
 * para no tener scroll horizontal; en escritorio es una tabla normal.
 */
export function TablaComparativa({ columnas }: { columnas: Array<{ nombre: string; datos: Record<FilaId, string>; destacar?: boolean }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="hidden bg-slate-50 text-left md:table-header-group">
          <tr>
            <th className="w-44 px-4 py-3 font-semibold text-slate-500">&nbsp;</th>
            {columnas.map((c) => (
              <th key={c.nombre} className={`px-4 py-3 font-bold ${c.destacar ? "text-brand-700" : "text-slate-900"}`}>
                {c.nombre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {FILAS.map((f) => (
            <tr key={f.id} className="block md:table-row">
              <th scope="row" className="block bg-slate-50 px-4 pb-1 pt-3 text-left font-semibold text-slate-700 md:table-cell md:bg-transparent md:py-3 md:align-top">
                {f.label}
              </th>
              {columnas.map((c) => (
                <td key={c.nombre} className={`block px-4 py-1.5 align-top md:table-cell md:py-3 ${c.destacar ? "md:bg-brand-50/60" : ""}`}>
                  <span className={`mr-1 font-semibold md:hidden ${c.destacar ? "text-brand-700" : "text-slate-900"}`}>{c.nombre}:</span>
                  <span className="text-slate-600">{c.datos[f.id]}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
