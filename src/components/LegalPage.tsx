import { getDefaultProduct } from "@/config/products";
import { ProductShell } from "@/components/product/ProductShell";

/** Plantilla para páginas legales. El texto es una base: revisalo con un abogado. */
export function LegalPage({ titulo, actualizado, secciones }: { titulo: string; actualizado: string; secciones: Array<[string, string]> }) {
  return (
    <ProductShell product={getDefaultProduct()}>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900">{titulo}</h1>
        <p className="mt-2 text-sm text-slate-500">Última actualización: {actualizado}</p>
        {secciones.map(([h, p]) => (
          <section key={h} className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">{h}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{p}</p>
          </section>
        ))}
      </article>
    </ProductShell>
  );
}
