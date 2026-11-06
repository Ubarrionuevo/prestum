import { AdminPanel } from "@/components/admin/AdminPanel";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Administración",
  brand: "Prestum",
  description: "Panel interno de Prestum.",
  path: "/admin",
  noindex: true,
});

/** Panel interno: registros, planes y cobros. Los datos solo los devuelve la base a un admin. */
export default function AdminPage() {
  return <AdminPanel />;
}
