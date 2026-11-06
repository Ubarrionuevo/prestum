import { renderOg, portadaSize } from "@/lib/og";
import { articulos, getArticulo } from "@/config/blog";
import { getDefaultProduct } from "@/config/products";

// Portada 16:9 (1200×675) de cada artículo: se usa al compartir y como imagen del artículo.
export const size = portadaSize;
export const contentType = "image/png";
export const alt = "Portada del artículo";
export const generateStaticParams = () => articulos.map((a) => ({ slug: a.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticulo((await params).slug);
  return renderOg({ brand: getDefaultProduct().brandName, eyebrow: `Blog · ${a?.categoria ?? ""}`, title: a?.portada ?? "Blog", emoji: a?.emoji, size: portadaSize });
}
