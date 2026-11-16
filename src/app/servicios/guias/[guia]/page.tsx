import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { ACTUALIZADO } from "@/config/fechas";
import { estudio } from "@/config/servicios/estudio";
import { consultaPath, consultas, getConsulta } from "@/config/servicios/consultas";
import { guiaPath, guiasGenerales } from "@/config/servicios/guias";
import { GuiaArticulo } from "@/components/servicios/GuiaArticulo";

/** /servicios/guias/<slug>: lo que busca un dueño antes de contratar una web o SEO. */
type Props = { params: Promise<{ guia: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => consultas.map((g) => ({ guia: g.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getConsulta((await params).guia);
  if (!g) return {};
  return buildMetadata({
    title: g.titulo,
    brand: estudio.nombre,
    description: g.descripcion,
    path: consultaPath(g),
    keywords: [g.busqueda, g.busqueda.normalize("NFD").replace(/[̀-ͯ]/g, "")],
  });
}

export default async function ConsultaPage({ params }: Props) {
  const g = getConsulta((await params).guia);
  if (!g) notFound();
  const path = consultaPath(g);
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: g.corto, path },
  ];
  const otras = [
    ...consultas.filter((x) => x.slug !== g.slug).map((o) => ({ href: consultaPath(o), texto: `${o.emoji} ${o.corto}` })),
    ...guiasGenerales.map((o) => ({ href: guiaPath(o), texto: `${o.emoji} ${o.h1}` })),
  ];

  return (
    <GuiaArticulo
      g={g}
      path={path}
      crumbs={crumbs}
      etiqueta={`${g.emoji} Guía · Antes de contratar`}
      fecha={ACTUALIZADO.consultas}
      otras={otras}
      otrasTitulo="Más guías"
      verTodas={{ href: `${estudio.base}/conseguir-clientes`, texto: "Ver las guías por rubro →" }}
    />
  );
}
