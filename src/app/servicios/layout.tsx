import type { Metadata } from "next";
import { estudio } from "@/config/servicios/estudio";
import { FooterEstudio, HeaderEstudio, WaFlotante } from "@/components/servicios/ui";

// Marca propia en todo /servicios: nada de "Prestum" en el nombre de la app, el autor ni el ícono.
export const metadata: Metadata = {
  applicationName: estudio.nombre,
  authors: [{ name: estudio.nombre }],
  creator: estudio.nombre,
  publisher: estudio.nombre,
  icons: { icon: "/estudio-icon.svg", apple: "/estudio-icon.svg" },
  appleWebApp: { capable: true, title: estudio.nombre, statusBarStyle: "black-translucent" },
};

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderEstudio />
      <main className="flex-1">{children}</main>
      <FooterEstudio />
      <WaFlotante mensaje="Hola! Quiero cotizar un servicio para mi negocio." />
    </>
  );
}
