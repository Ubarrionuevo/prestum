import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Imagen Open Graph generada al vuelo (lo que se ve al compartir el link en WhatsApp/redes). */
/** Portada 16:9 para el blog. */
export const portadaSize = { width: 1200, height: 675 };

export function renderOg({ brand, eyebrow, title, emoji, size = ogSize }: { brand: string; eyebrow: string; title: string; emoji?: string; size?: { width: number; height: number } }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #134e4a 0%, #0f766e 60%, #14b8a6 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 700 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "white",
              color: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            P
          </div>
          {brand}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, opacity: 0.85 }}>{eyebrow}</div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, display: "flex" }}>
            {emoji ? `${emoji} ` : ""}
            {title}
          </div>
        </div>
        <div style={{ fontSize: 26, opacity: 0.8 }}>prestum.com.ar</div>
      </div>
    ),
    size,
  );
}
