import { renderOg, ogSize } from "@/lib/og";
import { getDefaultProduct } from "@/config/products";

const product = getDefaultProduct();

export const alt = product.brandName;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ brand: product.brandName, eyebrow: product.name, title: product.heroTitle });
}
