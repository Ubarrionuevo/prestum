import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio } from "@/config/servicios/estudio";
import { guiaPath, guiasGenerales, guiasRubro } from "@/config/servicios/guias";
import { Diagnostico, HeroEstudio, Pildoras, Seccion } from "@/components/servicios/ui";

const path = `${estudio.base}/conseguir-clientes`;

export const metadata: Metadata = buildMetadata({
  title: "Cómo conseguir clientes: guías por rubro y por canal",
  brand: estudio.nombre,
  description: `Guías prácticas para conseguir clientes: para tu negocio o tu empresa, en Instagram y LinkedIn, y guías por rubro, de barberías a constructoras.`,
  path,
  keywords: ["cómo conseguir clientes", "como conseguir clientes", "conseguir clientes para mi negocio"],
});

export default function ConseguirClientes() {
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: "Cómo conseguir clientes", path },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs)]} />
      <HeroEstudio
        migas={crumbs}
        etiqueta="Guías gratis"
        titulo="Cómo conseguir clientes"
        bajada="Guías prácticas, sin humo, para que te encuentren y te escriban: por rubro y por canal. Lo que aplicamos todos los días con webs y SEO."
        mensaje="Hola! Quiero ayuda para conseguir más clientes para mi negocio."
      />
      <Seccion titulo="Guías generales y por canal">
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guiasGenerales.map((g) => (
            <li key={g.slug}>
              <Link href={guiaPath(g)} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:border-amber-400 hover:shadow-md">
                <span aria-hidden className="text-2xl">
                  {g.emoji}
                </span>
                <span className="mt-3 font-bold text-slate-900">{g.h1}</span>
                <span className="mt-1 text-sm text-slate-600">{g.descripcion}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Seccion>
      <Seccion titulo="Guías por rubro" gris>
        <Pildoras items={guiasRubro.map((g) => ({ href: guiaPath(g), texto: `${g.emoji} ${g.corto}` }))} />
      </Seccion>
      <Diagnostico />
    </>
  );
}
