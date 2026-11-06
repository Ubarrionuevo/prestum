import type { Faq as FaqT } from "@/config/types";
import { Section, SectionHead } from "./ui";

/** 09 · PREGUNTAS FRECUENTES (acordeón; el JSON-LD FAQPage se genera en la página). */
export function Faq({ n, faqs }: { n: number; faqs: FaqT[] }) {
  return (
    <Section id="preguntas">
      <SectionHead n={n} center eyebrow="Preguntas frecuentes" title="Lo que todos preguntan" />
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-3xl border border-slate-200">
        {faqs.map((f, i) => (
          <details key={f.q} className="group p-6" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-3 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
