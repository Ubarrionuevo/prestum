import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getProduct, secondaryProductRoutes, getDefaultProduct } from "@/config/products";
import { getNegocio as getNegocioConfig, negocios as negociosConfig } from "@/config/negocios";
import { RESERVED_SLUGS, SLUG_RE } from "@/config/reserved";
import { buildMetadata } from "@/lib/seo";
import { getServerSupabase, NEGOCIO_PUBLICO, negocioActivo, type NegocioDB, type RecursoDB } from "@/lib/supabase";
import { ProductShell } from "@/components/product/ProductShell";
import { ProductHome } from "@/components/product/ProductHome";
import { Reserva, type ReservaNegocio } from "@/components/turnero/Reserva";

/**
 * prestum.com.ar/<slug>
 *   1) ¿Es un producto? (ej: /sistema-de-gestion) → home del producto.
 *   2) ¿Es el negocio demo de la config? → reserva de prueba.
 *   3) Si no, es un negocio registrado → su página de reservas (desde Supabase).
 *
 * AHORRO EN VERCEL: las páginas de negocios son ISR. Se generan una vez y quedan en la CDN;
 * Supabase se consulta solo cuando cambia algo (el panel avisa a /api/revalidar) o una vez por día.
 * Las reservas van del navegador directo a Supabase: cero funciones de Vercel por reserva.
 */
export const revalidate = 86400; // 24 h
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...secondaryProductRoutes().map((p) => ({ slug: p.producto })), ...negociosConfig.map((n) => ({ slug: n.slug }))];
}

/** Busca el negocio en Supabase (una sola fila; `cache` evita leerlo dos veces por render). */
const getNegocioDB = cache(async (slug: string): Promise<NegocioDB | null> => {
  if (RESERVED_SLUGS.has(slug) || !SLUG_RE.test(slug)) return null;
  const sb = getServerSupabase();
  if (!sb) return null;
  const { data } = await sb.from("negocios").select(NEGOCIO_PUBLICO).eq("slug", slug).maybeSingle();
  return (data as NegocioDB | null) ?? null;
});

/** Funciones activas del plan de la sucursal (lista de espera, seña, fidelización…). */
async function getFuncionesDB(negocioId: string): Promise<string[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data } = await sb.rpc("funciones_negocio", { p_negocio: negocioId });
  return (data as string[] | null) ?? [];
}

/** Recursos que pueden recibir turnos (activos y dentro del límite del plan). */
async function getRecursosDB(negocioId: string): Promise<RecursoDB[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data } = await sb.rpc("recursos_habilitados", { p_negocio: negocioId });
  return (data as RecursoDB[] | null) ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (product) {
    return buildMetadata({ title: product.seoTitle, brand: product.brandName, description: product.seoDescription, path: `/${slug}`, keywords: product.keywords });
  }
  const conf = getNegocioConfig(slug);
  const db = conf ? null : await getNegocioDB(slug);
  const nombre = conf?.nombre ?? db?.nombre;
  if (!nombre) return {};
  return buildMetadata({
    title: `Reservá tu turno en ${nombre}`,
    brand: "Prestum Turnos",
    description: `${db?.descripcion || conf?.descripcion || `Sacá turno online en ${nombre}.`} Elegí servicio, día y horario y confirmá por WhatsApp.`,
    path: `/${slug}`,
    // Solo se indexan negocios con plan pago (evita que cuentas de prueba vacías bajen la calidad del dominio).
    noindex: conf ? !conf.indexable : !(db && db.pago_hasta && negocioActivo({ prueba_hasta: "", pago_hasta: db.pago_hasta })),
  });
}

function PaginaNegocio({ nombre, descripcion, direccion, children }: { nombre: string; descripcion?: string | null; direccion?: string | null; children: React.ReactNode }) {
  const product = getDefaultProduct();
  return (
    <>
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <header className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-brand-700 text-2xl font-bold text-white">
              {nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{nombre}</h1>
              {descripcion && <p className="mt-1 text-slate-600">{descripcion}</p>}
              {direccion && <p className="mt-0.5 text-sm text-slate-500">📍 {direccion}</p>}
            </div>
          </header>
          {children}
        </div>
      </main>
      <footer className="bg-slate-50 py-6 text-center text-xs text-slate-500">
        Turnos online con{" "}
        <Link href="/" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
          <img src="/icon.svg" alt="" width={14} height={14} />
          {product.brandName}
        </Link>
      </footer>
    </>
  );
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  const product = getProduct(slug);
  if (product) {
    return (
      <ProductShell product={product}>
        <ProductHome product={product} />
      </ProductShell>
    );
  }

  const conf = getNegocioConfig(slug);
  if (conf) {
    const negocio: ReservaNegocio = {
      nombre: conf.nombre,
      whatsapp: conf.whatsapp,
      servicios: conf.servicios,
      mediosDePago: conf.mediosDePago,
      horarios: conf.horarios as ReservaNegocio["horarios"],
      diasAnticipacion: conf.diasAnticipacion,
      recursos: conf.recursos,
      recursoEtiqueta: conf.recursoEtiqueta,
    };
    return (
      <PaginaNegocio nombre={conf.nombre} descripcion={conf.descripcion} direccion={conf.direccion}>
        <Reserva negocio={negocio} />
      </PaginaNegocio>
    );
  }

  const db = await getNegocioDB(slug);
  if (!db) notFound();

  const [recursos, funciones] = await Promise.all([getRecursosDB(db.id), getFuncionesDB(db.id)]);

  if (!negocioActivo(db) || db.servicios.length === 0 || recursos.length === 0) {
    return (
      <PaginaNegocio nombre={db.nombre} descripcion={db.descripcion} direccion={db.direccion}>
        <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
          <p className="text-3xl">🗓️</p>
          <p className="mt-3 font-semibold text-slate-900">La agenda online no está disponible en este momento.</p>
          <a
            href={`https://wa.me/${db.whatsapp}`}
            className="mt-5 inline-block rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </PaginaNegocio>
    );
  }

  const negocio: ReservaNegocio = {
    id: db.id,
    nombre: db.nombre,
    whatsapp: db.whatsapp,
    servicios: db.servicios,
    mediosDePago: db.medios_pago,
    horarios: db.horarios,
    diasAnticipacion: db.dias_anticipacion,
    recursos: recursos.map((r) => ({ id: r.id, nombre: r.nombre, servicios: r.servicios, horarios: r.horarios })),
    recursoEtiqueta: db.recurso_etiqueta,
    funciones,
    sena: db.sena,
    fidelizacion: db.fidelizacion,
  };
  return (
    <PaginaNegocio nombre={db.nombre} descripcion={db.descripcion} direccion={db.direccion}>
      <Reserva negocio={negocio} />
    </PaginaNegocio>
  );
}
