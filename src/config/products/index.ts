import type { Niche, Product } from "../types";
import { site } from "../site";
import { turnero } from "./turnero";
import { sistemaDeGestion } from "./sistema-de-gestion";

/**
 * REGISTRO DE PRODUCTOS
 * Cada producto se presenta como un software independiente con marca propia
 * (ej: "Prestum Turnos", "Prestum Gestión"): su propia home, header, footer y rubros.
 * Ningún producto muestra a los otros.
 *
 *   /                      home del producto principal (site.defaultProduct)
 *   /<producto>            home de cada otro producto
 *   /<producto>/<nicho>    landing por rubro
 */
export const products: Product[] = [turnero, sistemaDeGestion];

export const activeProducts = () => products.filter((p) => p.status === "activo");

export function getProduct(slug: string): Product | undefined {
  return activeProducts().find((p) => p.slug === slug);
}

export function getDefaultProduct(): Product {
  const p = getProduct(site.defaultProduct);
  if (!p) throw new Error(`site.defaultProduct "${site.defaultProduct}" no existe o no está activo`);
  return p;
}

export const isDefaultProduct = (p: Product) => p.slug === site.defaultProduct;

/** URL de la home del producto: "/" para el principal, "/<slug>" para el resto. */
export const productHomePath = (p: Product) => (isDefaultProduct(p) ? "/" : `/${p.slug}`);

export const nichePath = (p: Product, n: Niche) => `/${p.slug}/${n.slug}`;

export function getNiche(productSlug: string, nicheSlug: string): { product: Product; niche: Niche } | undefined {
  const product = getProduct(productSlug);
  const niche = product?.niches.find((n) => n.slug === nicheSlug);
  return product && niche ? { product, niche } : undefined;
}

/** Productos con home en /<slug> (todos menos el principal, que vive en "/"). */
export function secondaryProductRoutes() {
  return activeProducts()
    .filter((p) => !isDefaultProduct(p))
    .map((p) => ({ producto: p.slug }));
}

/** Todas las combinaciones producto/nicho publicables. */
export function allNicheRoutes() {
  return activeProducts().flatMap((p) => p.niches.map((n) => ({ producto: p.slug, nicho: n.slug })));
}
