import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getDefaultProduct } from "@/config/products";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: getDefaultProduct().brandName,
    short_name: getDefaultProduct().brandName,
    description: getDefaultProduct().seoDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    lang: site.lang,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
