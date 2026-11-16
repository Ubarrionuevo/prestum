import { absoluteUrl, site } from "@/config/site";
import { gestion } from "@/config/gestion";

/** SoftwareApplication de Prestum Gestión, con su precio en ARS. */
export function gestionLd(opts: { path: string; name: string; description: string; audience?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": absoluteUrl(`${gestion.base}#software`),
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Sistema de gestión comercial",
    operatingSystem: "Web, Android, iOS",
    inLanguage: site.lang,
    brand: { "@type": "Brand", name: gestion.marca },
    offers: {
      "@type": "Offer",
      price: gestion.precio,
      priceCurrency: "ARS",
      priceSpecification: { "@type": "UnitPriceSpecification", price: gestion.precio, priceCurrency: "ARS", unitCode: "MON", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } },
    },
    areaServed: { "@type": "Country", name: "Argentina" },
    ...(opts.audience ? { audience: { "@type": "BusinessAudience", audienceType: opts.audience } } : {}),
  };
}
