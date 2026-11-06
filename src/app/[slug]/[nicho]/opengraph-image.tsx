import { allNicheRoutes, getNiche } from "@/config/products";
import { renderOg, ogSize } from "@/lib/og";

export const alt = "Prestum";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return allNicheRoutes().map((r) => ({ slug: r.producto, nicho: r.nicho }));
}

export default async function Image({ params }: { params: Promise<{ slug: string; nicho: string }> }) {
  const { slug: producto, nicho } = await params;
  const found = getNiche(producto, nicho);
  if (!found) return renderOg({ brand: "Prestum", eyebrow: "", title: "Prestum" });
  return renderOg({
    brand: found.product.brandName,
    eyebrow: `${found.product.name} para ${found.niche.name.toLowerCase()}`,
    title: found.niche.heroTitle,
  });
}
