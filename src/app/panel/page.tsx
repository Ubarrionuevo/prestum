import { Suspense } from "react";
import { Panel } from "@/components/panel/Panel";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Panel",
  brand: "Prestum Turnos",
  description: "Tu panel de Prestum Turnos.",
  path: "/panel",
  noindex: true,
});

/** Página estática: los datos se cargan en el navegador directo desde Supabase. */
export default function PanelPage() {
  return (
    <Suspense>
      <Panel />
    </Suspense>
  );
}
