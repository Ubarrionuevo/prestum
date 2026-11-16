import { ImageResponse } from "next/og";
import { gestion, precioGestion } from "@/config/gestion";

// Imagen al compartir cualquier link de /sistema-de-gestion (marca Prestum Gestión).
export const alt = gestion.marca;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#eef2ff", color: "#0f172a", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 800 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#4f46e5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>P</div>
          <span>{gestion.marca}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, color: "#4338ca" }}>Kioscos · Almacenes · Minimercados</div>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1, display: "flex" }}>Stock, caja, proveedores y fiado en un solo sistema</div>
        </div>
        <div style={{ fontSize: 26, opacity: 0.7 }}>{`${precioGestion} por mes · Argentina`}</div>
      </div>
    ),
    size,
  );
}
