import type { Product } from "@/config/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Marco de cada producto: su header, su contenido y su footer. */
export function ProductShell({ product, children }: { product: Product; children: React.ReactNode }) {
  return (
    <>
      <Header product={product} />
      <main className="flex-1">{children}</main>
      <Footer product={product} />
    </>
  );
}
