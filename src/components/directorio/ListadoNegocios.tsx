import Link from "next/link";
import type { Directorio, NegocioListado } from "@/lib/directorio";
import { horarioLegible } from "@/lib/horario-osm";
import { EstadoAbierto } from "./EstadoAbierto";

const VISIBLES = 18;

const telHref = (t: string) => `tel:${t.replace(/[^\d+]/g, "")}`;
const igHref = (ig: string) => (ig.startsWith("http") ? ig : `https://www.instagram.com/${ig.replace(/^@/, "")}/`);
const mapaHref = (n: NegocioListado) =>
  n.lat && n.lon
    ? `https://www.google.com/maps/search/?api=1&query=${n.lat},${n.lon}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([n.nombre, n.direccion, n.localidad].filter(Boolean).join(", "))}`;

function Tarjeta({ n, ciudad }: { n: NegocioListado; ciudad: string }) {
  return (
    <li className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{n.nombre}</h3>
        {n.horario && <EstadoAbierto horario={n.horario} />}
      </div>
      <p className="text-sm text-slate-600">{[n.direccion, n.localidad ?? ciudad].filter(Boolean).join(", ")}</p>
      {n.horario && <p className="text-sm text-slate-500">Horario: {horarioLegible(n.horario)}</p>}
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm">
        {n.telefono && (
          <a href={telHref(n.telefono)} className="font-medium text-brand-700 hover:underline">
            📞 {n.telefono}
          </a>
        )}
        {n.instagram && (
          <a href={igHref(n.instagram)} target="_blank" rel="nofollow noopener noreferrer" className="text-brand-700 hover:underline">
            Instagram
          </a>
        )}
        <a href={mapaHref(n)} target="_blank" rel="nofollow noopener noreferrer" className="text-brand-700 hover:underline">
          Cómo llegar
        </a>
      </div>
    </li>
  );
}

/** Listado de negocios del rubro en la ciudad (datos de OpenStreetMap). */
export function ListadoNegocios({ directorio, rubro, negocio, ciudad }: { directorio: Directorio; rubro: string; negocio: string; ciudad: string }) {
  const { negocios, actualizado } = directorio;
  const primeros = negocios.slice(0, VISIBLES);
  const resto = negocios.slice(VISIBLES);
  const rubroMin = rubro.toLowerCase();
  return (
    <section id="listado" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        {rubro} en {ciudad}: dirección, teléfono y horario
      </h2>
      <p className="mt-3 max-w-3xl text-slate-600">
        {negocios.length} {rubroMin} de {ciudad} y alrededores. Cuando el local tiene cargado su horario, te mostramos si está abierto ahora. Confirmá por teléfono o Instagram antes
        de ir: los datos los carga la comunidad y pueden cambiar.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {primeros.map((n) => (
          <Tarjeta key={`${n.nombre}-${n.direccion}`} n={n} ciudad={ciudad} />
        ))}
      </ul>
      {resto.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer list-none rounded-xl border border-slate-200 px-4 py-3 text-center font-semibold text-brand-700 hover:bg-brand-50">
            Ver las otras {resto.length} {rubroMin}
          </summary>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {resto.map((n) => (
              <Tarjeta key={`${n.nombre}-${n.direccion}`} n={n} ciudad={ciudad} />
            ))}
          </ul>
        </details>
      )}
      <div className="mt-6 rounded-2xl bg-brand-50 p-5 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">¿Tenés una {negocio} en {ciudad}?</span> Con Prestum tus clientes te sacan turno online sin escribirte, y es gratis para
        empezar.{" "}
        <Link href="/registro" className="font-semibold text-brand-700 hover:underline">
          Crear mi agenda gratis →
        </Link>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Datos: ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="nofollow noopener noreferrer" className="underline">
          colaboradores de OpenStreetMap
        </a>{" "}
        (ODbL). Actualizado el {actualizado.split("-").reverse().join("/")}.
      </p>
    </section>
  );
}
