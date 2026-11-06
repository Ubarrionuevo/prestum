import { garantias, numeros, testimonios } from "@/config/products/turnero-landing";
import { Section, SectionHead } from "./ui";

/**
 * 07 · Prueba social: números + reseñas. Se completa desde turnero-landing.ts con datos REALES.
 * Sin datos todavía → muestra solo las garantías (no inventamos reseñas).
 */
export function Resenas({ n }: { n: number }) {
  const hayPrueba = numeros.length > 0 || testimonios.length > 0;
  return (
    <Section id="resenas">
      <SectionHead
        n={n}
        center
        eyebrow={hayPrueba ? "Negocios que ya lo usan" : "Sin letra chica"}
        title={
          hayPrueba ? (
            <>
              Lo cuentan los que
              <br />
              ya atienden tranquilos.
            </>
          ) : (
            <>
              Simple de usar.
              <br />
              Simple de pagar.
            </>
          )
        }
      />
      {numeros.length > 0 && (
        <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {numeros.map((x) => (
            <div key={x.label} className="rounded-2xl bg-brand-50 p-5 text-center">
              <dd className="text-3xl font-extrabold text-brand-900">{x.valor}</dd>
              <dt className="mt-1 text-sm text-slate-600">{x.label}</dt>
            </div>
          ))}
        </dl>
      )}
      {testimonios.length > 0 && (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonios.map((t) => (
            <figure key={t.autor} className="rounded-3xl border border-slate-200 p-6">
              <p className="text-amber-500" aria-label="5 estrellas">★★★★★</p>
              <blockquote className="mt-3 text-slate-700">“{t.texto}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-slate-900">{t.autor}</span> · <span className="text-slate-500">{t.detalle}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {garantias.map((g) => (
          <li key={g} className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-100 text-brand-700">✓</span>
            {g}
          </li>
        ))}
      </ul>
    </Section>
  );
}
