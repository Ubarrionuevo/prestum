import { getDefaultProduct } from "@/config/products";
import { getPrecios } from "@/lib/planes";
import { PRUEBA_DIAS } from "@/config/planes";
import { formatPrecio } from "@/config/negocios";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ProductShell } from "@/components/product/ProductShell";
import { Breadcrumbs } from "@/components/sections";
import { Precios } from "@/components/landing/Precios";
import { Faq } from "@/components/landing/Faq";

const product = getDefaultProduct();
export const revalidate = 86400;

export async function generateMetadata() {
  const { planes } = await getPrecios();
  const lista = planes.map((p) => `${p.nombre} ${formatPrecio(p.precio_mensual)}`).join(", ");
  return buildMetadata({
    title: "Precios del turnero online en pesos",
    brand: product.brandName,
    description: `Planes de Prestum Turnos en pesos argentinos: ${lista} por mes. Anual con 2 meses gratis. ${PRUEBA_DIAS} días gratis, sin tarjeta.`,
    path: "/precios",
  });
}

export default async function PreciosPage() {
  const { planes } = await getPrecios();
  const crumbs = [
    { name: product.brandName, path: "/" },
    { name: "Precios", path: "/precios" },
  ];
  const faqs = product.faqs.filter((f) => /gratis|cuesta|app|llega/i.test(f.q));
  return (
    <ProductShell product={product}>
      <JsonLd data={[graphLd(product, { path: "/precios", planes }), faqLd(faqs), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <h1 className="sr-only">Precios de Prestum Turnos</h1>
      <Precios n={1} />
      <Faq n={2} faqs={faqs} />
    </ProductShell>
  );
}
