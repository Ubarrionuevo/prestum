import type { Metadata, Viewport } from "next";
import { gestion } from "@/config/gestion";
import { FooterGestion, HeaderGestion, WaFlotanteGestion } from "@/components/gestion/ui";

// Color propio de Prestum Gestión (índigo), no el verde de Prestum Turnos.
export const viewport: Viewport = { themeColor: "#4f46e5" };

export const metadata: Metadata = {
  applicationName: gestion.marca,
  appleWebApp: { capable: true, title: gestion.marca, statusBarStyle: "default" },
};

export default function GestionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderGestion />
      <main className="flex-1">{children}</main>
      <FooterGestion />
      <WaFlotanteGestion />
    </>
  );
}
