import { getPrecios } from "@/lib/planes";
import { PRUEBA_DIAS } from "@/config/planes";
import { Section, SectionHead } from "./ui";
import { PreciosTabla } from "./PreciosTabla";

/** 08 · PRECIOS: los valores salen de Supabase (editables sin tocar código). */
export async function Precios({ n }: { n: number }) {
  const { planes, fundador } = await getPrecios();
  return (
    <Section id="precios" className="bg-slate-50">
      <SectionHead
        n={n}
        center
        eyebrow="Precios en pesos"
        title="Un precio fijo. Sin sorpresas."
        subtitle={`Probá ${PRUEBA_DIAS} días gratis con todas las funciones, sin tarjeta. Después elegís el plan. Sin contrato y sin comisión por turno.`}
      />
      <PreciosTabla planes={planes} fundador={fundador} />
    </Section>
  );
}
