import { ImageResponse } from "next/og";
import { estudio } from "@/config/servicios/estudio";

// Imagen al compartir cualquier link de /servicios (marca propia, no la de Prestum).
export const alt = estudio.nombre;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#020617", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 800 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fbbf24", color: "#020617", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>EW</div>
          {estudio.nombre}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, color: "#fcd34d" }}>Diseño web · Tiendanube · SEO · Sistemas a medida</div>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1, display: "flex" }}>Páginas web desde $150.000, en pesos y por WhatsApp</div>
        </div>
        <div style={{ fontSize: 26, opacity: 0.7 }}>Argentina</div>
      </div>
    ),
    size,
  );
}
