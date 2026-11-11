import { getPrecios } from "@/lib/planes";
import { TURNOS_GRATIS } from "@/config/planes";
import { Section, SectionHead } from "./ui";
import { PreciosTabla } from "./PreciosTabla";

/** 08 · PRECIOS: los valores salen de Supabase (editables sin tocar código). */
export async function Precios({ n, rubro }: { n: number; rubro?: string }) {
  const { planes } = await getPrecios();
  return (
    <Section id="precios" className="bg-slate-50">
      <SectionHead
        n={n}
        center
        eyebrow="Precios en pesos"
        title="Empezá gratis. Pagá solo cuando crezcas."
        subtitle={`Empezá gratis con hasta ${TURNOS_GRATIS} turnos por mes, sin tarjeta y sin vencimiento. Cuando necesitás más, pasás a un plan pago. Sin contrato y sin comisión por turno.`}
      />
      <PreciosTabla planes={planes} rubroRegistro={rubro} />
    </Section>
  );
}
