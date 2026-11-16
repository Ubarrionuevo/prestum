import type { Metadata } from "next";
import { buildMetadata, breadcrumbLd, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { faqsGestion, gestion, precioGestion } from "@/config/gestion";
import { gestionLd } from "@/lib/gestion-ld";
import { BotonDemo, Faqs, PantallaVenta, PrecioDemo, Seccion, TarjetasFunciones, TarjetasRubros, ListaDolores } from "@/components/gestion/ui";

const path = gestion.base;
const titulo = "Sistema de gestión para kioscos, almacenes y minimercados";
const descripcion = `Sistema de gestión para kioscos, almacenes y minimercados: control de stock, ventas y caja, proveedores y la libreta del fiado. Desde la compu o el celular, ${precioGestion} por mes.`;

export const metadata: Metadata = buildMetadata({
  title: titulo,
  brand: gestion.marca,
  description: descripcion,
  path,
  keywords: ["sistema de gestión para comercios", "sistema de gestión para kioscos", "programa para almacén", "sistema de stock y caja", "software de gestión comercial", "sistema para minimercado"],
});

const pasos = [
  { t: "Pedís la demo", d: "Nos escribís por WhatsApp y te mostramos el sistema funcionando con productos de tu rubro." },
  { t: "Cargamos tu negocio", d: "Tus productos, precios, proveedores y empleados. Empezás con lo que más vendés." },
  { t: "Vendés desde el primer día", d: "Cada venta descuenta stock y suma a la caja. Al cierre sabés cuánto tiene que haber." },
];

export default function GestionHome() {
  return (
    <>
      <JsonLd data={[gestionLd({ path, name: gestion.marca, description: descripcion }), faqLd(faqsGestion), breadcrumbLd([{ name: gestion.marca, path }])]} />

      <header className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-indigo-700">Para kioscos, almacenes y minimercados</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Stock, caja, proveedores y fiado, en un solo sistema</h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              {gestion.marca} ordena tu negocio de mostrador: sabés qué tenés, qué se vendió, cuánto tiene que haber en la caja, cuánto le debés a cada proveedor y quién te debe a vos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BotonDemo />
              <a href="#funciones" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-indigo-500 hover:text-indigo-700">
                Ver funciones
              </a>
            </div>
            <p className="mt-3 text-sm text-slate-500">{precioGestion} por mes · Sin instalar nada · Computadora o celular</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <PantallaVenta />
          </div>
        </div>
      </header>

      <Seccion titulo="¿Te pasa esto en el negocio?">
        <ListaDolores
          items={[
            "Te enterás de que algo se terminó cuando un cliente lo pide.",
            "Al cerrar, la caja no coincide y no sabés por qué.",
            "Cada aumento es una tarde cambiando precios a mano.",
            "El cuaderno del fiado no alcanza y las cuentas se discuten.",
          ]}
        />
      </Seccion>

      <Seccion titulo="Todo lo que necesita un negocio de mostrador" id="funciones" gris>
        <p className="mt-3 max-w-2xl text-slate-600">Cuatro módulos que trabajan juntos: cada venta descuenta stock, cada compra lo repone y actualiza el costo, y cada fiado queda en la cuenta del cliente.</p>
        <TarjetasFunciones />
      </Seccion>

      <Seccion titulo="Pensado para tu rubro">
        <TarjetasRubros />
      </Seccion>

      <Seccion titulo="Cómo empezar" gris>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {pasos.map((p, i) => (
            <li key={p.t} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-sm font-bold text-indigo-700">{i + 1}</span>
              <h3 className="mt-1 font-semibold text-slate-900">{p.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.d}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      <PrecioDemo />

      <Faqs faqs={faqsGestion} />
    </>
  );
}
