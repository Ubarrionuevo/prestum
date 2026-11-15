import { NextResponse, type NextRequest } from "next/server";
import { PREFIJOS_ELIMINADOS, PSEO_PRODUCTO, esRubroPublico } from "@/config/aliases";

/**
 * PÁGINAS ELIMINADAS → 410 "Gone".
 * Rubros que ya no apuntamos (canina, lavaderos, odontólogos…) y las viejas /turnos-online.
 * Con 410 Google las saca del índice más rápido que con un 404 o una redirección, y dejan
 * de ensuciar las métricas de Search Console. Solo corre en estas rutas (ver matcher).
 */
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const eliminada =
    PREFIJOS_ELIMINADOS.some((p) => path === p || path.startsWith(`${p}/`)) ||
    (path.startsWith(`/${PSEO_PRODUCTO}/`) && !esRubroPublico(path.split("/")[2] ?? ""));
  if (!eliminada) return NextResponse.next();
  return new NextResponse(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Página eliminada</title></head><body style="font-family:system-ui;padding:2rem"><h1>Esta página ya no existe</h1><p><a href="/">Ir a Prestum Turnos</a></p></body></html>`,
    { status: 410, headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=86400" } },
  );
}

export const config = {
  matcher: ["/turnero/:path+", "/turnos-online", "/turnos-online/:path*"],
};
