import type { NextConfig } from "next";
import { aliasRedirects } from "./src/config/aliases";

/**
 * Prestum Lavaderos es un proyecto aparte (repo prestum-lavaderos). Las páginas viejas del rubro
 * /turnero/lavaderos-de-autos[/<ciudad>] (antes 410) redirigen a la ciudad equivalente del directorio,
 * así Google le pasa la historia que tenían (La Plata y Santa Fe tenían impresiones en posición 7 a 10).
 */
function lavaderosRedirects() {
  const destino = "https://lavaderos.prestum.com.ar";
  const rubro = ":rubro(lavaderos-de-autos|lavadero-de-autos|lavaderos)";
  // Ciudad vieja → ciudad del directorio. Las que no están en el directorio van a la home del directorio.
  const ciudades: Record<string, string> = {
    "buenos-aires": "caba",
    caba: "caba",
    "capital-federal": "caba",
    "la-plata": "la-plata",
    "santa-fe": "santa-fe",
    rosario: "rosario",
    cordoba: "cordoba",
    mendoza: "mendoza",
    neuquen: "neuquen",
    posadas: "posadas",
    resistencia: "resistencia",
  };
  return [
    { source: `/turnero/${rubro}`, destination: `${destino}/`, permanent: true },
    ...Object.entries(ciudades).map(([vieja, nueva]) => ({ source: `/turnero/${rubro}/${vieja}`, destination: `${destino}/${nueva}`, permanent: true })),
    { source: `/turnero/${rubro}/:resto*`, destination: `${destino}/`, permanent: true },
  ];
}

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
      // Prestum Gestión es un proyecto aparte en su subdominio (repo prestum-gestion).
      { source: "/sistema-de-gestion", destination: "https://gestion.prestum.com.ar/", permanent: true },
      { source: "/sistema-de-gestion/:path*", destination: "https://gestion.prestum.com.ar/:path*", permanent: true },
      // El rubro viejo de lavaderos pasa al directorio aparte (lavaderos.prestum.com.ar). Van antes de los
      // alias de ciudad para que /turnero/lavaderos-de-autos/caba no dé dos saltos.
      ...lavaderosRedirects(),
      // URLs cortas de rubros y ciudades → slug canónico (ver src/config/aliases.ts)
      ...aliasRedirects(),
    ];
  },
};

export default nextConfig;
