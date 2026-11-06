import Link from "next/link";
import type { Product } from "@/config/types";
import { nichePath, productHomePath } from "@/config/products";
import { breadcrumbLd, faqLd, graphLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Benefits, ContactCta, FaqSection, Hero, HowItWorks } from "@/components/sections";
import { TurneroLanding } from "@/components/landing/TurneroLanding";
import { getPrecios } from "@/lib/planes";

/** Home de un producto. Se usa en "/" (producto principal) y en "/<producto>" (los demás). */
export async function ProductHome({ product }: { product: Product }) {
  const path = productHomePath(product);
  const { planes } = await getPrecios();

  return (
    <>
      <JsonLd
        data={[
          graphLd(product, { path, planes: product.slug === "turnero" ? planes : undefined }),
          faqLd(product.faqs),
          path === "/" ? null : breadcrumbLd([{ name: product.brandName, path }]),
        ]}
      />
      {product.slug === "turnero" ? <TurneroLanding product={product} /> : <GenericHome product={product} />}
    </>
  );
}

/** Home genérica para productos que todavía no tienen landing propia. */
function GenericHome({ product }: { product: Product }) {
  return (
    <>
      <Hero
        eyebrow={`${product.emoji} ${product.name}`}
        title={product.heroTitle}
        subtitle={product.heroSubtitle}
        primary={product.demoPath ? { href: product.demoPath, label: "Probar la demo" } : { href: "#contacto", label: "Quiero saber más" }}
        secondary={{ href: "#rubros", label: "Ver por rubro" }}
      />
      <HowItWorks />
      <Benefits title={`¿Por qué ${product.brandName}?`} items={product.benefits} />

      <section id="rubros" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Un {product.name.toLowerCase()} para cada rubro</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.niches.map((n) => (
            <li key={n.slug}>
              <Link
                href={nichePath(product, n)}
                className="block h-full rounded-2xl border border-slate-200 p-5 hover:border-brand-500 hover:shadow-sm"
              >
                <span className="text-3xl" aria-hidden>
                  {n.emoji}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">
                  {product.name} para {n.name.toLowerCase()}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{n.seoDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FaqSection faqs={product.faqs} />
      <div id="contacto">
        <ContactCta text={`Hola, quiero ${product.brandName} para mi negocio.`} demoPath={product.demoPath} />
      </div>
    </>
  );
}
