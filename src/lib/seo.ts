import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";
import type { Faq, Product } from "@/config/types";
import type { Plan } from "@/config/planes";
import { tieneAnual } from "@/config/planes";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  noindex?: boolean;
  /** Con noindex: Google no la muestra, pero sigue los links que tiene (noindex, follow). */
  follow?: boolean;
  /** Marca del producto: el título queda "<title> | <brand>" (ej: "… | Prestum Turnos"). */
  brand?: string;
}

/** Metadata consistente para cualquier página: canonical, OG, Twitter, robots. */
export function buildMetadata({ title, description, path, keywords, noindex, follow, brand }: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = brand ? `${title} | ${brand}` : title;
  return {
    title: brand ? { absolute: fullTitle } : title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url, languages: { [site.lang]: url } },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: brand ?? site.name,
      locale: site.locale,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: noindex
      ? { index: false, follow: !!follow }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

/* ---------------- JSON-LD (datos estructurados schema.org) ---------------- */

type JsonLd = Record<string, unknown>;

export function organizationLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    email: site.email,
    areaServed: { "@type": "Country", name: "Argentina" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["Spanish"],
      url: `https://wa.me/${site.whatsappVentas}`,
    },
  };
}

export function websiteLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    inLanguage: site.lang,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function softwareLd(product: Product, opts: { name: string; description: string; path: string; audience?: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    applicationCategory: product.applicationCategory,
    operatingSystem: "Web, Android, iOS",
    inLanguage: site.lang,
    publisher: { "@id": absoluteUrl("/#organization") },
    ...(opts.audience ? { audience: { "@type": "BusinessAudience", audienceType: opts.audience } } : {}),
    areaServed: { "@type": "Country", name: "Argentina" },
  };
}

export function faqLd(faqs: Faq[]): JsonLd | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    // Nombre de la lista (sin esto, Search Console la muestra como "Unnamed item").
    name: items.map((it) => it.name).join(" › "),
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/**
 * Grafo principal (mismo patrón que usan los líderes del rubro): Organization + WebSite +
 * SoftwareApplication con funciones y precios (offers), todo enlazado por @id.
 */
export function graphLd(product: Product, opts?: { path?: string; name?: string; description?: string; audience?: string; planes?: Plan[]; area?: { nombre: string; provincia: string } }): JsonLd {
  const path = opts?.path ?? "/";
  const offers = opts?.planes ? planOffers(opts.planes) : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...organizationLd(),
        "@context": undefined,
        description: `${site.name} desarrolla software simple para negocios y profesionales de Argentina.`,
        knowsAbout: product.keywords,
        foundingLocation: { "@type": "Place", name: "Argentina" },
      },
      { ...websiteLd(), "@context": undefined },
      {
        "@type": "SoftwareApplication",
        "@id": absoluteUrl(`${path === "/" ? "" : path}#app`),
        name: opts?.name ?? product.brandName,
        applicationCategory: product.applicationCategory,
        applicationSubCategory: product.name,
        operatingSystem: "Web, Android, iOS",
        url: absoluteUrl(path),
        inLanguage: site.lang,
        description: opts?.description ?? product.seoDescription,
        image: absoluteUrl("/icon.svg"),
        featureList: product.benefits.map((b) => `${b.title}: ${b.text}`),
        offers,
        publisher: { "@id": absoluteUrl("/#organization") },
        areaServed: opts?.area
          ? { "@type": "City", name: opts.area.nombre, containedInPlace: { "@type": "AdministrativeArea", name: opts.area.provincia } }
          : { "@type": "Country", name: "Argentina" },
        ...(opts?.audience ? { audience: { "@type": "BusinessAudience", audienceType: opts.audience } } : {}),
      },
    ],
  };
}

function planOffers(planes: Plan[]) {
  return [
    ...planes.flatMap((p) => [
      p.precio_mensual === 0
        ? { "@type": "Offer", name: p.nombre, price: "0", priceCurrency: "ARS", description: `${p.bajada} ${p.items.map((i) => i.texto).join(", ")}.` }
        : { "@type": "Offer", name: `${p.nombre} mensual`, price: String(p.precio_mensual), priceCurrency: "ARS", description: `${p.bajada} Por mes.` },
      ...(tieneAnual(p)
        ? [{ "@type": "Offer", name: `${p.nombre} anual`, price: String(p.precio_anual), priceCurrency: "ARS", description: `${p.bajada} Por año.` }]
        : []),
    ]),
  ];
}
