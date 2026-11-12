import Link from "next/link";
import type { Product } from "@/config/types";
import { nichePath, rubrosFoco } from "@/config/products";

/** Enlaces a las páginas de los rubros foco (barberías, peluquerías, estética) desde blog y glosario. */
export function RubrosFocoLinks({ product }: { product: Product }) {
  const rubros = rubrosFoco(product);
  if (!rubros.length) return null;
  return (
    <section className="mx-auto max-w-3xl px-4 pb-10">
      <h2 className="text-lg font-semibold text-slate-900">Sistema de turnos para tu rubro</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {rubros.map((n) => (
          <li key={n.slug}>
            <Link href={nichePath(product, n)} className="flex h-full items-center gap-2 rounded-xl border border-slate-200 p-4 font-semibold text-slate-900 hover:border-brand-500 hover:text-brand-700">
              <span aria-hidden>{n.emoji}</span> {n.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
