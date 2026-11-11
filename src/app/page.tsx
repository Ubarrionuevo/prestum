import { getDefaultProduct } from "@/config/products";
import { TURNOS_GRATIS } from "@/config/planes";
import { buildMetadata } from "@/lib/seo";
import { ProductShell } from "@/components/product/ProductShell";
import { ProductHome } from "@/components/product/ProductHome";

/**
 * Home de www.prestum.com.ar = home del producto principal (site.defaultProduct).
 * No es un catálogo: el visitante ve un único software.
 */
// ISR: precios desde Supabase, refresco diario o inmediato con /api/revalidar.
export const revalidate = 86400;

const product = getDefaultProduct();

const base = buildMetadata({
  title: product.seoTitle,
  brand: product.brandName,
  description: product.seoDescription,
  path: "/",
  keywords: product.keywords,
});
// Mismo patrón de título que los líderes: "Marca — keyword | beneficio".
const homeTitle = `${product.brandName} — ${product.seoTitle} | ${TURNOS_GRATIS} turnos gratis por mes`;
export const metadata = {
  ...base,
  title: { absolute: homeTitle },
  openGraph: { ...base.openGraph, title: `${product.brandName} — Tus clientes reservan solos, vos atendés` },
  twitter: { ...base.twitter, title: homeTitle },
};

export default function Home() {
  return (
    <ProductShell product={product}>
      <ProductHome product={product} />
    </ProductShell>
  );
}
