import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { ACTUALIZADO } from "@/config/fechas";
import { estudio } from "@/config/servicios/estudio";
import { getGuia, guiaPath, guias } from "@/config/servicios/guias";
import { consultaPath, consultas } from "@/config/servicios/consultas";
import { GuiaArticulo } from "@/components/servicios/GuiaArticulo";

type Props = { params: Promise<{ guia: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => guias.map((g) => ({ guia: g.slug }));

const HUB = `${estudio.base}/conseguir-clientes`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuia((await params).guia);
  if (!g) return {};
  return buildMetadata({ title: g.titulo, brand: estudio.nombre, description: g.descripcion, path: guiaPath(g), keywords: [g.busqueda, g.busqueda.replace("cómo", "como")] });
}

export default async function GuiaPage({ params }: Props) {
  const g = getGuia((await params).guia);
  if (!g) notFound();
  const path = guiaPath(g);
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: "Cómo conseguir clientes", path: HUB },
    { name: g.corto, path },
  ];
  const otras = [
    ...guias.filter((x) => x.slug !== g.slug).map((o) => ({ href: guiaPath(o), texto: `${o.emoji} ${o.corto}` })),
    ...consultas.map((c) => ({ href: consultaPath(c), texto: `${c.emoji} ${c.corto}` })),
  ];

  return (
    <GuiaArticulo
      g={g}
      path={path}
      crumbs={crumbs}
      etiqueta={`${g.emoji} Guía · Cómo conseguir clientes`}
      fecha={ACTUALIZADO.guias}
      otras={otras}
      otrasTitulo="Más guías para conseguir clientes"
      verTodas={{ href: HUB, texto: "Ver todas las guías →" }}
    />
  );
}
