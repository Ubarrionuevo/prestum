import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegistroForm } from "@/components/auth/RegistroForm";
import { buildMetadata } from "@/lib/seo";
import { getDefaultProduct } from "@/config/products";
import { OFERTA_CORTA, TURNOS_GRATIS } from "@/config/planes";

const product = getDefaultProduct();

export const metadata = buildMetadata({
  title: "Creá tu agenda de turnos online gratis",
  brand: product.brandName,
  description: `Registrate gratis y en 1 minuto tenés tu link de reservas. ${OFERTA_CORTA}, sin tarjeta y sin vencimiento.`,
  path: "/registro",
});

function Beneficios() {
  const items = [
    ["🔗", "Tu link al instante", "prestum.com.ar/tu-negocio, listo para Instagram y WhatsApp."],
    ["📲", "Reservas a tu WhatsApp", "Con servicio, día, hora y medio de pago."],
    ["📊", "Tus números claros", "Turnos del mes, ingresos y cómo te pagan."],
    ["🎁", `${TURNOS_GRATIS} turnos por mes gratis`, "Sin tarjeta y sin vencimiento. Si necesitás más, pasás a un plan pago."],
  ];
  return (
    <ul className="grid gap-4 pt-16">
      {items.map(([i, t, d]) => (
        <li key={t} className="flex gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-slate-100">
          <span className="text-2xl" aria-hidden>{i}</span>
          <span>
            <span className="block font-semibold text-slate-900">{t}</span>
            <span className="text-sm text-slate-600">{d}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function RegistroPage() {
  return (
    <AuthShell aside={<Beneficios />}>
      <Suspense>
        <RegistroForm />
      </Suspense>
    </AuthShell>
  );
}
