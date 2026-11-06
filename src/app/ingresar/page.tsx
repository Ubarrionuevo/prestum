import { AuthShell } from "@/components/auth/AuthShell";
import { IngresarForm } from "@/components/auth/IngresarForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ingresar",
  brand: "Prestum Turnos",
  description: "Ingresá a tu panel de Prestum Turnos.",
  path: "/ingresar",
  noindex: true,
});

export default function IngresarPage() {
  return (
    <AuthShell>
      <IngresarForm />
    </AuthShell>
  );
}
