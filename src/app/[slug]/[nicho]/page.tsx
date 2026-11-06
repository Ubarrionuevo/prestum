import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allNicheRoutes, getNiche, nichePath, productHomePath } from "@/config/products";
import { breadcrumbLd, buildMetadata, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/sections";
import { TurneroLanding } from "@/components/landing/TurneroLanding";
import { ProductShell } from "@/components/product/ProductShell";
import { getPrecios } from "@/lib/planes";

type Props = { params: Promise<{ slug: string; nicho: string }> };

// ISR: los precios vienen de Supabase y se refrescan 1 vez por día (o al instante con /api/revalidar).
export const revalidate = 86400;
export const dynamicParams = false;
export function generateStaticParams() {
  return allNicheRoutes().map((r) => ({ slug: r.producto, nicho: r.nicho }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: producto, nicho } = await params;
  const found = getNiche(producto, nicho);
  if (!found) return {};
  const { product, niche } = found;
  return buildMetadata({
    title: niche.seoTitle,
    brand: product.brandName,
    description: niche.seoDescription,
    path: nichePath(product, niche),
    keywords: [...niche.keywords, ...product.keywords.slice(0, 3)],
  });
}

export default async function NichePage({ params }: Props) {
  const { slug: producto, nicho } = await params;
  const found = getNiche(producto, nicho);
  if (!found) notFound();
  const { product, niche } = found;

  const path = nichePath(product, niche);
  const { planes } = await getPrecios();
  const crumbs = [
    { name: product.brandName, path: productHomePath(product) },
    { name: niche.name, path },
  ];

  return (
    <ProductShell product={product}>
      <JsonLd
        data={[
          graphLd(product, {
            name: `${product.name} para ${niche.name.toLowerCase()}`,
            description: niche.seoDescription,
            path,
            audience: niche.name,
            planes,
          }),
          faqLd([...niche.faqs, ...product.faqs]),
          breadcrumbLd(crumbs),
        ]}
      />
      <div className="bg-brand-50">
        <Breadcrumbs items={crumbs} />
      </div>
      <TurneroLanding product={product} niche={niche} />
    </ProductShell>
  );
}
