import type { NextConfig } from "next";
import { aliasRedirects } from "./src/config/aliases";

const nextConfig: NextConfig = {
  // Forzamos una única versión canónica de cada URL (sin barra final).
  trailingSlash: false,
  poweredByHeader: false,
  // Ahorro en Vercel: no usamos la optimización de imágenes (tiene cupo mensual). Usamos SVG.
  images: { unoptimized: true },
  async redirects() {
    return [
      // El turnero es el producto principal: su home es "/".
      // (si cambiás site.defaultProduct, actualizá esto)
      { source: "/turnero", destination: "/", permanent: true },
      { source: "/turnos", destination: "/", permanent: true },
      { source: "/turneros", destination: "/", permanent: true },
      // Links viejos de reserva → nuevo formato prestum.com.ar/<negocio>
      { source: "/reservar/:slug", destination: "/:slug", permanent: true },
      // URLs cortas de rubros y ciudades → slug canónico (ver src/config/aliases.ts)
      ...aliasRedirects(),
    ];
  },
};

export default nextConfig;
