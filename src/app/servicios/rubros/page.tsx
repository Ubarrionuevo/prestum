import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { estudio, servicios } from "@/config/servicios/estudio";
import { rubrosServ } from "@/config/servicios/rubros";
import { aplica, destinoPath } from "@/lib/servicios";
import { HeroEstudio, Seccion } from "@/components/servicios/ui";

const path = `${estudio.base}/rubros`;

export const metadata: Metadata = buildMetadata({
  title: "Páginas web, tiendas, SEO y sistemas por rubro",
  brand: estudio.nombre,
  description: `Qué necesita la web de cada rubro: barberías, odontólogos, abogados, inmobiliarias, tiendas de ropa y ${rubrosServ.length - 5} rubros más. Diseño web, Tiendanube, SEO y sistemas a medida.`,
  path,
});

export default function RubrosServicios() {
  const crumbs = [
    { name: "Servicios", path: estudio.base },
    { name: "Por rubro", path },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs)]} />
      <HeroEstudio
        migas={crumbs}
        etiqueta={`${rubrosServ.length} rubros`}
        titulo="Servicios por rubro"
        bajada="Una barbería, un estudio jurídico y una ferretería necesitan webs distintas. Elegí tu rubro y mirá qué conviene."
        mensaje="Hola! Quiero cotizar para mi negocio."
      />
      <Seccion>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rubrosServ.map((r) => (
            <div key={r.slug} className="rounded-2xl border border-slate-200 p-5">
              <p className="text-lg font-bold text-slate-900">
                <span aria-hidden>{r.emoji}</span> {r.nombre}
              </p>
              <p className="mt-2 text-sm text-slate-600">{r.cliente}</p>
              <ul className="mt-4 grid gap-1.5 text-sm">
                {servicios
                  .filter((s) => aplica(s, r))
                  .map((s) => (
                    <li key={s.slug}>
                      <Link href={destinoPath(s, r)} className="font-medium text-amber-700 hover:underline">
                        {s.titulo} para {r.nombre.toLowerCase()} →
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Seccion>
    </>
  );
}
