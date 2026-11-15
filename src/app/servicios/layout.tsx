import type { Metadata, Viewport } from "next";
import { estudio } from "@/config/servicios/estudio";
import { FooterEstudio, HeaderEstudio, WaFlotante } from "@/components/servicios/ui";

// Color de la barra del navegador en el celular: el de Solvion, no el verde de Prestum.
export const viewport: Viewport = { themeColor: "#020617" };

// Marca propia en todo /servicios: nada de "Prestum" en el nombre de la app, el autor, el ícono ni el manifest.
export const metadata: Metadata = {
  manifest: "/servicios.webmanifest",
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
