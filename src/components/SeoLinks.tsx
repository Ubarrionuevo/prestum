import Link from "next/link";
import type { Product } from "@/config/types";
import { ciudades, glosario } from "@/config/seo-content";
import { compararPath, competidores } from "@/config/comparativas";
import { articulos } from "@/config/blog";
import { PlegableCelular } from "@/components/PlegableCelular";

/**
 * Enlazado interno (antes del footer): hace fluir la autoridad de cada página hacia
 * glosario, ciudades, comparativas y blog, con textos de anclaje naturales.
 * Los rubros ya están enlazados en el footer, por eso no se repiten acá.
 * Solo para el producto que tiene ese contenido (el turnero).
 */
const TERMINOS = ["no-show", "sena", "caja-diaria", "comisiones-por-profesional", "lista-de-espera", "ticket-promedio", "recordatorio-de-turno", "multi-sucursal"];

export function SeoLinks({ product }: { product: Product }) {
  if (product.slug !== "turnero") return null;
  const terminos = TERMINOS.map((s) => glosario.find((t) => t.slug === s)).filter((t) => t !== undefined);
  const titulo = "mb-3 text-sm font-semibold text-slate-900";
  const link = "text-slate-600 hover:text-brand-700";

  return (
    <section aria-label="Más recursos" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 text-sm md:py-10">
      {/* En celular son tres pantallas de links: van plegados detrás de "Guías y recursos". */}
      <PlegableCelular titulo="Guías y recursos" className="pb-4 md:pb-0">
      <div className="grid gap-8 pt-4 sm:grid-cols-2 md:pt-0 lg:grid-cols-4">
        <nav aria-label="Guías del blog">
          <p className={titulo}>Guías para tu negocio</p>
          <ul className="grid gap-2">
            {articulos.slice(0, 5).map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className={link}>
                  {a.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Glosario">
          <p className={titulo}>Qué es…</p>
          <ul className="grid gap-2">
            {terminos.map((t) => (
              <li key={t.slug}>
                <Link href={`/glosario/${t.slug}`} className={link}>
                  {t.termino.replace(/\s*\(.*\)$/, "")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Comparativas">
          <p className={titulo}>Comparativas</p>
          <ul className="grid gap-2">
            {competidores.map((c) => (
              <li key={c.slug}>
                <Link href={compararPath(c)} className={link}>
                  Alternativa a {c.nombre}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/comparar" className={link}>
                Mejores apps de turnos
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Ciudades">
          <p className={titulo}>Turnos online en tu ciudad</p>
          <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
            {ciudades.map((c) => (
              <li key={c.slug}>
                <Link href={`/turnos-online/${c.slug}`} className={link}>
                  {c.corto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </PlegableCelular>
      </div>
    </section>
  );
}
