"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { demos, getDemo, type RubroDemo } from "@/config/products/turnero-landing";
import { site } from "@/config/site";

interface LandingCtx {
  nombre: string;
  setNombre: (v: string) => void;
  rubro: string;
  setRubro: (slug: string) => void;
  demo: RubroDemo;
  /** Nombre a mostrar: lo que escribió el visitante o "Tu barbería". */
  display: string;
  slug: string;
  /** Precio del servicio principal (editable en "Armala a tu gusto" y usado en la calculadora). */
  precio: number;
  setPrecio: (v: number) => void;
  /** Servicios activos en la vista previa. */
  activos: string[];
  toggleServicio: (n: string) => void;
}

const Ctx = createContext<LandingCtx | null>(null);

export const tuNegocio = (d: RubroDemo) => `Tu ${d.negocio}`;

export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "tu-negocio"
  );
}

export function LandingState({ initialRubro, children }: { initialRubro?: string; children: React.ReactNode }) {
  const start = initialRubro && demos[initialRubro] ? initialRubro : "barberias";
  const [nombre, setNombre] = useState("");
  const [rubro, setRubroRaw] = useState(start);
  const demo = getDemo(rubro);
  const [precio, setPrecio] = useState(demo.servicios[0].precio);
  const [activos, setActivos] = useState<string[]>(demo.servicios.map((s) => s.nombre));

  const setRubro = (slug: string) => {
    const d = getDemo(slug);
    setRubroRaw(slug);
    setPrecio(d.servicios[0].precio);
    setActivos(d.servicios.map((s) => s.nombre));
  };

  const value = useMemo<LandingCtx>(() => {
    const display = nombre.trim() || tuNegocio(demo);
    return {
      nombre,
      setNombre,
      rubro,
      setRubro,
      demo,
      display,
      slug: slugify(nombre.trim() || `tu-${demo.negocio}`),
      precio,
      setPrecio,
      activos,
      toggleServicio: (n) =>
        setActivos((a) => (a.includes(n) ? (a.length > 1 ? a.filter((x) => x !== n) : a) : [...a, n])),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre, rubro, demo, precio, activos]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanding() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLanding fuera de <LandingState>");
  return c;
}

/** Link al registro con el rubro y el nombre que ya escribió el visitante (menos fricción). */
export function useRegistroLink(plan?: string) {
  const { nombre, rubro } = useLanding();
  const q = new URLSearchParams({ rubro });
  if (nombre.trim()) q.set("nombre", nombre.trim());
  if (plan) q.set("plan", plan);
  return `/registro?${q.toString()}`;
}

/** Link de WhatsApp a ventas con el nombre del negocio que escribió el visitante. */
export function useVentasLink(extra?: string) {
  const { nombre, demo } = useLanding();
  const quien = nombre.trim() ? `Mi ${demo.negocio} se llama "${nombre.trim()}". ` : "";
  const msg = `Hola! Quiero activar Prestum Turnos. ${quien}${extra ?? ""}`.trim();
  return `https://wa.me/${site.whatsappVentas}?text=${encodeURIComponent(msg)}`;
}
